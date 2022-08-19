<template>
<div class="shell">
    <Back @click="beforeBack"></Back>
    <div class="aside" >
        <div class="content" v-show="!ifAlter" v-if="titles.length!=0">
            <div
                v-for="anchor in titles"
                :key="anchor"
                :style="{ padding: `10px 0 10px ${anchor.indent * 10+10}px` }"
                @click="handleAnchorClick(anchor)"
            >
                <a style="cursor: pointer">{{ anchor.title }}</a>
            </div>
        </div>
    </div>
    <div class="mainShell">
        <div class="head">
        </div>
        <div class="BlogShell">
            <div class="headLine" id="title" v-if="!ifAlter">
                <span class="centerText title" >
                    {{data.title}}
                </span>
            </div>
            <div class="headLine"  v-if="ifAlter">
                <input class="input1 title" id="newTitle" v-model="newTitle" @change="titleCheck">
            </div>
            <div class="line">
                <div class="label">
                    <span class="centerText labelName" >
                        作者
                    </span>
                    <span class="centerText labelValue">
                        {{data.author}}
                    </span>
                </div>
                <div class="label">
                    <span class="centerText labelName">
                        发布日期
                    </span>
                    <span class="centerText labelValue">
                        {{data.sub_date}}
                    </span>
                </div>
                <div style="margin:auto"></div>
                <div class="ops" v-if="ifAuthor">
                    <div class="btn" @click="unAlter" v-if="ifAlter">
                        <span class="centerText" >
                            取消修改
                        </span>
                    </div>
                    <div class="btn" @click="alter" id="alter">
                        <span class="centerText" >
                            {{btn2Name}}
                        </span>
                    </div>
                    <div class="btn" @click="del" id="del">
                        <span class="centerText">
                            删除
                        </span>
                    </div>
                </div>
            </div>
            
            <div class="tagShell" v-if="ifAlter">
                <div class="itemShell">
                    <div class="tagItem" v-for="(tag , index) in newTags" :key="tag">
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
            
            <div class="checkShell" v-if="ifAlter">
                <input class="myCheckBox" type="checkbox" :checked="data.private==1?true:false">
                <div class="checkText">仅自己可见</div>
            </div>
            <div class="context" ref="context">
                <v-md-preview class="mdPart" ref="preview" :text="data.context" height="550px" v-if="!ifAlter"></v-md-preview>
                <div class="editorShell" style="width:800px" v-if="ifAlter">
                    <v-md-editor  v-model="newContext" height="550px"></v-md-editor>
                </div>
            </div>
            <div class="tagShell">
                <div class="tag" v-for="tag in tags" :key="tag" @click.stop="intoTag(tag)">
                    {{tag}}
                </div>
            </div>
        </div>
        <Foot></Foot>
    </div>
    <div class="aside" >
        <div class="fixedShell">
            <div class="cell like" v-if="!ifPrivate">
                <div class="iconShell" @click="likeToggle">
                    <img style="height:100%" :src="likeIcon" alt="">
                </div>
                <div>{{data.likes}}</div>
            </div>
            <div class="cell toTop" @click="goTop">
                <div class="iconShell">
                    <img style="height:100%" src="../assets/angle-up.png" alt="">
                </div>
            </div>
        </div>
    </div>
</div>
</template>

