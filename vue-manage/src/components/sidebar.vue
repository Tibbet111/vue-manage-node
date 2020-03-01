<template>
<div class="sidebar">
    <el-menu
      class="sidebar-el-menu"
      :default-active="onRoutes"
      :collapse="collapse"
      background-color="#324157"
      text-color="#bfcbd9"
      active-text-color="#20a0ff"
      unique-opened
      router
        >
    <template v-for="item in items">
      <!-- 如果item有子元素 -->
      <template v-if="item.subs">
        <el-submenu :index="item.index" :key="item.index">
          <template slot="title">
            <i :class="item.icon"></i>
              <span slot="title">{{ item.title }}</span>
          </template>
          <template v-for="subItem in item.subs">
            <!-- 如果子元素还有子元素 -->
            <el-submenu
              v-if="subItem.subs"
              :index="subItem.index"
              :key="subItem.index"
            >
            <template slot="title">{{ subItem.title }}</template>
              <el-menu-item
                v-for="(threeItem,i) in subItem.subs"
                :key="i"
                :index="threeItem.index"
              >{{ threeItem.title }}</el-menu-item>
            </el-submenu>
              <el-menu-item
                v-else
                :index="subItem.index"
                :key="subItem.index"
              >{{ subItem.title }}</el-menu-item>
          </template>
        </el-submenu>
      </template>
      <template v-else>
        <el-menu-item :index="item.index" :key="item.index">
          <i :class="item.icon"></i>
            <span slot="title">{{ item.title }}</span>
        </el-menu-item>
      </template>
    </template>
    </el-menu>
  </div>  
</template>

<script>
import bus from './bus'
export default {
  name: '',
  data() {
    return {
      collapse:false,
      items:[
        {
                icon:'el-icon-s-home',
                index:'dashboard',
                title:'首页'
        },
      ]
    };
  },
  methods: {},
  computed:{
    onRoutes(){
      return this.$route.path.replace('/','');
    }
  },
  created(){
    //接收header传过来的折叠
    bus.$on('collapse',msg=>{
      this.collapse = msg;
      bus.$emit('collapse-content',msg);
    })
    var path = JSON.parse(localStorage.getItem('path'))
    for(let i=0;i<path.length;i++){
      this.items.push(path[i])
    }
  }
};
</script>

<style lang="scss" scoped>
.sidebar{
  display: flex;
  position: absolute;
  top: 70px;
  left: 0;
  bottom: 0;
}
 .sidebar-el-menu:not(.el-menu--collapse) {
    width: 250px;
}
  .sidebar > ul {
    height: 100%;
}
</style>
