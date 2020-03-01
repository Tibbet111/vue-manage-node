import axios from 'axios';
import Vue from 'vue'
import router from '../router/index'

const api = axios.create({
    baseURL:'http://localhost:3000/api'
})

//请求
api.interceptors.request.use(config=>{
    if(localStorage.token){
        config.headers.Authorization = 'Bearer ' + (localStorage.token)
    }
   
    return config
    
},err=>{
    return Promise.reject(err)
});

//响应
api.interceptors.response.use(res=>{
    if(res.data.msg){
        Vue.prototype.$message({
            type:'success',
            message:res.data.msg
        }) 
    }
    return res
},err=>{
    //若有错误信息显示
    if(err){
        Vue.prototype.$message({
        type:'error',
        message:err.response.data.message
    })
    //若错误码401判断为未登录，跳转登录页
    if(err.response.status === 401){
        router.push('/login')
    }
}
    return Promise.reject(err)
})

export default api