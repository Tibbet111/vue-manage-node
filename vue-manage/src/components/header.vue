<template>
  <div class="header">
    <!-- 折叠 -->
    <div class="collapse " @click="collapseChange">
      <i v-if="!collapse" class="el-icon-s-fold"></i>
      <i v-else class="el-icon-s-unfold"></i>
    </div>
    <div class="title">后台管理系统</div>
    <div class="header_right">
      <div class="header_right_con">
        <!-- 全屏 -->
        <div class="fullscreen" @click="handleFullScreen">
          <el-tooltip effect="dark" :content="fullscreen?`取消全屏`:`全屏`" placement="bottom">
            <i class="el-icon-full-screen"></i>
          </el-tooltip>
        </div>
        <!-- 消息 -->
        <div class="message">
          <el-tooltip effect="dark" :content="message?`有${message}条未读消息`:`消息中心`" placement="bottom">
            <router-link to="/tabs">
              <i class="el-icon-bell" style="color:#fff"></i>
            </router-link>
          </el-tooltip>
          <span class="messagenum" v-if="message">{{ message }}</span>                    
        </div>
        <!-- 头像 -->
        <div class="useravatar">
          <img v-if="userAvatar" :src="userAvatar">
          <avatar v-else :fullname="username" style="cursor:default" :size="45" color="#00BFFF"></avatar>
        </div>
        <!-- 用户名和下拉框 -->
        <el-dropdown class="username" trigger="hover" @command="handleCommand">
          <span class="dropdown">
            {{username}}
          <i class="el-icon-caret-bottom"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item><router-link to="/editroleinfo" style="color:#606266">修改个人信息</router-link></el-dropdown-item>
            <el-dropdown-item  divided  command="loginout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>        
      </div>
    </div>
  </div>
</template>

<script>
import bus from './bus'
import Avatar from 'vue-avatar-component'
export default {
  name: '',
  components:{ Avatar },
  data() {
    return {
      collapse:false,
      fullscreen:false,
      message:'',
      userAvatar:'',
      username:'',
      curId : JSON.parse(localStorage.user)._id
    };
  },
  methods: {
    //侧边栏折叠传递个侧边栏组件
    collapseChange(){
      this.collapse = !this.collapse
      bus.$emit('collapse',this.collapse);
    },
    handleFullScreen(){
      let element = document.documentElement;
      if (this.fullscreen) {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitCancelFullScreen) {
            document.webkitCancelFullScreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
      } else {
        if (element.requestFullscreen) {
            element.requestFullscreen();
        } else if (element.webkitRequestFullScreen) {
            element.webkitRequestFullScreen();
        } else if (element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
        } else if (element.msRequestFullscreen) {
          element.msRequestFullscreen();
        }
      }
          this.fullscreen = !this.fullscreen;
    },
    handleCommand(command){
      if(command == 'loginout'){
        this.$confirm('确认退出吗？','提示',{type:'warning'}).then(()=>{
          localStorage.clear()
          this.$router.push('/login')
        })
      }
    },
    async getMessageLen(){
      const res = await this.$api.get('/v2/messages')
      const unreadMsg = res.data
      const readMsg = await this.$api.get(`/message/msg?id=${this.curId}`)
      const readMessage = readMsg.data
      const arr = []
      for(let i =0;i<unreadMsg.length;i++){
        const item = unreadMsg[i]
        if(!readMessage.some(v=> v.messageId._id === item._id)){
          arr.push(item)
        }
      }
      this.message = arr.length
    }
  },
  mounted(){
    if(document.body.clientWidth < 1200){
      this.collapseChange()
    }
    bus.$on('message',msg=>{
      this.message = msg
    })
  },
  created(){
    let user = JSON.parse(localStorage.getItem('user'))
    this.username = user.name
    this.userAvatar = user.avatar
    this.getMessageLen()
  }
};
</script>

<style lang="scss" scoped>
.header{
  position: relative;
  width: 100%;
  height: 70px;
  font-size: 23px;
  color: #fff;
  background: #242f42;
  .collapse{
    float: left;
    cursor: pointer;
    padding: 0 21px;
    line-height: 70px;
  }
  .title{
    width: 250px;
    float: left;
    line-height: 70px;
  }
  .header_right{
    float: right;
    padding-right: 50px;
    &_con{
      display: flex;
      align-items: center;
      height: 70px;
      .fullscreen{
        margin-right: 5px;
        font-size: 24px;
      }
      .message,.fullscreen{
        position: relative;
        width: 30px;
        height: 30px;
        border-radius: 15px;
        cursor: pointer;
        text-align: center;
        .messagenum{
          background: #CA0C16;
          position: absolute;
          top: -4px;
          right: 0px;
          width: 15px;
          height: 15px;
          border-radius: 16px;
          color: #fff;
          font-size:xx-small;
          line-height: 16px;
          transform: scale(.9)
        }
      }
      .useravatar{
        margin-left: 20px;
        img{
          display: block;
          width: 45px;
          height: 45px;
          border-radius: 50%;
        }
      }
      .username{
        margin-left: 20px;
        .dropdown{
          color: #fff;
          cursor: pointer;
        }
      }
    }
  }
}
</style>
