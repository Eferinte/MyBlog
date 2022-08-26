<template>
<div style="position:relative;overflow-x: hidden;">
    <div class="headShell">
        <Back></Back>
        <div class="head">
            <div class="iconShell">
                <img class="iconImg" :src="userIcon" @click="hide"/>
            </div>
            <div class="msgShell">
                <div class="line" v-for="item in msgList" :key="item">
                    <div class="tagName">
                        {{item.name}}
                    </div>
                    <div class="tagText">
                        {{item.context}}
                    </div>
                </div>
            </div>
            <div class="optionShell">
                <!-- <div class="cell">
                    <button class="button1" @click="changePassword">修改密码</button>
                </div> -->
                <div class="cell">
                    <button class="button1" @click="logout">退出登录</button>
                </div>
            </div>
        </div>
    </div>
    <!-- <div class="topBlogPart">
            <div class="cardShell" @mouseenter="showCancelTop()" @mouseleave="hideCancelTop()">            
                <div class="cancelTopBtn" @click="cancelTop()">
                    <div class="topIconShell">
                        <img style="width:100%" src="../assets/setTop.png" alt="">
                    </div>
                    <div class="textShell">设为置顶</div>
                </div>
                <BlogCard  
                :title="topBlog.title" 
                :blogId="topBlog.blogId" 
                :brief="topBlog.brief" 
                :subDate="topBlog.subDate" 
                :tags="topBlog.tags" 
                :ifPrivate="topBlog.private" 
                :views="topBlog.views"
                :likes="topBlog.likes"
                ></BlogCard>
            </div>
    </div> -->
    <div class="articlesPart">
        <transition-group name="list" tag="blog-card">
            <div class="cardShell" v-for="(blog,index) in blogs" :key="blog.blogId" @mouseenter="showSetTop(index)" @mouseleave="hideSetTop(index)">            
                <div class="setTopBtn" @click="setTop(blog.blogId)">
                    <div class="topIconShell">
                        <img style="width:100%" src="../assets/setTop.png" alt="">
                    </div>
                    <div class="textShell">设为置顶</div>
                </div>
                <BlogCard  
                :title="blog.title" 
                :blogId="blog.blogId" 
                :brief="blog.brief" 
                :subDate="blog.subDate" 
                :tags="blog.tags" 
                :ifPrivate="blog.private" 
                :views="blog.views"
                :likes="blog.likes"
                ></BlogCard>
            </div>
        </transition-group>
    </div>
    <div class="noMore">
        <div class="text">没有更多</div>
    </div>
</div>
</template>

<script>
import userIcon from '../assets/defaultUser.png'
import { delCookie } from '../utils/cookies';
import Back from '../components/Back.vue';
import store from '../main';
import axios from 'axios';
import BlogCard from '../components/BlogCard.vue';
import Qs from 'qs';
export default {
    name: "UserSpace",
    methods: {
        showSetTop(index){
            document.getElementsByClassName('setTopBtn')[index].style.setProperty('transform','translateX(60px)');
        },
        hideSetTop(index){
            document.getElementsByClassName('setTopBtn')[index].style.setProperty('transform','none');
        },
        setTop(blogId){
            let axiosInstance = axios.create({
                baseURL: store.state.preUrl,
                timeout: 1000,
                headers:{"token":store.state.token}
            });
            let params= {
                blogId:blogId,
                uid:store.state.uid
            }
            //提交修改
            axiosInstance.post(store.state.preUrl+"/userSetTop", Qs.stringify(params)).then((Response) => {
                // console.log(Response.data);
                if(Response.data=="success"){
                    store.commit("setHintText","置顶成功");
                }else{
                    store.commit("setHintText","置顶失败");
                }
            });
        },
        logout() {
            delCookie("username");
            delCookie("uid");
            delCookie("token")
            this.$store.commit("clear");
            this.$router.push("/");
            
            window.localStorage.removeItem("uid");
            window.localStorage.removeItem("username");
            window.localStorage.removeItem("token");

        },
        back() {
            this.$router.push("/");
        },
        changePassword() {
        },
        hide(e){
            let element = e.target.parentNode.parentNode;
            if(this.ifHide){
                element.style="transform:translateX(0px);"
            }else{
                element.style="transform:translateX(500px);"
            }
            this.ifHide = !this.ifHide;
        },
        init(){
            //请求个人信息
            axios.get(store.state.preUrl+"/uid",{params:{uid:store.state.uid}}).then((Response)=>{
                console.log("[LOG]data=",Response.data,'uid=',store.state.uid);
                let date = new Date(Response.data.registration_time);
                date = date.getFullYear()+"-"+String(date.getMonth()+1).padStart(2,"0")+"-"+String(date.getDate()).padStart(2,"0");
                this.msgList=[
                    {
                        name:"用户名",
                        context:Response.data.username
                    },
                    {
                        name:"UID",
                        context:Response.data.uid
                    },
                    {
                        name:"注册时间",
                        context:date
                    }
                ]
                this.topBlogId = Response.data.topBlog;
                //加载置顶博客
                axios.get(store.state.preUrl+'/blog',{params:{
                    blogId:Response.data.topBlog
                }}).then(response=>{
                    this.topBlog = response.data;
                    this.topBlog.private=this.topBlog.private==1?true:false;
                })
            })
            //请求个人博客
            axios.get(store.state.preUrl+'/authorBlogs',{params:{
                author_uid:store.state.uid,
            }}).then((Response)=>{
                // console.log(Response);
                for(let index in Response.data){
                    let obj = Response.data[index]
                    this.blogs.push({
                        title:obj.title,
                        author:obj.author,
                        subDate:obj.sub_date,
                        blogId:obj.blog_id,
                        brief:obj.context,
                        tags:obj.tags,
                        private:obj.private==1?true:false,
                        views:obj.views,
                        likes:obj.likes
                    })
                }
                // console.log("数据请求完毕",Response);
            });
        }
    },
    data() {
        return {
            userIcon: userIcon,
            username:store.state.username,
            msgList:[],
            ifHide:false,
            blogs:[],
            topBlog:undefined
        };
    },
    created() {
        this.init();
    },
    components: { Back, BlogCard }
}
</script>

