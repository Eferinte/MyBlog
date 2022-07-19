<template>
<div class="shell">
    <div id="head">
        <div id="iconShell" ref="icon" :style="{opacity: iconOpacityValue}">
            <img style="height:100%;width:100%" :src="userIcon"/>
        </div>
        <div id="titleShell" :style="{left:editorLeft}">
            <input class="input1" placeholder="输入标题" v-model="title">
            <div class="operations">
                <button class="button1" @click="back">返回主页</button>
                <button class="button1" @click="save">保存</button>
                <button class="button1" @click="post" style="margin-right:0">发布</button>
            </div>
        </div>

    </div>
    <div id="fileShell" :style="{opacity: iconOpacityValue}">
    
    </div>
    <div id="editorShell" :style="{left:editorLeft}">
        <v-md-editor id="editor" v-model="text" :height="editorHeight"></v-md-editor>
    </div>
</div>
</template>

<script>
import userIcon from '../assets/myuserImg.jpg'
import axios from 'axios';
import store from '../main';
export default {
    name: "Editor",
    methods: {
        back() {
            this.$router.push("/");
            localStorage.setItem("draft", this.text);
            localStorage.setItem("draft-title", this.title);
        },
        save() {
            localStorage.setItem("draft", this.text);
            localStorage.setItem("draft-title", this.title);
            store.commit("setHintText","保存成功")
        },
        post() {
            if (this.title.length == "") {
                store.commit("setHintText","标题不能为空")
            }
            else if (this.text.length < 10) {
                store.commit("setHintText","正文不能少于10个字符")
            }
            else {
                if (confirm("确认发布吗？")) {
                    axios.get("http://localhost:8888/post", { params: {
                            title: this.title,
                            author: this.author,
                            context: this.text,
                        } }).then((Response) => {
                        store.commit("setHintText","发布成功")
                    });
                }
                else {
                    this.save();
                }
            }
        }
    },
    data() {
        return {
            userIcon: userIcon,
            title: "",
            text: "",
            iconStyle:"opacity:1;transition: 0.3s;",
            iconOpacityValue:1,
            editorLeft:'15%',
        };
    },
    computed: {
        author() {
            return store.state.username;
        },
        editorHeight(){
            return "550px";
        },
    },
    created() {
        console.log(window.innerWidth);
        window.addEventListener("resize", () => {
            if (window.innerWidth < 1000) {
                this.iconOpacityValue=0;
                this.editorLeft='10%';
            }
            else{
                this.iconOpacityValue=1;
                this.editorLeft='15%';
            }
        });
        this.text = localStorage.getItem("draft");
        this.title = localStorage.getItem("draft-title");
    },
}
</script>

<style scoped>
#fileShell{
    position: absolute;
    top: 130px;
    left: calc((15% - 130px) / 2);
    width: 130px;
    height: 550px;
    background-color: #fff;
    box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
    transition: 0.3s;
}
.button1{
    margin-top: 10px;
    max-width: 150px;
    margin-right: 10px;
    width: 31%;
    height: 30px;
    background-color: #fff;
    box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
    border: 4px;
    cursor: pointer;
    transition: 0.3s;
}
.button1:active{
    transform: scale(1.1);
}
.input1{
    border: 4px;
    border-radius: 0px;
    width: 100%;
    height: 33px;
    padding: 0;
    padding: 10px 15px;
    box-sizing: border-box;
    box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
}
.input1:focus{
    outline: none;
}
#head{
    position: absolute;
    top: 0px;
    width: 100%;
    height: 61.8%;
    background-color: antiquewhite;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
}
#iconShell{
    position: absolute;
    top: 20px;
    left: calc((15% - 90px) / 2);
    border-radius: 50%;
    border: solid 5px rgb(148, 156, 146);
    height: 80px;
    width: 80px;
    overflow: hidden;
    transition: 0.3s;
}
#titleShell{
    position: absolute;
    left: 15%;
    margin-left: 0;
    margin-top: 30px;
    width: 80%;
    display: flex;
    flex-direction: column;
    transition: 0.3s;
}
#editorShell{
    position: absolute;
    top: 130px;
    left: 15%;
    width: 80%;
    margin: auto;
    transition: 0.3s;
    /* background-color: rgb(205, 248, 200); */
}
.shell{
    transition: 0.3s;
}
</style>