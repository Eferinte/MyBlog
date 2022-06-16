import { createRouter,createWebHistory }  from 'vue-router'
import Articles from '../pages/Articles'
import Home from '../pages/Home'
import Blog from '../pages/Blog'
import UserSpace from '../pages/UserSpace'
import Editor from '../pages/Editor'
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
            name:"UserSpace",
            path:'/UserSpace',
            component:UserSpace,
            // props: ["title","author","time","content","tags"]
        },
        {
            name:"Editor",
            path:'/Editor',
            component:Editor,
            // props: ["title","author","time","content","tags"]
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