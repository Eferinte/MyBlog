<template>
    <div id="shell">
        <div id="title">
            <div id="title1">Eferinte</div>
            <img id="bird" src="../assets/birdNichicho.png"/>
            <div id="title2">の</div>
            <div id="title3">博客</div>
            <div id="blank"></div>
        </div>
    </div>
</template>

<script>
export default {
    name:"Head",
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
    border-radius: 10px;
}
#bird{
    position:absolute;
    top:-40px;
    left:150px;
    transform:scale(90%);
    z-index:-3;
}
#title{
    margin-top: 40px;
    left: 500px;
    height:150px;
    width:272px;
    /* background-color:#c1c1c1; */
    position:relative;
    z-index:-2;
}
#blank{
    top:20px;
    left:-40px;
    height:100px;
    width:330px;
    border-style:soild;
    border-width:3px;
    background-color:#c1c1c1;
    border-color:#c1c1c1;
    position:absolute;
    display:inline-block;
    /* opacity:0.5; */
    z-index:-4;
    transform:perspective(100px) rotateX(20deg);
    box-shadow:10px 10px 50px #888888;
}
#title1{
    top:0;
    left:0;
    font-size:50px;
    display:inline-block;
    position:absolute;
    z-index:-2;
}
#title2{
    font-family:MS Mincho;
    top:-10px;
    left:170px;
    font-size:100px;
    display:inline-block;
    position:absolute;
    z-index:-2;
}
#title3{
    font-weight:regular;
    top:60px;
    left:68px;
    font-size:50px;
    display:inline-block;
    position:absolute;
    z-index:-2;
}
</style>