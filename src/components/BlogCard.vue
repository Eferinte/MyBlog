<template>
  <div class="cardShell" @click="intoBlog()" ref="card">
        <div class="line">
            <div class="title">
                {{title}}
            </div>
            <div  class="subDate">
                {{formatTime}}
            </div>            
        </div>

        <div class="brief">
            <v-md-preview class="mdPart" :text="brief"></v-md-preview>
        </div>
        <div class="tagShell">
            <div class="tags">
                <div class="tagItem" v-for="tag in TAGS" :key="tag" @click.stop="intoTag(tag)">
                    {{tag}}
                </div>               
            </div>

        </div>
  </div>
</template>

<script>
export default{
    name:"articleCard",
    props:["title","blogId","brief","subDate","tags"],
    methods: {
        //操作路由，跳转到对应的博文页
        intoBlog(){
            this.$refs.card.style=`
                transition: 0.3s ease-out;
                transform: scaleY(3) scaleX(2);
                opacity:0;

            `
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
    },
    computed:{
        formatTime(){
            let subDate = new Date(this.subDate);
            return subDate.getFullYear() + "-" + (subDate.getMonth() + 1) + "-" + subDate.getDate();
        },
        TAGS(){
            if(this.tags==undefined){
                return ["该文章暂无标签"]
            }else{
                let list =[];
                let str = this.tags;
                let point = str.lastIndexOf("#")
                while(point!=-1){
                    let tag = str.slice(point+1)
                    list.push(tag)
                    str =  str.slice(0,point)
                    point = str.lastIndexOf("#")
                }
                return list
            }
        }
    }

}
</script>

<style scoped>
    .line{
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        margin-top: 10px;
        /* background-color:#FBF7D4; */
        width: 90%;
        height: 20%;
    }
    .cardShell{
        width: 800px;
        height: 250px;
        background-color: white;
        border-radius: 3px;
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
        transition: 0.25s;
    }
    .cardShell:hover{
        cursor:pointer;
    }
    .title{
        font-size: 30px;
        text-align: start;
        border: solid black;
        border-width: 0 0 2px 0;
        font-weight: bold;
    }    
    .subDate{
        font-size: 16px;
        text-align: right;
    }
    .brief{
        text-align: left;
        width: 90%;
        height: 60%;
        font-size: 16px;
        overflow: hidden; 
    }
    .tagShell{
        /* background-color: #FBF7D4; */
        width: 100%;
        height: 15%;
        box-shadow: 0 -10px 100px -5px black;
    }
    .tags{
        width: calc(100% - 20px);
        height: 100%;
        margin-right: 20px;
        display: flex;
        justify-content: flex-end;
        flex-direction: row;
    }
    .tagItem{
        margin-top: auto;
        margin-bottom: auto;
        margin-left: 20px;
        padding: 2px 10px;
        width: fit-content;
        height: 20px;
        border-radius: 10px;
        background-color: #fae6ef;
        font-size: 10px;
        transition: 0.5s;
        text-align: center;
    }
    .tagItem:hover{
        background-color: #FC807F;
        cursor:pointer;
    }
</style>
