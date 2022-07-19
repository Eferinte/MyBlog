<template>
  <div class="articlesPart">
    <transition-group name="flip-list" tag="blog-card">
        <blog-card v-for="blog in blogs" :key="blog.blog_id" :title="blog.title" :blogId="blog.blogId">
        </blog-card>
    </transition-group>
  </div>
</template>

<script>
import BlogCard from '../components/BlogCard.vue'
import axios from 'axios'
export default{
    name:"atricle",
    components:{BlogCard},
    methods: {
        intoTag(){
            
        },
        //初始化请求数据
        init(){
            axios.get('http://localhost:8888/all_blogs').then((Response)=>{
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
    unmounted() {
        console.log("被销毁了")
    },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.flip-list-move {
  transition: transform 0.8s ease;
}
.articlesPart{
    margin: auto;
    width: 1200px;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
}
</style>
