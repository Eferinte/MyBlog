<template>
  <div id="root">    
    <transition name="fade">
      <div id="loginMask" v-show="maskShow">
        <transition name="fade">
          <Login v-if="loginShow"></Login>
        </transition>
      </div>
    </transition>
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
    <Hint ref="rootHint"></Hint>
    <Foot></Foot>
  </div>
</template>
<script>

import Hint from './components/Hint.vue';
import store from './main';
import { getCookie } from './utils/cookies';
import Foot from './components/Foot.vue';
import Login from './components/Login.vue';
// import HollowKnightCounter from './components/HollowKnightCounter.vue'
export default {
    name: "App",
    created() {
      // 读取本地登录状态
      //使用cookies
      // console.log("cookies=",getCookie("uid"),getCookie("username"));
      // if(getCookie("uid")){
      //   this.$store.commit("setUid",getCookie('uid'));
      //   this.$store.commit("setUsername",getCookie('username'));
      //   this.$store.commit("setToken",getCookie('token'));
      // }else{
        // this.$store.commit("setUid",window.localStorage.getItem("uid"));
        // this.$store.commit("setUsername",window.localStorage.getItem("username"));
        // this.$store.commit("setToken",window.localStorage.getItem("token"));
      // }
      
      // this.$router.push("/home");
    },
    //监听Hint
    watch:{
      hintText(newText,oldText){
        if(newText!=""){
          this.$refs.rootHint.doHint(newText)
          store.commit("setHintText","")
        }
        // console.log("newText=",newText,"oldText=",oldText,);
      }
    },
    computed:{
      hintText(){
        return store.state.hintText;
      },
      maskShow(){
        return store.state.maskShow;
      },
      loginShow(){
        return store.state.loginShow;
      }
    },
    components: { Hint, Foot, Login }
}
</script>

<style>
/* 过渡 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
#root{
  position: static;
  transition: 0.25s;
  margin: 0;
  height: 100%;
  width: 100%;
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
</style>
