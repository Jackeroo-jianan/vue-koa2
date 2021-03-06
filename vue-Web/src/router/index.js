import { createRouter,createWebHashHistory } from 'vue-router'
import Home from '../components/Home.vue'

const routes=[{
    name:'home',//根组件
    path:'/',
    meta:{ //meta--元数据
        title:'首页'
    },
    component:Home,
    redirect:'/welcome',
    //子组件
    children:[
        {
            name:'welcome',
            path:'/welcome',
            meta:{ title:'欢迎页' },
            component:()=>import('./../views/Welcome.vue'),
        },
        {
            name:'user',
            path:'/system/user',
            meta:{ title:'用户增删改查' },
            component:()=>import('./../views/User.vue'),
        },
        {
            name:'menu',
            path:'/system/menu',
            meta:{ title:'这是菜单页' },
            component:()=>import('./../views/Menu.vue'),
        },
        {
            name:'role',
            path:'/system/role',
            meta:{ title:'这是角色页' },
            component:()=>import('./../views/Role.vue'),
        },
        {
            name:'dept',
            path:'/system/dept',
            meta:{ title:'这是部门页' },
            component:()=>import('./../views/Dept.vue'),
        },
              
    ]
},
{
    name:'login',
    path:'/login',
    meta:{ title:'登陆界面' },
    component:()=>import('./../views/Login.vue'),
},
]

const router = createRouter({
    history:createWebHashHistory(),
    routes
})

export default router