<template>
<div class="shell">    
    <Back @click="beforeBack"></Back>
    <div id="head">
        <!-- <div id="iconShell" ref="icon" :style="{opacity: iconOpacityValue}">
            <img style="height:100%;width:100%" :src="userIcon"/>
        </div> -->
        <div id="titleShell" :style="{left:editorLeft}">
            <input id="title" class="input1" placeholder="请输入标题" v-model="uniDraft.title" @change="titleCheck" @keydown="enter">
            <div class="tagShell">
                    <div class="itemShell">
                    <div class="tagItem" v-for="(tag , index) in uniDraft.tags" :key="tag">
                        <div class="tagText">
                            <div class="textShell tag">
                                {{tag}}
                            </div>
                        </div>
                        <div class="tagDel" @click="tagDel(index)">
                            <img src="../assets/quit.png" style="height:50%;margin: auto;">
                        </div>
                    </div>
                </div>
                <input id="tag" class="input1 tag" placeholder="输入后回车创建标签" v-model="tagInput" @change="titleCheck" @keydown="createTag">
            </div>
            <div class="operations">
                <!-- <button class="button1" @click="back">返回主页</button> -->
                <button class="button1" id="addNew" @click="addNew" ref="addNew">新建</button>
                <button class="button1" @click="deleteDraft(false)">删除</button>
                <button class="button1" @click="save">保存</button>
                <button class="button1" @click="post">发布</button>
                <div class="checkShell">
                    <input class="myCheckBox" type="checkbox">
                    <div class="centerText">仅自己可见</div>
                    <div class="noteText">发布后仅会出现在个人空间中</div>
                </div>
            </div>
        </div>

    </div>
    <div id="fileShell" :style="{opacity: iconOpacityValue}">
        <div :class="this.index==index?'activeView':'view'"  v-for="(draft,index) in this.drafts" :key="draft.title" @click="choose(index)">
            <div class="textShell file" :style="{fontSize:dynaSize(draft.title)}">
                {{draft.title}}
            </div>
        </div>
    </div>
    <div id="editorShell" :style="{left:editorLeft}">
        <v-md-editor id="editor" v-model="uniDraft.context" :height="editorHeight"></v-md-editor>
    </div>
</div>
</template>

<script>

