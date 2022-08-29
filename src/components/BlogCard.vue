<template>
    <div class="cardShell"  ref="card" :style="{height:cardHeight}" >
        <div class="line" @click="intoBlog()">
            <div class="title" :style="{fontSize:titleFontSize}">
                {{title}}
            </div>
            <!-- <div class="decoration">
                <div class="hole"></div>
                <div class="hole"></div>
            </div> -->
                
        </div>
        <div  class="mark private" v-if="ifPrivate">
            仅自己可见
        </div>      
        <div  class="mark">
            {{formatTime}}
        </div>        

        <div class="brief" @click="intoBlog()">
            <v-md-preview class="mdPart" :text="brief" ></v-md-preview>
        </div>

        <div class="bottomShell">
            <div class="msgShell" v-if="!ifPrivate">
                <div class="cell">
                    <div class="iconShell">
                        <img style="height:100%" src="../assets/eye.png">
                    </div>
                    <div class="centerText">{{views}}</div>
                </div>
                <div class="cell">
                    <div class="iconShell">
                        <img style="height:80%;margin:2px 2px;" src="../assets/like.png">
                    </div>
                    <div class="centerText">{{likes}}</div>
                </div>
                <div class="cell">
                    <div class="iconShell">
                        <img style="height:80%;margin:3px 2px;" src="../assets/comment.png">
                    </div>
                    <div class="centerText">{{floors}}</div>
                </div>
            </div>
            <div class="tagShell">
                <div class="tags">
                    <div class="tagItem" v-for="tag in TAGS" :key="tag">
                        {{tag}}
                    </div>               
                </div>
            </div>            
        </div>
    </div>

</template>

<script>

export default{
    name:"articleCard",
    props:["title","blogId","brief","subDate","tags","ifPrivate","views","likes",'floors','titleFontSize','cardHeight'],
    methods: {
        //操作路由，跳转到对应的博文页
        intoBlog(){
            this.$router.push({
                name:"Blog",
                query:{
                    blogId:this.blogId
                }
            })
        }
    },
    created(){
        // console.log("[card]title=",this.title,"ifPrivate=",this.ifPrivate);
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
        },
    }

}
</script>

<style scoped>
    .cardShell{
        width: 100%;
        height: 250px;
        background-color: white;
        border-radius: 3px;
        display: flex;
        justify-content: space-between;
        flex-direction: column;
        transition: 0.25s;
        box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
        position: relative;
        overflow: hidden;
    }
    .cardShell:hover{
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
        height: 20%;
        max-height: 50px;
        /* 不换行 */
        white-space: nowrap;
        position: relative;
        z-index: 3;
    }

    .title{
        font-size: 30px;
        text-align: start;
        border: solid black;
        border-width: 0 0 2px 0;
        font-weight: bold;
        overflow: hidden;
        max-width: 60%;
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
        position: absolute;
        top: 10px;
        right: 0;
        /* left: 33px; */
        /* border: solid 1px black; */
        border-radius: 12px 0 0 12px;
        height: 24px;
        padding: 2px 20px;
        padding-right: 10px;
        background-color: olivedrab;
        color: aliceblue;
        z-index: 4;
    }
    .mark.private{
        position: absolute;
        padding: 2px 15px;
        background-color:  rgb(139, 9, 139);;
        height: 16px;
        font-size: 12px;
        top: 40px;
        left: auto;
        right: 0px;
    }
    .brief{
        text-align: left;
        width: 100%;
        height: 80%;
        font-size: 16px;
        overflow: hidden; 
        transform: scale(0.8);
    }
    .bottomShell{
        /* background-color: #FBF7D4; */
        width: 100%;
        height: fit-content;
        min-height: 30px;
        box-shadow: 0 -10px 100px -5px black;
        position: relative;
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
        position: absolute;
        bottom: 0;
        background-color: white;
    }
    .bottomShell:hover{
        cursor: default;
    }
    .bottomShell:active{
        cursor: default;
    }
    .msgShell{
        width: 150px;
        min-height: 30px;
        /* background-color: royalblue; */
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        background-color: #ffffff;
        padding-left: 15px;
    }
    .cell{
        margin: auto 0px;
        display: flex;
        flex-direction: row;
        background-color: #ffffff;
    }
    .iconShell{
        height: 20px;
        width: 20px;
    }
    .centerText{
        font-size: 10px;
        margin: auto 5px;
        /* background-color: olivedrab; */
        min-height: 10px;
        min-width: 35px;
    }
    .tagShell{
        /* background-color: #FBF7D4; */
        width: calc(100% - 150px);
        height: 100%;
        min-height: 30px;
        position: relative;
        /* background-color: rebeccapurple; */
        overflow: hidden;
        display: flex;
        justify-content: flex-end;
    }
    .tags{
        width: fit-content;
        min-height: 30px;
        height: 100%;
        margin: 0 10px;
        padding-bottom: 5px;
        white-space: nowrap;
        overflow-x:auto;
        float:left;
        overflow-y:hidden
    }
    .tags::-webkit-scrollbar {
        height: 5px;
        background-color: #d4d2d2;
    }
    .tags::-webkit-scrollbar-thumb{
        height: 5px;
        background-color: olivedrab;
    }
    .tagItem{
        margin-top: 10px;
        margin-bottom: 0px;
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
        display: inline-block;
    }
</style>
