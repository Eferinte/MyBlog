<template>
<div class="shell">
  <div id="loginPart" v-if="!ifMobile">
    <transition name="fade">
      <div id="loginMask" v-show="maskShow">
        <transition name="fade">
          <Login v-if="loginShow"></Login>
        </transition>
        <transition name="fade">
          <Recorder v-if="recorderShow"></Recorder>
        </transition>
        <transition name="fade">
          <Timer v-if="timerShow"></Timer>
        </transition>
      </div>
    </transition>
  </div>
  <LeftBar v-if="!ifMobile"></LeftBar>
  <div class="mainShell">
    <div class="headShell">
      <Head2 v-if="!ifMobile"></Head2>
    </div>    
    <div class="mainBox">
      <div class="articleBox">
        <router-view></router-view>
      </div>
      <div class="aside" v-if="!ifMobile">
        <div class="stickyBox">
          <TagCollotion></TagCollotion>
        </div>
      </div>
    </div>
  </div>
  <transition name="fadeUp">
    <div class="cell" @click="goTop" v-show="ifTop" :style="goTopScale">
      <div class="iconShell">
        <img style="height:100%" src="../assets/angle-up.png" alt="">
      </div>
    </div>  
  </transition>
  <!-- <div class="cell test" @click="doTest" :style="goTopScale">
    <div class="iconShell">
      <img style="height:100%" src="../assets/test.png" alt="">
    </div>
  </div>   -->

</div>

</template>
<script>
import Head2 from '../components/Head2.vue'
import Login from '../components/Login.vue'
import LeftBar from '../components/LeftBar.vue'
import Recorder from '../components/Recorder.vue';
import Timer from '../components/Timer.vue';
import TagCollotion from '../components/TagCollotion.vue';
import { throttle } from '../utils/throttle';
import store from '../main';
export default {
  components:{ Head2, Login, LeftBar, Recorder, Timer, TagCollotion },
  name: 'Home',
  methods: {
      // //测试用函数
      // doTest(){
      //   let log = store.state.log;
      //   alert(log);
      // },
    //适配函数
    changeFunc(){
      if(875<document.documentElement.clientWidth&&document.documentElement.clientWidth<1125){
          document.getElementsByClassName('shell')[0].style.setProperty('--main-width','875px');
          document.getElementsByClassName('shell')[0].style.setProperty('--head-height','200px');
          document.getElementsByClassName('shell')[0].style.setProperty('--head-width','875px');
          document.getElementsByClassName('shell')[0].style.setProperty('--mainBox-marginTop','10px');
          document.getElementsByClassName('shell')[0].style.setProperty('--shellRadius','10px');
          // console.log('[throttleFunc]width=',document.documentElement.clientWidth,'次移动端模式');
          this.goTopScale="transform:scale(1);";
          this.ifMobile = true;
          store.commit('setMode','pc');
      }else if(document.documentElement.clientWidth<875){
          document.getElementsByClassName('shell')[0].style.setProperty('--main-width','100%');
          document.getElementsByClassName('shell')[0].style.setProperty('--head-height','100px');
          document.getElementsByClassName('shell')[0].style.setProperty('--head-width','100%');
          document.getElementsByClassName('shell')[0].style.setProperty('--mainBox-marginTop','0');
          document.getElementsByClassName('shell')[0].style.setProperty('--shellRadius','0px');
          // console.log('[throttleFunc]width=',document.documentElement.clientWidth,'移动端模式');
          this.goTopScale="transform:scale(0.7);";
          this.ifMobile = true;
          store.commit('setMode','mobile');
      }else{
          document.getElementsByClassName('shell')[0].style.setProperty('--main-width','875px');
          document.getElementsByClassName('shell')[0].style.setProperty('--head-height','200px');
          document.getElementsByClassName('shell')[0].style.setProperty('--head-width','1200px');
          document.getElementsByClassName('shell')[0].style.setProperty('--mainBox-marginTop','10px');
          document.getElementsByClassName('shell')[0].style.setProperty('--shellRadius','10px');
          this.goTopScale="transform:scale(1);";
          this.ifMobile = false;
          store.commit('setMode','pc');
      }
    },
    goTop(){
      // let timeStamp = requestAnimationFrame(function fn() {
      //   let osTop = document.documentElement.scrollTop || document.body.scrollTop;
      //   let speed = -osTop / 6;
      //   document.documentElement.scrollTop = document.body.scrollTop = osTop + speed;
      //   if (osTop == 0) {
      //       cancelAnimationFrame(timeStamp);
      //   }else{
      //       timeStamp = requestAnimationFrame(fn);
      //   }
      // });
      window.scrollTo({top:0,behavior:'smooth'});
    },
    init(){
      var intersectionObserver = new IntersectionObserver(
        (entries)=> {
          // 如果不可见，就返回
          if (entries[0].intersectionRatio <= 0){
            this.ifTop = true;
          }else{
            this.ifTop = false;
          }
        }
      );
      intersectionObserver.observe(document.getElementsByClassName("headShell")[0]);
      //监听页面大小变化进行适配
      window.addEventListener('resize',this.throttleFunc);
    }
  },
  computed:{
    uid(){
      return this.$store.state.uid;
    },
    maskShow(){
      return this.$store.state.maskShow;
    },
    loginShow(){
      return this.$store.state.loginShow;
    },
    recorderShow(){
      return this.$store.state.recorderShow;
    },
    timerShow(){
      return this.$store.state.timerShow;
    }
  },
  created() {
    this.$router.push('/home/articles');
    //封装节流函数
    this.throttleFunc = throttle(()=>{
      this.changeFunc();
    },314)
  },
  mounted() {
    this.init();
    //挂载时监听
    this.changeFunc();
  },
  beforeUnmount() {
      //移除监听器
      window.removeEventListener('resize',this.throttleFunc);
  },
  data() {
    return {
      ifTop:false,
      ifMobile:false,
      throttleFunc:undefined,
      goTopScale:"transform:scale(1);"
    }
  },
}
</script>

