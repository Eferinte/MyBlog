<template>
    <div id="hint" ref="hint">
        <div class="textCell">
            {{hintText}}
        </div>
    </div>
</template>

<script>
export default {
    name:'Hint',
    methods: {
        timeFunc1(){
            // console.log("消失")
            this.$refs.hint.style.transition="1s";
            this.$refs.hint.style.opacity="0";
            this.$refs.hint.style.top="200px";
        },
        timeFunc2(){
            // console.log("消失")
            this.$refs.hint.style.visibility="hidden";
        },
        doHint(text){         
            //重置定时器
            clearTimeout(this.preTimeoutID1);
            clearTimeout(this.preTimeoutID2);
            this.hintText=text   
            // console.log("提示")
            this.$refs.hint.style.top="calc(50% - 25px)";
            this.$refs.hint.style.opacity="1";
            this.$refs.hint.style.visibility="visible";
            this.$refs.hint.style.transition="0s";
            this.preTimeoutID1 = setTimeout(this.timeFunc1,800);
            this.preTimeoutID2 = setTimeout(this.timeFunc2,1200);
        },
    },
    data() {
        return {
            hintText:"",
            preTimeoutID1:"",
            preTimeoutID2:"",
        }
    },
}
</script>

<style scoped>
    #hint{
        position: fixed;
        height: 50px;
        width: 200px;
        top: calc(50% - 25px);
        left: calc(50% - 100px);
        border: 4px;
        background-color: #fff;
        box-shadow: 0 5px 30px 10px rgb(0 0 0 / 10%);
        z-index: 2000;
        visibility:hidden;
    }
    .textCell{
        width: fit-content;
        height: fit-content;
        margin: 10px auto;
    }
</style>