<template>
    <div id="head">
        <div id="iconShell">
            <img style="height:100%;width:100%" :src="userIcon"/>
        </div>
        <div id="optionShell">
            <div class="cell">
                <button class="button1" @click="back">返回主页</button>
            </div>
            <div class="cell">
                <button class="button1" @click="changePassword">修改密码</button>
            </div>
            <div class="cell">
                <button class="button1" @click="logout">退出登录</button>
            </div>
        </div>
    </div>
</template>

<script>
import userIcon from '../assets/myuserImg.jpg'
export default {
    name:"UserSpace",
    methods:{
        logout(){
            localStorage.removeItem('uid');
            this.$store.commit("clear");
            this.$router.push('/');
        },
        back(){
            this.$router.push('/');
        },
        changePassword(){

        }
    },
    data() {
        return {
            userIcon:userIcon,
        }
    },
}
</script>

<style scoped>
.button1{
    width: 150px;
    height: 30px;
}
#head{
    position: absolute;
    top: 0;
    width: 100%;
    height: 400px;
    background-color: antiquewhite;
}
#iconShell{
    margin: 20px auto;
    border-radius: 50%;
    border: solid 5px rgb(148, 156, 146);
    height: 150px;
    width: 150px;
    overflow: hidden;
}
#optionShell{
    margin: 20px auto;
    display: flex;
    flex-direction: column;
}
.cell{
    margin: 10px auto;
    width:fit-content;
}
</style>