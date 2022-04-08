import { createRouter,createWebHistory }  from 'vue-router'
import Articles from '../pages/Articles'

const router = createRouter({
    history:createWebHistory(),
    routes:[
        {
            path:'/',
            component:Articles
        }
    ]
})
export default router