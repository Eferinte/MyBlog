<template>
<div>
  <transition>
    <div class="dialog" v-if="!ifSignUp">
      <div class="quit" @click="loginQuit">
        <img class="quitIcon" src="../assets/quit.png"/>
      </div>
      <div class="shell login">
        <div class="area">
          <div class="inputLine">
            <div class="tagName">
              <span class="tagText">用户名</span>
            </div>
            <input id="unameInput1" class="loginInput" v-model="username"/>
          </div>
          <div class="inputLine">
            <div class="tagName">
              <span class="tagText">密码</span>
            </div>
            <div class="inputShell">
              <input type="password" id="pwdInput1" class="loginInput" v-model="password" @keypress.enter="login"/>
              <!-- <div class="eye" @click="changeVisible1">
                <img style="height:100%" :src="eyeIcon" alt="">
              </div> -->
            </div>
          </div>
          <button id="loginBtn" @click="login">登录</button>
        </div>
      </div>      
      <div class="shell toggle" @click="toggle">
        <span style="font-size:16px">{{msg}}</span>
      </div>  
    </div>
    <div class="dialog" v-else-if="ifSignUp">
      <div class="quit" @click="loginQuit">
        <img class="quitIcon" src="../assets/quit.png"/>
      </div>
      <div class="shell signUp">
        <div class="area">
          <div class="inputLine">
            <div class="tagName">
              <span class="tagText">用户名</span>
              <span class="hintText">{{unameHint}}</span>
              <div class="passIcon" v-show="usernamePass">
                <img style="height:100%" src="../assets/right.png" alt="">
              </div>
            </div>
            <input id="unameInput2" class="loginInput" v-model="signUp_username" @change="usernameCheck" placeholder=" 请输入用户名"/>
          </div>
          <div class="inputLine">
            <div class="tagName">
              <span class="tagText">密码</span>
              <span class="hintText">{{pwdHint}}</span>
              <div class="passIcon" v-show="pwdPass">
                <img style="height:100%" src="../assets/right.png" alt="">
              </div>
            </div>
            <div class="inputShell">
              <input type="password" id="pwdInput2" class="loginInput" v-model="signUp_password" @change="pwdCheck" @keypress.enter="changeFocus" placeholder=" 请输入密码"/>
              <!-- <div class="eye" @click="changeVisible2">
                <img style="height:100%" :src="eyeIcon" alt="">
              </div> -->
            </div>
          </div>
          <div class="inputLine">
            <div class="tagName">
              <span class="tagText">确认密码</span>
              <span class="hintText">{{rePwdHint}}</span>
              <div class="passIcon" v-show="rePwdPass">
                <img style="height:100%" src="../assets/right.png" alt="">
              </div>
            </div>
            <div class="inputShell">
              <input type="password" id="pwdInput3" class="loginInput" v-model="signUp_re_password" @change="rePwdCheck" @keypress.enter="changeFocus" placeholder=" 确认密码"/>
              <!-- <div class="eye" @click="changeVisible3">
                <img style="height:100%" :src="eyeIcon" alt="">
              </div> -->
            </div>
          </div>
          <button id="loginBtn" @click="signUp">注册</button>
        </div>
      </div>    
      <div class="shell toggle" @click="toggle">
        <span style="font-size:16px">{{msg}}</span>
      </div>  
    </div>  
  </transition>
</div>
</template>

