<template>
  <div id="root">
    <router-view></router-view>
  </div>
</template>
<script>
// import HollowKnightCounter from './components/HollowKnightCounter.vue'
export default {
  name: 'App',
  created() {
    // 读取本地登录状态
    if(localStorage.getItem('uid')){
      this.$store.commit("setUid",localStorage.getItem('uid'));
    }
    this.$router.push('/home')
  },
}
</script>

<style>
</style>
