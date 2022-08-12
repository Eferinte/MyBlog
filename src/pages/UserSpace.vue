<template>
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
                <div class="cell">
                    <button class="button1" @click="changePassword">修改密码</button>
                </div>
                <div class="cell">
                    <button class="button1" @click="logout">退出登录</button>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
import userIcon from '../assets/myuserImg.jpg'
import { delCookie } from '../utils/cookies';
import Back from '../components/Back.vue';
import store from '../main';
import axios from 'axios';
export default {
    name: "UserSpace",
    methods: {
        logout() {
            delCookie("username");
            delCookie("uid");
            this.$store.commit("clear");
            this.$router.push("/");
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
        }
    },
    data() {
        return {
            userIcon: userIcon,
            username:store.state.username,
            msgList:[],
            ifHide:false
        };
    },
    created() {
        axios.get(store.state.preUrl+"/user",{params:{username:this.username}}).then((Response)=>{
            console.log("[LOG]data=",Response.data);
            let date = new Date(Response.data.registration_time);
            date = date.getFullYear()+"-"+String(date.getMonth()+1).padStart(2,"0")+"-"+date.getDate();
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

        })
    },
    components: { Back }
}
</script>

<style scoped>
.line{
    height: 20px;
    display: flex;
    flex-direction: row;
    margin: 10px 5px;
    margin-left: 75px;
    justify-content: space-around;
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
    position: absolute;
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
</style>