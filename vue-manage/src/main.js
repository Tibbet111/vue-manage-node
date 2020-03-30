import Vue from 'vue'
import App from './App.vue'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import router from './router'

import './assets/style.scss'
import api from './api/api'

import './assets/iconfont/iconfont.css'

Vue.use(ElementUI)

Vue.config.productionTip = false
Vue.prototype.$api = api

//头像上传加上token
Vue.mixin({
  computed:{
    uploadUrl(){
      return this.$api.defaults.baseURL+'/upload'
    }
  },
  methods : {
    getAuthHeaders(){
      return {
        Authorization : `Bearer ${localStorage.token || ''}`
      }
    }
  }
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