<script>
import axios from 'axios'
import Qs from 'qs'
import store from '../main';
import Foot from '../components/Foot.vue';
import Back from '../components/Back.vue';
import likeIcon from '../assets/like-fill.png';
import disLikeIcon from '../assets/like.png';
export default{
    name: "atricle",
    methods: {
        goTop(){
            let timeStamp = requestAnimationFrame(function fn() {
                let osTop = document.documentElement.scrollTop || document.body.scrollTop;
                let speed = -osTop / 6;
                document.documentElement.scrollTop = document.body.scrollTop = osTop + speed;
                if (osTop == 0) {
                    cancelAnimationFrame(timeStamp);
                }else{
                    timeStamp = requestAnimationFrame(fn);
                }
            });
        },
        likeToggle(){
            if(!this.likeLock){
                this.likeLock = true;
                let axiosInstance = axios.create({
                    baseURL: store.state.preUrl,
                    timeout: 1000,
                    headers:{"token":store.state.token}
                });
                let params= {
                    blogId: this.data.blog_id,
                    uid: store.state.uid
                }
                let lastUrl = this.ifLike?'/unLikeBlog':'/likeBlog';
                //提交修改
                axiosInstance.post(store.state.preUrl+lastUrl, Qs.stringify(params)).then((Response) => {
                    // console.log(Response.data);
                    if(Response.data=="success"){
                        store.commit("setHintText",this.ifLike?'取消点赞':'点赞成功');
                        this.likeLock = false;
                        this.init();
                    }else{
                        store.commit("setHintText","操作失败");
                        this.likeLock = false;
                    }
                });
            }
        },
        titleCheck() {
            if (!(this.newTitle.length > 0)) { //回滚
                store.commit("setHintText","标题不能为空");
                document.getElementById('newTitle').focus();
            }
        },
        createTag(e){
            if((e.keyCode==13)&&(this.tagInput.length>0)){
                //判断标签是否过多
                if(this.newTags.length >= 10){
                    store.commit("setHintText","最多创建10个标签")
                }
                //判断是否已存在该标签
                else if(this.newTags.find((item)=>{return this.tagInput==item?true:false}) != undefined){
                    store.commit("setHintText","已存在相同标签")
                }else if(this.tagInput.indexOf('#')!=-1){
                    store.commit("setHintText","标签中不得包括‘#’字符");
                }else if(this.tagInput.length>10){
                    store.commit("setHintText","标签长度不超过10个字符");
                }
                else{
                    this.newTags.push(this.tagInput);
                    this.tagInput = "";
                }
            }
        },
        tagDel(index){
            this.newTags.splice(index,1);
        },
        formatTags(tagList){
            let formatTag = ""
            tagList.forEach((item)=>{
                formatTag += "#"+item
            })
            return formatTag;
        },
        //返回的回调函数
        beforeBack(){
            // console.log("移除监听事件");
            // window.removeEventListener("scroll",this.funcName);
        },
        //初始化请求数据
        init() {
            let blogId = this.$route.query.blogId;
            // console.log(this.$route.query);
            axios.get(store.state.preUrl + "/blog", { params: {
                    blogId: blogId
            } }).then((Response) => {
                this.data = Response.data;
                let date = new Date(this.data.sub_date);
                this.data.sub_date = date.getFullYear()+"-"+String(date.getMonth()+1).padStart(2,"0")+"-"+String(date.getDate()).padStart(2,"0");
                this.ifAuthor = this.data.author==store.state.username?true:false;
                this.ifPrivate = this.data.private=="1"?true:false;
            });
            // 确认点赞情况
            axios.get(store.state.preUrl + "/checkLike", { params: {
                    uid:store.state.uid,
                    blogId: blogId
            } }).then((Response) => {
                this.ifLike = Response.data=="1"?true:false;
            });
        },
        unAlter(){
            this.ifAlter=false;
        },
        alter(){
            if(!this.ifAlter){
                this.ifAlter=true;
                this.newContext = this.data.context;
                this.newTitle = this.data.title;

                this.newTags=[];
                let str = String(this.data.tags);
                let point = str.lastIndexOf("#");
                while(point!=-1){
                    let tag = str.slice(point+1);
                    this.newTags.push(tag);
                    str =  str.slice(0,point);
                    point = str.lastIndexOf("#");
                }
                
            }else{
                
                if (!(this.newTitle.length > 0)) { //回滚
                    store.commit("setHintText","标题不能为空");
                    document.getElementById('newTitle').focus();
                    return
                }
                let axiosInstance = axios.create({
                    baseURL: store.state.preUrl,
                    timeout: 1000,
                    headers:{"token":store.state.token}
                });
                let params= {
                    newTitle:this.newTitle,
                    username: store.state.username,
                    author:this.data.author,
                    blogId: this.data.blog_id,
                    newContext:this.newContext.replaceAll("'","\\'"),
                    newTags:this.formatTags(this.newTags).replaceAll("'","\\'"),
                    private:document.getElementsByClassName("myCheckBox")[0].checked?1:0
                }
                //提交修改
                axiosInstance.post(store.state.preUrl+"/updateBlog", Qs.stringify(params)).then((Response) => {
                    // console.log(Response.data);
                    if(Response.data=="success"){
                        store.commit("setHintText","修改成功");
                        this.ifAlter = false;
                        this.init();
                        this.setTitles();
                    }else{
                        store.commit("setHintText","修改失败");
                    }
                });
            }
        },
        del(){
            if(confirm("确认删除改博文吗？")){
                // console.log("[LOG]token=",store.state.token);
                let axiosInstance = axios.create({
                    baseURL: store.state.preUrl,
                    timeout: 1000,
                    headers:{"token":store.state.token}
                });
                let params= {
                    username: store.state.username,
                    blogId: this.data.blog_id,
                }
                axiosInstance.post("/deleteBlog", Qs.stringify(params)).then((Response) => {
                    if(Response.data=="success"){
                        store.commit("setHintText","删除成功");
                        this.$router.push("/");
                    }else{
                        // console.log(Response.data);
                        store.commit("setHintText","删除失败");
                    }
                });
            }
        }, 
        setTitles(){
            const anchors = this.$refs.preview.$el.querySelectorAll('h1,h2,h3,h4,h5,h6');
            const titles = Array.from(anchors).filter((title) => !!title.innerText.trim());
            // console.log("[setTitles]=",anchors);
            if (!titles.length) {
                this.titles = [];
                return;
            }

            const hTags = Array.from(new Set(titles.map((title) => title.tagName))).sort();

            this.titles = titles.map((el) => ({
            title: el.innerText,
            lineIndex: el.getAttribute('data-v-md-line'),
            indent: hTags.indexOf(el.tagName),
            }));
            // //利用getBoundingClientRect实现sticky
            // window.removeEventListener("scroll",this.funcName);
            // window.addEventListener("scroll",this.funcName);
        },
        handleAnchorClick(anchor) {
            const { preview } = this.$refs;
            const { lineIndex } = anchor;

            const heading = preview.$el.querySelector(`[data-v-md-line="${lineIndex}"]`);

            if (heading) {
                preview.scrollToTarget({
                target: heading,
                scrollContainer: window,
                top: 60,
                behavior: "smooth"
                });
            }
        },
        // //导航栏的sticky监听实现
        // scrollFunc(){
        //     return throttle(()=>{
        //         if(document.getElementById("title").getBoundingClientRect().y<20){
        //             this.$refs.contentShell.style="position:fixed;top:0";
        //         }else{
        //             this.$refs.contentShell.style="position:absolute;";
        //         }
        //     },100)
        // }
    },
    created() {
        this.init();
    },
    data() {
        return {
            data: {},
            ifAlter:false,
            ifAuthor:false,
            ifLike:false,
            likeLock:false,
            ifPrivate:true,
            newTitle:"",
            newContext:"",
            newTags:[],
            tagInput:"",
            titles:"",
            //存储实例化的节流函数对象,使监听器可以正确remove
            funcName:undefined
        };
    },
    mounted() {     
        setTimeout(()=>{
            // console.log("[preview]=",this.$refs.preview.$el.firstChild);
            this.setTitles();
        },300)
    },
    computed:{
        btn2Name(){
            return this.ifAlter?"确认修改":"修改";    
        },
        likeIcon(){
            return this.ifLike?likeIcon:disLikeIcon;
        }
    },
    components: { Foot, Back }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
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
    .input1.title{
        height: 70px;
        padding: 0 40px;
        font-size: 32px;
        font-weight: bold;
    }
    .tagShell{
        display: flex;
        flex-direction: row;
        background-color: #fff;
        margin: 10px auto;
        box-shadow: 0 2px 10px 2px rgba(54,58,80,.32);
        width: 800px;
    }
    .itemShell{
        /* width: fit-content; */
        display: flex;
        flex-direction: row;
        /* max-width: 80%; */
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
    .aside{
        margin: 0 50px;
        margin-top:210px;
        bottom: 0;
        height: auto;
        width: 200px;
        border-radius: 10px;
        /* background-color: olivedrab; */
    }
    .mainShell{
        /* margin-right: calc(50% - 400px); */
    }
    .paddingBlock{
        height: 20px;
        width: 200px;
        margin: 0;
        /* background-color: olivedrab; */
    }
    .content{
        background-color: #fff;
        min-height: 100px;
        height: fit-content;
        width: 200px;
        transition: 0.25s;
        border-radius: 5px;
        font-size: 8px;
        box-shadow: 0 2px 10px 2px rgba(54,58,80,.32);
        position: sticky;
        top: 10px;
    }
    .fixedShell{
        position: fixed;
        bottom: 0;
        padding-bottom: 30px;
    }
    .cell{
        background-color: #fff;
        height: 75px;
        width: 75px;
        border-radius: 5px;
        box-shadow: 0 2px 10px 2px rgba(54,58,80,.32);
        margin: 20px 0;
        text-align: center;
        color: #707070;
    }
    .cell:hover{
        cursor: pointer;
    }
    .iconShell{
        position: relative;
        height: 35px;
        width: 35px;
        margin: 10px auto;
        margin-bottom: 0;
    }
    .cell.toTop .iconShell{
        margin: auto;
        /* background-color: olivedrab; */
    }
    .cell.like{
        display: flex;
        flex-direction: column;

    }
    .cell.toTop{
        display: flex;
    }
    .btn{
        width: 100px;
        height: 30px;
        background-color: #fff;
        transition: 0.25s;
        display: flex;
        font-weight: bold;
        margin-left: 20px;
        box-shadow: 0 2px 10px 2px rgba(54,58,80,.32);
    }
    .btn:hover{
        cursor: pointer;
    }
    .btn:active{
        transform: scale(1.1);
    }
    .btn#alter:active{
        background-color: #EBE650;
    }
    .btn#del:active{
        background-color: rgb(145, 9, 9);
    }
    .shell{
        background-color: #b5c0ed;
        display: flex;
        flex-direction: row;
        justify-content: center;
    }


    .checkShell{
        position: relative;
        top: -5px;
        margin: 0px 10px;
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
        width: 100%;
        height: 30px;
        /* background-color: #fff;
        box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%); */
    }
    .checkText{
        height: fit-content;
        width: 100px;
        margin: auto 0px;
        font-weight: bold;
        color: rgb(139, 9, 139);
    }
    .myCheckBox{
        height: 20px;
        width: 20px;
        margin: auto 10px;
        background-color: rgb(139, 9, 139);
    }

    .head{
        background-image: url("../../public/assert/background.jpg");
        background-size: 100% 180%;
        margin-top: 0px;
        width: 800px;
        margin-left: calc(50% - 400px);
        height: 200px;
        left: 100px;
        background-color: rgb(208, 231, 251);
        z-index: -5;
        text-align:center;
        border-radius: 0px 0px 10px 10px;
    }
    .BlogShell{
        margin: auto;
        display: flex;
        flex-direction: column;
        justify-content: center;
    }
    .headLine{
        margin: 10px auto;;
        width: 800px;
        min-height: 70px;
        display: flex;
        background-color: #fff;
        box-shadow: 0 2px 10px 2px rgba(54,58,80,.32);
        font-size: 32px;
        border-radius: 5px;
    }
    .line{
        margin: auto;
        width: 800px;
        height: 30px;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        /* box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%); */
        margin-bottom: 10px;
        flex-direction: row;
        border-radius: 5px;
    }
    .ops{
        margin: auto;
        margin-right: 0;
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
    }
    .label{
        display: flex;
        flex-direction: row;
        box-shadow: 0 2px 10px 2px rgba(54,58,80,.32);
        margin-right: 20px;
    }
    .centerText.labelName{
        margin: 0;
        padding: 3px 10px;
        background-color: #EBEAAB;
    }
    .centerText.labelValue{
        margin: 0;
        padding: 3px 10px;
        background-color: #C3DCEB;
    }
    .centerText.title{
        padding: 0 40px ;
        font-weight: bold;
        margin-left: 0;
    }
    .centerText{
        width: fit-content;
        display: block;
        margin: auto;
    }
    .mdPart{
        margin: auto;
        width: 800px;
        background-color: #fff;
        box-shadow: 0 2px 10px 2px rgba(54,58,80,.32);
        height: fit-content;
        min-height: 500px;
    }
    .editorShell{
        margin: auto;
        width: 800px;
        background-color: #fff;
        box-shadow: 0 2px 10px 2px rgba(54,58,80,.32);
        height: fit-content;
        min-height: 500px;
    }
    .context{
        border-radius: 5px;
        width: 800px;
        overflow: hidden;
        margin: auto;
        height: fit-content;
        box-shadow: 0 2px 10px 2px rgba(54,58,80,.32);
    }
</style>
