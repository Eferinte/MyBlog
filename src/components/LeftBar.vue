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
            <!-- <div class="leftTime">00:00:00</div> -->
          </div>
        </div>
        <div class="cell" @click="doTest">
          <div class="imgShell">
            <img id="test" class="cellImg" src="../assets/test.png"/>
          </div>
        </div>
    </div>
</template>

<script>
import login from '../assets/login.png'
import userIcon1 from '../assets/myuserImg.jpg'
import store from '../main'
import { test } from '../utils/test'
import { getCookie } from '../utils/cookies'
export default {
    name:"LeftBar",
    methods: {
      //测试用函数
      doTest(){
        let log = test();
        alert(log);
      },
      userClick(){
        // 跳转到个人主页,登录逻辑交给路由守卫处理
        this.$router.push('/UserSpace')
      },
      openEditor(){
        // 跳转到创建页
        this.$router.push('/Editor')
      },
      openRecorder(){
        // 打开记录窗口
        //是否登录
        if(!store.state.uid){
            // 返回 false 以取消导航
            // 打开登录窗口
            store.commit("openMask");
            store.commit("openLogin");
            return false
        }else{
          store.commit("openMask");
          store.commit("openRecorder");
        }
      },
      openTimer(){
        // 打开沙漏窗口
        //是否登录
        if(!store.state.uid){
            // 返回 false 以取消导航
            // 打开登录窗口
            store.commit("openMask");
            store.commit("openLogin");
            return false
        }else{
          store.commit("openMask");
          store.commit("openTimer");
        }
      }
    },
    computed:{
        userIcon(){
            if(this.$store.state.uid){
                return userIcon1;
            }else{
                return login;
            }
        },
    },
    created() {
      setTimeout(()=>{
        console.log("[LOG]cookies=",getCookie("uid"),getCookie("username"));
        if(getCookie("uid")){
          this.$store.commit("setUid",getCookie('uid'));
          this.$store.commit("setUsername",getCookie('username'));
        }
      },5000)
    },
}
</script>

<style scoped>
#test{
  transform: scale(0.7);
}
.leftTime{
  position: relative;
  top: 24px;
  left: 3px;
}
#leftBar{
  margin: 0;
  position: fixed;
  width: 100px;
  height: 100%;
  left: 0;
  top: 0;
  background-color: #A6A6A6;
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