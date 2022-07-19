<template>
  <div id="loginDialog">
      <div class="quit" @click="loginQuit">
          <img class="quitIcon" src="../assets/quit.png"/>
      </div>
      <div id="inputArea">
      <br>
      <div class="inputLine">
          <input class="loginInput" v-model="username" placeholder=" 请输入用户名"/>
      </div>
      <br>
      <div class="inputLine">
          <input class="loginInput" v-model="password" @keypress.enter="login" placeholder=" 请输入密码"/>
      </div>
          <button id="loginBtn" @click="login">登录</button>
      </div>
  </div>
</template>

<script>
import axios from 'axios'
import store from '../main';
export default {
    name: "Login",
    methods: {
        // 提交表单登录
        login() {
            axios.get("http://localhost:8888/login", {
                params: {
                    username: this.username,
                    password: this.password
                }
            }).then((response) => {
                console.log(response.data);
                if (response.data == "unfind user") { //用户不存在
                    store.commit("setHintText","用户名或密码错误")
                    console.log("store.state.hintText=",store.state.hintText);
                }
                else if (response.data == "wrong password") { //密码错误
                    store.commit("setHintText","用户名或密码错误")
                    console.log("store.state.hintText=",store.state.hintText);
                }
                else { //登录成功
                    let uid = response.data.uid;
                    localStorage.setItem("uid", uid); //本地存储记录登录状态
                    localStorage.setItem("username", this.username); //本地存储记录登录状态
                    store.commit("setUid", uid);
                    store.commit("setUsername", this.username);
                    // 关闭登录窗口
                    store.commit("closeMask");
                    store.commit("closeLogin");
                    store.commit("setHintText","登陆成功")
                    console.log("store.state.hintText=",store.state.hintText);
                }
            });
        },
        loginQuit() {
            // 关闭登录窗口
            this.$store.commit("closeMask");
            this.$store.commit("closeLogin");
        },
    },
    data() {
        return {
            username: "",
            password: "",
        };
    },
}
</script>

<style  scoped>
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
</style>