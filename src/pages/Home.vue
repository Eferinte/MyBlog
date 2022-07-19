<template>
  <body>
    <transition name="fade">
      <div id="loginPart" v-show="maskShow" >
        <div id="loginMask"/>
        <Login v-show="loginShow"></Login>
        <Recorder v-show="recorderShow"></Recorder>
        <!-- <HollowKnightCounter  v-show="select.recorder"></HollowKnightCounter> -->
      </div>
    </transition>
    <LeftBar></LeftBar>
    <div id="main">
      <Head2></Head2>
      <br>
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
// import HollowKnightCounter from './components/HollowKnightCounter.vue'
export default {
  components:{ Head2, Login, LeftBar, Recorder },
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
    }
  },
  created() {
    // 读取本地登录状态
    if(localStorage.getItem('uid')){
      this.$store.commit("setUid",localStorage.getItem('uid'));
      this.$store.commit("setUsername",localStorage.getItem('username'));
    }
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
#mainBox{
  /* 这个水平居中方法记得收录 */
  position: absolute;
  margin-top: 7%;
  margin-left: -600px;
  margin-bottom: 3%;
  left: 50%;
  background-color: #cad3c3;
  width: 1200px;
  border-radius: 10px;
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
    width: calc(100% - 100px);
    margin: 0;
    height: 200px;
    left: 100px;
    background-color: rgb(208, 231, 251);
    z-index: -5;
    text-align:center
}
</style>
