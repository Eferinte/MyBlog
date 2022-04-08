<template>
  <div class="articleShell">
        <div class="title">
            {{title}}
        </div>
        <div class="content">
            {{content}}
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
    name:"atricle",
    props:["title","brief","author","time","content","TAGS"],
    methods: {
        intoTag(){
            
        }
    },
    created(){
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
