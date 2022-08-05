<template>
    <div class="dialogShell" >
        <div class="quit" @click="recorderQuit">
            <img class="quitIcon" src="../assets/quit.png"/>
        </div>
        <div class="main" v-show="show">
            <div class="statueShell"  v-for="boss in bosses" :key="boss">
                <StatueCell :bossName="boss.name" :iconSrc="boss.iconSrc" :banned="1" ></StatueCell>
                <div class="hitTimesText" >
                    {{boss.hitTimes}}
                </div>
            </div>
        </div>
        <div class="change" @click="doChange" v-if="ifEf">

        </div>
        <div class="main" v-show="!show" v-if="!ds">
            <div class="statueShell"  v-for="boss in bosses" :key="boss" >
                <StatueCell :bossName="boss.name" :iconSrc="boss.iconSrc" @choose="chosen"></StatueCell>
            </div>
            <div class="operations" >
                <div class="opCell">
                    <TimeSelector draggable="true" ref="timer"></TimeSelector>
                </div>
                <div class="opCell">
                    <button class="button1" @click="upload">提交记录</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import StatueCell from './StatueCell.vue';
import TimeSelector from './TimeSelector.vue';
import store from '../main';
export default {
    methods: {
        recorderQuit() {
            // 关闭记录窗口
            this.ds=true;
            this.show=true
            this.$store.commit("closeMask");
            this.$store.commit("closeRecorder");
        },
        chosen(name) {
            console.log("chosen",name);
            this.recorder[name]=1
        },
        doChange(){
            if(this.show){//创建一个boss对象数组
                this.bosses.forEach((item)=>{
                    let obj={};
                    obj[item.name]=0;
                    this.recorder = Object.assign(this.recorder,obj)
                })
                this.ds=false;
                console.log("this.destory=",this.ds);
            }else{//清空对象数组
                this.recorder={}
                this.ds=true;
            }
            this.show=!this.show
        },
        upload(){
            let date = new Date();
            console.log(date);
            let strDate = date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate()+" "+date.getHours()+":"+date.getMinutes()+":"+date.getSeconds()
            axios.get(store.state.preUrl+"/upRecorder",{params:{
                recorder:this.recorder,
                date:strDate,
                useTime:this.$refs.timer.getTime()
            }}).then((response)=>{
                store.commit("setHintText","发布成功")
                this.initMissTimes()//使用promise实现
                this.show=!this.show
            })
        },
        initMissTimes(){        
            axios.get(store.state.preUrl+"/missTimes").then((response) => {
                let missTimes = response.data[0];
                this.bosses.forEach(function (item) {
                    item.hitTimes = missTimes[item.name];
                });
            });
        }
    },
    data() {
        return {
            bosses: require("../bossData.json").boss,
            show: true,
            recorder:{},
            ds:false,
        };
    },
    mounted(){
        let preUrl = "/boss_sprites/statue/statue_";
        this.bosses.forEach(function (item, index) {
            item.index = index;
            item.iconSrc = preUrl + item.name + ".png";
        });
        this.initMissTimes();
    },
    computed:{
        ifEf(){
            console.log(store.state.username);
            return store.state.username=="eferinte";
        }
    },
    components: { StatueCell, TimeSelector }
}
</script>

<style scoped>
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
    .opCell{
        width: 400px;
        height: 100px;
        margin:auto;
        display: flex;
        justify-content: flex-end;
    }
    .operations{
        margin-top: 50px;
        width: 100%;
        height: 120px;
        /* background-color: #7b7777; */
        display: flex;
        flex-direction: row;
        background-color: #F2F1DC;
        box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
    }
    .change{
        width: 30px;
        height: 400px;
        background-color: #c1c1c1;
        position: absolute;
        top: calc(50% - 200px);
        left: 30px;
        transition: 0.25s;
    }
    .change:hover{
        cursor: pointer;
        background-color: #a8a8a8;
    }
    .hitTimesText{
        margin: 0 auto; 
        width:60px;
        text-align:center;
        font:italic 1em Georgia, serif;
        border: solid black;
        border-width: 2px 0 0 0;
        padding-bottom: 20px;
    }
    .bossNameText{
        text-align:center;
        font:italic 1em Georgia, serif;
        padding-bottom: 10px;
    }
    .statueShell{
        /* width:160px;
        display: flex;
        flex-direction: column;
        user-select: none; */
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
    .dialogShell{
        position: fixed;
        top: calc(50% - 300px);
        left: calc(50% - 550px);
        margin:0;
        width: 1100px;
        height: 600px;
        background-color: #F2F1DC;
        z-index: 5;
        transition: 0.5s;
    }
    .main{
        position: relative;
        top: 25px;
        left: calc(50% - 450px);
        background-color: #F2F1DC;
        width: 900px;
        height: 550px;
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        overflow-x:hidden;
        overflow-y:show;
        transition: 0.5s;
    }
    .statue{
        width: 120px;
        height: 120px;
        margin: 20px;
        margin-top: 50px;
        background-color: #7b7777;
        display: flex;
        justify-content: flex-end;
        flex-direction: column;
    }
</style>