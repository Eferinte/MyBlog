<template>
<div class="shell">
    <Back @click="beforeBack" v-if="!ifMobile"></Back>
    <div class="aside left" v-if="!ifMobile">
        <transition name="fade">
        <div class="content" v-if="!ifAlter&&titles.length!=0">
            <div
                class="contentLine"
                v-for="anchor in titles"
                :key="anchor"
                :style="{ padding: `10px 0 10px ${anchor.indent * 10+10}px` }"
                @click="handleAnchorClick(anchor)"
            >
                <a style="cursor: pointer">{{ anchor.title }}</a>
            </div>
        </div>        
        </transition>
    </div>
    <div class="mainShell">
        <div class="head">
        </div>
        <div class="MobileNav" v-if="ifMobile">
            <div class="navItem" @click="goBack">返回主页</div>
            <div class="navItem" @click="goTop">回到顶部</div>
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
                        {{authorName}}
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
                <div class="ops" v-if="ifAuthor&&(!ifMobile)">
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
                <div v-if="!ifAlter">
                    <v-md-preview class="mdPart" ref="preview" :text="data.context" height="550px" ></v-md-preview>
                    <div class="noteShell"><div class="textShell">本文最后修改于&nbsp;&nbsp;&nbsp;&nbsp;{{lastChanged}}</div> </div>                    
                </div>
                <div class="editorShell" style="width:800px" v-if="ifAlter">
                    <v-md-editor  v-model="newContext" height="550px"></v-md-editor>
                </div>
            </div>
            <!-- <div class="tagShell">
                <div class="tag" v-for="tag in tags" :key="tag" @click.stop="intoTag(tag)">
                    {{tag}}
                </div>
            </div> -->
        </div>
        <div class="commentBox">
            <Comment :blog_id="blogId" :ifAuthor="ifAuthor"></Comment>
        </div>
        <Foot></Foot>
    </div>
    <div class="aside right" v-if="!ifMobile">
        <div class="fixedShell">
            <transition-group name="list" tag="div">
                <div class="cell like" v-if="!ifPrivate&&uid" key="like">
                    <div class="iconShell" @click="likeToggle">
                        <img style="height:100%" :src="likeIcon" alt="">
                    </div>
                    <div>{{data.likes}}</div>
                </div>
                <div class="cell toTop" @click="goTop" v-if="ifTop" key="top">
                    <div class="iconShell">
                        <img style="height:100%" src="../assets/angle-up.png" alt="">
                    </div>
                </div>
            </transition-group>
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
import { getCookie, setCookie } from '../utils/cookies';
import {debounce} from '../utils/debounce';
import { throttle } from '../utils/throttle';
import Comment from '../components/comment.vue';
export default{
    name: "atricle",
    methods: {
        goBack(){
            this.$router.push('/');
        },
        goTop(){
            // let timeStamp = requestAnimationFrame(function fn() {
            //     let osTop = document.documentElement.scrollTop || document.body.scrollTop;
            //     let speed = -osTop / 6;
            //     document.documentElement.scrollTop = document.body.scrollTop = osTop + speed;
            //     if (osTop == 0) {
            //         cancelAnimationFrame(timeStamp);
            //     }else{
            //         timeStamp = requestAnimationFrame(fn);
            //     }
            // });
            window.scrollTo({top:0,behavior:'smooth'});
        },
        likeToggle(){
            if(!this.likeLock){
                this.debounceFunc();
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
        setAuthorName(uid){
            console.log('[setAuthorName]author_uid=',uid);
            axios.get(store.state.preUrl+'/uid',{params:{
                uid:uid
            }}).then(Response=>{
                console.log('[setAuthorName]response=',Response);
                this.authorName = Response.data.username;
            })
        },
        //初始化请求数据
        init() {
            let blogId = this.$route.query.blogId;
            this.blogId = blogId;
            // console.log(this.$route.query);
            
            let axiosInstance = axios.create({
                baseURL: store.state.preUrl,
                withCredentials: true, //携带cookie
                timeout: 1000,
                // headers:{"token":store.state.token}
            });
            axiosInstance.get("/blog", { params: {
                    blogId: blogId
            } }).then((Response) => {
                this.data = Response.data;
                this.setAuthorName(this.data.author_uid);
                let date = new Date(this.data.sub_date);
                this.data.sub_date = date.getFullYear()+"-"+String(date.getMonth()+1).padStart(2,"0")+"-"+String(date.getDate()).padStart(2,"0");
                this.ifAuthor = this.data.author_uid==store.state.uid?true:false;
                this.ifPrivate = this.data.private=="1"?true:false;
                date = new Date(this.data.last_changed);
                this.lastChanged = date.getFullYear()+"-"+String(date.getMonth()+1).padStart(2,"0")+"-"+String(date.getDate()).padStart(2,"0");
            });

            //确认访问情况
            // console.log("[init]cookie=",getCookie(`viewCookie${this.$route.query.blogId}`));
            if( getCookie(`viewCookie${this.$route.query.blogId}`) !== 'viewed'){
                //更新访问cookie
                setCookie(`viewCookie${this.$route.query.blogId}`,'viewed',3);
                //浏览量+1
                axios.get(store.state.preUrl + "/addViews", { params: {
                        blogId: blogId
                } })
            }

            // 确认点赞情况
            axios.get(store.state.preUrl + "/checkLike", { params: {
                    uid:store.state.uid,
                    blogId: blogId
            } }).then((Response) => {
                this.ifLike = Response.data=="1"?true:false;
            });

            //封装防抖函数
            this.debounceFunc = debounce(()=>{
                this.likeLock = false;
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
                        this.init();
                    }else{
                        store.commit("setHintText","操作失败");
                    }
                    this.likeLock = false;
                });
            },314);

            //封装节流函数
            this.throttleFunc = throttle(()=>{
                if(document.documentElement.clientWidth<1125){
                    document.getElementsByClassName('shell')[0].style.setProperty('--main-width','100%');
                    document.getElementsByClassName('shell')[0].style.setProperty('--head-height','100px');
                    store.commit('setMode','mobile');
                    this.ifMobile = true;
                }else{
                    this.ifMobile = false;
                    document.getElementsByClassName('shell')[0].style.setProperty('--main-width','800px');
                    document.getElementsByClassName('shell')[0].style.setProperty('--head-height','200px');
                    store.commit('setMode','pc');
                }
            },314)

            //监听页面大小变化进行适配
            window.addEventListener('resize',this.throttleFunc);
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
                    uid: store.state.uid,
                    author_uid:this.data.author_uid,
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
                    uid: store.state.uid,
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
        //更新目录
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
            blogId:undefined,
            authorName:'',
            lastChanged:"",
            ifAlter:false,
            ifAuthor:false,
            ifLike:false,
            ifTop:false,
            ifMobile:false,
            likeLock:false,
            ifPrivate:true,
            newTitle:"",
            newContext:"",
            newTags:[],
            tagInput:"",
            titles:"",
            uid:store.state.uid,
            //包装好后防抖函数对象的引用-用于点赞
            debounceFunc:undefined,
            //包装好后节流函数对象的引用-用于监听页面大小变化
            throttleFunc:undefined
        };
    },
    mounted() {     
        setTimeout(()=>{
            // console.log("[preview]=",this.$refs.preview.$el.firstChild);
            this.setTitles();
        },300)

        //初始化【返回顶部】监听器
        var intersectionObserver = new IntersectionObserver(
            (entries)=> {
            // 如果不可见，就返回
            if (entries[0].intersectionRatio <= 0){
                this.ifTop = true;
            }else{
                this.ifTop = false;
            }
            },{threshold:[0,1]}
        );
        intersectionObserver.observe(document.getElementsByClassName('head')[0]);

        
        //初始化模式
        if(document.documentElement.clientWidth<1125){
            document.getElementsByClassName('shell')[0].style.setProperty('--main-width','100%');
            document.getElementsByClassName('shell')[0].style.setProperty('--head-height','100px');
            // console.log('[throttleFunc]width=',document.documentElement.clientWidth,'移动端模式');
            this.ifMobile = true;
        }else{
            document.getElementsByClassName('shell')[0].style.setProperty('--main-width','800px');
            document.getElementsByClassName('shell')[0].style.setProperty('--head-height','200px');
            this.ifMobile = false;
        }
    },
    computed:{
        btn2Name(){
            return this.ifAlter?"确认修改":"修改";    
        },
        likeIcon(){
            return this.ifLike?likeIcon:disLikeIcon;
        },
    },
    beforeUnmount() {
        //移除监听器
        window.removeEventListener('resize',this.throttleFunc);
    },
    components: { Foot, Back, Comment }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.shell{
    --main-width:800px;
    --head-height:200px;
    --BKG-color:#b5c0ed;
    --box-margin:10px;
}
    .fade-enter-to,
    .fade-leave-from {
        transform: translateX(-75px);
        opacity: 0;
    }

    .list-move, /* 对移动中的元素应用的过渡 */
    .list-enter-active,
    .list-leave-active {
        transition: all 0.25s ease;
    }
    .list-leave-to{
        transform: translateY(75px);
        opacity: 0;
    }
    .list-enter-from{
        transform: translateY(75px);
        opacity: 0;
    }

    /* 确保将离开的元素从布局流中删除
    以便能够正确地计算移动的动画。 */
    .list-leave-active {
        position: absolute;
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
        width: 800px;
        white-space: nowrap;
        overflow-x:auto;
    }
    .itemShell::-webkit-scrollbar{
        /* display: none; */
        height: 5px;
        background-color: #d4d2d2;
    }
    .itemShell::-webkit-scrollbar-thumb{
        height: 5px;
        background-color: #707070;
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
        margin: 0 auto;
        margin-top:210px;
        bottom: 0;
        height: auto;
        width: 220px;
        border-radius: 10px;
        position: relative;
        display: flex;
        flex-direction: column;
        /* background-color: olivedrab; */
    }
    .aside.right{
        justify-content: flex-end;
    }
    .aside.left{
        justify-content: flex-start;
    }
    .mainShell{
        /* margin-right: calc(50% - 400px); */
        width: var(--main-width);
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
        width: 100%;
        transition: 0.25s;
        border-radius: 5px;
        font-size: 8px;
        box-shadow: 0 2px 10px 2px rgba(54,58,80,.32);
        position: sticky;
        top: 10px;
        transition: 0.25s;
        padding: 10px;
        margin-right:  10px;
    }
    .contentLine{
        transition: 0.25s;
    }
    .contentLine:hover{
        background-color: #ededed;
        transform: scale(1.1);
        color: #3eaf84;
        cursor: pointer;
        font-weight: bold;
    }
    .fixedShell{
        padding-bottom: 30px;
        left: 50%;
        position: sticky;
        bottom: 20px;
        margin: 0 auto;
    }
    .cell{
        background-color: #fff;
        height: 75px;
        width: 75px;
        border-radius: 5px;
        box-shadow: 0 2px 10px 2px rgba(54,58,80,.32);
        margin: 20px auto;
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
        /* background-color: olivedrab; */
        margin: auto;
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
        background-color: var(--BKG-color);
        display: flex;
        flex-direction: row;
        justify-content: center;
        width: 100%;
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
        width: 100%;
        height: var(--head-height);
        left: 100px;
        background-color: rgb(208, 231, 251);
        z-index: -5;
        text-align:center;
    }
    .MobileNav{
        margin: auto;
        width: 100%;
        height: 30px;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        margin-top: 0px;
        flex-direction: row;
        background-color: white;
        box-shadow: 0 2px 10px 2px rgba(54,58,80,.32);
        position: sticky;
        top: 0;
        z-index: 2;
    }
    .navItem{
        width: fit-content;
        padding: 0 5px;
        margin: auto 0;
        /* font-family: Microsoft YaHei; */
    }
    .navItem:hover{
        cursor: pointer;
    }
    .BlogShell{
        margin: auto;
        display: flex;
        flex-direction: column;
        justify-content: center;
    }
    .headLine{
        margin: var(--box-margin) auto;
        width: 100%;
        min-height: 70px;
        display: flex;
        background-color: #fff;
        box-shadow: 0 2px 10px 2px rgba(54,58,80,.32);
        font-size: 32px;
        border-radius: 5px;
    }
    .line{
        margin: auto;
        width: 100%;
        height: 30px;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        margin-bottom: var(--box-margin);
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
        width: 100%;
        background-color: #fff;
        box-shadow: 0 2px 10px 2px rgba(54,58,80,.32);
        height: fit-content;
        min-height: 500px;
    }
    .editorShell{
        margin: auto;
        width: 100%;
        background-color: #fff;
        box-shadow: 0 2px 10px 2px rgba(54,58,80,.32);
        height: fit-content;
        min-height: 500px;
    }
    .context{
        border-radius: 5px;
        width: 100%;
        overflow: hidden;
        margin: auto;
        height: fit-content;
        box-shadow: 0 2px 10px 2px rgba(54,58,80,.32);
    }
    .noteShell{
        width: 100%;
        height: 30px;
        background-color: white;
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
    }
    .noteShell .textShell{
        color: rgb(152, 161, 161);
        font-size: 12px;
        margin: auto 10px;
    }
    .commentBox{
        margin-top: 10px;
        width: 100%;
        height: fit-content;
        background-color: white;
        border-radius: 5px;
        overflow: hidden;
        box-shadow: 0 2px 10px 2px rgba(54,58,80,.32);
    }
</style>
