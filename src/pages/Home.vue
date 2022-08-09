<template>
<div class="shell">
  <div class="background"></div>
  <div class="mainBody">
    <transition name="fade">
      <div id="loginPart" v-show="maskShow">
        <div id="loginMask" />
        <Login v-if="loginShow"></Login>
        <Recorder v-show="recorderShow"></Recorder>
        <Timer v-show="timerShow"></Timer>
      </div>
    </transition>
    <LeftBar></LeftBar>
    <div id="main">
      <Head2></Head2>
      <div id="mainBox">
        <router-view></router-view>
      </div>
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
export default {
  components:{ Head2, Login, LeftBar, Recorder, Timer },
  name: 'Home',
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
.mainBody{
  display: flex;
  flex-direction: row;
}
#mainBox{
  /* 这个水平居中方法记得收录 */
  position: absolute;
  margin-top: 7%;
  margin-left: -500px;
  margin-bottom: 3%;
  left: 50%;
  width: 1000px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

#loginPart{
  z-index: 4;
}
#loginMask{
  position: fixed;
  left: 0;
  top: 0;
  opacity: 40%;
  width: 100%;
  height: 100%;
  background-color: black;
  transition: z-index 0.5s;;
}

#main{
  background-image: url("../../public/assert/background.jpg");
  background-size: 100% 180%;
  position: absolute;
  top: 0px;
  width: 1000px;
  margin-left: calc(50% - 500px);
  height: 200px;
  background-color: rgb(208, 231, 251);
  z-index: -5;
  text-align:center;
  border-radius: 0px 0px 10px 10px;
}
</style>
