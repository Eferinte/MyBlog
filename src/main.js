import { createApp } from 'vue'
import App from './App.vue'

// vue3.0取消了Vue.prototype，官方文档推荐使用globalProperties
createApp(App).mount('#app')