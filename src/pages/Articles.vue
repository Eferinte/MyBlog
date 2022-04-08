<template>
  <div class="articlesPart">
        <blog-card v-for="article in articles" :key="article.aid" :title="article.title" :brief="article.brief" :TAGS="article.tags">
        </blog-card>
  </div>
</template>

<script>
import BlogCard from '../components/BlogCard.vue'
export default{
    name:"atricle",
    components:{BlogCard},
    methods: {
        intoTag(){
            
        }
    },
    created(){

    },
    data() {
        return {
            articles:[
                {
                    title:"test-title",
                    brief:"test-brief",
                    aid:"001",
                    tags:["tag1","tag2","tag3"]
                },
                {
                    title:"test-title",
                    brief:"test-brief",
                    aid:"002",
                    tags:["tag1","tag2","tag3"]
                },
                {
                    title:"test-title",
                    brief:"test-brief",
                    aid:"003",
                    tags:["tag1","tag2","tag3"]
                },
                {
                    title:"test-title",
                    brief:"test-brief",
                    aid:"004",
                    tags:["tag1","tag2","tag3"]
                },
                {
                    title:"test-title",
                    brief:"test-brief",
                    aid:"005",
                    tags:["tag1","tag2","tag3"]
                },
                {
                    title:"test-title",
                    brief:"test-brief",
                    aid:"006",
                    tags:["tag1","tag2","tag3"]
                },
                {
                    title:"test-title",
                    brief:"test-brief",
                    aid:"007",
                    tags:["tag1","tag2","tag3"]
                },
                {
                    title:"test-title",
                    brief:"test-brief",
                    aid:"008",
                    tags:["tag1","tag2","tag3"]
                },
                {
                    title:"test-title",
                    brief:"test-brief",
                    aid:"009",
                    tags:["tag1","tag2","tag3"]
                },
                {
                    title:"test-title",
                    brief:"test-brief",
                    aid:"010",
                    tags:["tag1","tag2","tag3"]
                },
            ]
        }
    },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.articlesPart{
    margin: auto;
    width: 1200px;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
}
</style>
