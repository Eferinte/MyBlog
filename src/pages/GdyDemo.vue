<template>
  <div class="page-shell">
    <!-- 素材序列 -->
    <div class="file-list-shell">
        <!-- 隐式input -->
        <input type="file" id="fileElem" accept="video/*,image/*" style="display:none" @change="upLoadHandle($event)" multiple>
        <div class="empty-back" v-show="clips.length==0" @click="upload">
        </div>
        <div class="clips-list-shell" >
            <div  class="clip-cell" draggable="true"  v-for="(clip,index) in clips" :key="clip" @dragstart="setDragImg($event,index)">
                <img draggable="false" :src="covers.get(clip)" style="margin:auto;height: 80px;" alt="">
                <div  v-if="clip.ifloading">
                
                </div>
                <div style="text-align:center;height:20px;width:200px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">
                    {{clip.name}}
                </div>
                <div style="text-align:center;height:20px;width:200px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">
                    <!-- {{videoDuration.get(clip)}} -->
                    {{clip.videoDuration}}
                    <!-- {{clip.clipLength}} -->
                </div>
                <!-- 操作部分 -->
                <div class="ops"></div>
            </div>
        </div>
        <div class="upload-btn-shell"  v-show="clips.length!=0">
            <div class="opsCell" @click="upload">
                <div class="loadingMask upLoading" v-show="ifUpLoading">
                    <div class="loadingBox">
                        <div class="loader"></div>
                        <div class="halfCricle"></div>
                    </div>
                </div>
                <div class="opsIcon">
                    <img style="height:100%" src="../assets/upload2.png" alt="">
                </div>
                <div class="opsName">上传</div>
            </div>
            <span style="padding-top:13px;padding-left:10px;font-size:8px;text-align: end;">支持图片、视频上传，双击标尺小球可以进行剪切</span>
        </div>
    </div>
    <!-- 剪辑序列 -->
    <div class="clips-sequence-shell" @mousemove="mousemove" @mouseup="endMove">
        <div class="clips-sequence" :style="{width:sequenceLength+'px'}" @drop="dropEnd" @dragover="dragOver">
            <div id="pointer">
                <div id="pointer-head" @mousedown="beginMove" @dblclick="cut" ></div>
            </div>
            <div class="time-line-shell">
                <canvas id="time-line" :width="sequenceLength" height="20"></canvas>
            </div>
            <transition-group name="list" tag="div" style="position: relative;">
                <div class="sClip-cell"  :style="{width:sClip.clipLength+'px',opacity:sClip.ifPre?0.5:1}" draggable="true" v-for="(sClip,index) in sequenceClips" :key="sClip" @dragstart="setDragData($event,index)">
                    <img draggable='false' style="height:100%" :src='covers.get(clips[sClip.clipIndex])'>
                </div>
            </transition-group>
        </div>
    </div>
    <!-- 垃圾桶 -->
    <div class="trash-bin" @drop="delClip" @dragover="delOver">
        <img style="height:50%;opacity:0.5;margin: auto;" src="../assets/delete.png" alt="">
    </div>
  </div>
</template>


<script>

