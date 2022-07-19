<template>
    <div class="shell">
        <div class="fixed">:</div>
        <div class="digitShell" v-for="unit in units" :key="unit">
            <div class=" ops up" @click="up(unit)">
                <img class="icon" src="../assets/upHK.png"/>
            </div>  
            <div class="cell">
                {{unit.value}}
            </div>  
            <div class=" ops down" @click="down(unit)">
                <img class="icon" src="../assets/downHK.png"/>
            </div>  
        </div>  
    </div>
</template>

<script>

export default {
    name:"TimeSelector",
    methods: {
        up(unit){
            let index = this.units.indexOf(unit)
            if(index!=2){
                this.units[index].value=(this.units[index].value+10+1)%10
            }else{
                this.units[index].value=(this.units[index].value+6+1)%6
            }
        },
        down(unit){
            let index = this.units.indexOf(unit)
            if(index!=2){
                this.units[index].value=(this.units[index].value+10-1)%10
            }else{
                this.units[index].value=(this.units[index].value+6-1)%6
            }
        },
        getTime(){
            return "00:"+this.units[0].value+this.units[1].value+":"+this.units[2].value+this.units[3].value
        }
    },
    data() {
        return {
            units:[
                {name:"minute",value:0},
                {name:"minuteTeen",value:0},
                {name:"second",value:0},
                {name:"secondTeen",value:0},
            ]
        }
    },
}
</script>

<style scoped>
    .icon{
        height: 80%;
        width: 100%;
    }
    .shell{
        display: flex;
        flex-direction: row;
        justify-content: center;
        user-select: none;
        position: relative;
    }
    .digitShell{
        font-size: 26px;
        height: 100px;
        width: 50px;
        margin:0 5px;
        /* background-color: rgb(154, 183, 142); */
        overflow: hidden;
    }
    .cell{
        text-align:center;
        height: 33px;
        /* background-color: #e39c9c; */
        transition: 0.25s;
        /* background-color: #ffffff; */
        /* box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%); */
    }
    .ops:hover{
        cursor: pointer;
    }
    .ops.up:active{
        transform: translateY(-3px);
    }
    .ops.down:active{
        transform: translateY(3px);
    }

    .ops{
        text-align:center;
        height: 33px;
        transition: 0.25s;
    }
    .fixed{
        font-size: 30px;
        top: 26.5px;
        position:absolute
    }
</style>