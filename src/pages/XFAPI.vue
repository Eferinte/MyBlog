<template>
<div >
    <Back></Back>
    <div class="mainShell">
        <div style="margin:auto">
            <button type="button" @click="callApi"></button>
        </div>
    </div>
</div>  
</template>

<script>
import Back from '../components/Back.vue';
import axios from 'axios';
import Qs from 'qs';
import store from '../main';
export default {
    components: { Back },
    mounted() {
        console.log('height = ',window.innerHeight);
    },
    methods: {
        callApi(){
            let axiosInstance = axios.create({
                baseURL: store.state.preUrl,
                timeout: 1000,
            });
            // console.log("params=",params);
            axiosInstance.get("/callXFAPI").then((response) => {
                if(response.data.ok=="0"){
                    store.commit("setHintText", "预处理请求成功");
                }else{
                    store.commit("setHintText", "预处理请求失败");
                }
                console.log(response.data);
            });
        }
    },
    data() {
        return {
            secretKey:'49c3731bd0be94ec26a3cd8cd46fd411',
            appID:'6c348107',
        }
    },
}
</script>
<style scoped>
.mainShell{
    height: 678px;
    width: 800px;
    margin: auto;
    background-color: #9c9c9c;
    display: flex;
}
button{
    width: 200px;
    height: 50px;
    margin: auto;
}
button:hover{
    cursor: pointer;
}
</style>