<template>
<div class="shell">
    <Back></Back>
    <div class="contentShell" ref="contentShell" v-show="!ifAlter">
        <div class="paddingBlock"></div>
        <div class="content" >

            <div
                v-for="anchor in titles"
                :key="anchor"
                :style="{ padding: `10px 0 10px ${anchor.indent * 10+10}px` }"
                @click="handleAnchorClick(anchor)"
            >
                <a style="cursor: pointer">{{ anchor.title }}</a>
            </div>

        </div>
    </div>
    <div>
        <div class="head">
        </div>
        <div class="BlogShell">
            <div class="headLine" id="title">
                <span class="centerText title" >
                    {{data.title}}
                </span>
            </div>
            <div class="line">

                <div class="tag">
                    <span class="centerText tagName" >
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
            <div class="context" ref="context">
                <v-md-preview class="mdPart" ref="preview" :text="data.context" height="550px" v-if="!ifAlter"></v-md-preview>
                <div class="editorShell" style="width:800px" v-if="ifAlter">
                    <v-md-editor  v-model="newContext" height="550px"></v-md-editor>
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
 
</div>
</template>

<script>
import axios from 'axios'
import Qs from 'qs'
import store from '../main';
import Foot from '../components/Foot.vue';
import Back from '../components/Back.vue';
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
        unAlter(){
            this.ifAlter=false;
        },
        alter(){
            if(!this.ifAlter){
                this.ifAlter=true;
                this.newContext = this.data.context;
            }else{
                let axiosInstance = axios.create({
                    baseURL: "http://localhost:50001",
                    timeout: 1000,
                    headers:{"token":store.state.token}
                });
                let params= {
                    username: store.state.username,
                    author:this.data.author,
                    blogId: this.data.blog_id,
                    newContext:this.newContext.replaceAll("'","\\'")
                }
                //提交修改
                axiosInstance.post(store.state.preUrl+"/updateBlog", Qs.stringify(params)).then((Response) => {
                    console.log(Response.data);
                    if(Response.data=="success"){
                        store.commit("setHintText","修改成功");
                        this.ifAlter = false;
                        this.init();
                        this.setTitles();
                    }else{
                        store.commit("setHintText","修改失败");
                    }
                });
            }
        },
        del(){
            if(confirm("确认删除改博文吗？")){
                console.log("[LOG]token=",store.state.token);
                let axiosInstance = axios.create({
                    baseURL: "http://localhost:50001",
                    timeout: 1000,
                    headers:{"token":store.state.token}
                });
                let params= {
                    username: store.state.username,
                    blogId: this.data.blog_id,
                }
                axiosInstance.post("/deleteBlog", Qs.stringify(params)).then((Response) => {
                    if(Response.data=="success"){
                        store.commit("setHintText","删除成功");
                        this.$router.push("/");
                    }else{
                        console.log(Response.data);
                        store.commit("setHintText","删除失败");
                    }
                });
            }
        }, 
        setTitles(){
            const anchors = this.$refs.preview.$el.querySelectorAll('h1,h2,h3,h4,h5,h6');
            const titles = Array.from(anchors).filter((title) => !!title.innerText.trim());
            console.log("[setTitles]=",anchors);
            if (!titles.length) {
            this.titles = [];
            return;
            }

            const hTags = Array.from(new Set(titles.map((title) => title.tagName))).sort();

            this.titles = titles.map((el) => ({
            title: el.innerText,
            lineIndex: el.getAttribute('data-v-md-line'),
            indent: hTags.indexOf(el.tagName),
            }));
        },
        handleAnchorClick(anchor) {
            const { preview } = this.$refs;
            const { lineIndex } = anchor;

            const heading = preview.$el.querySelector(`[data-v-md-line="${lineIndex}"]`);

            if (heading) {
                preview.scrollToTarget({
                target: heading,
                scrollContainer: window,
                top: 60,
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
            titles:""
        };
    },
    mounted() {     
        setTimeout(()=>{
            console.log("[preview]=",this.$refs.preview.$el.firstChild);
            this.setTitles()
        },300)
        //利用getBoundingClientRect实现sticky
        window.addEventListener("scroll",()=>{
            if(document.getElementById("title").getBoundingClientRect().y<100){
                this.$refs.contentShell.style="position:fixed;top:0";
            }else{
                this.$refs.contentShell.style="position:absolute;";
            }
        })
    },
    computed:{
        btn2Name(){
            return this.ifAlter?"确认修改":"修改";    
        },
    },
    components: { Foot, Back }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .contentShell{
        top: 110px;
        left: 100px;
        position: absolute;
        height: 800px;
        width: 200px;
        border-radius: 10px;
        /* background-color: olivedrab; */
        overflow: visible;
    }
    .paddingBlock{
        height: 100px;
        width: 200px;
        margin: 0;
        /* background-color: olivedrab; */
    }
    .content{
        background-color: #fff;
        min-height: 100px;
        height: fit-content;
        width: 200px;
        transition: 0.25s;
        border-radius: 3px;
        font-size: 8px;
        box-shadow: 0 2px 12px 0 rgb(0 0 0 / 20%);
    }
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

    .head{
        background-image: url("../../public/assert/background.jpg");
        background-size: 100% 180%;
        margin-top: 0px;
        width: 800px;
        margin-left: calc(50% - 400px);
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
        width: 800px;
        height: 70px;
        display: flex;
        background-color: #fff;
        box-shadow: 0 2px 12px 0 rgb(0 0 0 / 20%);
        font-size: 32px;
        border-radius: 5px;
    }
    .line{
        margin: auto;
        width: 800px;
        height: 30px;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        /* box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%); */
        margin-bottom: 10px;
        flex-direction: row;
        border-radius: 5px;
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
        width: 800px;
        background-color: #fff;
        box-shadow: 0 2px 12px 0 rgb(0 0 0 / 20%);
        height: fit-content;
        min-height: 500px;
    }
    .editorShell{
        margin: auto;
        width: 800px;
        background-color: #fff;
        box-shadow: 0 2px 12px 0 rgb(0 0 0 / 20%);
        height: fit-content;
        min-height: 500px;
    }
    .context{
        border-radius: 5px;
        width: 800px;
        overflow: hidden;
        margin: auto;
        height: fit-content;
    }
</style>