<script>
import Qs from 'qs'
import axios from 'axios'
import store from '../main';
import { setCookie } from '../utils/cookies';
export default {
    name: "Login",
    methods: {
        // 提交表单登录
        login() {
          let axiosInstance = axios.create({
            baseURL: store.state.preUrl,
            timeout: 1000,
          });
          if(this.username==""){
            document.getElementById("unameInput1").className="shakeLoginInput";
            setTimeout(()=>{
              document.getElementById("unameInput1").className="loginInput";
            },400)
          }else if(this.password==""){
            document.getElementById("pwdInput1").className="shakeLoginInput";
            setTimeout(()=>{
              document.getElementById("pwdInput1").className="loginInput";
            },400)
          }else{
            let params = {
              username:this.username,
              password:this.password
            }
            axiosInstance.post("/login",Qs.stringify(params)).then((response)=>{
              // console.log(response.data);
              if (response.data == "unfound user") { //用户不存在
                  store.commit("setHintText","用户名或密码错误")
              }
              else if (response.data == "wrong password") { //密码错误
                  store.commit("setHintText","用户名或密码错误")
              }else if (response.data == "wrong data"){
                  // console.log("[ERROR]数据错误");
              }
              else { //登录成功
                  let token = response.data.token;
                  // console.log("token=",token);
                  let tokenMSG = window.atob(token.slice(token.indexOf(".")+1,token.lastIndexOf(".")));
                  tokenMSG= JSON.parse(tokenMSG)
                  //使用cookie存储
                  setCookie("token",token,30);
                  setCookie("uid",tokenMSG.uid,30);
                  setCookie("username",tokenMSG.username,30);

                  window.localStorage.setItem("uid",tokenMSG.uid);
                  window.localStorage.setItem("username",tokenMSG.username);
                  window.localStorage.setItem("token",token);

                  store.commit("setToken", token);
                  store.commit("setUid", tokenMSG.uid);
                  store.commit("setUsername", tokenMSG.username);
                  // 关闭登录窗口
                  store.commit("closeMask");
                  store.commit("closeLogin");
                  store.commit("setHintText","登陆成功")
                  // console.log("store.state.hintText=",store.state.hintText);
                  this.clear();
              }
            });     
          }
        },
        signUp(){
          let axiosInstance = axios.create({
            baseURL: store.state.preUrl,
            timeout: 1000,
          });
          if(this.usernamePass&&this.pwdPass&&this.rePwdPass){
            let params ={
                username: this.signUp_username,
                password: this.signUp_password,
            }
            // console.log("QS=",Qs.stringify(params));
            axiosInstance.post("/signUp", Qs.stringify(params)).then((response) => {
                // console.log(response.data);
                try{
                  if(response.data.token){//注册成功
                    let token = response.data.token;
                    // console.log("token=",token);
                    let tokenMSG = window.atob(token.slice(token.indexOf(".")+1,token.lastIndexOf(".")));
                    tokenMSG= JSON.parse(tokenMSG)
                    //使用cookie存储
                    setCookie("token",token,30);
                    setCookie("uid",tokenMSG.uid,30);
                    setCookie("username",tokenMSG.username,30);
                    store.commit("setToken", token);
                    store.commit("setUid", tokenMSG.uid);
                    store.commit("setUsername", tokenMSG.username);
                    // 关闭登录窗口
                    store.commit("closeMask");
                    store.commit("closeLogin");
                    store.commit("setHintText","注册成功")
                    // console.log("store.state.hintText=",store.state.hintText);
                    this.clear();
                  } else { 
                  store.commit("setHintText","注册失败")
                  }
                }catch(err){
                  // console.log(err);
                }
            });  
          }
        },
        loginQuit() {
            // 关闭登录窗口
            this.$store.commit("closeMask");
            this.$store.commit("closeLogin");
            this.clear();
        },
        toggle(){
          this.ifSignUp=!this.ifSignUp;
        },
        usernameCheck(){
          if(this.signUp_username.length<=2){
            this.unameHint="用户名至少包含两个字符";
            return false;
          }else if(this.signUp_username.length>=21){
            this.unameHint="用户名不得超过20个字符";
            return false;
          }else{
            axios.get(store.state.preUrl+"/user", {
              params: {
                username: this.signUp_username
              }
            }).then((response) => {
              // console.log(response.data);
              if (response.data == "unfound user") { //用户不存在
                this.unameHint="";
                this.usernamePass=true;
                return true;
              }else { //已存在该用户名
                this.unameHint="该用户名已存在";
                return false;
              }
            });    
          }
        },
        pwdCheck(){
          let reAlphaG = /[A-Z]+/;
          let reAlphaN = /[a-z]+/;
          let reNum = /[0-9]+/;
          let reSpe = /[_!@#$%^&*()+.]+/
          if(this.signUp_password.length<8){
            this.pwdHint="密码至少包含8个字符";
            return false;
          }else if(this.signUp_password.length>=21){
            this.pwdHint="密码不得超过20个字符";
            return false;
          }else{
            let strength = 0;
            if(reAlphaG.test(this.signUp_password)){
              strength ++;
            }
            if(reAlphaN.test(this.signUp_password)){
              strength ++;
            }
            if(reNum.test(this.signUp_password)){
              strength ++;
            }
            if(reSpe.test(this.signUp_password)){
              strength ++;
            }
            if(strength<3){
              this.pwdHint="密码必须包含大小写字母、数字、特殊字符任意三种";
              return false;
            }else{
              this.pwdHint="";
                this.pwdPass=true;
              return true;
            }
          }
        },
        rePwdCheck(){
          if(this.signUp_password!=this.signUp_re_password){
            this.rePwdHint="两次输入的密码不一致";
            return false;
          }else{
            this.rePwdPass=true;
            this.rePwdHint="";
            return true;
          }
        },
        clear(){
          // this.username="";
          // this.password="";
          // this.signUp_username="";
          // this.signUp_password= "";
          // this.signUp_re_password="";
          // this.ifSignUp=false;
        }
    },
    data() {
        return {
            username: "",
            password: "",
            signUp_username:"",
            signUp_password: "",
            signUp_re_password: "",
            ifSignUp:false,
            unameHint:"",
            usernamePass:false,
            pwdPass:false,
            rePwdPass:false,
            pwdHint:"",
            rePwdHint:"",
        };
    },
    computed:{
      msg(){
        return this.ifSignUp?"已有帐户?返回登录":"没有帐户?前去注册"
      }
    }
}
</script>

<style scoped>
@keyframes shake{
    0%   {transform:translateX(3px);}
    20%   {transform:translateX(-6px);}
    40%   {transform:translateX(10px);}
    60%   {transform:translateX(-6px);}
    80%   {transform:translateX(3px);}
    100%   {transform:translateX(0px);}
}
.v-enter-active,
.v-leave-active {
  transition: all  0.3s ease;
}

.v-enter-from{
  opacity: 0;
  transform: translateX(-400px);
}
.v-leave-to {
  opacity: 0;
  transform: translateX(400px);
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
.dialog{
  position: fixed;
  top: calc(50% - 280px);
  left: calc(50% - 200px);
  width: 400px;
  height: fit-content;
  background-color: white;
  z-index: 11;
}
.shell{
  width: fit-content;
  margin: 50px auto 20px auto;
  padding: 10px 0;
  border-radius: 5px ;
  border: solid 2px #e3e7eb;
  background: #f6f8fa;
  display: flex;
  justify-content: center;
}
.area{
  margin: auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.inputLine{
  display: flex;
  justify-content: center;
  padding:10px;
  flex-direction: column;
}
.tagName{
  width: 280px;
  height: 30px;
  margin: 0px auto;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  font-size: 14px;
  position: relative;
}
.passIcon{
  position: absolute;
  height: 15px;
  top:3px;
  left: 265px;
}
.hintText{
  position: absolute;
  top: 70px;
  margin-left: 0;
  font-size: 8px;
  color: red;
}
.inputShell{
  display: flex;
  flex-direction: row;
  position: relative;
}
.loginInput{
  width: 270px;
  height: 30px;
  margin: 3px auto;
  border: solid 2px #e3e7eb;
  border-radius: 5px;
  background: white;
  outline: none;
  transition: 0.7s;
  padding-left:10px ;
  font-size: 16px;
}
.shakeLoginInput{
  width: 270px;
  height: 30px;
  margin: 3px auto;
  border: solid 2px #a22121;
  border-radius: 5px;
  background: white;
  outline: none;
  transition: 0.7s;
  padding-left:10px ;
  font-size: 16px;
  animation: shake 0.25s ;
}
.loginInput:focus{
  border-color: rgb(156, 201, 238);
}
.loginInput:focus::placeholder{
  color: white;
  transition: 0.3s;
}
#loginBtn{
  margin: 10px auto;
  width: 288px;
  height: 36px;
  border-radius: 8px;
  background-color: #2da44e;
  color: white;
  font-size: 16px;
  border: solid 2px #e3e7eb;
  transition: 0.25s;
}
#loginBtn:hover{
  cursor: pointer;
}
#loginBtn:active{
  transform: scale(1.03);
}
.shell.toggle{
  margin-top: 0;
  margin-bottom: 50px;
  width: 308px;
  height: 30px;
  transition: 0.25s;
}
.shell.toggle:hover{
  cursor: pointer;
  color: rgb(63, 186, 118);
}
</style>