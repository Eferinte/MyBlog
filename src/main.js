import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
// vue3.0取消了Vue.prototype，官方文档推荐使用globalProperties
createApp(App).use(router).mount('#app')