<template>
<div class="shell">
<div style="position:relative">
    <div class="selectedShell">
        <transition-group name="list">
            <div class="selectedItem" v-for="(tag , index) in selectedTags" :key="tag">
                <div class="tagText">
                    <div class="textShell tag">
                        {{tag.tagName}}
                    </div>
                </div>
                <div class="tagDel" @click="removeTag(index)">
                    <img src="../assets/quit-white.png" style="height:50%;margin: auto;">
                </div>
            </div>
        </transition-group>
    </div>
    <div class="tagShell" :style="{top:dynaticTop}">
        <div v-for="(tag,index) in tags" :key="tag" @click="select(tag,index)">
            <div :id="'item'+index" class="tagItem" :ref="tag.tagName">
                {{tag.tagName}}({{tag.blogId.length}})
            </div>
        </div>
    </div>
</div>


</div>
</template>

<script>
import axios from 'axios';
import store from '../main';
export default {
    methods: {
        init(){
            axios.get(store.state.preUrl+"/getAllTags").then(Response=>{
                let tagCollection = Response.data;
                let keys = Object.keys(tagCollection);
                keys.forEach(key=>{
                    this.tags.push({
                        tagName:key,
                        blogId:tagCollection[key]
                    })
                })
                // console.log("[INIT]this.tags=",this.tags);
            });
        },
        select(tag,index){
            if(this.selectedTags.length>10){
                store.commit("setHintText","不能再多了");
                return;
            }
            if(typeof this.selectedTags.find((item)=>{return item==tag?true:false}) != "undefined"){
                // console.log("[select]elment=",document.getElementById("item"+index),"index=",index);
                // store.commit("setHintText","已选择该标签");
                // 修改class 增加抖动动画
                document.getElementById("item"+index).className = "shakeTagItem";
                // class改回来
                setTimeout(()=>{
                    document.getElementById("item"+index).className = "tagItem";
                },300)
            }else{
                this.selectedTags.push(tag);
                store.commit("updateTags",this.selectedTags.map(item=>{
                    return item.tagName
                }));
                console.log('[vuex]tags=',store.state.selectedTags);
            }
            // console.log("[TOP=]",document.getElementsByClassName("selectedShell")[0].offsetHeight);
            setTimeout(()=>{
            this.dynaticTop = document.getElementsByClassName("selectedShell")[0].offsetHeight+5+"px";
            },10)
        },
        removeTag(index){
            this.selectedTags.splice(index,1);
            store.commit("updateTags",this.selectedTags.map(item=>{
                return item.tagName
            }));
            setTimeout(()=>{
                if(document.getElementsByClassName("selectedShell")[0].offsetHeight==0){
                    this.dynaticTop = "0px";
                }else{
                    this.dynaticTop = document.getElementsByClassName("selectedShell")[0].offsetHeight+5+"px";
                }
            },10)
        },
    },
    created() {
        this.init();
    },
    data() {
        return {
            // tag={
            //     tagName:"",
            //     blogId:[]
            // }
            tags:[],
            selectedTags:[],
            dynaticTop:"0px"
        }
    },
    beforeUnmount() {
        store.commit("updateTags",[]);
    }
}
</script>

<style scoped>

    @keyframes shake{
        0%   {transform:translateX(5px);}
        20%   {transform:translateX(-10px);}
        40%   {transform:translateX(15px);}
        60%   {transform:translateX(-10px);}
        80%   {transform:translateX(5px);}
        100%   {transform:translateX(0px);}
    }
    .list-move, /* 对移动中的元素应用的过渡 */
    .list-enter-active,
    .list-leave-active {
        transition: all 0.25s ease;
    }
    .list-leave-to,
    .list-enter-from{
        opacity: 0;
        transform: translateY(30px);
    }

    /* 确保将离开的元素从布局流中删除
    以便能够正确地计算移动的动画。 */
    .list-leave-active {
    position: absolute;
    }
    .shell{
        position: -webkit-sticky;
        position: sticky;
        top: 8px;
    }
    .selectedShell{
        transition: height 0.25s;
        /* background-color: #7fb9fc; */
        
    }
    .tagShell{
        min-height: 200px;
        width: 315px;
        background-color: rgb(123, 140, 91);
        border-radius: 10px;
        display: flex;
        flex-direction: row;
        justify-content: center;
        flex-wrap: wrap;
        align-content: flex-start;
        padding-top: 20px;
        padding-bottom: 10px;
        transition: 0.25s;
        top: 0;
        position:absolute;
        box-shadow: 0 2px 10px 2px rgba(54,58,80,.32);
    }
    .tagItem{
        margin: 5px;
        padding: 2px 10px;
        width: fit-content;
        height: 20px;
        border-radius: 10px;
        background-color: #fff;
        font-size: 10px;
        transition: 0.5s;
        text-align: center;
    }
    .tagItem:hover{
        background-color: #371D40;
        cursor:pointer;
        color: white;
    }
    .shakeTagItem{
        margin: 5px;
        padding: 2px 10px;
        width: fit-content;
        height: 20px;
        border-radius: 10px;
        background-color: #fff;
        font-size: 10px;
        transition: 0.5s;
        text-align: center;
        animation: shake 0.25s;

    }
.selectedItem{
    display: flex;
    flex-direction: row;
    padding: 0 5px;
    margin: 5px;
    margin-left: 0;
    border: solid 1px rgb(114, 155, 155);
    border-radius: 8px;
    width: fit-content;
    background-color: #7b8c5b;
    color: #ffffff;
    box-shadow: 0 2px 10px 2px rgba(54,58,80,.32);
}
.tagText{
    white-space: nowrap;
    width: fit-content;
    font-size: 8px;
    display: flex;
    justify-content: center;
}
.tag.textShell{
    padding: 2px 5px;
    margin: auto;
    text-align: center;
}
.tagDel{
    height: 20px;
    display: flex;
    justify-content: center;
}
.tagDel:hover{
    cursor: pointer;
}
</style>