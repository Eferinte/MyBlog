import { createRouter,createWebHistory }  from 'vue-router'
import Articles from '../pages/Articles'
import Home from '../pages/Home'
import Blog from '../pages/Blog'
import UserSpace from '../pages/UserSpace'
import Editor from '../pages/Editor'
import store from '../main'
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
        }
    ]
})
router.beforeEach((to, from) => {
    // 若未登录则取消导航并打开登陆页
    console.log("to=",to)
    if(to.fullPath=="/UserSpace"||to.fullPath=="/Editor"){
        console.log(store);
        if(!store.state.uid){
            // 返回 false 以取消导航
            // 打开登录窗口
            store.commit("openMask");
            store.commit("openLogin");
            return false
        }
    }
  })
export default router