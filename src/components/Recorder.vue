<template>
    <div class="dialogShell" >
        <div class="quit" @click="recorderQuit">
            <img class="quitIcon" src="../assets/quit.png"/>
        </div>
        <div class="main" v-show="show" ref="mainBlank">
            <div class="statueShell"  v-for="boss in bosses" :key="boss">
                <StatueCell :bossName="boss.name" :iconSrc="boss.iconSrc" :banned="1" ></StatueCell>
                <div class="dataShell" @mouseenter="toggleIn" @mouseleave="toggleOut" >
                    <div class="hitTimesText left">
                        {{boss.missRate}}
                    </div>
                    <div class="hitTimesText right">
                        {{boss.hitTimes}}/{{totalNums}}
                    </div>
                </div>
            </div>
        </div>
        <div class="changeShell">
            <div class="sortBtn" @click="sort">
                <span class="centerText">
                    {{sortWayText}}
                </span>
            </div>
            <div class="change" @click="doChange" v-if="ifEf"></div>

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
import Qs from 'qs'
import StatueCell from './StatueCell.vue';
import TimeSelector from './TimeSelector.vue';
import store from '../main';
export default {
    methods: {
        //显示数值
        toggleIn(e){
            console.log(e)
            e.target.children[0].style.transform='translateX(-30px)';
            e.target.children[0].style.opacity='0';
            e.target.children[1].style.transform='translateX(-30px)';
            e.target.children[1].style.opacity='1';
        },
        //显示百分比
        toggleOut(e){
            e.target.children[1].style.transform='translateX(30px)';
            e.target.children[1].style.opacity='0';
            e.target.children[0].style.transform='translateX(30px)';
            e.target.children[0].style.opacity='1';
        },
        sort(){
            if(this.sortWayText=='按流程排序'){
                this.sortWayText='按失误率排序';
                let temp = null;
                temp = this.bosses;
                this.bosses = this.sortedBosses;
                this.sortedBosses = temp;
            }else{
                this.sortWayText='按流程排序';
                let temp = null;
                temp = this.bosses;
                this.bosses = this.sortedBosses;
                this.sortedBosses = temp;
            }
            this.$refs.mainBlank.scrollTop=0;
        },
        recorderQuit() {
            // 关闭记录窗口
            this.ds=true;
            this.show=true
            this.$store.commit("closeMask");
            this.$store.commit("closeRecorder");
        },
        chosen(name) {
            // console.log("chosen",name);
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
                // console.log("this.destory=",this.ds);
            }else{//清空对象数组
                this.recorder={}
                this.ds=true;
            }
            this.show=!this.show
        },
        upload(){
            let axiosInstance = axios.create({
                baseURL: store.state.preUrl,
                timeout: 1000,
                headers:{"token":store.state.token}
            });
            let date = new Date();
            // console.log(date);
            let strDate = date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate()+" "+date.getHours()+":"+date.getMinutes()+":"+date.getSeconds()
            let params= {
                recorder:JSON.stringify(this.recorder),
                date:strDate,
                useTime:this.$refs.timer.getTime()
            }
            
            axiosInstance.post("/upRecorder",Qs.stringify(params)).then((response)=>{
                if(response.data=="success"){
                    store.commit("setHintText","提交成功");
                    this.initMissTimes();
                }else{
                    store.commit("setHintText","提交失败");
                }
            })           
        },
        initMissTimes(){        
            axios.get(store.state.preUrl+"/missTimes").then((response) => {
                let missTimes = response.data[0];
                this.totalNums = missTimes['totalNums']
                this.bosses.forEach(function (item) {
                    item.hitTimes = Number(missTimes[item.name]);
                    item.missRate = (100*Number(missTimes[item.name]/missTimes['totalNums'])).toFixed(1)+'%';
                });
                this.show = true;
                //深拷贝
                this.sortedBosses = [...this.bosses];
                // this.bosses.forEach(item=>{
                //     this.sortedBosses.push(item);
                // })

                this.sortedBosses.sort((a, b)=>{
                    let ans = Number(a.hitTimes) - Number(b.hitTimes)
                    return -ans;
                })
                console.log('[init]sortedBosses=',this.sortedBosses);
                console.log('[init]bosses=',this.bosses);
            });
        }
    },
    data() {
        return {
            bosses: require("../bossData.json").boss,
            show: true,
            recorder:{},
            ds:false,
            sortWayText:'按失误率排序',
            sortedBosses:[],
            totalNums:undefined
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
            // console.log(store.state.username);
            return store.state.username=="Eferinte";
        },
        showBosses(){
            if(this.sortWayText=='按流程排序'){
                return this.bosses;
            }else{
                return this.sortedBosses;
            }
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
    .changeShell{
        position: absolute;
        top: calc(50% - 250px);
        left: 30px;
        transition: 0.25s;
        display: flex;
        flex-direction: column;
    }
    .sortBtn{
        width: 30px;
        height: fit-content;
        margin-bottom: 20px;
        background-color: #c1c1c1;
        transition: 0.25s;
        display: flex;
    }
    .sortBtn:hover{
        cursor: pointer;
        background-color: #a8a8a8;
    }
    .centerText{
        margin: auto;
        width: fit-content;
        text-align: center;
    }
    .change{
        width: 30px;
        height: 320px;
        background-color: #c1c1c1;
        transition: 0.25s;
        text-align: center;
    }
    .change:hover{
        cursor: pointer;
        background-color: #a8a8a8;
    }
    .dataShell{
        margin: 0 auto;
        display: flex;
        flex-direction: row;
        width: 100%;
        overflow: hidden;
        justify-content: center;
    }
    .hitTimesText{
        margin: 0; 
        width:60px;
        text-align:center;
        font:italic 1em Georgia, serif;
        padding-bottom: 20px;
        /* background-color: rgb(174, 143, 205); */
        transition:0.314s;
    }
    .hitTimesText.left{
        transform:translateX(30px);
        opacity: 1;
    }
    .hitTimesText.right{
        transform:translateX(30px);
        opacity: 0;
    }
    .statueShell{
        /* width:160px;
        display: flex;
        flex-direction: column;
        user-select: none; */
        position: relative;
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
        z-index: 11;
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