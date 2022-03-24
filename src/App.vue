
<template>
  <body>
    <transition name="fade">
      <div id="loginPart" v-show="masked">
        <div id="loginMask"/>
        <div id="loginDialog" v-show="select.login">
          <div class="quit" @click="loginQuit">
            <img class="quitIcon" src="./assets/quit.png"/>
          </div>
          <div id="inputArea">
            <br>
            <div class="inputLine">
              <input class="loginInput" v-model="username" placeholder=" 请输入用户名"/>
            </div>
            <br>
            <div class="inputLine">
              <input class="loginInput" v-model="password" placeholder=" 请输入密码"/>
            </div>
            <button id="loginBtn" @click="login">登录</button>
          </div>
        </div>
        <div id="HKrecorder" v-show="select.recorder">
          <div class="quit" @click="recorderQuit">
            <img class="quitIcon" src="./assets/quit.png"/>
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
                  <img class="quitIcon" src="./assets/quit.png"/>
                </div>
                <div id="nums">
                  <div id="hour" class="numCol">
                    <div class="numCell"><span class="number">{{timer.preHour}}</span></div>
                    <div class="numCell"><span class="number">{{timer.currentHour}}</span></div>
                    <div class="numCell"><span class="number">{{timer.nextHour}}</span></div>
                  </div>
                  <div id="minute" class="numCol">
                    <div class="numCell"><span class="number">{{timer.preMinute}}</span></div>
                    <div class="numCell"><span class="number">{{timer.currentMinute}}</span></div>
                    <div class="numCell"><span class="number">{{timer.nextMinute}}</span></div>
                  </div>
                  <div id="second" class="numCol">
                    <div class="numCell"><span class="number">{{timer.preSecond}}</span></div>
                    <div class="numCell"><span class="number">{{timer.currentSecond}}</span></div>
                    <div class="numCell"><span class="number">{{timer.nextSecond}}</span></div>
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
      </div>
    </transition>
    <div id="leftBar">
        <div id="loginCell" class="cell" @click="openLogin">
            <img id="user" src="./assets/user.png"/>
            <!-- <img id="user_active" src="../img/user_active.png"/> -->
        </div>
        <div id="recorderCell" class="cell" @click="openRecorder">
          <img id="hollowKnightRecorder" src="./assets/Pantheon_of_Hallownest.png"/>
        </div>
    </div>
    <div id="root">
        <div id="shell">
            <div id="title">
              <div id="title1">Eferinte</div>
              <img id="bird" src="./assets/birdNichicho.png"/>
              <div id="title2">の</div>
              <div id="title3">博客</div>
              <div id="blank"></div>
            </div>
        </div>
        <br>
        <div id="articlesPart">
        </div>
    </div>
  </body>
</template>
<script>
import axios from 'axios' 



