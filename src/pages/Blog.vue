<template>
  <div class="BlogShell">
        <div class="title">
            {{title}}
        </div>
        <div class="context">
            <v-md-preview :text="context"></v-md-preview>
        </div>
        <div class="tagShell">
            <div class="tag" v-for="tag in tags" :key="tag" @click.stop="intoTag(tag)">
                {{tag}}
            </div>
        </div>
  </div>
</template>

<script>
import axios from 'axios'
export default{
    name:"atricle",
    methods: {
        //初始化请求数据
        init(){
            let blogId =  this.$route.params.blogId
            console.log(this.$route.params)
            axios.get('http://localhost:8888/blog',{params:{
                blogId:blogId
            }}).then((Response)=>{
                this.data = Response.data;
                console.log(Response);
            });
        }
    },
    created(){
        this.init()
    },
    data() {
        return {
            data:{},
        }
    },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .BlogShell{
        margin: auto;
        width: 1200px;
        height: 500px;
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
    }
</style>
