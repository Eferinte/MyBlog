<template>
    <div id="HKrecorder">
        <div class="quit" @click="recorderQuit">
            <img class="quitIcon" src="../assets/quit.png"/>
        </div>
        <br/>
        <div id="recordInput" >
        <button id="switcher" @click="switcher">{{switcherText}}</button>
        <transition name="fade">
            <button id="useTime" @click="openTimeSetter" v-show="switchStatus">00:00</button>
        </transition>
        <!-- 时间选择器 -->
        <transition name="fade">
            <div id="timeSetter" v-show="timeSetter">
            <div class="quit" @click="timeSetterQuit">
                <img class="quitIcon" src="../assets/quit.png"/>
            </div>
            <div id="nums">
                <div class="numShell">
                <div class="dragBlock" id="dragBlock1" @mousedown="dragBegin" >
                    <div id="hour" class="numCol">
                    <div class="numShell2">
                        <div class="numCell"><span :style="preHourCSS" class="number">{{timer.preHour}}</span></div>
                    </div>
                    <div class="numShell2">
                        <div class="numCell"><span :style="{opacity:timerCSS.currentHour_opacity}" class="number">{{timer.currentHour}}</span></div>
                    </div>
                    <div class="numShell2">
                        <div class="numCell"><span :style="{opacity:timerCSS.nextHour_opacity}" class="number">{{timer.nextHour}}</span></div>
                    </div>
                    </div>
                </div>
                </div>
                <div class="numShell">
                <div class="dragBlock" draggable="true">
                    <div id="minute" class="numCol">
                    <div class="numShell2">
                        <div class="numCell"><span class="number">{{timer.preMinute}}</span></div>
                    </div>
                    <div class="numShell2">
                        <div class="numCell"><span class="number">{{timer.currentMinute}}</span></div>
                    </div>
                    <div class="numShell2">
                        <div class="numCell"><span class="number">{{timer.nextMinute}}</span></div>
                    </div>
                    </div>
                </div>
                </div>
                <div class="numShell">
                <div class="dragBlock" draggable="true">
                    <div id="second" class="numCol">
                    <div class="numShell2">
                        <div class="numCell"><span class="number">{{timer.preSecond}}</span></div>
                    </div>
                    <div class="numShell2">
                        <div class="numCell"><span class="number">{{timer.currentSecond}}</span></div>
                    </div>
                    <div class="numShell2">
                        <div class="numCell"><span class="number">{{timer.nextSecond}}</span></div>
                    </div>
                    </div>
                </div>
                </div>
            </div>
            </div>
        </transition>
        <transition name="fade">
            <button id="upload" @click="upload" v-show="switchStatus">上传</button>
        </transition>
    </div>
    <div id="recorderBlank">
    <!-- 提交选择 -->
    <transition-group name="bosses">
        <div class="HKcell" v-show="switchStatus" v-for="boss in bosses" :key="boss.order" >
            <div class="HKcellShell" @click="choose">
                <img class="HKcellIcon" :src="boss.iconSrc"/>
            </div>
        </div>
    </transition-group>
    <!-- 统计展示 -->
    <transition-group name="sortedBosses">
        <div class="HKcell" v-show="!switchStatus" v-for="sboss in sortedBosses" :key="sboss.order" >
            <div class="HKcellShell" @click="choose">
                <img class="HKcellIcon" :src="sboss.iconSrc"/>
                <div class="numDiv" v-show="!switchStatus">{{sboss.order}}</div>
            </div>
        </div>
    </transition-group>
    </div>
</div>
</template>

