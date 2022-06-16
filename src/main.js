import { createApp } from 'vue'
import { createStore } from 'vuex'
import App from './App.vue'
import router from './router'

// 创建一个新的 store 实例
const store = createStore({
    state () {
      return {
        uid:undefined
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
      }
    }
})

// vue3.0取消了Vue.prototype，官方文档推荐使用globalProperties
createApp(App).use(router).use(store).mount('#app')