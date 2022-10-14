<template>
<div class="iMusicRoot">
    <div class="iMusicHead">
        <div class="back">
            <img class="backIcon" src="../assets/back_android_white.png" alt="">
            <span class="headTitle">我的歌单</span>
        </div>
        <div class="listMsgShell">
            <div class="listCoverShell">
                <div class="coverShadow"></div>
                <div class="listCover">
                    <img class="listCoverImg" src="../assets/ミカヅキの航海.jpg" alt="">
                </div>
            </div>
            <div class="listMsg">
                <div class="listName">我收藏的音乐</div>
                <div class="ownerMsg">
                    <img src="../assets/defaultUser.png" class="ownerIcon">
                    <div class="ownerName">Eferinte</div>
                    <img src="../assets/arrow-right.png" class="goOwnerSpace">
                </div>
            </div>
        </div>
        <div class="listOpsShell">
            <div class="opsCell">
                <div class="opsIcon">
                    <img style="height:100%" src="../assets/upload2.png" alt="">
                </div>
                <div class="opsName">上传</div>
            </div>
            <div class="splitLine"></div>
            <div class="opsCell">
                <div class="opsIcon comment">
                    <img style="height:100%" src="../assets/comment_music.png" alt="">
                </div>
                <div class="opsName">评论</div>
            </div>
            <div class="splitLine"></div>
            <div class="opsCell">
                <div class="opsIcon share">
                    <img style="height:100%" src="../assets/share.png" alt="">
                </div>
                <div class="opsName">分享</div>
            </div>
        </div>
    </div>
    <div class="listOpsShell2">
        <div class="playAll">
            <div class="playAllIcon">
                <img style="height:100%" src="../assets/play_red.png" alt="">
            </div>
            <span class="playAllText">{{'播放全部（'+musicList.length+'）'}}</span>
        </div>
        <div class="elseOps">
            <div class="opsCell download">
                <img style="height:100%" src="../assets/download.png" alt="">
            </div>
            <div class="opsCell multiChoice">
                <img style="height:100%" src="../assets/multi-choice.png" alt="">
            </div>
        </div>
    </div>
    <div class="mainList">
        <div class="musicItem" v-for="(music,index) in musicList" :key="music">
            <div class="numsCell">{{index+1}}</div>
            <div class="musicMsgCell">
                <div class="musicName">{{music.musicName}}</div>
                <div class="musicMsg">{{music.singer+' - '+music.album}}</div>
            </div>
            <div class="musicOpsCell">
                <img style="height:100%" src="../assets/options.png" alt="">
            </div>
        </div>
    </div>
    <div class="myAudio">
        <audio>
            <source src="http://localhost:50001/getMusic">
        </audio>
        <div class="musicIcon iconShell">
            <div class="coverShell">
                <img class="cover" :src="playingMusic.coverUrl" alt="">
            </div>
        </div>
        <div class="musicName">
            <span class="musicNameText">
                {{playingMusic.musicName}}
            </span>
        </div>
        <div class="playIcon iconShell">
            <img class="icon" src="../assets/play-fill.png" alt="">
        </div>
        <div class="listIcon iconShell">
            <img class="icon" src="../assets/play-list.png" alt="">
        </div>
    </div>
</div>  
</template>

