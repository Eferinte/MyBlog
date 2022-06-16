import { createRouter,createWebHistory }  from 'vue-router'
import Articles from '../pages/Articles'
import Home from '../pages/Home'
import Blog from '../pages/Blog'
const router = createRouter({
    history:createWebHistory(),
    routes:[
        {
            path:'/',
            redirect:'/home'
        },
        {
            name:'Home',
            path:'/home',
            component:Home,
            children:[{
                path: "articles",
                component: Articles
            }]
        },
        {
            name:"Blog",
            path:'/blog',
            component:Blog,
            // props: ["title","author","time","content","tags"]
        }
    ]
})
export default router