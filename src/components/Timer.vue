<template>
    <div class="dialogShell" ref="shell">
        <div class="quit" @click="timerQuit">
            <img class="quitIcon" src="../assets/quit.png"/>
        </div>
        <div>
            <div class="main" v-show="!ifStarted">
                <div style="margin-top:50px">
                    <TimeSelector ref="timeSetter"></TimeSelector>
                </div>
                <button class="button1" @click="start">开始计时</button>
            </div>
            <div class="main" v-show="ifStarted">
                <div class="leftTime" :style="{color:actColor}">
                    {{hour}}:{{minute}}:{{second}}
                </div>
                <button class="button1" v-show="!ifPaused" @click="pause">暂停计时</button>
                <button class="button1" v-show="ifPaused" @click="dePause">恢复计时</button>
                <button class="button1" @click="reset">清除计时</button>
            </div>
        </div>

    </div>
</template>

<script>
import axios from 'axios';
import store from '../main';
import TimeSelector from './TimeSelector.vue';
export default {
    methods: {
        refresh(){
            //暂停计时时不进行刷新
            if((!this.ifPaused)&&this.ifStarted){
                if(document.visibilityState == "visible"){    
                    axios.get(store.state.preUrl+"/getTimer",{params:{
                        uid:store.state.uid
                    }}).then((response)=>{
                        console.log("TargetTime=",response.data[0].target_time);
                        let now = new Date()
                        let targetTime = new Date(response.data[0].target_time)
                        this.leftTime = Math.floor((targetTime.getTime() - now.getTime())/1000)
                    })
                }
            }
        },
        timerQuit() {
            this.$store.commit("closeMask");
            this.$store.commit("closeTimer");
            if(this.ifStarted){
                // this.$refs.shell.style.left="20px"
                // this.$refs.shell.style.borderRadius="50%"
                // this.$refs.shell.style.transform="scale(0.5)"
            }else{
                console.log("关闭计时器显示");
            }
        },
        start(){
            let date = new Date()
            this.ifStarted=true;
            let time = this.$refs.timeSetter.getTime()
            //转化为秒
            let hour=Number(time.slice(3,5))
            let minute=Number(time.slice(6,8))
            // console.log("time=",time,"hour=",hour,"minute=",minute);
            this.leftTime = hour*3600+minute*60
            this.setTime = hour*3600+minute*60
            store.commit("setSetTime",this.setTime)
            this.timer.siv.push(            
                setInterval(()=>{
                    if(this.leftTime<=0){
                        this.reset()
                    }else{
                        this.leftTime--
                    }
                },1000)
            )
            time = date.getTime()+(this.setTime*1000)
            date = new Date(time)
            let targetTime = date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate()+" "+date.getHours()+":"+date.getMinutes()+":"+date.getSeconds()
            console.log(targetTime);
            axios.get(store.state.preUrl+"/setTimer",{params:{
                targetTime:targetTime,
                uid:store.state.uid
            }}).then((response)=>{
                console.log("设置成功");
            })

            document.addEventListener("visibilitychange",this.refresh)
        },
        reset(){
            store.commit("clearSetTime")
            this.ifStarted=false;
            this.ifPaused=false;
            this.timer.siv.forEach((item) => {
                clearInterval(item)
            });
            this.timer.siv=[]
            document.removeEventListener("visibilitychange",this.refresh)
        },
        pause(){
            this.timer.siv.forEach((item) => {
                clearInterval(item)
            });
            this.timer.siv=[]
            this.ifPaused=true
        },
        dePause(){
            //更新目标时间
            let now = new Date().getTime()
            now = now + this.leftTime*1000
            let date = new Date(now)
            let targetTime = date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate()+" "+date.getHours()+":"+date.getMinutes()+":"+date.getSeconds()
            axios.get(store.state.preUrl+"/setTimer",{params:{
                targetTime:targetTime,
                uid:store.state.uid
            }}).then((response)=>{
                console.log("设置成功");
            })

            this.ifPaused=false
            this.timer.siv.push(            
                setInterval(()=>{
                    if(this.leftTime<=0){
                        clearInterval() 
                    }else{
                        this.leftTime--
                    }
                },1000)
            )
        },
        task(){
            
        }
    },
    data() {
        return {
            leftTime: 0,
            setTime:0,
            ifStarted:false,
            ifPaused:false,
            timer : {
                sto: [], 
                siv: []
            }
        };
    },
    created() {
        console.log("timer创建")
        if(store.state.setTime){
            this.setTime=store.state.setTime
            this.ifStarted=true
            axios.get(store.state.preUrl+"/getTimer",{params:{
                uid:store.state.uid
            }}).then((response)=>{
                let now = new Date()
                let targetTime = new Date(response.data[0].target_time)
                this.leftTime = Math.floor((targetTime.getTime() - now.getTime())/1000)
                console.log("leftTime=",this.leftTime); 
                this.timer.siv.push(            
                setInterval(()=>{
                    if(this.leftTime<=0){
                        clearInterval() 
                    }else{
                        this.leftTime--
                    }
                },1000)
            )
            })      
        }
    },
    unmounted(){
        console.log("timer被销毁了")
    },
    computed:{
        hour(){
            let hour  = Math.floor(this.leftTime/3600)
            return (hour>9)?hour:"0"+hour
        },
        minute(){
            let minute  = Math.floor(this.leftTime/60)
            return (minute>9)?minute:"0"+minute
        },
        second(){
            let second  = this.leftTime%60
            return (second>9)?second:"0"+second
        },
        actColor(){
            let targetColor = {
                R:255,
                G:0,
                B:0,
            }
            //接受0-1的值，返回0-1的值
            let smooth = (x)=>{
                let ans = (16-(16*x*x))^(1/2)
                return ans/16
            }
            let percent = this.leftTime/this.setTime
            return "rgb("+Math.floor(255-targetColor.R*smooth((1-percent)))+",0,0)"
        }
    },
    components: { TimeSelector }
}
</script>
<style scoped>    
    .leftTime{
        margin: auto;
        transition: 1s;
    }
    .button1{
        margin: auto;
        max-width: 150px;
        width: 31%;
        height: 30px;
        background-color: #ffffff;
        box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
        border: 4px;
        cursor: pointer;
        transition: 0.3s;
    }
    .dialogShell{
        position: fixed;
        top: calc(50% - 300px);
        left: calc(50% - 250px);
        margin:0;
        width: 500px;
        height: 500px;
        background-color: #ffffff;
        z-index: 5;
        transition: 0.5s;
        overflow:hidden
    }
    .quit{
        float: right;
        width: 30px;
        height: 30px;
        margin: 10px;
        transition: 0.3s;
        /* background-color: black; */
    }
    .quitIcon{
        width: 100%;
        height: auto;
    }
    .quit:hover{
        transform: scale(1.1);
        cursor:pointer;
        transform:rotate(150deg);
    }
    .main{
        position: relative;
        top: 50px;
        left: calc(50% - 200px);
        background-color: rgb(199, 193, 193);
        width: 400px;
        height: 400px;
        display: flex;
        flex-wrap: wrap;
        flex-direction: column;
        justify-content: center;
        overflow-x:hidden;
        overflow-y:show;
        transition: 0.5s;
        font-size: 66px;
    }
</style>