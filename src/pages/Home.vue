<template>
<!-- 将拖拽滑块的过程和结束判断至于全局，开始判定放在对应滑块组件上 -->
  <body>
    <transition name="fade">
      <div id="loginPart" v-show="masked" >
        <div id="loginMask"/>
        <Login v-show="select.login" @listenClose="closeLogin"></Login>
        <!-- <HollowKnightCounter  v-show="select.recorder"></HollowKnightCounter> -->
      </div>
    </transition>
    <LeftBar @listenOpen="openLogin" @listenClose="closeLogin" ></LeftBar>
    <div id="main">
      <Head></Head>
      <br>
      <div id="mainBox">
        <router-view></router-view>
      </div>
    </div>
  </body>
</template>
<script>
import Head from '../components/Head.vue'
import Login from '../components/Login.vue'
import LeftBar from '../components/LeftBar.vue'
// import HollowKnightCounter from './components/HollowKnightCounter.vue'
export default {
  components:{Head,Login,LeftBar},
  name: 'Home',
  methods: {
    openLogin(){
      // 打开登陆界面
      this.masked = true;
      this.select.login = true;
    },
    closeLogin(){
      this.masked = false;
      this.select.login = false;
    }
  },
  computed:{
    uid(){
      return this.$store.state.uid;
    },
  },
  data(){
    return{
      masked:false,
      select:{
          login:false,
          recorder:false
      },
    }
  },
  created() {
    // 读取本地登录状态
    if(localStorage.getItem('uid')){
      this.$store.commit("setUid",localStorage.getItem('uid'));
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
    position: absolute;
    top: 0px;
    width: calc(100% - 100px);
    margin: 0;
    height: 30%;
    left: 100px;
    background-color: rgb(208, 231, 251);
    z-index: -5;
    text-align:center
}
</style>