<script>
import store from '../main'
export default {
    name: "Music",
    computed: {
        audioUrl() {
            return store.state.preUrl + "/getMusic";
        },
    },
    data() {
        return {
            musicList:[
                {
                    musicName:'平行線 -アニメ「クズの本懐」ED ver.- [期間生産限定盤]',
                    singer:'さユり',
                    album:'平行線',
                    coverUrl:require("../assets/ミカヅキの航海.jpg"),
                    audioUrl:''
                },
                {
                    musicName:'平行線 -アニメ「クズの本懐」ED ver.- [期間生産限定盤]',
                    singer:'さユり',
                    album:'平行線',
                    coverUrl:require("../assets/ミカヅキの航海.jpg"),
                    audioUrl:''
                },
                {
                    musicName:'平行線 -アニメ「クズの本懐」ED ver.- [期間生産限定盤]',
                    singer:'さユり',
                    album:'平行線',
                    coverUrl:require("../assets/ミカヅキの航海.jpg"),
                    audioUrl:''
                },
                {
                    musicName:'平行線 -アニメ「クズの本懐」ED ver.- [期間生産限定盤]',
                    singer:'さユり',
                    album:'平行線',
                    coverUrl:require("../assets/ミカヅキの航海.jpg"),
                    audioUrl:''
                },
                {
                    musicName:'平行線 -アニメ「クズの本懐」ED ver.- [期間生産限定盤]',
                    singer:'さユり',
                    album:'平行線',
                    coverUrl:require("../assets/ミカヅキの航海.jpg"),
                    audioUrl:''
                },
                {
                    musicName:'平行線 -アニメ「クズの本懐」ED ver.- [期間生産限定盤]',
                    singer:'さユり',
                    album:'平行線',
                    coverUrl:require("../assets/ミカヅキの航海.jpg"),
                    audioUrl:''
                },
                {
                    musicName:'平行線 -アニメ「クズの本懐」ED ver.- [期間生産限定盤]',
                    singer:'さユり',
                    album:'平行線',
                    coverUrl:require("../assets/ミカヅキの航海.jpg"),
                    audioUrl:''
                },
                {
                    musicName:'平行線 -アニメ「クズの本懐」ED ver.- [期間生産限定盤]',
                    singer:'さユり',
                    album:'平行線',
                    coverUrl:require("../assets/ミカヅキの航海.jpg"),
                    audioUrl:''
                },
                {
                    musicName:'平行線 -アニメ「クズの本懐」ED ver.- [期間生産限定盤]',
                    singer:'さユり',
                    album:'平行線',
                    coverUrl:require("../assets/ミカヅキの航海.jpg"),
                    audioUrl:''
                },
                {
                    musicName:'平行線 -アニメ「クズの本懐」ED ver.- [期間生産限定盤]',
                    singer:'さユり',
                    album:'平行線',
                    coverUrl:require("../assets/ミカヅキの航海.jpg"),
                    audioUrl:''
                },
            ],
            playingMusic:{
            },
        }
    },
    mounted() {
        this.playingMusic = this.musicList[0]
    },
}
</script>

