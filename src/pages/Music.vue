<template>
<div class="iMusicRoot">
    <div class="iMusicHead" id="musicHead">
        <div class="back">
            <div class="backIcon">
                <img @click="goBack" style="height:100%" src="../assets/back_android_white.png" alt="">
            </div>
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
                <div class="ownerMsg" @click="goUserSpace">
                    <img src="../assets/defaultUser.png" class="ownerIcon">
                    <div class="ownerName">Eferinte</div>
                    <img src="../assets/arrow-right.png" class="goOwnerSpace">
                </div>
            </div>
        </div>
        <div class="listOpsShell">
            <div class="opsCell" @click="upload">
                <div class="opsIcon">
                    <img style="height:100%" src="../assets/upload2.png" alt="">
                </div>
                <div class="opsName">上传</div>
                <!-- 隐式input -->
                <input type="file" id="fileElem" accept="audio/*" style="display:none" @change="upLoadHandle($event)">
            </div>
            <div class="splitLine"></div>
            <div class="opsCell" @click="comment">
                <div class="opsIcon comment">
                    <img style="height:100%" src="../assets/comment_music.png" alt="">
                </div>
                <div class="opsName">评论</div>
            </div>
            <div class="splitLine"></div>
            <div class="opsCell" @click="share">
                <div class="opsIcon share">
                    <img style="height:100%" src="../assets/share.png" alt="">
                </div>
                <div class="opsName">分享</div>
            </div>
        </div>
    </div>
    <div class="listOpsShell2">
        <div class="playAll" @click="playAll">
            <div class="playAllIcon">
                <img style="height:100%" src="../assets/play_red.png" alt="">
            </div>
            <span class="playAllText">{{'播放全部（'+musicList.length+'）'}}</span>
        </div>
        <div class="elseOps">
            <div class="opsCell download" @click="downloadAll">
                <img style="height:100%" src="../assets/download.png" alt="">
            </div>
            <div class="opsCell multiChoice" @click="mutliChoice">
                <img style="height:100%" src="../assets/multi-choice.png" alt="">
            </div>
        </div>
    </div>
    <div class="mainList">
        <div class="musicItem" v-for="(music,index) in musicList" :key="music" @click="play(music)">
            <div class="numsCell">{{index+1}}</div>
            <div class="musicMsgCell">
                <div class="musicName">{{music.musicName}}</div>
                <div class="musicMsg">{{music.musicSinger+' - '+music.musicAlbum}}</div>
            </div>
            <div class="musicOpsCell" @click.stop='itemOps(music)'>
                <img style="height:100%" src="../assets/options.png" alt="">
            </div>
        </div>
    </div>
    <div class="myAudio">
        <audio id="player" :src="musicSrc">
        </audio>
        <div class="musicIcon iconShell">
            <div class="coverShell">
                <img id="coverImg" class="cover" src="../assets/ミカヅキの航海.jpg" alt="">
            </div>
        </div>
        <div class="musicName">
            <span class="musicNameText">
                {{playingMusic.musicName?playingMusic.musicName:"?"}}
            </span>
        </div>
        <div class="playIcon iconShell" @click="toggle(false)">
            <img class="icon" :src="playIcon" alt="">
        </div>
        <div class="listIcon iconShell">
            <img class="icon" src="../assets/play-list.png" alt="">
        </div>
    </div>
</div>  
</template>

