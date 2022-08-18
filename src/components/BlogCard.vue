<template>
    <div class="cardShell" @click="intoBlog()" ref="card">
        <div class="line">
            <div class="title">
                {{title}}
            </div>
            <!-- <div class="decoration">
                <div class="hole"></div>
                <div class="hole"></div>
            </div> -->
            <div  class="mark private" v-if="ifPrivate">
                仅自己可见
            </div>      
            <div  class="mark">
                {{formatTime}}
            </div>            
        </div>

        <div class="brief">
            <v-md-preview class="mdPart" :text="brief"></v-md-preview>
        </div>

        <div class="tagShell">
            <div class="tags">
                <div class="tagItem" v-for="tag in TAGS" :key="tag">
                    {{tag}}
                </div>               
            </div>

        </div>
    </div>
</template>

<script>
export default{
    name:"articleCard",
    props:["title","blogId","brief","subDate","tags","ifPrivate"],
    methods: {
        //操作路由，跳转到对应的博文页
        intoBlog(){
            // this.$refs.card.style=`
            //     transition: 0.3s ease-out;
            //     transform: scaleY(3) scaleX(2);
            //     opacity:0;
            // `
            this.$router.push({
                name:"Blog",
                query:{
                    blogId:this.blogId
                }
            })
        },
        //操作路由，跳转到对应Tag分类页面
        intoTag(tag){
            // 根据获取到的tag转到对应页面
            // console.log("跳转到"+tag)
        }
    },
    created(){
        console.log("[card]title=",this.title,"ifPrivate=",this.ifPrivate);
    },
    computed:{
        formatTime(){
            let subDate = new Date(this.subDate);
            return subDate.getFullYear() + "-" + String(subDate.getMonth() + 1).padStart(2,"0") + "-" + String(subDate.getDate()).padStart(2,"0");
        },
        TAGS(){
            // console.log("[LOG]title=",this.title,"tags=",this.tags)
            let str = new String(this.tags);
            if(str.indexOf("#")==-1){
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
    .cardShell{
        width: 650px;
        height: fit-content;
        background-color: white;
        border-radius: 3px;
        display: flex;
        justify-content: center;
        flex-direction: column;
        transition: 0.25s;
        box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
        position: relative;
    }

    .cardShell:hover{
        width: 650px;
        height: 260px;
        background-color: white;
        border-radius: 3px;
        display: flex;
        justify-content: center;
        flex-direction: column;
        transition: 0.25s;
        box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
        position: relative;
        cursor: pointer;
    }

    .line{
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        margin: 0 auto;
        margin-top: 10px;
        /* background-color:#FBF7D4; */
        width: 90%;
        height: 50px;
        /* 不换行 */
        white-space: nowrap;
        position: relative;
    }

    .title{
        font-size: 30px;
        text-align: start;
        border: solid black;
        border-width: 0 0 2px 0;
        font-weight: bold;
        overflow: hidden;
    }    
    .decoration{
        height: 28px;
        width: fit-content;
        display: flex;
        justify-content: center;
        margin-left: auto;
        margin-right: 10px;
        position: relative;
        left: 50px;
    }
    .hole{
        height: 20px;
        width: 20px;
        border-radius: 100%;
        background-color: #b2aca4;
        margin: auto 5px;
    }
    .mark{
        font-size: 16px;
        text-align: right;
        position: relative;
        left: 33px;
        /* border: solid 1px black; */
        border-radius: 12px 0 0 12px;
        height: 24px;
        padding: 2px 20px;
        padding-right: 10px;
        background-color: olivedrab;
        color: aliceblue;
    }
    .mark.private{
        position: absolute;
        padding: 2px 15px;
        background-color:  rgb(139, 9, 139);;
        height: 16px;
        font-size: 12px;
        top: 33px;
        left: auto;
        right: -33px;
    }
    .brief{
        text-align: left;
        width: 90%;
        height: 150px;
        font-size: 16px;
        overflow: hidden; 
    }
    .tagShell{
        /* background-color: #FBF7D4; */
        width: 100%;
        height: fit-content;
        min-height: 50px;
        box-shadow: 0 -10px 100px -5px black;
    }
    .tags{
        width: 630px;
        min-height: 50px;
        height: fit-content;
        margin: 0 10px;
        display: flex;
        justify-content: flex-end;
        flex-direction: row-reverse;
        flex-wrap: wrap;
        flex-direction: row;
    }
    .tagItem{
        margin-top: 10px;
        margin-bottom: 10px;
        margin-left: 10px;
        padding: 2px 10px;
        width: fit-content;
        height: 20px;
        border-radius: 10px;
        background-color: olivedrab;
        font-size: 10px;
        transition: 0.5s;
        text-align: center;
        color: white;
    }
</style>
