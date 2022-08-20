<template>
<div class="shell">
  <div id="loginPart">
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
  <LeftBar></LeftBar>
  <div class="mainShell">
    <div class="headShell">
      <Head2></Head2>
    </div>    
    <div class="mainBox">
      <router-view></router-view>
      <div class="aside">
        <div class="stickyBox">
          <TagCollotion></TagCollotion>
        </div>
      </div>
    </div>
  </div>
  <div class="cell" @click="goTop">
    <div class="iconShell">
      <img style="height:100%" src="../assets/angle-up.png" alt="">
    </div>
  </div>

</div>

</template>
<script>
import Head2 from '../components/Head2.vue'
import Login from '../components/Login.vue'
import LeftBar from '../components/LeftBar.vue'
import Recorder from '../components/Recorder.vue';
import Timer from '../components/Timer.vue';
import TagCollotion from '../components/TagCollotion.vue';
export default {
  components:{ Head2, Login, LeftBar, Recorder, Timer, TagCollotion },
  name: 'Home',
  methods: {
    goTop(){
      let timeStamp = requestAnimationFrame(function fn() {
        let osTop = document.documentElement.scrollTop || document.body.scrollTop;
        let speed = -osTop / 6;
        document.documentElement.scrollTop = document.body.scrollTop = osTop + speed;
        if (osTop == 0) {
            cancelAnimationFrame(timeStamp);
        }else{
            timeStamp = requestAnimationFrame(fn);
        }
      });
    },
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
    this.$router.push('/home/articles')
  },
}
</script>

<style scoped>
:root{
    --blogWidth: 800px;
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
.mainShell{
  display: flex;
  flex-direction: column;
  left: 200px;
  width: fit-content;
  margin-left: 200px;
}
.mainBox{
  /* 这个水平居中方法记得收录 */
  /* position: absolute;
  top: 210px;
  margin-left: -437.5px;
  margin-bottom: 10px;
  left: 50%; */
  margin-top: 10px;
  height: fit-content;
  width: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  position: relative;
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
  width: 1200px;
  height: 200px;
  background-color: rgb(208, 231, 251);
  z-index: -5;
  text-align:center;
  border-radius: 0px 0px 10px 10px;
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
  right: 20px;
  bottom: 20px;
  display: flex;
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
