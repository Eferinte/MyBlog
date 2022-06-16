<template>
  <div>
    <router-view></router-view>
  </div>
</template>
<script>
// import HollowKnightCounter from './components/HollowKnightCounter.vue'
export default {
  name: 'App',
  created() {
    this.$router.push('/home')
  },
}
</script>

<style>
</style>
