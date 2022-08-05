<template>
<div class="shell">
    <transition name="iconTrans">
        <div class="back" @click="doBack">
            <img src="../assets/back.png" style="height:100%">
        </div>
    </transition>
    <transition-group name="flip" tag="div">
        <div class="books" v-if="ifBooks">
        </div>
        <div>
            <div class="toggle" @click="toggle"></div>
            <div class="mainView">
                <div class="pageShell">
                    <img src="../assets/JOJO1.jpg" style="height:100%">
                </div>
            </div>
            <Foot></Foot>
        </div>
    </transition-group>
</div>  
</template>

<script>
import Foot from '../components/Foot.vue';
export default {
    components: { Foot },
    methods: {
        doBack() {
            this.$router.push("/");
        },
        toggle(){
            this.ifBooks = !this.ifBooks;
        }
    },
    data() {
        return {
            ifBooks:true,
        }
    },
}
</script>

<style scoped>
    .flip-move {
        transition: transform 0.8s ease;
    }
    .flip-enter-from{
        opacity: 0;
        transform: translateY(-300px);
    }
    .flip-leave-to {
        transform: translateY(30px);
    }
    .flip-leave-active {
        position: absolute;
    }
    .back{
        position: fixed;
        height: 70px;
        width: 70px;
        top: 50px;
        left: 30px;
        transition: 0.4s;
    }
    .back:hover{
        cursor: pointer;
        transform: rotate(360deg) scale(1.1);
    }
    .books{
        height: 500px;
        transition: 0.8s ease;
        /* 28px */
        background-color: rgb(200, 183, 151);
    }
    .toggle{
        height: 30px;
        background-color: #e7e69a;
    }
    .toggle:hover{
        cursor: pointer;
    }
    .mainView{
        margin: auto;
        height: 700px;
        width: 1080px;
        background-color: rgb(174, 202, 230);
        display: flex;
    }
    .shell{
        
        /* background-color: rgb(174, 202, 230); */
    }
    .pageShell{
        height: 650px;
        margin: 25px auto;
    }
</style>