export default {
  name: 'App',
  methods: {
    openLogin(){
      this.masked = true;
      this.select.login = true;
    },
    // 应该写个event获取到触发事件的具体部件，然后对其进行操作，实现对象化
    loginQuit(){
      this.masked = false;
      this.select.login = false;
    },
    recorderQuit(){
      this.masked = false;
      this.select.recorder = false;
    },
    timeSetterQuit(){
      this.timeSetter = false;
    },        
    openRecorder(){
      this.masked = true;
      this.select.recorder = true;
    },
    openTimeSetter(){
      this.timeSetter = true;
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
    choose(){
      if(this.switchStatus){
        console.log("点击了");
      }
    },
    // 提交表单登录
    login(){
      console.log("发送请求");

      axios.get('http://localhost:8081/test')
      .then((response)=>{
          console.log(response.data[0])
      })
    }
  },
  created(){
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
  },
  data() {
    return {
      username:"",
      paasword:"",
      masked:false,
      select:{
        login:false,
        recorder:false
      },
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
      switchStatus:false,
      timeSetter:false,
      switcherText:"添加数据",
      bosses:require("./bossData.json").boss,
      sortedBosses:[]
    }
  }
}
</script>

<style>
.bosses-enter-from,
.bosses-leave-to {
  opacity: 0;
}
.bosses-leave-active {
  position: absolute;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
.numCol{
  width: 60px;
  height: 180px;
  margin: auto;
  background-color: gray;
  z-index: 6;
  border-radius: 3px;
  transition: 0.3s;
  display: flex;
  flex-direction:column;
  justify-content:space-around;
}
.numCell{
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
#loginPart{
  z-index: 4;
}
#loginMask{
  position: fixed;
  left: 0;
  top: 0;
  opacity: 40%;
  width: 100%;
  height: 100%;
  background-color: black;
  transition: z-index 0.5s;;
}
#loginDialog{
  position: fixed;
  top: 50%;
  left: 50%;
  margin: -15% 0 0 -20%;
  width: 40%;
  height: 60%;
  background-color: white;
  z-index: 5;
  transition: z-index 0.5s;
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
.quit{
  float: right;
  width: 30px;
  height: 30px;
  margin: 10px;
  transition: 0.3s;
  /* background-color: black; */
}
#inputArea{
  width: 400px;
  height: 200px;
  margin: 100px auto;
  background: #d0e7fb;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.inputLine{
  display: flex;
  justify-content: center;
  padding:10px;
}
.loginInput{
  width: 300px;
  height: 30px;
  border-top: none;
  border-right: none;
  border-left: none;
  border-bottom: 1px solid;
  background: #d0e7fb;
  outline: none;
  transition: 0.7s;
}
.loginInput:focus{
  background: linear-gradient(to left, transparent, #74759b);
  color: white;
  border-bottom-color: black;
}
.loginInput:focus::placeholder{
  color: white;
  transition: 0.3s;
}
#loginBtn{
  margin: auto;
  width: 350px;
  height: 30px;
}
#shell{
    width:100%;
    height:50%;
    left:0;
    /* background-color:rgb(208, 231, 251); */
    user-select:none;
    text-align:center;
    z-index:-4;
    border-radius: 10px;
}
#bird{
    position:absolute;
    top:-40px;
    left:150px;
    transform:scale(90%);
    z-index:-3;
}
#title{
    margin: auto;
    margin-top: 40px;
    height:150px;
    width:272px;
    /* background-color:#c1c1c1; */
    position:relative;
    z-index:-2;
}
#blank{
    top:20px;
    left:-40px;
    height:100px;
    width:330px;
    border-style:soild;
    border-width:3px;
    background-color:#c1c1c1;
    border-color:#c1c1c1;
    position:absolute;
    display:inline-block;
    /* opacity:0.5; */
    z-index:-4;
    transform:perspective(100px) rotateX(20deg);
    box-shadow:10px 10px 50px #888888;
}
#title1{
    top:0;
    left:0;
    font-size:50px;
    display:inline-block;
    position:absolute;
    z-index:-2;
}
#title2{
    font-family:MS Mincho;
    top:-10px;
    left:170px;
    font-size:100px;
    display:inline-block;
    position:absolute;
    z-index:-2;
}
#title3{
    font-weight:regular;
    top:60px;
    left:68px;
    font-size:50px;
    display:inline-block;
    position:absolute;
    z-index:-2;
}
#articlesPart{
    margin: auto;
    margin-top: 7%;
    background-color: #cad3c3;
    height: 600px;
    width: 1000px;
    border-radius: 10px;
}
#root{
    position: absolute;
    top: 0px;
    width: 93%;
    height: 30%;
    left: 7%;
    background-color: rgb(208, 231, 251);
    border-radius: 0px 0px 20px 0px;
    z-index: -5;
}
#leftBar{
    position: fixed;
    width: 7%;
    height: 100%;
    left: 0;
    top: 0;
    background-color: #74759b;
    z-index: -3;
}
.cell{
    margin: auto;
    margin-top:10%;
    width: 80%;
    height: auto;
    /* background-color: white; */
}
#hollowKnightRecorder{
    width: 100%;
    height: auto;
    transition: 0.3s;
    display:inline;
}
#user{
    width: 100%;
    height: auto;
    transition: 0.3s;
    display:inline;
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
#user:hover{
    transform: scale(1.1);
    cursor:pointer;
}
#hollowKnightRecorder:hover{
    transform: scale(1.1);
    cursor:pointer;
}
</style>
