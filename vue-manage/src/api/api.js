import axios from 'axios';
import Vue from 'vue'

const api = axios.create({
    baseURL:'http://localhost:3000/api'
})

//响应
api.interceptors.response.use(res=>{
    return res
},err=>{
    //若有错误信息显示
    if(err.response.data.message){
        Vue.prototype.$message({
        type:'error',
        message:err.response.data.message
    })
    
}
    return Promise.reject(err)
})

export default api