<script>
import store from '../main'
import router from '../router'
import playIcon from '../assets/play-fill.png'
import pauseIcon from '../assets/pause-fill.png'
export default {
    name: "Music",
    computed: {
        audioUrl() {
            return store.state.preUrl + "/getMusic";
        },
    },
    methods: {
        //获取对应uid的歌单
        getMusicList(uid){
            let xhr = new XMLHttpRequest();
            xhr.open('GET', `${store.state.preUrl}/getMusicList?uid=${uid?uid:'00000002'}`, true);
            xhr.send(null);
            xhr.addEventListener('load', ()=>{
                if(xhr.readyState == 4){
                    let data = JSON.parse(xhr.response)
                    this.musicList = []
                    data.forEach(music=>{
                        this.musicList.push({
                            musicUrl:store.state.preUrl+'/getMusic?path=./Music/'+music['owner_id']+'/'+encodeURIComponent(music['music_name']),
                            musicName:music['music_name'],
                            musicSinger:music['music_singer'],
                            listOrder:music['list_order'],
                            musicLength:music['music_length'],
                            musicAlbum:music['music_album']
                        })
                    })
                    console.log(data);
                    //默认载入第一首播放
                    this.playingMusic = this.musicList[0]
                    this.player.src = this.playingMusic.musicUrl
                }
            });
        },
        goBack(){
            router.push('/');
        },
        goUserSpace(){

        },
        //将点击事件传递给隐式input
        upload(){
            if(store.state.token&&store.state.uid){
                store.commit('setHintText','上传');
                let fileElem = document.getElementById("fileElem");
                fileElem.click();
            }else{
                store.commit('setHintText','请先登录');
            }
        },
        upLoadHandle(event){
            console.log(event.target.files);
            let file = event.target.files[0];
            
            if(file){
                let url = URL.createObjectURL(file);//获取录音时长
                let audioElement = new Audio(url);//audio也可获取视频的时长
                audioElement.addEventListener("loadedmetadata", ()=>{
                    let duration = String(audioElement.duration);
                    let xhr = new XMLHttpRequest();
                    xhr.open("POST", "http://localhost:50001/uploadMusic");
                    xhr.setRequestHeader('musicname',encodeURIComponent(file.name));
                    xhr.setRequestHeader('listorder',this.musicList.length+1);
                    xhr.setRequestHeader('musiclength',duration);
                    xhr.setRequestHeader('token',store.state.token);
                    xhr.setRequestHeader('uid',store.state.uid);
                    xhr.setRequestHeader("Content-Type","multipart/form-data;")  
                    xhr.send(file)
                    //更新本地
                    xhr.addEventListener('load', ()=>{
                        if(xhr.readyState == 4){
                            console.log('[log]',xhr.response);
                            this.getMusicList()
                        }
                    });
                });
            }
        },
        comment(){
            store.commit('setHintText','评论');
        },
        share(){
            store.commit('setHintText','分享');
        },
        playAll(){
            store.commit('setHintText','播放全部');
        },
        downloadAll(){
            store.commit('setHintText','下载全部');
        },
        mutliChoice(){
            store.commit('setHintText','复选');
        },
        toggle(justPlay){
            //切换播放状态
            this.playState = !this.playState;
            if(justPlay){
                this.playState = true;
            }
            if(this.playState){//开始播放
                this.player.play();
                this.playIcon = pauseIcon;

                //开始动画
                this.coverImg.style.setProperty('animation-play-state','running');

            }else{//暂停播放
                this.player.pause();
                this.playIcon = playIcon;

                //暂停动画
                this.coverImg.style.setProperty('animation-play-state','paused');
            }
        },
        play(music){
            console.log(music.musicUrl);
            this.player.src = music.musicUrl
            this.playingMusic = music;
            this.toggle(true);
        },
        itemOps(music){
            store.commit('setHintText','操作单曲');
        }
    },
    data() {
        return {
            player:undefined,
            coverImg:undefined,
            playIcon:playIcon,
            playState:false,
            musciSrc:undefined,
            musicList:[],
            playingMusic:{
            },
        }
    },
    created() {
        // 获取歌单
        this.getMusicList(store.state.uid);
    },
    mounted() {
        //加载结点
        this.player = document.getElementById('player');
        this.coverImg = document.getElementById('coverImg');

        //监听页头可见百分比，实时修改透明度
        let el = document.getElementById('musicHead');
        let backEl = document.getElementsByClassName('back')[0];
        let myThreshold = [0], n =100;
        for(let i=n;i>0;i--){
            myThreshold.push(1/i);
        }
        let ob = new IntersectionObserver(entries=>{
            console.log(entries[0].intersectionRatio);
            backEl.style.setProperty('background-color',`rgba(137, 100, 120, ${1 - entries[0].intersectionRatio})`);
        },{
            threshold: myThreshold
        });
        ob.observe(el)
    },
}
</script>

<style scoped>
@keyframes sping {
    from {transform:rotate(0deg);} to {transform: rotate(360deg);}
}
    .numsCell{
        text-align: center;
        height: fit-content;
        width: 60px;
        margin: auto 0;
        color: #b9b9b9;
    }
    .musicMsgCell{
        margin: auto 0;
        width: calc(100% - 60px - 10%);
    }
    .musicMsgCell .musicName{
        white-space: nowrap;
        overflow: hidden;
        font-size: 18px;
        font-weight: 500;
        background-color: transparent;
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
        margin: auto 5% auto 5%;
        border-radius: 100%;
    }
    .listOpsShell2{
        margin: 40px 0;
        width: 100%;
        height: 40px;
        position: sticky;
        top: 60px;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        background-color: white;
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
    .playAllIcon:hover{
        cursor: pointer;
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
        height: fit-content;
    }
    .musicItem{
        display: flex;
        flex-direction: row;
        width: 100%;
        height: 75px;
        transition: 0.25s;
    }
    .musicItem:hover{
        background-color: #e7e6e6;
        cursor: pointer;
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
    .opsCell:hover{
        cursor: pointer;
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
    .ownerMsg:hover{
        cursor: pointer;
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
        left: 0;
        padding-left: 1em;
        top: 0;
        font-size: 18px;
        letter-spacing: 2px;
        color: white;
        height: 60px;
        width:100%;
        display: flex;
        z-index: 10;
        align-items: flex-end;
        background-color: transparent;
        /* transition: 0.25s; */
    }
    .headTitle{
        display: block;
        height: fit-content;
        margin: 14px 5px;
    }
    .backIcon{
        height:1.8em;
        margin: 10px 0;
    }
    .backIcon:hover{
        cursor: pointer;
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
        transition: 1s;
        animation: 36s linear infinite sping;
        animation-play-state: paused; 
    }
    .iconShell{
        display: flex;   
        position: relative;
    }
    .icon{
        height: 30px;
        margin: auto;   
        position: relative;
        top: -10px;
    }
    .playIcon .icon{
        height: 25px;
    }
    .icon:hover{
        cursor: pointer;
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
        margin: auto 3% auto auto;
        width: var(--icon-width);
        height: var(--icon-size);
        background-color: white;
    }
</style>