<template>
  <div class="cardShell" @click="intoBlog()" id="card">
        <div class="title">
            {{title}}
        </div>
        <div class="brief">

        </div>
        <div class="tagShell">
            <!-- <div class="tag" v-for="tag in TAGS" :key="tag" @click.stop="intoTag(tag)">
                {{tag}}
            </div> -->
        </div>
  </div>
</template>

<script>
export default{
    name:"articleCard",
    props:["title","blogId"],
    methods: {
        //操作路由，跳转到对应的博文页
        intoBlog(){
            document.getElementById("card").style="transition: 0.3s ease-out;transform: scaleY(3) scaleX(2);opacity:0"
            this.$router.push({
                name:"Blog",
                params:{
                    blogId:this.blogId
                }
            })
        },
        //操作路由，跳转到对应Tag分类页面
        intoTag(tag){
            // 根据获取到的tag转到对应页面
            console.log("跳转到"+tag)
        }
    },
    created(){
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .cardShell{
        width: 800px;
        height: 250px;
        background-color: white;
        border-radius: 5px;
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
        transition: 0.25s;
    }
    .cardShell:hover{
        cursor:pointer;
    }
    .title{
        margin-top: 1%;
        background-color:#FBF7D4;
        width: 90%;
        height: 20%;
        font-size: 30px;
        text-align: start;
    }
    .brief{
        text-align: left;
        background-color: #FBF7D4;
        width: 90%;
        height: 60%;
        font-size: 16px;
    }
    .tagShell{
        background-color: #FBF7D4;
        width: 90%;
        height: 10%;
        display: flex;
        justify-content: flex-start;
        flex-direction: row;
    }
    .tag{
        margin-top: auto;
        margin-bottom: auto;
        margin-left: 10px;
        width: 40px;
        height: 60%;
        background-color: orange;
        font-size: 10px;
        transition: 0.5s;
    }
    .tag:hover{
        background-color: orangered;
        cursor:pointer;
    }
</style>
