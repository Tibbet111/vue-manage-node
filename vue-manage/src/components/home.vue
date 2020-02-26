<template>
  <div class="wrapper">
    <v-head></v-head>
    <v-sidebar></v-sidebar>
      <div class="content-box" ref="scollElement" :class="{'content-collapse':collapse}">
        <v-tags></v-tags>
        <div class="content">
          <transition name="fade" mode="out-in">
            <keep-alive>
              <router-view></router-view>
            </keep-alive>
          </transition>
        </div>
      </div>
    
  </div>
</template>

<script>
import vHead from './header.vue'
import vSidebar from './sidebar.vue'
import vTags from './tags.vue'
import bus from './bus'
export default {
  name: '',
  components:{
  vHead,
  vSidebar,
  vTags
  },
  data() {
    return {
      collapse:false
    };
  },
  methods: {},
  created(){
    bus.$on('collapse-content',msg=>{
      this.collapse = msg
    })
  }
};
</script>

<style lang="scss" scoped>
.content-box{
  position: absolute;
  top: 70px;
  right: 0;
  left: 250px;
  bottom: 0;
  transition: left .3s ease-in-out;
  background: #f0f0f0;
  .content{
    width: auto;
    height: 100%;
    padding: 10px;
    box-sizing: border-box;
    overflow: auto;
    .fade-enter-active,
    .fade-leave-active {
    transition: opacity .5s;
}
    .fade-enter,
    .fade-leave {
    opacity: 0;
}
  }
}
.content-collapse{
  left: 65px;
}
</style>
