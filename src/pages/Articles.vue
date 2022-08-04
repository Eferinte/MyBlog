<template>
  <div class="articlesPart">
    <transition-group name="list" tag="blog-card">
        <div class="cardShell" v-for="blog in blogs" :key="blog.blogId">
            <blog-card  :title="blog.title" :blogId="blog.blogId"></blog-card>
        </div>
    </transition-group>
  </div>
</template>

<script>
import BlogCard from '../components/BlogCard.vue'
import axios from 'axios'
import store from '../main';
export default{
    name:"atricle",
    components:{BlogCard},
    methods: {
        intoTag(){
            
        },
        //初始化请求数据
        init(){
            axios.get(store.state.preUrl+'/all_blogs').then((Response)=>{
                console.log(Response);
                for(let index in Response.data){
                    let obj = Response.data[index]
                    this.blogs.push({
                        title:obj.title,
                        author:obj.author,
                        subDate:obj.sub_date,
                        blogId:obj.blog_id
                    })
                }
            });
        }
    },
    created(){
        this.init();
    },
    data() {
        return {
            blogs:[]
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

/* 确保将离开的元素从布局流中删除
  以便能够正确地计算移动的动画。 */
.list-leave-active {
  position: absolute;
}
.cardShell:nth-child(2n+1){
    left: -40px;
}
.cardShell:nth-child(2n){
    left: 120px;
}
.cardShell{
    margin: 10px;
    display: flex;
    justify-content: center;
    position: relative;

}
.articlesPart{
    margin: auto;
    width: 1200px;
    display: flex;
    flex-direction: column;
}
</style>
