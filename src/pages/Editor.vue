<template>
<div ckass="shell">
    <div id="head">
        <div id="iconShell" ref="icon">
            <img style="height:100%;width:100%" :src="userIcon"/>
        </div>
        <div id="titleShell">
            <input class="input1" placeholder="输入标题" v-model="title">
            <div operations>
                <button class="button1" @click="back">返回主页</button>
                <button class="button1" @click="save">保存</button>
                <button class="button1" @click="post">发布</button>
            </div>
        </div>

    </div>
    <div id="editorShell">
        <v-md-editor id="editor" v-model="text" height="550px"></v-md-editor>
    </div>
    <Hint ref="hint"></Hint>
</div>
</template>

<script>
import userIcon from '../assets/myuserImg.jpg'
import axios from 'axios';
import store from '../main';
import Hint from '../components/Hint.vue';
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
                this.$refs.hint.doHint("保存成功");
        },
        post() {
            if (this.title.length == "") {
                this.$refs.hint.doHint("标题不能为空");
            }
            else if (this.text.length < 10) {
                this.$refs.hint.doHint("正文不能少于10个字符");
            }
            else {
                if (confirm("确认发布吗？")) {
                    axios.get("http://localhost:8888/post", { params: {
                            title: this.title,
                            author: this.author,
                            context: this.text,
                        } }).then((Response) => {
                        this.$refs.hint.doHint("发布成功");
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
            hint: "保存成功"
        };
    },
    computed: {
        author() {
            return store.state.username;
        }
    },
    created() {
        console.log(window.innerWidth);
        window.addEventListener("resize", () => {
            if (window.innerWidth < 1000) {
                this.$refs.icon.style.opacity = "0";
            }
            else {
                this.$refs.icon.style.opacity = "1";
            }
        });
        this.text = localStorage.getItem("draft");
        this.title = localStorage.getItem("draft-title");
    },
    components: { Hint }
}
</script>

<style scoped>
.button1{
    margin-top: 10px;
    margin-right: 10px;
    width: 150px;
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
    height: 130px;
    background-color: antiquewhite;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
}
#iconShell{
    position: absolute;
    top: 20px;
    left: calc((10% - 90px) / 2);
    border-radius: 50%;
    border: solid 5px rgb(148, 156, 146);
    height: 80px;
    width: 80px;
    overflow: hidden;
    transition: 0.3s;
}
#titleShell{
    position: absolute;
    left: 10%;
    margin-left: 0;
    margin-top: 30px;
    width: 80%;
    display: flex;
    flex-direction: column;
}
#editorShell{
    position: absolute;
    top: 150px;
    left: 10%;
    width: 80%;
    margin: auto;
    /* background-color: rgb(205, 248, 200); */
}
.shell{
    position: absolute;
    top: 0;
}
</style>