<template>
    <div id="shell">
        <div id="title">
            <div id="title1">Eferinte</div>
            <div id="title2">の</div>
            <div id="title3">博客</div>
            <div id="line"></div>
        </div>
    </div>
</template>

<script>
export default {
    name:"Head2",
}
</script>

<style scoped>
#shell{
    width:100%;
    height:50%;
    left:0;
    /* background-color:rgb(208, 231, 251); */
    user-select:none;
    text-align:center;
    z-index:-4;
}
#title{
    margin-top: 40px;
    left: 500px;
    height:150px;
    width:400px;
    /* background-color:#c1c1c1; */
    position:relative;
    z-index:-2;
    text-shadow: 0 0 5px #000000, 0 0 5px #ffffff;
    color: #000000;
}
#title1{
    top:0;
    left:0;
    font-size:50px;
    display:inline-block;
    position:absolute;
    z-index:-2;
    text-shadow: 0 0 5px #000000, 0 0 5px #000000;
    color: #ffffff;
}
#title2{
    font-family:MS Mincho;
    top:20px;
    left:190px;
    font-size:30px;
    display:inline-block;
    position:absolute;
    z-index:-2;
}
#title3{
    font-weight:regular;
    top:50px;
    left:200px;
    font-size:50px;
    display:inline-block;
    position:absolute;
    z-index:-2;
    text-shadow: 0 0 5px #ffffff, 0 0 5px #000000;
    color: #000000;
}
</style>