<template>
    <div id="leftBar">
        <div  class="cell" @click="userClick" >
            <div class="imgShell">
              <img id="user" class="cellImg" :src="userIcon" />
            </div>
        </div>
        <div class="cell" @click="openEditor">
          <div class="imgShell">
            <img id="editor" class="cellImg" src="../assets/editor.png"/>
          </div>
        </div>
        <div class="cell" @click="openRecorder">
          <div class="imgShell">
            <img id="hollowKnightRecorder" class="cellImg" src="../assets/Pantheon_of_Hallownest.png"/>
          </div>
        </div>
        <div class="cell" @click="openTimer">
          <div class="imgShell">
            <img id="timer" class="cellImg" src="../assets/timer.png"/>
          </div>
        </div>
    </div>
</template>

<script>
import login from '../assets/login.png'
import userIcon1 from '../assets/myuserImg.jpg'
import store from '../main'
export default {
    name:"LeftBar",
    methods: {
        userClick(){
          // 跳转到个人主页,登录逻辑交给路由守卫处理
          this.$router.push('/UserSpace')
        },
        openEditor(){
          // 跳转到创建页
          this.$router.push('/Editor')
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
          // 打开登录窗口
          store.commit("openMask");
          store.commit("openRecorder");
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

<style scoped>

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
  justify-content:flex-start;
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
#editor{
  width: 50px;
  height: 50px;
  z-index: 0;
  position: absolute;
  top: 12px;
  left: 8px;
}
#hollowKnightRecorder{
  width: 90px;
  z-index: 0;
  position: absolute;
  top: -30px;
  left: -10px;
}
#timer{
  width: 50px;
  height: 50px;
  z-index: 0;
  position: absolute;
  top: 10px;
  left: 10px;
}
.imgShell{
  position: relative;
  overflow: hidden;
  width: 70px;
  height: 70px;
  border-radius: 100%;
  /* border: solid 2px rgb(135, 167, 253); */
  box-shadow: 10px 10px 10px #515050;
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