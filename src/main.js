import { createApp } from 'vue'
import { createStore } from 'vuex'

import VueMarkdownEditor from '@kangc/v-md-editor';
import VMdPreview from '@kangc/v-md-editor/lib/preview';
import '@kangc/v-md-editor/lib/style/base-editor.css';
import vuepressTheme from '@kangc/v-md-editor/lib/theme/vuepress.js';
import '@kangc/v-md-editor/lib/theme/style/vuepress.css';
import Prism from 'prismjs';

import App from './App.vue'
import router from './router'

VueMarkdownEditor.use(vuepressTheme, {
  Prism,
});
VMdPreview.use(vuepressTheme, {
  Prism,
})

// 创建一个新的 store 实例
const store = createStore({
    state () {
      return {
        uid:undefined,
        username:undefined,
        maskShow:false,
        loginShow:false,
        recorderShow:false,
        hintText:"",
      }
    },
    mutations: {
    //  添加uid 
      setUid (state,uid) {
        state.uid=uid
      },
    //  添加username
      setUsername (state,username) {
        state.username=username
      },
    //   清除uid
      clear(state){
        state.uid=undefined
        state.username=undefined
      },
      // 打开遮罩
      openMask(state){
        state.maskShow=true
      },
      // 关闭遮罩
      closeMask(state){
        state.maskShow=false
      },
      // 打开登录页
      openLogin(state){
        state.loginShow=true
      },
      // 关闭登录页
      closeLogin(state){
        state.loginShow=false
      },
      // 打开记录页
      openRecorder(state){
        state.recorderShow=true
      },
      // 关闭记录页
      closeRecorder(state){
        state.recorderShow=false
      },
      //设置提示信息
      setHintText(state,text){
        state.hintText=text
      },
      //清除提示信息
      clearHint(state){
        state.hintText=""
      }
    }
})

export default store
createApp(App).use(VueMarkdownEditor).use(VMdPreview).use(router).use(store).mount('#app')