<script>
export default {
    name:"HollowKnightCounter",
    methods: {
        preHourCSS(){
        // 由于不能直接对span进行缩放，故需要一个缩放等级到字体大小的映射过程
        var scale = this.timerCSS.preHour_scaleValue;
        var value = {
            opacity: String(0.3*Math.atan(0.01*scale)+0.5),
            fontSize: String(7*Math.atan(0.01*scale)+25)+'px' 
        }
        return value;
        },
        choose(){
            if(this.switchStatus){
                // console.log("点击了");
            }
        },
        recorderQuit(){
            this.masked = false;
            this.select.recorder = false;
        },
        timeSetterQuit(){
            this.timeSetter = false;
        },       
        openTimeSetter(){
            this.timeSetter = true;
        },
        // 根据鼠标事件获取拖动方向和距离
        dragBegin(e){
            this.draggable = true;
            this.tempForMouseLocate = e.pageY;
        },
        dragging(e){
        // console.log(e.target);
        if(this.draggable){
            if(e.pageY-this.tempForMouseLocate>0){
                this.timerCSS.preHour_scaleValue++;
            }else{
                this.timerCSS.preHour_scaleValue--;
            }
            if(e.pageY - this.tempForMouseLocate>0){
                document.getElementById("dragBlock1").style.top = Math.min(e.pageY - this.tempForMouseLocate, 50)+"px";
            }else{
                document.getElementById("dragBlock1").style.top = Math.max(e.pageY - this.tempForMouseLocate, -50)+"px";
            }
        }

        },
        dragEnd(e){
        // console.log(e.target);
            this.draggable = false;
        },
        switcher(){
            if(this.switchStatus==false){
                this.switchStatus = true;
                this.switcherText = "切换显示"
                // console.log("标准排序")
                // console.log(this.bosses)
                // console.log("受击排序")
                // console.log(this.sortedBosses)
            }else{
                this.switchStatus = false;
                this.switcherText = "添加数据"
            }
        },
    },
    created() {
        
        var preUrl = "/boss_sprites/statue/statue_";
        var testNum = this.bosses.length;
        for(var i = 0;i<this.bosses.length;i++){
        this.bosses[i].iconSrc = preUrl+this.bosses[i].name+".png";
        this.bosses[i].order = i;
        this.bosses[i].hitTimes = testNum;
        testNum--;
        }
        //获取数据库数据，生产sortedBosses
        //根据受击次数排序
        this.sortedBosses = this.bosses.slice(0);
        this.sortedBosses.sort((a,b)=>{return a.hitTimes-b.hitTimes})
        console.log(this.sortedBosses)
        
        this.$router.push({
            name:"Home",
        })
    },
    data() {
        return {
        tempForMouseLocate:0,
        offsetX:0,
        offsetY:0,
        draggable:false,
        timer:{
            preHour:"23",
            currentHour:"00",
            nextHour:"01",
            preMinute:"59",
            currentMinute:"00",
            nextMinute:"01",
            preSecond:"59",
            currentSecond:"00",
            nextSecond:"01"
        },
        timerCSS:{
            preHour_opacity:0.5,
            currentHour_opacity:1,
            nextHour_opacity:0.5,
            // vue会将scale识别为用户自定义的函数
            preHour_scaleValue:1,
            currentHour_scale:1,
            nextHour_scale:0.5
        },
        switchStatus:false,
        timeSetter:false,
        switcherText:"添加数据",
        bosses:require("./bossData.json").boss,
        sortedBosses:[],
        articles:[
            {
                title:"test-title",
                brief:"test-brief",
                aid:"001",
                tags:["tag1","tag2","tag3"]
            },
            {
                title:"test-title",
                brief:"test-brief",
                aid:"002",
                tags:["tag1","tag2","tag3"]
            },
            {
                title:"test-title",
                brief:"test-brief",
                aid:"003",
                tags:["tag1","tag2","tag3"]
            },
            {
                title:"test-title",
                brief:"test-brief",
                aid:"004",
                tags:["tag1","tag2","tag3"]
            },
            {
                title:"test-title",
                brief:"test-brief",
                aid:"005",
                tags:["tag1","tag2","tag3"]
            },
            {
                title:"test-title",
                brief:"test-brief",
                aid:"006",
                tags:["tag1","tag2","tag3"]
            },
            {
                title:"test-title",
                brief:"test-brief",
                aid:"007",
                tags:["tag1","tag2","tag3"]
            },
            {
                title:"test-title",
                brief:"test-brief",
                aid:"008",
                tags:["tag1","tag2","tag3"]
            },
            {
                title:"test-title",
                brief:"test-brief",
                aid:"009",
                tags:["tag1","tag2","tag3"]
            },
            {
                title:"test-title",
                brief:"test-brief",
                aid:"010",
                tags:["tag1","tag2","tag3"]
            },
        ]
        }
    }
}
</script>

<style>
.quit{
  float: right;
  width: 30px;
  height: 30px;
  margin: 10px;
  transition: 0.3s;
  /* background-color: black; */
}
#HKrecorder{
  position: fixed;
  top: 50%;
  left: 50%;
  margin: -22% 0 0 -40%;
  width: 80%;
  height: 90%;
  background-color: white;
  z-index: 5;
  border-radius: 10px;
}
#recordInput{
  display: flex;
  justify-content: flex-start;
  padding-left: 30px;
}
#recorderBlank{
  position: fixed;
  top: 50%;
  left: 50%;
  margin: -17% 0 0 -38%;
  width: 76%;
  height: 70%;
  background-color: lightblue;
  opacity: 1;
  z-index: 5;
  overflow-x:hidden;
  overflow-y:show;
  display: flex;
  flex-flow: row wrap;
  justify-content: center;
}
.HKcell{
  width: 150px;
  height: 170px;
  background-color: #c89679;
  margin: 20px;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  transition: 0.5s;
}
.HKcellShell{
  bottom: 0px;

}
.HKcellIcon{
  bottom: 0px;
  max-width: 150px;
  max-height: 150px;
}
.numDiv{
  width: 150px;
  height: 20px;
  background-color: white;
  bottom: 0px;
}
.numCol{
  width: 60px;
  height: 180px;
  margin: 0;
  background-color: gray;
  z-index: 6;
  border-radius: 3px;
  transition: 0.3s;
  display: flex;
  flex-direction:column;
  justify-content:space-around;
}
.numShell2{
  width: 50px;
  height: 50px;
  background-color: white;
  z-index: 6;
  border-radius: 3px;
  transition: 0.3s;
  margin: auto;
  display: flex;
  flex-direction:column;
  justify-content:space-around;
}
.number{
  font-size: 35px;
}
.dragBlock{
  position: relative;
  top:30px;
  height: 180px;
  display: flex;
  flex-direction:column;
  justify-content:space-around;
  background-color: #74759b;
  transition: 0.5s;
}
.numShell{
  display: flex;
  flex-direction:column;
  justify-content:center;
}
#nums{
  position: fixed;
  top: 35%;
  left: 40%;
  width: 20%;
  height: 40%;
  background-color: whitesmoke;
  z-index: 6;
  border-radius: 10px;
  transition: 0.3s;
  display: flex;
  flex-direction:row;
  justify-content:space-around;
  user-select: none;
}
#timeSetter{
  position: fixed;
  top: 30%;
  left: 40%;
  width: 20%;
  height: 50%;
  background-color: whitesmoke;
  z-index: 6;
  border-radius: 10px;
  transition: 0.3s;
}
#useTime{
  background-color: #4CAF50; /* Green */
  border: none;
  color: white;
  height: 40px;
  width: 300px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 5px;
}
#upload{
  background-color: #4CAF50; /* Green */
  border: none;
  color: white;
  height: 40px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 5px;
}
#switcher{
  background-color: #4CAF50; /* Green */
  border: none;
  color: white;
  height: 40px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 5px;
  transition: 0.5s;
}
</style>