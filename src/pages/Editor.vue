<template>
<div class="shell">
    <div id="head">
        <div id="iconShell" ref="icon" :style="{opacity: iconOpacityValue}">
            <img style="height:100%;width:100%" :src="userIcon"/>
        </div>
        <div id="titleShell" :style="{left:editorLeft}">
            <input class="input1" placeholder="请输入标题" v-model="title" @change="titleCheck">
            <div class="operations">
                <button class="button1" @click="back">返回主页</button>
                <button class="button1" id="addNew" @click="addNew" ref="addNew">新建</button>
                <button class="button1" @click="deleteDraft">删除</button>
                <button class="button1" @click="save">保存</button>
                <button class="button1" @click="post" style="margin-right:0">发布</button>
            </div>
        </div>

    </div>
    <div id="fileShell" :style="{opacity: iconOpacityValue}">
        <div :class="this.index==index?'activeView':'view'" v-for="(draft,index) in this.drafts" :key="draft.title" @click="choose(index)">
            <div style="margin:5px auto">
                {{draft.title}}
            </div>
        </div>
    </div>
    <div id="editorShell" :style="{left:editorLeft}">
        <v-md-editor id="editor" v-model="text" :height="editorHeight"></v-md-editor>
    </div>
</div>
</template>

<script>
import userIcon from '../assets/myuserImg.jpg'
import axios from 'axios';
import store from '../main';
export default {
    name: "Editor",
    methods: {
        titleCheck(){
            if(!(this.title.length>0)){//回滚
                alert("标题不能为空")
                this.title = this.oldDraft.title;
            }else{
                this.oldDraft.title = this.title;
            }
        },
        refresh(){
            this.title = this.drafts[this.index].title;
            this.text = this.drafts[this.index].text;
        },
        back() {
            this.$router.push("/");
            this.save();
        },
        addNew(){
            console.log("addNew");
            if(this.drafts.length>=3){
                document.getElementById("addNew").className="shakeClass";
                setTimeout(()=>{
                    document.getElementById("addNew").className="button1";
                },400)
            }else{
                if(this.drafts.length!=0){
                    this.save()
                }
                this.index = this.drafts.length;
                this.drafts.push({
                    title:"无标题",
                    text:""
                })
                this.refresh()
                console.log("this.index=",this.index);
            }
        },
        deleteDraft(force=false){
            if(force||confirm("确认删除当前草稿吗？")){
                if(this.drafts.length>1){
                    this.drafts.splice(this.index,1);
                    this.index = 0;
                }else{
                    this.drafts.splice(this.index,1);
                    this.index--;
                    this.addNew();
                }
                localStorage.setItem("drafts", JSON.stringify(this.drafts));
                this.refresh()
            }
        },
        save() {
            if((this.drafts[this.index].title!=this.title)||(this.drafts[this.index].text!=this.text)){
                this.drafts[this.index]=
                {
                    title:this.title,
                    text:this.text
                }
                localStorage.setItem("drafts", JSON.stringify(this.drafts));
                store.commit("setHintText","保存成功");
                this.oldDraft = this.drafts[this.index];
            }
        },
        post() {
            if (this.title.length == "") {
                store.commit("setHintText","标题不能为空")
            }
            else if (this.text.length < 10) {
                store.commit("setHintText","正文不能少于10个字符")
            }
            else {
                if (confirm("确认发布吗？")) {
                    axios.get(store.state.preUrl+"/post", { params: {
                            title: this.title,
                            author: this.author,
                            context: this.text,
                        } }).then((Response) => {
                        store.commit("setHintText","发布成功")
                        this.deleteDraft(true)
                    });
                }
                else {
                    this.save();
                }
            }
        },
        choose(index){
            this.save()
            this.index = index
            this.oldDraft = this.drafts[this.index]
            console.log("this.index=",index);
            this.refresh()
        }
    },
    data() {
        return {
            userIcon: userIcon,
            drafts:[],
            oldDraft:{},//提供历史快照和回滚支持
            title:"",
            text:"",
            index:0,
            iconStyle:"opacity:1;transition: 0.3s;",
            iconOpacityValue:1,
            editorLeft:'15%',
        };
    },
    computed: {
        author() {
            return store.state.username;
        },
        editorHeight(){
            return "550px";
        },
    },
    created() {
        console.log(window.innerWidth);
        window.addEventListener("resize", () => {
            if (window.innerWidth < 1000) {
                this.iconOpacityValue=0;
                this.editorLeft='10%';
            }
            else{
                this.iconOpacityValue=1;
                this.editorLeft='15%';
            }
        });
        let drafts = JSON.parse(localStorage.getItem("drafts"))
        if(drafts){
            this.drafts = drafts;
            this.title = this.drafts[this.index].title;
            this.text = this.drafts[this.index].text;
            this.oldDraft =  this.drafts[this.index];
        }
        console.log("drafts=",this.drafts);
    },
}
</script>

<style scoped>
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
.button1{
    margin-top: 10px;
    max-width: 150px;
    margin-right: 10px;
    width: 31%;
    height: 30px;
    background-color: #fff;
    box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
    border: 4px;
    cursor: pointer;
    transition: 0.3s;
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
    top: 130px;
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