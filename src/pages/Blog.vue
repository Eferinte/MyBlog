<template>
<div class="shell">
    <transition name="iconTrans">
        <div class="back" @click="doBack">
            <img src="../assets/back.png" style="height:100%">
        </div>
    </transition>
    <div class="head">
    </div>
    <div class="BlogShell">
        <div class="headLine">
            <span class="centerText title" >
                {{data.title}}
            </span>
        </div>
        <div class="line">

            <div class="tag">
                <span class="centerText tagName">
                    作者
                </span>
                <span class="centerText tagValue">
                    {{data.author}}
                </span>
            </div>
            <div class="tag">
                <span class="centerText tagName">
                    发布日期
                </span>
                <span class="centerText tagValue">
                    {{data.sub_date}}
                </span>
            </div>
            <div style="margin:auto"></div>
            <div class="ops" v-if="ifAuthor">
                <div class="btn" @click="unAlter" v-if="ifAlter">
                    <span class="centerText" >
                        取消修改
                    </span>
                </div>
                <div class="btn" @click="alter" id="alter">
                    <span class="centerText" >
                        {{btn2Name}}
                    </span>
                </div>
                <div class="btn" @click="del" id="del">
                    <span class="centerText">
                        删除
                    </span>
                </div>
            </div>
        </div>
        <div class="context">
            <v-md-preview class="mdPart" :text="data.context" height="550px" v-if="!ifAlter"></v-md-preview>
            <div class="editorShell" style="width:1200px" v-if="ifAlter">
                <v-md-editor v-model="newContext" height="550px"></v-md-editor>
            </div>
        </div>
        <div class="tagShell">
            <div class="tag" v-for="tag in tags" :key="tag" @click.stop="intoTag(tag)">
                {{tag}}
            </div>
        </div>
    </div>
    <Foot></Foot>
</div>
</template>

<script>
import axios from 'axios'
import store from '../main';
import Foot from '../components/Foot.vue';
export default{
    name: "atricle",
    methods: {
        //初始化请求数据
        init() {
            let blogId = this.$route.params.blogId;
            console.log(this.$route.params);
            axios.get(store.state.preUrl + "/blog", { params: {
                    blogId: blogId
                } }).then((Response) => {
                this.data = Response.data;
                let subDate = new Date(this.data.sub_date);
                this.data.sub_date = subDate.getFullYear() + "-" + (subDate.getMonth() + 1) + "-" + subDate.getDate();
                this.ifAuthor = this.data.author==store.state.username?true:false;
            });
        },
        doBack() {
            this.$router.push("/");
        },
        unAlter(){
            this.ifAlter=false;
        },
        alter(){
            if(!this.ifAlter){
                this.ifAlter=true;
                this.newContext = this.data.context;
            }else{
                //提交修改
                axios.get(store.state.preUrl+"/updateBlog", { params: {
                    username: store.state.username,
                    author:this.data.author,
                    blogId: this.data.blog_id,
                    newContext:this.newContext
                } }).then((Response) => {
                    console.log(Response.data);
                    if(Response.data=="update success"){
                        store.commit("setHintText","修改成功");
                        this.ifAlter = false;
                        this.init();
                    }
                });
            }
        },
        del(){
            if(confirm("确认删除改博文吗？")){
                axios.get(store.state.preUrl+"/deleteBlog", { params: {
                    username: store.state.username,
                    blogId: this.data.blog_id,
                } }).then((Response) => {
                    store.commit("setHintText","删除成功");
                    this.$router.push("/");
                });
            }
        }
    },
    created() {
        this.init();
    },
    data() {
        return {
            data: {},
            ifAlter:false,
            ifAuthor:false,
            newContext:"",
        };
    },
    computed:{
        btn2Name(){
            return this.ifAlter?"确认修改":"修改";    
        },

    },
    components: { Foot }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .btn{
        width: 100px;
        height: 30px;
        background-color: #fff;
        transition: 0.25s;
        display: flex;
        font-weight: bold;
        margin-left: 20px;
    }
    .btn:hover{
        cursor: pointer;
    }
    .btn:active{
        transform: scale(1.1);
    }
    .btn#alter:active{
        background-color: #EBE650;
    }
    .btn#del:active{
        background-color: rgb(145, 9, 9);
    }
    .shell{
        background-color: #b5c0ed;
    }
    .back{
        position: fixed;
        height: 70px;
        width: 70px;
        top: 20px;
        left: 30px;
        transition: 0.4s;
    }
    .back:hover{
        cursor: pointer;
        transform: rotate(360deg) scale(1.1);
    }

    .head{
        background-image: url("../../public/assert/background.jpg");
        background-size: 100% 180%;
        margin-top: 0px;
        width: 1200px;
        margin-left: calc(50% - 600px);
        height: 200px;
        left: 100px;
        background-color: rgb(208, 231, 251);
        z-index: -5;
        text-align:center;
        border-radius: 0px 0px 10px 10px;
    }
    .BlogShell{
        margin: auto;
        display: flex;
        flex-direction: column;
        justify-content: center;
    }
    .headLine{
        margin: 10px auto;;
        width: 1200px;
        height: 70px;
        display: flex;
        background-color: #fff;
        box-shadow: 0 2px 12px 0 rgb(0 0 0 / 20%);
        font-size: 32px;
    }
    .line{
        margin: auto;
        width: 1200px;
        height: 30px;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        /* box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%); */
        margin-bottom: 10px;
        flex-direction: row;
    }
    .ops{
        margin: auto;
        margin-right: 0;
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
    }
    .tag{
        display: flex;
        flex-direction: row;
        box-shadow: 0 2px 12px 0 rgb(0 0 0 / 20%);
        margin-right: 20px;
    }
    .centerText.tagName{
        margin: 0;
        padding: 3px 10px;
        background-color: #EBEAAB;
    }
    .centerText.tagValue{
        margin: 0;
        padding: 3px 10px;
        background-color: #C3DCEB;
    }
    .centerText.title{
        padding: 0 40px ;
        font-weight: bold;
        margin-left: 0;
    }
    .centerText{
        width: fit-content;
        display: block;
        margin: auto;
    }
    .mdPart{
        margin: auto;
        width: 1200px;
        background-color: #fff;
        box-shadow: 0 2px 12px 0 rgb(0 0 0 / 20%);
        height: fit-content;
        min-height: 500px;
    }
    .editorShell{
        margin: auto;
        width: 1200px;
        background-color: #fff;
        box-shadow: 0 2px 12px 0 rgb(0 0 0 / 20%);
        height: fit-content;
        min-height: 500px;
    }
</style>
