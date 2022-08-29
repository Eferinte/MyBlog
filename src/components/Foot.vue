<template>
<div class="shell">
    <div class="centerText">
        <a href="https://beian.miit.gov.cn">浙ICP备2022024722号-1</a>
    </div>
</div>  
</template>

<script>
export default {
    name:"Foot",
}
</script>

<style scoped>
    .shell{
        height: 75px;
        width: 100%;
        display: flex;
        z-index: 2;
        background-color: #fafafa;
    }
    .centerText{
        margin: auto;
    }
    a{
        color:#aaaaaa;
        text-decoration: none;
    }
</style>