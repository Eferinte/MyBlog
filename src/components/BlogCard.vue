<template>
  <div class="cardShell" @click="intoBlog()">
        <div class="title">
            {{title}}
        </div>
        <div class="brief">

        </div>
        <div class="tagShell">
            <div class="tag" v-for="tag in TAGS" :key="tag" @click.stop="intoTag(tag)">
                {{tag}}
            </div>
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
        console.log("blogId=",this.blogId);
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .cardShell{
        margin: 20px;
        width: 300px;
        height: 250px;
        background-color: white;
        border-radius: 5px;
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
    }
    .cardShell{
        cursor:pointer
    }
    .title{
        margin-top: 3%;
        background-color: aliceblue;
        width: 90%;
        height: 20%;
        font-size: 30px;
    }
    .brief{
        text-align: left;
        background-color: aliceblue;
        width: 90%;
        height: 60%;
        font-size: 16px;
    }
    .tagShell{
        background-color: aliceblue;
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