import getOffset from '../utils/getOffset';
import swap from '../utils/swap';
import ifArrOver from '../utils/ifArrOver';
import card1 from '../../public/assert/card1.jpg';
export default {
    name:'GdyDemo',
    data(){
        return{
            clips:new Array(),//导入的片段数组,
            covers:undefined,//获取的封面
            videoDuration:undefined,
            ifUpLoading:false,
            sequenceClips:[],//导入剪辑序列的片段数组
            sequenceLength:1000,
            clipLengthFactor:10,//clip长度系数
            preClipPosition:undefined,
            curDragClipIndex:undefined,
            ifMoving:false,
            clipSequence:undefined,//剪辑序列的dom结点
            pointer:undefined//pointer的dom结点
        }
    },
    created(){
        this.covers = new Map(); 
        this.videoDuration = new Map(); 
        //添加全局拖拽结束事件
        document.addEventListener('dragend',()=>{
            if(this.curDragClipIndex!=undefined){
                let index = this.curDragClipIndex;
                if(index[0]=='s'){
                    index = Number(index.slice(1));
                    // debugger
                    if(!ifArrOver(this.sequenceClips,index)){
                        let ans = Object.prototype.hasOwnProperty.call(this.sequenceClips[index], 'ifPre')
                        if(ans){
                            this.sequenceClips[this.preClipPosition].ifPre=false;
                        }
                    }
                }
                this.curDragClipIndex=undefined;
                this.preClipPosition=undefined;
            }
        })
        //添加预设图片
        let card = {
            name:'电子界到临者@火灵天星',
            clipLength : 100,
            videoDuration : '00:10',
            ifPre : false
        }
        this.clips.push(card);
        this.covers.set(card,card1);
    },
    mounted() {
        this.timeLineRender();
        this.pointer = document.getElementById('pointer');
        this.clipSequence = document.getElementsByClassName('clips-sequence')[0];
    },
    updated() {
        
    },
    watch:{
        // sequenceClips: {
        //     handler(newValue, oldValue) {
        //         // 注意：在嵌套的变更中，
        //         // 只要没有替换对象本身，
        //         // 那么这里的 `newValue` 和 `oldValue` 相同
        //         console.log(newValue);
        //     },
        //     deep: true
        // },
        'sequenceClips.length'(newValue,oldValue){
            this.sequenceLength=200;
            this.sequenceClips.forEach(clip=>{
                // debugger
                this.sequenceLength+=clip.clipLength;
            })
            this.sequenceLength=Math.max(this.sequenceLength,1000);
            //序列长度变化时重新渲染时间轴
            this.timeLineRender();
        }
    },
    methods: {
        //裁剪视频
        cut(){
            //获取当前pointer所在sClip
            let sClip,index=-1;
            let pointerPoistion = Number(this.pointer.style.left.slice(0,this.pointer.style.left.length-2));
            let base = 0;
            for(let i=0;i<this.sequenceClips.length;i++){
                sClip = this.sequenceClips[i];
                if(pointerPoistion<base+sClip.clipLength){
                    index = i;
                    break;
                }else{
                    base+=sClip.clipLength
                }
            }
            if(index!=-1){
                //根据pointer位置将sClip拆分为两半；
                let {...left} = sClip;
                let {...right} = sClip;
                left.clipLength = pointerPoistion - base;
                right.clipLength = sClip.clipLength - left.clipLength;
                console.log('sClipLength=',sClip.clipLength,' pointerPosition = ',pointerPoistion,' letfLength = ',left.clipLength,'rightLength = ',right.clipLength);
                left.videoDuration = this.timeTrans(left.clipLength);
                right.videoDuration = this.timeTrans(right.clipLength);
                this.sequenceClips.splice(index,1,left,right);
                this.timeLineRender();
                // debugger

                //动画处理
                let pointerHead = document.getElementById('pointer-head');
                pointerHead.style.setProperty('background-color','red');
                setTimeout(() => {
                    pointerHead.style.setProperty('transition','1s');
                    pointerHead.style.setProperty('background-color','olivedrab');
                    setTimeout(() => {
                        pointerHead.style.setProperty('transition','0s');
                    }, 1000);
                }, 0);
            }
        },
        //
        beginMove(ev){
            this.ifMoving = true;
        },
        //处理移动
        mousemove(ev){
            if(this.ifMoving){
                let offset = getOffset(this.clipSequence,ev);
                this.pointer.style.setProperty('left',offset.offsetX+'px')
            }
        },
        //
        endMove(ev){
            this.ifMoving = false;
        },
        //使用渲染时间轴
        timeLineRender(){
            //将canvas渲染置于微任务队列中
            window.requestAnimationFrame(() => {
                let canvas = document.getElementById('time-line');
                let ctx = canvas.getContext('2d');
                // 清空画布
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.beginPath();
                ctx.font = '10px, serif';
                for(let i=0;i<this.sequenceLength;i+=this.clipLengthFactor){
                    //判断刻线长度
                    let lineLength = 5;
                    if(i%600==0){
                        lineLength = 15;
                        ctx.fillText(String(i/10),i,20);
                    }else if(i%300==0){
                        lineLength = 10;
                        ctx.fillText(String(i/10),i,20);
                    }
                    //绘画
                    ctx.moveTo(i,0);
                    ctx.lineTo(i,lineLength);
                }
                console.log('draw');
                ctx.stroke();
            });
        },
        //获取插入位置
        //pre=0,
        getClipPosition(offsetX){
            let baseX = 0;
            let clipPosition = 0;
            for(;clipPosition<this.sequenceClips.length;clipPosition++){
                if(offsetX<(baseX+(this.sequenceClips[clipPosition].clipLength/2))){
                    break;
                }else{
                    baseX+=this.sequenceClips[clipPosition].clipLength;
                }
                // console.log('clipPosition=',clipPosition);
            }
            // clipPosition=Math.min(clipPosition,this.sequenceClips.length-1)
            //插入位置为预览块的后一块时
            if(this.sequenceClips[clipPosition-1]&&this.sequenceClips[clipPosition-1].ifPre==true){
                clipPosition--;
            }
            // debugger
            return Math.max(clipPosition,0);
        },
        //设置拖拽数据
        setDragData($event,index){
            if(!this.ifMoving){
                this.curDragClipIndex = 's'+index
                //降级为预览块
                this.preClipPosition = index;
                this.sequenceClips[index].ifPre=true;
                // let dt = $event.dataTransfer;
                // dt.setData('text/plain', 's'+index);
            }
        },
        //删除clip
        delClip(ev){
            ev.dataTransfer.dropEffect = "all";
            //获取拖拽对象数据
            let index = this.curDragClipIndex;
            let inSequence;
            console.log(index);
            if(index[0]=='s'){
                inSequence = true;
                index = Number(index.slice(1));
            }else{
                inSequence = false;
                index = Number(index);
            }
            if(inSequence){
                console.log('in S');
                this.sequenceClips.splice(index,1)
            }else{
                console.log('not in S');
                //查看序列中有无引用
                if(this.sequenceClips.findIndex(item=>{return item.clipIndex==index})==-1){
                    this.clips.splice(index,1);
                }else{
                    //提示是否删除
                    if(confirm('序列中已使用改素材，该操作会修改剪辑序列，是否仍要删除？')){
                        //删除序列中所引用的clip
                        let sIndex = this.sequenceClips.findIndex(item=>{return item.clipIndex==index});
                        while(sIndex!=-1){
                            this.sequenceClips.splice(sIndex,1);
                            sIndex = this.sequenceClips.findIndex(item=>{return item.clipIndex==index});
                        }
                        //删除素材clip
                        this.clips.splice(index,1);
                    }
                }
            }
        },
        delOver(ev){
            ev.preventDefault();
        },
        //设置拖拽图像,同时间轴中的结点
        setDragImg($event,index){
            // let clipLength = this.timeTrans(this.videoDuration.get(clip),true)
            // let canvas = document.createElementNS("http://www.w3.org/1999/xhtml","canvas");
            // let cover = document.createElement('img');
            // cover.src=this.covers.get(clip);
            // cover.style.height = '100px';
            // canvas.width = clipLength;
            // canvas.height = 200;

            // let ctx = canvas.getContext("2d");
            // ctx.drawImage(cover,0,0);

            // $event.srcElement.appendChild(canvas);

            let dt = $event.dataTransfer;
            // dt.setData('text/plain', String(index));
            this.curDragClipIndex = index;
            dt.setDragImage($event.srcElement.firstChild, 10, 10);
        },
        //seconds与标准时间转换
        timeTrans(timeData,reverse = false){
            if(!reverse){
                let minute = Math.floor(timeData/60);
                let second =  Math.floor(timeData%60);
                return String(minute).padStart(2,'0')+':'+String(second).padStart(2,'0');
            }else{
                let str = timeData.split(':');
                console.log(str);
                let seconds = 0;
                for(let i=str.length-1;i>0;i--){
                    // while(str[i][0]=='0'){
                    //     str[i]=str[i].slice(1);
                    //     console.log(str[i]);
                    // }                    
                    console.log(Number(str[i]));
                    seconds+=Number(str[i]) * (60 ** i);
                }
                return seconds
            }
        },
        //预览块生成
        dragOver(ev) {
            ev.preventDefault();
            ev.dataTransfer.dropEffect = "move";
            if(!this.ifMoving){
                //获取拖拽数据
                let inSequence;
                let index = this.curDragClipIndex;
                if(index[0]=='s'){
                    inSequence = true;
                    index = Number(index.slice(1));
                }else{
                    inSequence = false;
                    index = Number(index);
                }
                //获取序列轴元素
                let sequence = document.getElementsByClassName('clips-sequence')[0];
                //获取相对位置
                let offset = getOffset(sequence,ev);
                let clipPosition = this.getClipPosition(offset.offsetX);
                //添加预览块
                if(this.preClipPosition!=clipPosition){
                    //删除上次生成的pre
                    if(inSequence){//序列中移动
                        if(this.preClipPosition<clipPosition){
                            clipPosition--;
                        }
                        swap(this.sequenceClips,this.preClipPosition,clipPosition)
                    }else{//序列外添加
                        //新建预览块
                        if(this.preClipPosition==undefined){
                            //添加sClip
                            let {...sClip} = this.clips[index];
                            sClip.ifPre = true;
                            sClip.clipIndex = index;
                            this.sequenceClips.splice(clipPosition,0,sClip);
                        }else{//移动预览块
                            // debugger
                            if(this.preClipPosition<clipPosition){
                                clipPosition--;
                            }
                            swap(this.sequenceClips,this.preClipPosition,clipPosition)
                        }
                    }
                    this.preClipPosition = clipPosition;
                }
            }
        },
        //放置函数
        dropEnd(ev) {
            ev.preventDefault();
            if(!this.ifMoving){
                //将预览块升级为sClip块
                this.sequenceClips[this.preClipPosition].ifPre = false;
                //ifPre变化未触发动态style，手动修改透明度
                document.getElementsByClassName('sClip-cell')[this.preClipPosition].style.opacity=1;
                //重置预览块
                this.curDragClipIndex=undefined
                this.preClipPosition=undefined;
            }
            // debugger
            // //获取序列轴元素
            // let sequence = document.getElementsByClassName('clips-sequence')[0];
            // //获取拖拽对象数据
            // let inSequence;
            // let index = ev.dataTransfer.getData("text/plain");
            // if(index[0]=='s'){
            //     inSequence = true;
            //     index = Number(index.slice(1));
            // }else{
            //     inSequence = false;
            //     index = Number(index);
            // }
            // //获取相对位置
            // let offset = getOffset(sequence,ev);
            // let clipPosition = this.getClipPosition(offset.offsetX);
            // //添加clip块
            // if(inSequence){//序列中移动
            //     let clip = this.sequenceClips[index];
            //     this.sequenceClips.splice(index,1);
            //     this.sequenceClips.splice(clipPosition,0,clip);
            // }else{//序列外添加
            //     //添加sClip
            //     let clip = this.clips[index];
            //     this.sequenceClips.splice(clipPosition,0,clip);
            // }
        },
        //获取视频首帧图片
        getClipCover(file){
            //隐式video元素
            let videoElem = document.createElement('video');
            videoElem.preload = true;
            videoElem.muted = true;
            videoElem.autoplay = true;
            let imgUrl;
            //加载数据后使用canvas捕获第一帧图片，并将其添加到cover属性上
            let canvas = document.createElement('canvas');
            //画布绘制原点
            let basePointX=0, basePointY=0, timePtr=0;
            let ctx = canvas.getContext('2d');
            //加载完元数据后获取视频长度
            let promise = new Promise((resolve,reject)=>{
                videoElem.onloadedmetadata=()=>{
                    let scale = Math.min(80/videoElem.videoHeight, 200/videoElem.videoWidth)
                    this.videoDuration.set(file,this.timeTrans(videoElem.duration));
                    file.clipLength = this.clipLengthFactor*videoElem.duration;
                    file.videoDuration = this.timeTrans(videoElem.duration);
                    file.ifPre = false;
                    // let videoLength = Math.floor(videoElem.duration);
                    // let screenShotStep = 10;
                    
                    canvas.width =  videoElem.videoWidth*scale;
                    canvas.height =  videoElem.videoHeight*scale;
                    videoElem.currentTime = 0;
                    
                    //截取首帧
                    videoElem.onloadeddata=()=>{
                        console.log('timeupdate');
                        ctx.drawImage(videoElem,basePointX,basePointY,canvas.width,canvas.height);
                        ctx.drawImage(videoElem,basePointX,basePointY,canvas.width,canvas.height);
                        console.log(videoElem.currentTime);

                        resolve();
                    }

                }
            })
            promise.then(()=>{
                imgUrl = canvas.toDataURL('image/jpeg');
                this.covers.set(file,imgUrl);
                console.log('加载完毕');
            })
            //加载视频到隐式video
            videoElem.src = window.URL.createObjectURL(file); 
        },
        //导入图片素材
        getClipCoverImg(file){
            //添加默认值
            file.clipLength = 100;
            file.videoDuration = '00:10';
            file.ifPre = false;
            let imgUrl = window.URL.createObjectURL(file);
            this.covers.set(file,imgUrl);
        },
        //将点击事件传递给隐式input
        upload(){
            if(this.ifUpLoading) return
            let fileElem = document.getElementById("fileElem");
            fileElem.click();
        },
        //当素材片段列表变化时
        upLoadHandle(){
            let index = this.clips.length;
            let fileElem = document.getElementById("fileElem");
            this.clips.push(...fileElem.files);
            for(let i=index;i<this.clips.length;i++){
                console.log(this.clips[i]);
                if(this.clips[i].type.slice(0,5)=='image'){
                    this.getClipCoverImg(this.clips[i]);
                }else{
                    this.getClipCover(this.clips[i]);
                }
            }
            console.log('value=',fileElem.value);
            fileElem.value=''
        }
    },
}
</script>

