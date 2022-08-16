<template>
    <div id="leftBar">
      <div v-for="(item , index) in items" :key="item">
        <div  class="cell" @click="funcTransfer(index)" @mouseenter="enter" @mouseleave="leave">
            <div class="imgShell">
              <img class="iconImg" :style="item.imgCss" :src="item.icon" />
            </div>
            <div class="slideShell">
              <div class="msg">
                <span class="text">
                {{item.text}}
                </span>
              </div>
              <div class="decorationLine"></div>
            </div>
            <div class="shadowBlock"></div>
        </div>
      </div>
    </div>
</template>

<script>
import login from '../assets/login.png'
import userIcon1 from '../assets/defaultUser.png'
import editorIcon from '../assets/editor.png'
import timerIcon from '../assets/timer.png'
import mangaIcon from '../assets/manga.png'
import testIcon from '../assets/test.png'
import recorderIcon from '../assets/Pantheon_of_Hallownest.png'
import store from '../main'
import { test } from '../utils/test'
import { getCookie } from '../utils/cookies'
export default {
    name:"LeftBar",
    methods: {
      //中转函数，根据item调用对应函数
      funcTransfer(index){
        switch(index){
          case 0: this.goUserSpace();break;
          case 1: this.openEditor();break;
          case 2: this.openRecorder();break;
          case 3: this.openTimer();break;
          case 4: this.openManga();break;
          case 5: this.doTest();break;
        }

      },
      //显示注解块
      enter(e){
        // console.log("[OVER]e=",e.target.childNodes[1]);
        let element = e.target.childNodes[1];
        // element.style="transform:translateX(105px);opacity:1;"
        element.style="width:140px;"
      },
      //收起注解块
      leave(e){
        // console.log("[OUT]e=",e.target.childNodes[1]);
        let element = e.target.childNodes[1];
        // element.style="transform:translateX(0px);opacity:0;"
        element.style="width:0px;"
      },
      //测试用函数
      doTest(){
        let log = test();
        alert(log);
      },
      goUserSpace(){
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
          store.commit("openMask");
          store.commit("openRecorder");
      },
      openManga(){
        // 跳转到创建页
        store.commit("setHintText","该模块暂时不可用")
        // this.$router.push('/manga')
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
        items(){
          return [
            {
              icon:this.userIcon,
              text:"个人空间",
              imgCss:"transform:scale(1.5);"
            },
            {
              icon:editorIcon,
              text:"编辑器",
              imgCss:""
            },
            {
              icon:recorderIcon,
              text:"辐五计数器",
              imgCss:`
                object-fit:cover;
                width: 90px;
                height: 90px;
                z-index: 0;
                position: absolute;
                top: -10px;
                left: -10px;
              `
            },
            // {
            //   icon:timerIcon,
            //   text:"计时器",
            //   imgCss:""
            // },
            // {
            //   icon:mangaIcon,
            //   text:"漫画柜",
            //   imgCss:""
            // },
            // {
            //   icon:testIcon,
            //   text:"测试",
            //   imgCss:""
            // },
          ]
        }
    },
    created() {
      setTimeout(()=>{
        // console.log("[LOG]cookies=",getCookie("uid"),getCookie("username"));
        if(getCookie("uid")){
          this.$store.commit("setUid",getCookie('uid'));
          this.$store.commit("setUsername",getCookie('username'));
        }
      },5000)
    },
}
</script>

<style scoped>
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
  z-index: 1;
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
.slideShell{
  position: absolute;
  overflow: hidden;
  width: 0px;
  height: 70px;
  top: 0px;
  left: 35px;
  background-color: #b2aca4;
  border-radius: 0 35px 35px 0 ;
  box-shadow: 10px 10px 10px #515050;
  z-index: -1;
  transition: 0.25s;
  display: flex;
  justify-content: center;
  flex-direction: column;
}
.msg{
  margin: 10px auto;
  height: 20px;
  width: 140px;
  /* background-color: white; */
  color: #fff;
  font-size: 20px;
}
.text{
  padding-left: 40px;
  width: fit-content;
}
.decorationLine{
  margin: 5px auto;
  height: 15px;
  width: 140px;
  background-color: white;
}
.shadowBlock{
  position: absolute;
  top: 0;
  height: 70px;
  width: 70px;
  border-radius: 100%;
  box-shadow: 10px 10px 10px #515050;
  z-index: -2;
}
.iconImg{
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