<style scoped>
.list-move, /* 对移动中的元素应用的过渡 */
.list-enter-active,
.list-leave-active {
  transition: all 0.75s ease;
}

.list-enter-from:nth-child(2n+1){
  opacity: 0;
  transform: translateX(-300px);
}
.list-enter-from:nth-child(2n){
  opacity: 0;
  transform: translateX(300px);
}

/* 确保将离开的元素从布局流中删除
  以便能够正确地计算移动的动画。 */
.list-leave-active {
  position: absolute;
}

    .setTopBtn{
        height: 250px;
        width: 60px;
        position: absolute;
        right: 0;
        top: 0;
        background-color: rgb(191, 166, 216);
        box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
        transition: 0.25s;
        border-radius: 3px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        margin: 20px 0;
    }
    .setTopBtn .topIconShell{
        width: 40px;
        height: 50px;
        margin: auto;
        margin-bottom: 0;
    }
    .setTopBtn .textShell{
        width: 40px;
        height: 50px;
        margin: auto;
        margin-top: 10px;
        font-weight: bold;
        text-align: center;
    }
    .setTopBtn:hover{
        cursor: pointer;
    }
.line{
    height: 20px;
    display: flex;
    flex-direction: row;
    margin: 10px 5px;
    margin-left: 75px;
    justify-content: center;
}
.tagName{
    padding: 0px 10px;
    width: 80px;
    height: 20px;
    border: solid 2px aliceblue;
    border-radius: 11px 0 0 11px;
    background-color: aliceblue;
}
.tagText{
    width: 100px;
    padding: 0px 5px;
    height: 20px;
    border: solid 2px aliceblue;
    border-radius: 0 11px 11px 0;
    background-color: aliceblue;
}
.msgShell{
    width: 400px;
    height: 160px;
    margin: auto 0;
    border-radius: 3px;
    background-color: #949c92;
    color: black;
    display: flex;
    justify-content: center;
    flex-direction: column;
}
.button1{
    width: 120px;
    height: 30px;
}
.button1:hover{
    cursor: pointer;
}
.headShell{
    /* position: absolute; */
    top: 0;
    width: 100%;
    background-color: antiquewhite;
    overflow: hidden;
}
.head{
    height: fit-content;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    transition: 0.25s;
}
.iconShell{
    position: relative;
    left: 75px;
    margin: 20px 0;
    border-radius: 50%;
    border: solid 5px #949c92;
    height: 150px;
    width: 150px;
    overflow: hidden;
    z-index: 5;
    background-color: black;
}
.iconImg{
    height: 100%;
    transition: 0.25s;
}
.iconImg:hover{
    cursor: pointer;
    opacity: 0.7;
}

.optionShell{
    margin: 20px 0;
    padding-right: 50px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 150px;
    height: 160px;
    background-color: #949c92;
}
.cell{
    margin: 20px auto;
    width:fit-content;
}
/* .cardShell:nth-child(2n+1){
    left: -40px;
}
.cardShell:nth-child(2n){
    left: 120px;
} */
.cardShell{
    margin: 20px auto;
    display: flex;
    justify-content: center;
    position: relative;
    width: 650px;
}
.topBlogPart{
    min-height: 100px;
    margin:0 auto;
    margin-top: 10px;
    width: 875px;
    display: flex;
    flex-direction: column;
    background-color: #b3ada5;
    border-radius:  5px;
    position: relative;
}
.articlesPart{
    min-height: 468px;
    margin:0 auto;
    margin-top: 10px;
    width: 875px;
    display: flex;
    flex-direction: column;
    background-color: #b3ada5;
    border-radius:  5px 5px 0 0 ;
    position: relative;
}
.noMore{
    margin: auto;
    width: 875px;
    height: 75px;
    /* background-color: #b3ada5; */
    background-color: #b3ada5;
    display: flex;
}
.text{
    margin: auto;
    font-size: 30px;
    font-weight: bold;
    color: white;
    text-shadow: 0 0 10px black;
}
</style>