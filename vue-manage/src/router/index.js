import Vue from 'vue'
import VueRouter from 'vue-router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

NProgress.configure({showSpinner:false})


Vue.use(VueRouter)

const routes = [
  {
    path:'/login',
    component:()=>import('../views/login.vue'),
    meta:{title:'登录'}
  },
  {
    path:'/',
    component:()=>import('../components/home.vue'),
    redirect:'/dashboard',
    children:[
      {
        path:'/dashboard',
        component:()=>import('../views/dashboard.vue'),
        meta:{title:'首页'}
      },
      {
        path:'/userinfo',
        component:()=>import('../views/userinfo.vue'),
        meta:{title:'编辑员工信息',permission:true}
      },
      {
        path:'/user',
        component:()=>import('../views/user.vue'),
        meta:{title:'查询员工信息'}
      },
      {
        path:'/tabs',
        component:()=>import('../views/tabs.vue'),
        meta:{title:'消息'}
      },
      {
        path:'/role',
        component:()=>import('../views/manageroles.vue'),
        meta:{title:'权限管理',permission:true}
      },
      {
        path:'/editmessage',
        component:()=>import('../views/editTabs.vue'),
        meta:{title:'发布消息',permission:true}
      },
      {
        path:'/editroleinfo',
        component:()=>import('../views/editRoleInfo.vue'),
        meta:{title:'修改个人信息'}
      }
    ]
  },
  {
    path:'/401',
    component:()=>import('../views/401.vue'),
    meta:{title:'401'}
  },
  {
    path:'/404',
    component:()=>import('../views/404.vue'),
    meta:{title:'404'}
  },
  {
    path:'*',
    redirect:'/404'
  }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to,from,next)=>{
  NProgress.start()
  document.title = `${to.meta.title}`
  const user = JSON.parse(localStorage.getItem('user'))
  const role = localStorage.role
  if(to.path == '/login'){
    localStorage.clear()
  }
  if(!user && to.path !=='/login'){
    next('/login')
    NProgress.done()
  }else if(to.meta.permission && role){
    role === 'admin'?next():next('/401')
    NProgress.done()
  }else{
    next()
    NProgress.done()
  }
})


export default router
