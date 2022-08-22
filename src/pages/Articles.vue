<template>
<div class="shell">
    <div class="articlesPart">
        <transition-group name="list">
            <div class="cardBox" v-for="blog in blogs" :key="blog.blogId" >
                <blog-card  
                    :title="blog.title" 
                    :blogId="blog.blogId" 
                    :brief="blog.brief" 
                    :subDate="blog.subDate" 
                    :tags="blog.tags" 
                    :ifPrivate="blog.private"
                    :views="blog.views"
                    :likes="blog.likes"
                    :titleFontSize="cardCSS.titleFontSize"
                    :cardHeight="cardCSS.cardHeight"
                ></blog-card>
            </div>
        </transition-group>
    </div>
    <div class="noMore">
        <div class="text">没有更多</div>
    </div>
    <transition name="fade">
        <div class="loadingMask" v-show="ifLoading">
            <div class="loadingBox">
                <div class="loader"></div>
                <div class="halfCricle"></div>
            </div>
        </div>
    </transition>
</div>
</template>

<script>
import BlogCard from '../components/BlogCard.vue'
import axios from 'axios'
import store from '../main';
import { listToStr} from '../utils/tagTrans';
export default{
    name:"atricle",
    components:{BlogCard},
    methods: {
        //初始化请求数据
        init(){
            this.ifLoading=true;
            axios.get(store.state.preUrl+'/partBlogs',{params:{
                start:this.offset,
                amount:this.defaultAmount,
                selectedTags:listToStr(this.selectedTags)
            }}).then((Response)=>{
                // console.log(Response);
                for(let index in Response.data){
                    let obj = Response.data[index]
                    this.blogs.push({
                        title:obj.title,
                        author:obj.author,
                        subDate:obj.sub_date,
                        blogId:obj.blog_id,
                        brief:obj.context,
                        tags:obj.tags,
                        views:obj.views,
                        likes:obj.likes
                    })
                }
                this.offset+=this.defaultAmount;
                //获取到数据，渲染完后再监听
                this.intersectionObserver = new IntersectionObserver(
                    (entries) =>{
                        // 如果不可见，就返回
                        if (entries[0].intersectionRatio <= 0) return;
                        this.getMoreBlogs(this.defaultAmount);
                        // console.log('Loaded new items');
                    }
                );

                // 开始观察
                // console.log("[querySelector]=", document.querySelector('.noMore'));
                this.intersectionObserver.observe(
                    document.querySelector('.noMore')
                );
                // console.log('[MOUNTED]=',this.offset);
                this.ifLoading=false;
            });
        },
        //接着获取指定条数的博客
        getMoreBlogs(amount){
            // console.log('[getMoreBlogs]=from ',this.offset,' to ',amount);
            axios.get(store.state.preUrl+'/partBlogs',{params:{
                start:this.offset,
                amount:amount,
                selectedTags:listToStr(this.selectedTags)
            }}).then((Response)=>{
                // console.log('[Resopnse]=',Response.data);
                if(Response.data.length==0){
                    this.intersectionObserver.unobserve(document.querySelector('.noMore'));
                }
                for(let index in Response.data){
                    let obj = Response.data[index]
                    this.blogs.push({
                        title:obj.title,
                        author:obj.author,
                        subDate:obj.sub_date,
                        blogId:obj.blog_id,
                        brief:obj.context,
                        tags:obj.tags,
                        views:obj.views,
                        likes:obj.likes
                    })
                }
                this.offset+=amount;
            });
        }
    },
    created(){
        this.init();
    },
    data() {
        return {
            blogs:[],
            offset:0,
            defaultAmount:5,
            intersectionObserver:undefined,
            ifLoading:false
        }
    },
    watch:{
        selectedTags(oldText,newText){
            this.blogs=[];
            this.offset=0;
            if(this.intersectionObserver){
                this.intersectionObserver.unobserve(document.querySelector('.noMore'));
            }
            this.init();
        },
        mode(newV, oldV){
            console.log('[watch]mode changed from ',oldV,' to ',newV);
            // //修改字体大小
            // if(newV == 'mobile'){
            //     document.getElementsByClassName('cardShell')[0].style.setProperty('--title-font-size','16px');
            //     document.getElementsByClassName('cardShell')[0].style.setProperty('--card-height','150px');
            // }else if(newV == 'pc'){
            //     document.getElementsByClassName('cardShell')[0].style.setProperty('--title-font-size','30px');
            //     document.getElementsByClassName('cardShell')[0].style.setProperty('--card-height','250px');
            // }else{
            //     console.log('[watch] unknow mode');
            // }
        }
    },
    computed:{
        selectedTags(){
            return store.state.selectedTags;
        },
        mode(){
            return store.state.mode;
        },
        cardCSS(){
            if(store.state.mode == 'mobile'){
                return {
                    cardHeight:'350px',
                    titleFontSize:'16px'
                }
            }else{
                return {
                    cardHeight:'250px',
                    titleFontSize:'30px'
                }
            }
        }
    },
    beforeUnmount() {            
        if(this.intersectionObserver){
            this.intersectionObserver.unobserve(document.querySelector('.noMore'));
        }
    },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.list-move, /* 对移动中的元素应用的过渡 */
.list-enter-active,
.list-leave-active {
  transition: all 0.75s ease;
}

.list-enter-from:nth-child(2n+1){
  opacity: 0;
  transform: translateX(-300px);
}
.list-enter-from:nth-child(2n){
  opacity: 0;
  transform: translateX(300px);
}
/* .list-enter-from{
  opacity: 0;
  transform: translateY(300px);
} */

/* 确保将离开的元素从布局流中删除
  以便能够正确地计算移动的动画。 */
.list-leave-active {
  position: absolute;
}


.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.618s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
/* .cardBox:nth-child(2n+1){
    transform: translateX(var(--offsetL));
}
.cardBox:nth-child(2n){
    transform: translateX(var(--offsetR));
} */
.cardBox{
    /* --offsetL:-50px;
    --offsetR:50px; */
    margin: 10px auto;
    display: flex;
    justify-content: center;
    position: relative;
    max-width: 650px;
    width: 80%;
}
.shell{
    position: relative;
    border-radius:  10px 10px 0 0 ;
    box-shadow: 0 2px 10px 2px rgba(54,58,80,.32);
    width: 100%;
}
.articlesPart{
    margin: auto;
    width: 100%;
    display: flex;
    flex-direction: column;
    background-color: #b3ada5;
    border-radius:  10px 10px 0 0 ;
    transition: 0.25s;
    height: fit-content;
    justify-content: center;
}
.loadingMask{
    position: absolute;
    top: 0;
    bottom: 0;
    height: auto;
    background-color: #fff;
    opacity: 0.5;
    width: 100%;
    /* border-radius: 10px 10px 0 0; */
    z-index: 5;
    display: flex;
}
@keyframes spin
{
    from {transform:rotate(0deg);}
    to {transform:rotate(360deg);}
}
.loadingBox{
    margin: 0 auto;
    top: 350px;
    left: calc(50% - 160px);
    height: 50px;
    width: 50px;
    position: fixed;
    /* border: solid 1px olivedrab; */
    animation: spin 1s ease infinite ;
    position: sticky;
}
.loader{
    top: 0;
    left: 0;
    position: absolute;
    margin: auto;
    height: 50px;
    width: 50px;
    border: solid 10px olivedrab;
    /* border-top: 20px; */
    border-radius: 100% 100% 100% 100%;
    /*内边框*/
    box-sizing: border-box; 
}
.halfCricle{
    top: 0;
    left: 0;
    position: absolute;
    margin: auto;
    height: 0px;
    width: 0px;
    border-top: 25px solid white;
    border-left: 25px solid transparent;
    border-right: 25px solid transparent;
    border-bottom: 25px solid transparent;
    border-radius: 100%;
}
.noMore{
    height: 75px;
    background-color: #b3ada5;
    /* background-color: olivedrab; */
    display: flex;
}
.text{
    margin: auto;
    font-size: 30px;
    font-weight: bold;
    color: white;
    text-shadow: 0 0 10px black;
}
</style>
