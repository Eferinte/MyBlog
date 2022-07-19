<template>
  <div id="root">
    <router-view></router-view>
    <Hint ref="rootHint"></Hint>
  </div>
</template>
<script>
import Hint from './components/Hint.vue';
import store from './main';
// import HollowKnightCounter from './components/HollowKnightCounter.vue'
export default {
    name: "App",
    created() {
        // 读取本地登录状态
        if (localStorage.getItem("uid")) {
            this.$store.commit("setUid", localStorage.getItem("uid"));
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
      }
    },
    components: { Hint }
}
</script>

<style>
#root{
  transition: 0.3s;
}
</style>
