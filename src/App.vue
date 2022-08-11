<template>
  <div id="root">    
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
    <Hint ref="rootHint"></Hint>
  </div>
</template>
<script>
import Hint from './components/Hint.vue';
import store from './main';
import { getCookie } from './utils/cookies';
// import HollowKnightCounter from './components/HollowKnightCounter.vue'
export default {
    name: "App",
    created() {
      // 读取本地登录状态
      //使用cookies
      console.log("cookies=",getCookie("uid"),getCookie("username"));
      if(getCookie("uid")){
        this.$store.commit("setUid",getCookie('uid'));
        this.$store.commit("setUsername",getCookie('username'));
        this.$store.commit("setToken",getCookie('token'));
      }
      this.$router.push("/home");
    },
    watch:{
      hintText(newText,oldText){
        if(newText!=""){
          this.$refs.rootHint.doHint(newText)
          store.commit("setHintText","")
        }
        console.log("newText=",newText,"oldText=",oldText,);
      }
    },
    computed:{
      hintText(){
        return store.state.hintText;
      },
    },
    components: { Hint }
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
  transition: 0.25s;
  margin: 0;
}
</style>
