<template>
  <body class="mainBody">
    <transition name="fade">
      <div id="loginPart" v-show="maskShow">
        <div id="loginMask" />
        <Login v-show="loginShow"></Login>
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
  </body>
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
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
.mainBody{
  display: flex;
  flex-direction: row;
}
#mainBox{
  /* 这个水平居中方法记得收录 */
  position: absolute;
  margin-top: 7%;
  margin-left: -600px;
  margin-bottom: 3%;
  left: 50%;
  background-color: #B0A69A;
  width: 1200px;
  border-radius:  10px 10px 0px 0px;
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
  width: 1200px;
  margin-left: calc(50% - 650px);
  height: 200px;
  left: 100px;
  background-color: rgb(208, 231, 251);
  z-index: -5;
  text-align:center;
  border-radius: 0px 0px 10px 10px;
}
</style>
