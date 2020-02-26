<template>
  <div class="errPage">
    <el-button icon="el-icon-arrow-left" type="primary" @click="back">
      返回首页
    </el-button>
    <el-row>
      <el-col :span="12">
        <h1 class="oops">Ooops!</h1>
        <h2>您没有权限访问该页面</h2>
        <h6>如果宁有不满请联系你的老板</h6>
        <p>或者你可以</p>
        <ul class="list">
          <li class="type">
            <router-link to="/dashboard">
            回首页
            </router-link>
          </li>
          <li class="type">
            <a href="https://www.github.com" target="_blank">逛逛全球最大同性交流网站</a>
          </li>
          <li><a href="#" @click.prevent="dialogVisible=true">点开康康我老婆们？</a></li>
        </ul>
      </el-col>
      <el-col :span="12">
        <img src="../assets/401.gif" width="313" height="428" class="girlimg">
      </el-col>
    </el-row>
    <el-dialog :visible.sync="dialogVisible" title="康康我的老婆们">
      <el-carousel indicator-position="outside" height="450px">
        <el-carousel-item v-for="item in wifes" :key="item.name">
          <img :src="item.src" width="100%">
          <span class="wifename">{{item.name}}</span>
        </el-carousel-item>
      </el-carousel>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: '',
  data() {
    return {
      dialogVisible:false,
      wifes:[
        {name:'蕾姆',src:'https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=3385398923,3980470729&fm=26&gp=0.jpg'},
        {name:'薇尔莉特',src:'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=4022421928,1398956111&fm=26&gp=0.jpg'},
        {name:'圣人惠',src:'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1578998900353&di=f9b5e37be3850b3db429c16095922dc2&imgtype=0&src=http%3A%2F%2Fi0.hdslb.com%2Fbfs%2Farchive%2F5862d14b05e6c034e945118884d13ad30c653dcf.jpg'},
        {name:'远坂凛',src:'http://b-ssl.duitang.com/uploads/item/201712/08/20171208230022_RwiAM.png'},
        {name:'中野三玖',src:'http://img1.imgtn.bdimg.com/it/u=2744194272,2060945945&fm=26&gp=0.jpg'},
        {name:'艾米莉亚碳',src:'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=655279031,2576756978&fm=26&gp=0.jpg'},
        {name:'和泉纱雾',src:'https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=3743649973,60972169&fm=26&gp=0.jpg'},
        {name:'伊莉雅',src:'https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=397810225,4146875489&fm=26&gp=0.jpg'},
        {name:'02',src:'http://img.netbian.com/file/2018/1122/ee5862643e8e962b63d6e42110ed2a13.jpg'},
      ]
    };
  },
  methods: {
    back(){
      this.$router.push('/')
    }
  },
};
</script>

<style lang="scss">
.errPage{
  width: 800px;
  max-width: 100%;
  margin: 100px 450px;
  .oops{
    margin: .67em 0;
    font-size: 60px;
    font-weight: 700;
    color: #484848;
  }
  h2{
    margin: 30px 0
  }
  h6{
    margin-bottom: 20px;
  }
  p{
    margin-bottom: 5px;
  }
  .list{
    font-size: 14px;
    li{
      padding-bottom: 5px;
      margin-left: 25px
    }
    a {
      color: #008489;
      &:hover {
        text-decoration: underline !important;
      }
    }
  }
  .girlimg{
    position: relative;
  }
  .wifename{
    display:flex;
    justify-content:center;
    margin-top: 10px;
    font-size: 20px;
  }
}
</style>
