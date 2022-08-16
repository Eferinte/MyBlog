<template>
<div class="shell">
    <div :class="actClass" @click="choose" :style="{backgroundColor:backgroundColor,boxShadow:boxShadow}">
        <img class="bossImg" :src="iconSrc"  :style="{maxWidth:maxWidth , maxHeight:maxHeight}">
    </div>
    <div class="bossNameText" :style="{textDecoration:textDecoration}" >
        {{bossName}}
    </div>
</div>
</template>

<script>
export default {
    name:"StatueCell",
    props:{
        bossName:{
            type:String,
            required: true
        },
        iconSrc:{
            type:String,
            required: true
        },
        banned:{
            type: Number,
            default:0
        }
    },
    methods: {
        choose(){
            if(!this.banned){
                // console.log("点击了",this.bossName);
                this.ifChosed=!this.ifChosed;
                this.$emit("choose",this.bossName)
            }else{
                // console.log("该事件被禁用");
            }
        }
    },
    data() {
        return {
            ifChosed:false,
        }
    },
    computed:{
        maxWidth(){
            return !this.ifChosed?"100%":"80%"
        },
        maxHeight(){
            return !this.ifChosed?"100%":"80%"
        },
        actClass(){
            return !this.banned?"statue":"statue2"
        },
        textDecoration(){
            return !this.ifChosed?"none":"line-through"
        },
        backgroundColor(){
            return !this.ifChosed?"#F2F1DC":"#A67468"
        },
        boxShadow(){
            return !this.ifChosed?"none":"0 0 15px 10px #974746"
        }
    }
}
</script>
    
<style scoped>
    .bossImg{
        max-width:100%;
        max-height: 100%;
        margin: 0 auto;
        transition: 0.25s;
        user-select: none;
    }
    .statue{
        width: 120px;
        height: 120px;
        /* background-color: #7b7777; */
        display: flex;
        justify-content: flex-end;
        flex-direction: column;
        margin: 20px;
        margin-top: 50px;
        transition: 0.25s;
        border-radius: 50%;
    }
    .statue2{
        width: 120px;
        height: 120px;
        display: flex;
        justify-content: flex-end;
        flex-direction: column;
        margin: 20px;
        margin-top: 50px;
    }
    .statue:hover{
        cursor: pointer;
    }
    .bossNameText{
        text-align:center;
        font:italic 1em Georgia, serif;
        padding-bottom: 10px;
        user-select: none;
    }
</style>