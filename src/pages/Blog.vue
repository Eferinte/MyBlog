<template>
  <div class="BlogShell">
        <div class="title">
            {{title}}
        </div>
        <div class="content">
            {{content}}
        </div>
        <div class="tagShell">
            <div class="tag" v-for="tag in tags" :key="tag" @click.stop="intoTag(tag)">
                {{tag}}
            </div>
        </div>
  </div>
</template>

<script>
export default{
    name:"atricle",
    props:["title","author","time","content","tags"],
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
    .BlogShell{
        margin: auto;
        width: 1200px;
        height: 500px;
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
    }
</style>
