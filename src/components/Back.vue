<template>
    <transition name="iconTrans">
        <div class="back" @click="doBack">
            <img src="../assets/back.png" style="height:100%">
        </div>
    </transition>  
</template>

<script>
import router from '../router'
export default {
    name:"Back",
    methods: {
        doBack(){
            router.push("/")
        }
    },
}
</script>

<style scoped>
    .back{
        position: fixed;
        height: 70px;
        width: 70px;
        top: 20px;
        left: 30px;
        transition: 0.4s;
        z-index: 999;
    }
    .back:hover{
        cursor: pointer;
        transform: rotate(360deg) scale(1.1);
    }
</style>