<style scoped>
    .numsCell{
        text-align: center;
        height: fit-content;
        width: 40px;
        margin: auto 0;
        color: #b9b9b9;
    }
    .musicMsgCell{
        margin: auto 0;
        width: 70%;
    }
    .musicMsgCell .musicName{
        white-space: nowrap;
        overflow: hidden;
        font-size: 18px;
        font-weight: 500;
    }
    .musicMsgCell .musicMsg{
        white-space: nowrap;
        overflow: hidden;
        font-size: 16px;
        color: #b9b9b9;
        padding: 0 10px;
    }
    .musicOpsCell{
        height: 20%;
        width: fit-content;
        margin: auto 5% auto auto;
    }
    .listOpsShell2{
        margin: 40px 0;
        width: 100%;
        height: 40px;
        position: sticky;
        top: 5px;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
    }
    .playAll{
        display: flex;
        flex-direction: row;
    }
    .elseOps{
        display: flex;
        flex-direction: row;
        width: 100px;
        height: 100%;
        margin: auto 20px;
    }
    .playAllIcon{
        height: 80%;
        margin: auto 20px;
    }
    .playAllText{
        font-size: 18px;
        font-weight: 550;
        margin: auto;
    }
    .opsCell.download{
        height: 70%;
    }
    .opsCell.multiChoice{
        height: 50%;
    }
    .mainList{
        width: 100%;
        height: 1000px;
    }
    .musicItem{
        display: flex;
        flex-direction: row;
        width: 100%;
        height: 75px;
    }
    .splitLine{
        margin: auto 2px;
        width: 1px;
        height: 20px;
        background-color: #515151;   
    }
    .opsCell{
        height:40px;
        width: 80px;
        margin: auto 5px;
        display: flex;
        flex-direction: row;
        justify-content: center;
    }
    .opsIcon{
        height:100%;
        margin: auto;
    }
    .opsIcon.comment{
        height: 50%;
    }
    .opsIcon.share{
        height: 40%;
    }
    .opsName{
        font-size: 14px;
        color: #515151;
        margin: auto 0;
        position:relative;
        left: -5px;
    }
    .listOpsShell{
        --width:300px;
        --height:50px;
        position: absolute;
        margin: 0 auto;
        top: calc(100% - (var(--height) / 2));
        left: calc(50% - (var(--width) / 2) );
        height: var(--height);
        width: var(--width);
        background-color: white;
        border-radius: 100px;
        box-shadow: 0 2px 20px 0 rgb(0 0 0 / 20%);
        display: flex;
        flex-direction: row;
        justify-content: center;
    }
    .listMsgShell{
        height: 130px;
        width: 100%;
        position: absolute;
        top: 100px;
        display: flex;
        flex-direction: row;
    }
    .listCoverShell{
        position: relative;
        z-index: 0;
        margin: auto 0 auto calc(1em + 5px);
    }
    .listCover{
        height: 120px;
        width:120px;
        border-radius: 15%;
        overflow: hidden;
        z-index: 0;
    }
    .listCoverImg{
        height: 100%;
    }
    .coverShadow{
        position: absolute;
        height: 80%;
        width: 85%;
        top: -6%;
        left: 7.5%;
        background-color: #9b7486;
        border-radius: 15%;
        z-index: -1;
    }
    .listMsg{
        margin: auto 15px;
        height: 120px;
        width:120px;
        display: flex;
        flex-direction: column;
        justify-content: center;
    }
    .listName{
        font-size: 16px;
        letter-spacing: 2px;
        color: white;
        padding: 0 5px;
    }
    .ownerMsg{
        height: 70%;
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: left;
    }
    .ownerIcon{
        height: 30px;
        width: 30px;
        border-radius: 100%;
        margin: auto 5px;
    }
    .ownerName{
        font-size: 12px;
        color: #a79da3;
        margin: auto 2px;
    }
    .goOwnerSpace{
        margin: auto 0px;
        height: 15px;
    }
    .back{
        position: fixed;
        left: 1em;
        top: 1.5em;
        font-size: 18px;
        letter-spacing: 2px;
        color: white;
        height: 1.8em;
        width:10em;
        display: flex;
    }
    .headTitle{
        display: block;
        height: fit-content;
        margin: auto 5px;
    }
    .backIcon{
        height: 100%;
    }
    .coverShell{
        border-radius: 100%;
        overflow: hidden;
        height: 60%;
        width: 60%;
        outline: solid 10px black;
        position: relative;
        left: 40%;
    }
    .cover{
        width: 100%;
        height: 100%;
    }
    .iconShell{
        display: flex;   
    }
    .icon{
        height: 50%;
        margin: auto 0;   
        position: relative;
        top: -10%;
    }
    .iMusicHead{
        height: 280px;
        background: linear-gradient(to bottom right, #9c627c, #5d686e);
        width: 100%; 
        border-radius: 0 0 600% 600% / 0 0 35% 35%;
        position: relative;
    }
    .myAudio{
        --icon-size:75px;
        --icon-width:40px;
        position: fixed;
        bottom: 0;
        width: 100%;
        height: var(--icon-size);
        border-radius: 0;
        border: solid #cdcdcd;
        border-width: 1px 0 0 0 ;
        background-color: #fefefe;
        display: flex;
        flex-direction: row;
        justify-content:space-between;
        box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
    }
    .musicIcon{
        margin: auto;
        width: var(--icon-size);
        height: var(--icon-size);
        background-color: white;
    }
    .musicName{
        margin: auto;
        width: calc(100% - (3 * var(--icon-size)));
        height: var(--icon-size);
        background-color: white;
        display: flex;
    }
    .musicNameText{
        margin: auto 20px;
        font-size: 18px;
        white-space: nowrap;
        overflow: hidden;
        position: relative;
        top: -8px;
    }
    .playIcon{
        margin: auto;
        width: var(--icon-width);
        height: var(--icon-size);
        background-color: white;
    }
    .listIcon{
        margin: auto 10px auto auto;
        width: var(--icon-width);
        height: var(--icon-size);
        background-color: white;
    }
</style>