import userIcon from '../assets/myuserImg.jpg'
import axios from 'axios';
import store from '../main';
import Back from '../components/Back.vue';
import Qs from 'qs';
export default {
    name: "Editor",
    methods: {
        //初始化函数
        init(){
            window.addEventListener("resize", () => {
                if (window.innerWidth < 1000) {
                    this.iconOpacityValue = 0;
                    this.editorLeft = "10%";
                }
                else {
                    this.iconOpacityValue = 1;
                    this.editorLeft = "15%";
                }
            });
            let axiosInstance = axios.create({
                baseURL: store.state.preUrl,
                timeout: 1000,
                headers:{"token":store.state.token}
            });
            //获取远程草稿
            let params= {
                uid: this.uid,
            }
            // console.log("params=",params);
            axiosInstance.post("/getDrafts", Qs.stringify(params)).then((response) => {
                if(typeof response.data != 'undefined'){
                    console.log("远程草稿=",response.data.drafts);
                    this.drafts = JSON.parse(response.data.drafts.replaceAll("\n","\\n"));
                    console.log("远程草稿=",response.data);
                    console.log("[drafts=]",this.drafts);
                    //本地存档和远程存档冲突时选择最新的使用
                    try{
                        if(localStorage.getItem("save_date")!=response.data.save_date){
                            if(Number(localStorage.getItem("save_date"))>Number(response.data.save_date)){
                                this.drafts = JSON.parse(localStorage.getItem("drafts"));
                                console.log("[init]加载本地存档");
                            }else{
                                this.drafts = JSON.parse(response.data.drafts.replaceAll("\n","\\n"));
                                console.log("[init]加载远程存档");
                            }
                        }else{
                            this.drafts = JSON.parse(localStorage.getItem("drafts"));
                            console.log("[init]存档未冲突");
                            console.log("[init]加载本地存档");
                        }                        
                    }catch(err){
                        this.drafts = JSON.parse(localStorage.getItem("drafts"));
                        console.log("[init]加载本地存档");
                        console.log("[ERROR]",err);
                    }
                    this.refresh();
                }else{
                    console.log("[init]未找到远程存档");
                    console.log("[init]加载本地存档");
                    this.drafts = JSON.parse(localStorage.getItem("drafts"));
                }
                console.log('[init]this.dratfs=',this.drafts);
            });
        },
        //保存到远程草稿
        remoteSave(saveDate){
            let axiosInstance = axios.create({
                baseURL: store.state.preUrl,
                timeout: 1000,
                headers:{"token":store.state.token}
            });
            let params= {
                uid: this.uid,
                //转义引号
                drafts: JSON.stringify(this.drafts).replaceAll("'","\\'"),
                save_date:saveDate
            }
            // console.log("params=",params);
            axiosInstance.post("/saveDrafts", Qs.stringify(params)).then((response) => {
                if(response.data=="success"){
                    store.commit("setHintText", "保存成功");
                }else{
                    store.commit("setHintText", response.data);
                }
            });
        },
        //退出时函数
        beforeBack(){
            this.save();
        },
        //重载回车事件
        enter(e){
            if(e.keyCode==13){
                document.getElementById('tag').focus();
            }
        },
        //创建标签
        createTag(e){
            if((e.keyCode==13)&&(this.tagInput.length>0)){
                //判断标签是否过多
                if(this.uniDraft.tags.length >= 10){
                    store.commit("setHintText","最多创建10个标签");
                }
                //判断是否已存在该标签
                else if(this.uniDraft.tags.find((item)=>{return this.tagInput==item?true:false}) != undefined){
                    store.commit("setHintText","已存在相同标签");
                }else if(this.tagInput.indexOf('#')!=-1){
                    store.commit("setHintText","标签中不得包括‘#’字符");
                }else if(this.tagInput.length>10){
                    store.commit("setHintText","标签长度不超过10个字符");
                }
                else{
                    this.uniDraft.tags.push(this.tagInput);
                    this.tagInput = "";
                }
            }
        },
        //删除标签
        tagDel(index){
            this.uniDraft.tags.splice(index,1);
        },
        //标签格式转化
        formatTags(tagList){
            let formatTag = ""
            tagList.forEach((item)=>{
                formatTag += "#"+item
            })
            return formatTag;
        },
        //检测标题合法性
        titleCheck() {
            // console.log(this.drafts)
            if (!(this.uniDraft.title.length > 0)) { //回滚
                alert("标题不能为空");
                this.uniDraft.title = this.drafts[this.index].title;
                document.getElementById('title').focus();
            }
        },
        //刷新页面数据 将uniDrafts更新为当前index对应的drafts数据
        refresh() {
            // console.log("refresh");
            // console.log(JSON.stringify(this.uniDraft),"=?????=",JSON.stringify(this.drafts[this.index]));
            this.uniDraft.title = this.drafts[this.index].title;
            this.uniDraft.tags = [...this.drafts[this.index].tags];//扩展运算符深拷贝数组
            this.uniDraft.context = this.drafts[this.index].context;
            document.getElementsByClassName("myCheckBox")[0].checked=false;
            // console.log(JSON.stringify(this.uniDraft),"=?????=",JSON.stringify(this.drafts[this.index]));
        },
        //新建草稿
        addNew() {
            if (this.drafts.length >= 3) {
                document.getElementById("addNew").className = "shakeClass";
                setTimeout(() => {
                    document.getElementById("addNew").className = "button1";
                }, 400);
                store.commit("setHintText","草稿已满")
            }
            else {
                if (this.drafts.length != 0) {
                    this.save();
                }
                this.index = this.drafts.length;
                this.drafts.push({
                    title: "无标题",
                    tags:[],
                    context: "",
                });
                this.refresh();
                // console.log("this.index=", this.index);
            }
        },
        //删除当前视图草稿
        deleteDraft(force = false) {
            console.log("[deleteDraft]:index=",this.index);
            console.log('[deleteDraft]:drafts=',this.drafts);
            if (force || confirm("确认删除当前草稿吗？")) {
                if (this.drafts.length > 1) {
                    this.drafts.splice(this.index, 1);
                    if(this.index!=0) this.index--;
                    console.log('[deleteDraft]:drafts=',this.drafts);
                }
                else {
                    this.drafts.splice(this.index, 1);
                    this.index--;
                    this.addNew();
                }
                this.refresh();
                this.save();
            }
        },
        //保存当前视图草稿
        save() {
            if(JSON.stringify(this.uniDraft)!=JSON.stringify(this.drafts[this.index])){
                console.log("执行保存");
                this.drafts[this.index].title =this.uniDraft.title;
                this.drafts[this.index].tags =[...this.uniDraft.tags];
                this.drafts[this.index].context =this.uniDraft.context;
                let saveDate = new Date().getTime();
                console.log("[save]this.drafts",this.drafts);
                localStorage.setItem("drafts", JSON.stringify(this.drafts));
                localStorage.setItem("save_date", saveDate);
                store.commit("setHintText", "保存成功");
                this.remoteSave(saveDate);
            }

        },
        //发布当前视图草稿
        post() {
            if (this.uniDraft.title.length == "") {
                store.commit("setHintText", "标题不能为空");
            }
            else if (this.uniDraft.context.length < 10) {
                store.commit("setHintText", "正文不能少于10个字符");
            }
            else {
                if (confirm("确认发布吗？")) {
                    let axiosInstance = axios.create({
                        baseURL: store.state.preUrl,
                        timeout: 1000,
                        headers:{"token":store.state.token}
                    });
                    let params= {
                        title: this.uniDraft.title,
                        author_uid: this.uid,
                        //转义引号
                        context: this.uniDraft.context.replaceAll("'","\\'"),
                        tags:this.formatTags(this.uniDraft.tags).replaceAll("'","\\'"),
                        private:document.getElementsByClassName("myCheckBox")[0].checked?1:0
                    }
                    // console.log("params=",params);
                    axiosInstance.post("/post", Qs.stringify(params)).then((response) => {
                        if(response.data=="success"){
                            store.commit("setHintText", "发布成功");
                            this.deleteDraft(true);
                        }else{
                            store.commit("setHintText", "发布失败");
                        }
                    });
                }
                else {
                    this.save();
                }
            }
        },
        //切换草稿视图
        choose(index) {
            this.save();
            this.index = index;
            this.refresh();
            // console.log("this.index=", index);
        },
        dynaSize(title){
            //接受0-infinity的值，返回0-1的值 图像类似 acrtan()
            let smooth = (x)=>{
                return 2*Math.atan(x/6.18)/Math.PI
            }
            let ans = smooth(title.length)
            // console.log("ans=",ans);
            ans = 18-Math.floor(12*ans)+"px"
            // console.log("ans=",ans);
            return ans;
            // return "20px"
        }
    },
    data() {
        return {
            userIcon: userIcon,
            drafts: [],
            tagInput:"",
            uniDraft: {
                title:"",
                tags:[],
                context:""
            },
            index: 0,
            iconStyle: "opacity:1;transition: 0.3s;",
            iconOpacityValue: 1,
            editorLeft: "15%",
        };
    },
    computed: {
        author() {
            return store.state.username;
        },
        editorHeight() {
            return "550px";
        },
        uid(){
            return store.state.uid;
        }
    },
    created() {
        this.init();
    },
    components: { Back }
}
</script>