<style scoped>
#pointer{
    width: 3px;
    position: absolute;
    height: 100%;
    left: 10px;
    top: 0;
    background-color: olivedrab;
    z-index: 5;
}
#pointer-head{
    position: relative;
    left: -10px;
    top: -15px;
    width: 20px;
    height: 20px;
    background-color: olivedrab;
    border: solid 1px black;
    border-radius: 100%;
}
#pointer-head:hover{
    cursor: pointer;
}
.list-move, /* 对移动中的元素应用的过渡 */
.list-enter-active{
  transition: all 0.2s ease;
}
.list-leave-active {
  transition: all 0.2s ease;
}

.list-enter-from{
  opacity: 0;
  transform: translate(0, -80px);
}
.list-leave-to {
  opacity: 0;
  transform: translate(0, -80px);
}

/* 确保将离开的元素从布局流中删除
  以便能够正确地计算移动的动画。 */
.list-leave-active {
  position: absolute;
}
    .sClip-cell{
        height:80px;
        background-color:black;
        outline:solid 3px #c678dd;
        overflow: hidden;
        display: inline-block;
        position: relative;
    }
    .drag-clip-shell{
        height: 100px;
    }
    .clip-preview{
        margin: auto;
        height: 100%;
    }
    .page-shell{
        margin: auto;
        width: 1000px;
        display: flex;
        flex-direction: column;
    }
    .file-list-shell{
        width: 1000px;
        height: 500px;
        background-color: rgba(51, 51, 51, 0.3);
        margin: auto;
        position: relative;
        padding-top: 50px;
    }
    .clips-list-shell{
        display: flex;
        flex-wrap: wrap;
        height: 500px;
        flex-direction: row;
        overflow: auto;
    }
    .clip-cell{
        width: 200px;
        height: 120px;
        /* background-color: olive; */
        margin: 20px 50px;
        display: flex;
        flex-direction: column;
        position: relative;
        overflow:hidden;
    }
    .clip-cell:hover{
        cursor:grab;
        background-color: #b1b1b1;
    }
    .empty-back{
        width: 1000px;
        height: 500px;
        background: url('../assets/upload_file.png') center;
        background-repeat: no-repeat;
    }
    .empty-back:hover{
        cursor: pointer;
    }
    .clips-sequence{
        /* min-width: 1000px; */
        height: 200px;
        /* width: fit-content; */
        /* background-color: rgba(27, 36, 38,0.5); */
        /* display: flex;
        flex-direction: row;
        flex-wrap: nowrap; */
        position: relative;
        padding-top: 30px;
    }    
    .time-line-shell{
        width: 100%;
        height: 20px;
        position: absolute;
        left: 0;
        top: 0;
    }
    .trash-bin{
        width: 150px;
        height: 150px;
        position: fixed;
        left: 75px;
        bottom: 275px;
        border: solid 2px #0086d8;
        border-radius: 100%;
        background-color: gainsboro;
        display: flex;
    }
    .clips-sequence-shell{
        overflow-x: auto;
        overflow-y: hidden;
        width: 1000px;
        height: 200px;
        background-color: rgba(27, 36, 38,0.5);
        padding-top: 20px;
    }  
    .upload-btn-shell{
        position: absolute;
        top: 10px;
        left: 0;
        height: fit-content;
        width: fit-content;
        display: flex;
        flex-direction: row;
    }
    .opsCell{
        height:40px;
        width: fit-content;
        margin: auto 5px;
        display: flex;
        flex-direction: row;
        justify-content: center;
        position: relative;
    }
    .opsCell:hover{
        cursor: pointer;
        background-color: #b1b1b1;
    }
    .opsIcon{
        height:100%;
        margin: auto;
    }
    .opsName{
        font-size: 14px;
        color: #515151;
        margin: auto 0;
        position:relative;
        left: -5px;
    }
</style>