<style scoped>
.shell{
  --main-Width: 875px;
  --head-height:200px;
  --head-width:1200px;
  --mainBox-marginTop:10px;
  --shellRadius:10px;
}
.shell{
  /* background-image: url('../assets/background2.jpg');
  background-size: 100% 100%; */
  height: 100%;
}
.background{
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  /* background-image: url("../assets/background.jpg"); */
  background-size: cover;
  z-index: -999;
  /* opacity: 0; */
  background-color: #f4f5f7;
}
.bosses-enter-from,
.bosses-leave-to {
  opacity: 0;
}
.bosses-leave-active {
  position: absolute;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.fadeUp-enter-active,
.fadeUp-leave-active {
  transition: opacity 0.5s ease;
}

.fadeUp-enter-from,
.fadeUp-leave-to {
  opacity: 0;
  transform: translateY(75px);
}
.mainShell{
  display: flex;
  flex-direction: column;
  left: 200px;
  width: var(--head-width);
  margin:auto;
}
.mainBox{
  /* 这个水平居中方法记得收录 */
  /* position: absolute;
  top: 210px;
  margin-left: -437.5px;
  margin-bottom: 10px;
  left: 50%; */
  margin-top: var(--mainBox-marginTop);
  height: fit-content;
  width: var(--head-Width);
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  position: relative;
}
.articleBox{
  width: var(--main-Width);
  border-radius: var(--shellRadius) var(--shellRadius) 0 0;
  overflow: hidden;
}
.aside{
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  position: relative;
  top: 0;
  bottom: 0;
  height: auto;
  width: 315px;
  /* background-color: rgb(175, 160, 189); */
}
.stickyBox{
  position: -webkit-sticky;
  position: sticky;
  top: 10px;
}

#loginPart{
  z-index: 10;
}
#loginMask{
  position: fixed;
  left: 0;
  top: 0;
  /* opacity: 40%; */
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.5);
  transition: 0.5s;;
  z-index: 10;
}

.headShell{
  background-image: url("../../public/assert/background.jpg");
  /* background-image: url('../assets/background.jpg'); */
  background-size: 100% 180%;
  /* position: absolute;
  top: 0px;
  margin-left: calc(50% - 580px); */
  width: var(--head-width);
  height: var(--head-height);
  background-color: rgb(208, 231, 251);
  z-index: -5;
  text-align:center;
  border-radius: 0px 0px var(--shellRadius) var(--shellRadius);
  /* box-shadow: 0 2px 10px 2px rgba(54,58,80,.32); */
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
  position: fixed;
  right: 50px;
  bottom: 20px;
  display: flex;
  transition: 0.25s;
  z-index: 5;
}
.cell.test{
  bottom: 150px;
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
  margin: auto;
}
</style>
