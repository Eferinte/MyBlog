<template>
    <div id="leftBar">
        <div  class="cell" @click="userClick" >
            <div id="userCell">
            <!-- <div class="cellMask" ref="userMask"></div> -->
            <img id="user" class="cellImg" :src="userIcon" />
            </div>
        </div>
        <div class="cell" @click="openRecorder">
            <img id="hollowKnightRecorder" class="cellImg" src="../assets/Pantheon_of_Hallownest.png"/>
        </div>
    </div>
</template>

<script>
import login from '../assets/login.png'
import userIcon1 from '../assets/myuserImg.jpg'
export default {
    name:"LeftBar",
    methods: {
        userClick(){
            if(this.$store.state.uid){
                // 跳转到个人主页
            }else{
                this.$emit("listenOpen")
            }
        },
        // userOver(){
        //     this.$refs.userMask.style.opacity="0.2";

        //     if(this.uid){
        //         // 提示去往个人主页
        //     }else{
        //         // 提示登录
        //     }
        // },
        // userOut(){
        // //关闭提示遮罩层
        //     this.$refs.userMask.style.opacity="0"
        // },
        openRecorder(){
        // this.masked = true;
        // this.select.recorder = true;
        },
        closeLogin(){
            this.$emit("listenClose")
        },
        // closeRecorder(){
        //     this.masked = false;
        //     this.select.recorder = false;
        // },
    },
    computed:{
        userIcon(){
            if(this.$store.state.uid){
                return userIcon1;
            }else{
                return login;
            }
        },
    }
}
</script>

<style>

#leftBar{
  margin: 0;
  position: fixed;
  width: 100px;
  height: 100%;
  left: 0;
  top: 0;
  background-color: #74759b;
  z-index: -3;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.cell{
  margin: 20px auto;
  width: 80%;
  transition: 0.3s;
  position: relative;
}
.cell:hover{
  transform: scale(1.1);
  cursor:pointer;
}
.cellImg{
  width: 70px;
  height: auto;
  display:inline;
  z-index: 0;
}
#user{
  width: 100px;
  height: 100px;
  z-index: 0;
  position: absolute;
  top: -15px;
  left: -15px;
}
#userCell{
  position: relative;
  overflow: hidden;
  width: 70px;
  height: 70px;
  border-radius: 100%;
  /* border: solid 2px rgb(135, 167, 253); */
  background-color: white;
}
.cellMask{
  width: 100%;
  height: 100%;
  background-color: black;
  position: absolute;
  opacity: 0;
  transition: 0.3s;
}
</style>