<style scoped>
.tagShell{
    display: flex;
    flex-direction: row;
    background-color: #fff;
    margin: 10px 0;
    box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
}
.itemShell{
    width: fit-content;
    /* max-width: 80%; */
    /* background-color: olivedrab; */
    display: flex;
    flex-direction: row;
    /* overflow: hidden; */
}
.tagItem{
    display: flex;
    flex-direction: row;
    padding: 0 5px;
    margin: 5px;
    border: solid 1px rgb(114, 155, 155);
    border-radius: 8px;
}
.tagText{
    white-space: nowrap;
    width: fit-content;
    font-size: 8px;
    display: flex;
    justify-content: center;
}
.tag.textShell{
    padding: 2px 5px;
    margin: auto;
    text-align: center;
}
.file.textShell{
    margin: auto;
}
.tagDel{
    height: 20px;
    display: flex;
    justify-content: center;
}
.tagDel:hover{
    cursor: pointer;
}
.tag.input1{
    box-shadow:none;
}

@keyframes shake{
    0%   {transform:translateX(3px);}
    20%   {transform:translateX(-6px);}
    40%   {transform:translateX(10px);}
    60%   {transform:translateX(-6px);}
    80%   {transform:translateX(3px);}
    100%   {transform:translateX(0px);}
}
#fileShell{
    position: absolute;
    top: 130px;
    left: calc((15% - 130px) / 2);
    width: 130px;
    height: 550px;
    background-color: #fff;
    box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
    transition: 0.3s;
    display: flex;
    justify-content: flex-start;
    flex-direction: column;
}
.view{
    margin: 15px auto;
    width: 100px;
    height: 140px;
    background-color: #fff;
    box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
    transition: 0.25s;
    display: flex;
}
.activeView{
    margin: 15px auto;
    width: 100px;
    height: 140px;
    background-color: #fff;
    box-shadow: -5px 2px 10px 0 #665339;
    transition: 0.25s;
    display: flex;
    transform: scale(1.1) translateX(25px);
}
.view:hover{
    cursor: pointer;
    transform: scale(1.1);
    box-shadow: 0 2px 12px 0 rgb(0 0 0 / 30%);
}
.operations{
    display: flex;  
}
.button1{
    margin: 10px 0px;
    max-width: 150px;
    margin-right: 10px;
    width: 120px;
    height: 30px;
    background-color: #fff;
    box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
    border: 4px;
    cursor: pointer;
    transition: 0.3s;
}
.checkShell{
    margin: 10px 10px;
    display: flex;
    flex-direction: row;
    width: 320px;
    height: 30px;
    /* background-color: #fff;
    box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%); */
}
.centerText{
    height: fit-content;
    width: fit-content;
    margin: auto 0px;
    font-weight: bold;
    color: rgb(139, 9, 139);
}
.noteText{
    height: fit-content;
    width: fit-content;
    margin: auto 10px;
    margin-top: 8px;
    font-size: 13px;
    color: rgb(125, 117, 117);
}
.myCheckBox{
    height: 20px;
    width: 20px;
    margin: auto 10px;
}
.button1:active{
    transform: scale(1.1);
}
.shakeClass{
    margin-top: 10px;
    max-width: 150px;
    margin-right: 10px;
    width: 31%;
    height: 30px;
    background-color: rgb(243, 145, 145);
    box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
    border: 4px;
    cursor: pointer;
    transition: 0.3s;
    animation: shake 0.25s;
}
.input1{
    border: 4px;
    border-radius: 0px;
    width: 100%;
    height: 33px;
    padding: 0;
    padding: 10px 15px;
    box-sizing: border-box;
    box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
}
.input1:focus{
    outline: none;
}
#head{
    position: absolute;
    top: 0px;
    width: 100%;
    height: 61.8%;
    background-color: antiquewhite;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
}
#iconShell{
    position: absolute;
    top: 20px;
    left: calc((15% - 90px) / 2);
    border-radius: 50%;
    border: solid 5px rgb(148, 156, 146);
    height: 80px;
    width: 80px;
    overflow: hidden;
    transition: 0.3s;
}
#titleShell{
    position: absolute;
    left: 15%;
    margin-left: 0;
    margin-top: 30px;
    width: 80%;
    display: flex;
    flex-direction: column;
    transition: 0.3s;
}
#editorShell{
    position: absolute;
    top: 170px;
    left: 15%;
    width: 80%;
    margin: auto;
    transition: 0.3s;
    /* background-color: rgb(205, 248, 200); */
}
.shell{
    transition: 0.3s;
}
</style>