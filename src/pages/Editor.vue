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
    <div id="hint" ref="hint">
        <div class="textCell">
            {{hint}}
        </div>
    </div>
</div>
</template>

<script>
import userIcon from '../assets/myuserImg.jpg'
export default {
    name:"Editor",
    methods:{
        back(){
            this.$router.push('/');
            localStorage.setItem("draft",this.text);
            localStorage.setItem("draft-title",this.title);
        },
        timeFunc1(){
            console.log("消失")
            this.$refs.hint.style.transition="1s";
            this.$refs.hint.style.opacity="0";
            this.$refs.hint.style.top="200px";
        },
        timeFunc2(){
            console.log("消失")
            this.$refs.hint.style.visibility="hidden";
        },
        doHint(text){         
            this.hint=text   
            console.log("提示")
            this.$refs.hint.style.top="calc(50% - 25px)";
            this.$refs.hint.style.opacity="1";
            this.$refs.hint.style.visibility="visible";
            this.$refs.hint.style.transition="0s";
            setTimeout(this.timeFunc1,800);
            setTimeout(this.timeFunc2,1200);
        },
        save(){
            localStorage.setItem("draft",this.text);
            localStorage.setItem("draft-title",this.title);
            this.doHint("保存成功");

        },
        post(){
            if(this.title.length == ""){
                this.doHint("标题不能为空");
            }else if(this.text.length<10){
                this.doHint("正文不能少于10个字符");
            }
        }
    },
    data() {
        return {
            userIcon:userIcon,
            title:"",
            text:"",
            hint:"保存成功"
        }
    },
    created(){
        console.log(window.innerWidth);
        window.addEventListener('resize', () => {
            if(window.innerWidth<1000){
                this.$refs.icon.style.opacity="0";
            }else{
                this.$refs.icon.style.opacity="1";
            }
        });
        this.text=localStorage.getItem("draft");
        this.title=localStorage.getItem("draft-title");
    }
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
#hint{
    position: absolute;
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