import { createApp } from 'vue'
import { createStore } from 'vuex'


//md基础模块
import VueMarkdownEditor from '@kangc/v-md-editor';
import VMdPreview from '@kangc/v-md-editor/lib/preview';
import '@kangc/v-md-editor/lib/style/base-editor.css';
import vuepressTheme from '@kangc/v-md-editor/lib/theme/vuepress.js';
import '@kangc/v-md-editor/lib/theme/style/vuepress.css';
import Prism from 'prismjs';
//todo-list插件
import createTodoListPlugin from '@kangc/v-md-editor/lib/plugins/todo-list/index';
import '@kangc/v-md-editor/lib/plugins/todo-list/todo-list.css';
//流程图插件
// import createMermaidPlugin from '@kangc/v-md-editor/lib/plugins/mermaid/cdn';
// import '@kangc/v-md-editor/lib/plugins/mermaid/mermaid.css';
//快捷复制代码插件
import createCopyCodePlugin from '@kangc/v-md-editor/lib/plugins/copy-code/index';
import '@kangc/v-md-editor/lib/plugins/copy-code/copy-code.css';


import App from './App.vue'
import router from './router'

VueMarkdownEditor.use(vuepressTheme, {
  Prism,
});

//装载
VueMarkdownEditor.use(createTodoListPlugin());
// VueMarkdownEditor.use(createMermaidPlugin());
VMdPreview.use(vuepressTheme, {
  Prism,
});
VMdPreview.use(createTodoListPlugin());
VMdPreview.use(createCopyCodePlugin());
// VMdPreview.use(createMermaidPlugin());

// 创建一个新的 store 实例
const store = createStore({
    state () {
      return {
        token:undefined,
        uid:undefined,
        username:undefined,
        premisson:'user',
        maskShow:false,
        loginShow:false,
        recorderShow:false,
        timerShow:false,
        setTime:0,
        hintText:"",
        preUrl:process.env.VUE_APP_URL,
        selectedTags:[],
        mode:'pc',
        log:''
      }
    },
    mutations: {
    // 输出log
      setLog(state, msg){
        state.log+=new Date()+msg+'\n';
      },
    // 修改mode
      setMode(state, mode){
        state.mode= mode;
      },

    // 添加token
      setToken (state, token){
        state.token=token
      },
    //  添加uid 
      setUid (state,uid) {
        state.uid=uid
      },
    //  添加username
      setUsername (state,username) {
        state.username=username
      },
    //   清除登录状态
      clear(state){
        state.token=undefined
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
      // 打开计时器
      openTimer(state){
        state.timerShow=true
      },
      // 关闭计时器
      closeTimer(state){
        state.timerShow=false
      },
      // 设置计时
      setSetTime(state,value){
        state.setTime=value
      },
      // 清除计时
      clearSetTime(state){
        state.setTime=0
      },
      //设置提示信息
      setHintText(state,text){
        state.hintText=text
      },
      //清除提示信息
      clearHint(state){
        state.hintText=""
      },
      //更新标签
      updateTags(state,newTags){
        state.selectedTags=newTags;
      },
      //清空标签
      cleartags(state){
        state.selectedTags=[];
      }
    }
})

export default store
createApp(App).use(VueMarkdownEditor).use(VMdPreview).use(router).use(store).mount('#app')