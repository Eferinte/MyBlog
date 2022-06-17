import { createApp } from 'vue'
import { createStore } from 'vuex'

import VueMarkdownEditor from '@kangc/v-md-editor';
import '@kangc/v-md-editor/lib/style/base-editor.css';
import vuepressTheme from '@kangc/v-md-editor/lib/theme/vuepress.js';
import '@kangc/v-md-editor/lib/theme/style/vuepress.css';
import Prism from 'prismjs';

import App from './App.vue'
import router from './router'

VueMarkdownEditor.use(vuepressTheme, {
  Prism,
});


// 创建一个新的 store 实例
const store = createStore({
    state () {
      return {
        uid:undefined,
        maskShow:false,
        loginShow:false,
        recorderShow:false
      }
    },
    mutations: {
    //  添加uid 
      setUid (state,uid) {
        state.uid=uid
      },
    //   清楚uid
      clear(state){
        state.uid=undefined
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
      }
    }
})
export default store

createApp(App).use(VueMarkdownEditor).use(router).use(store).mount('#app')