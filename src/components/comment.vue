<template>
    <div class="commentShell">
        <div class="sendShell" v-if="mode!='mobile'">
            <div class="iconSpace">
                <div class="iconShell">
                    <img style="height:100%" :src="userIcon" alt="">
                </div>
            </div>
            <div class="mainComment">
                <div class="mask" v-if="!ifLogin">
                    <div class="loginBtn" @click="openLogin">请先登录</div>
                </div>
                <textarea :disabled="!ifLogin" type="text" placeholder="发一条友善的评论" v-model="context"></textarea>
                <button :disabled="!ifLogin" @click="sendComment">发送评论</button>
            </div>
        </div>
        <div class="floorsShell">
            <div class="floor" v-for="(comment, index) in comments" :key="comment" @mouseenter="showOps(index)" @mouseleave="unShowOps(index)">
                <div class="iconSpace">
                    <div class="iconShell">
                        <img style="height:100%" src="../assets/defaultUser.png" alt="">
                    </div>
                </div>
                <div class="mainComment">
                    <div class="nameLine">{{comment.username}}</div>
                    <div class="context">{{comment.context}}</div>
                    <div class="note">{{comment.sub_time}}</div>
                </div>
                <div class="opShell" v-if="ifAuthor" @click="doDelete(index)" >
                    <div class="opIcon">
                        <img style="height:100%" src="../assets/delete.png" alt="">
                    </div>
                    <div class="opText">
                        删除评论
                    </div>
                </div>    
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
import store from '../main';
import Qs from 'qs';
import login from '../assets/login.png';
import userIcon1 from '../assets/defaultUser.png';
export default {
    name:'comment',
    props:['blog_id','ifAuthor'],
    methods: {
        doDelete(index){
            if(this.ifAuthor){
                let axiosInstance = axios.create({
                    baseURL: store.state.preUrl,
                    timeout: 1000,
                    headers:{"token":store.state.token}
                });
                let params= {
                    blogId:this.blog_id,
                    floor: this.comments[index].floor,
                }
                // console.log("params=",params);
                axiosInstance.post("/deleteComment", Qs.stringify(params)).then((response) => {
                    if(response.data=="success"){
                        store.commit("setHintText", "删除成功");
                        this.init();
                    }else{
                        store.commit("setHintText", "删除失败");
                    }
                });
            }
        },
        showOps(index){
            if(this.ifAuthor){
                document.getElementsByClassName('opShell')[index].style.setProperty('display','flex');
            }
        },
        unShowOps(index){
            if(this.ifAuthor){
                document.getElementsByClassName('opShell')[index].style.setProperty('display','none');
            }
        },
        sendComment(){
            let axiosInstance = axios.create({
                baseURL: store.state.preUrl,
                timeout: 1000,
                headers:{"token":store.state.token}
            });
            let params= {
                blogId:this.blog_id,
                uid: store.state.uid,
                //转义引号
                context: this.context.replaceAll("'","\\'"),
            }
            // console.log("params=",params);
            axiosInstance.post("/sendComment", Qs.stringify(params)).then((response) => {
                if(response.data=="success"){
                    store.commit("setHintText", "评论成功");
                    this.init();
                }else{
                    store.commit("setHintText", "评论失败");
                }
            });
        },
        init(){
            this.context='';
            //加载评论内容
            axios.get(store.state.preUrl+'/getComment',{params:{
                blogId:this.blog_id
            }}).then(Response=>{
                this.comments = Response.data;
                this.comments.forEach(comment=>{
                    let date = new Date(comment.sub_time);
                    comment.sub_time = date.getFullYear()+"-"+String(date.getMonth()+1).padStart(2,"0")+"-"+String(date.getDate()).padStart(2,"0")+" "+String(date.getHours()).padStart(2,"0")+":"+String(date.getMinutes()).padStart(2,"0")+":"+String(date.getSeconds()).padStart(2,"0");
                })
            })
        }
    },
    data() {
        return {
            comments:[],
            context:'',
        }
    },
    created() {
        this.init();
    },
    computed:{
        userIcon(){
            if(this.ifLogin){
                return userIcon1;
            }else{
                return login;
            }
        },
        ifLogin(){
            return store.state.uid?true:false;
        },
        mode(){
            return store.state.mode;
        }
    }
}
</script>

<style scoped>

.commentShell{
    width: calc(100% - 50px);
    height: fit-context;
    padding: 25px;
}
.sendShell{
    margin:20px 0;
    height: fit-context;
    min-height: 100px;
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-context: space-between;
    position: relative;
}
.floor{
    margin:20px 0;
    height: fit-context;
    min-height: 75px;
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-context: space-between;
    position: relative;
}
.iconSpace{
    width: 70px;
    display: flex;
    flex-direction: column;
    justify-context: flex-start;
}
.iconSpace .iconShell{
    margin: 0px 20px auto 0;
    height: 50px;
    width: 50px;
    overflow: hidden;
    border-radius: 100%;
}
.mainComment{
    min-height: 50px;
    width: calc(100% - 100px);
    position: relative;
    margin-right: 30px;
    padding-bottom: 20px;
}
.opShell{
    position: absolute;
    right: 20px;
    top: 0;
    width: 70px;
    height: 20px;
    background-color: rgb(191, 188, 188);
    display: none;
    flex-direction: row;
}
.opShell:hover{
    cursor: pointer;
}
.opIcon{
    height: 16px;
    width: 16px;
}
.opText{
    width: 50px;
    height: 20px;
    font-size: 12px;
}
.sendShell .mask{
    position: absolute;
    height: 80%;
    width: 100%;
    background-color: rgba(144, 144, 144 , .5);
    display: flex;
}
.loginBtn{
    width: 80px;
    height: 35px;
    background-color: #00a1d6;
    margin: auto;
    color: white;
    text-align: center;
    border-radius: 10px;
}
.sendShell .mainComment{
    height: 80px;
}
textarea{
    width: 90%;
    margin-right: 10px;
    border: solid 1px gray;
    border-radius: 3px;
    padding: 5px;
    resize: none;
    font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
}
textarea:hover{
    outline: 1px solid #00a1d6; 
}
textarea:focus{
    outline: 1px solid #00a1d6; 
}
button{
    width: 75px;
    padding: 20px;
    border-radius: 5px;
    border: 1px solid white;
    background-color: #00a1d6;
    color: white;
    transition: 0.25s;
}
button:hover{
    cursor: pointer;
}
.mainComment button:active{
    transform: scale(0.95);
}
.floor .mainComment{
    border: solid 1px rgb(175, 175, 175);
    border-width: 0 0 1px 0;
}
.sendShell .mainComment{
    /* background-color: aquamarine; */
    display: flex;
    flex-direction: row;
}
.mainComment .nameLine{
    height: 24px;
}
.mainComment .context{
    min-height: calc(100% - 40px);
}

.mainComment .note{
    min-height: 15px;
    font-size: 12px;
    color: rgb(175, 175, 175);
    text-align: right;
    position: relative;
    top: 20px;
}
</style>