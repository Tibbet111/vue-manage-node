<template>
  <div id="container">
    <el-form :model="ruleForm" @submit.native.prevent="handleSubmit" :rules="rules" ref="ruleForm" label-position="left" label-width="0px" class="login-container">
    <h3 class="title">用户登录</h3>
    <el-form-item prop="username">
      <i class="el-icon-user"></i><el-input type="text" v-model="ruleForm.username" auto-complete="off" placeholder="账号"></el-input>
    </el-form-item>
    <el-form-item prop="password">
      <i class="el-icon-lock"></i><el-input type="password" v-model="ruleForm.password" auto-complete="off" placeholder="密码"></el-input>
    </el-form-item>
    <div class="captcha">
    <input type="text" v-model="captcha" placeholder="请输入验证码" class="inputCap">
    <div v-html="svgData" class="svgImg"></div>
    </div>
    <a @click.prevent="toggleVerify" class="changeSvg">看不清？点击换一张图片</a>
    <el-form-item style="width:100%;">
      <el-button type="primary" style="width:100%;" native-type="submit" class="button">登录</el-button>
    </el-form-item>
    </el-form>
  </div>
</template>
<script>

export default {
  name: '',
  data() {
    return {
        ruleForm:{
            username:'',
            password:'',
        },
        rules:{
            username:[{required:true,message:'请输入账号',trigger:'blur'}],
            password:[{required:true,message:'请输入密码',trigger:'blur'}]
        },
        verifyLoadState:false,
        svgData:'',
        svgText:'',
        captcha:''
    };
  },
  methods: {
       handleSubmit() {
         this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            this.login()
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      }, 
      async login(){
          if(this.captcha == ''){
            this.$confirm('请输入验证码','提示',{})
          }
          else if(this.svgText == this.captcha.toLowerCase()){
          const res = await this.$api.post('/login',this.ruleForm)
          const {user,path,token} = res.data
          localStorage.token = token
          localStorage.setItem('user',JSON.stringify(user))
          localStorage.setItem('path',JSON.stringify(path))
          localStorage.role = user.role
          this.$message({
              type:'success',
              message:'登陆成功'
          })
          this.$router.push('/')
          }else{
            this.$message({
              type:'error',
              message:'验证码错误'
            })
          }
          
      },
      getImg(){
        this.$api.get('/captcha').then(res=>{
          this.svgData = res.data.img
          this.svgText = res.data.text
        })
      },
      toggleVerify(){
        this.getImg()
      }
  },
  created(){
    this.getImg()
  }
};
</script>

<style lang="scss">
  #container{
    background: url('../assets/1.jpg');
    background-repeat: no-repeat;
    background-size: 100% 100%;
    height: 100%;
    width: 100%;
    position:fixed;
    .login-container{
      border-radius: 5px;
      background-clip: padding-box;
      width: 450px;
      margin: 150px auto;
      padding: 35px 35px 15px 35px;
      background:#00000060;
      border:0px solid #eaeaea;
      text-align: center;
      .title{
        margin:0px auto 40px auto;
        text-align: center;
        color: #fff;
      }
      .el-input__inner {
        position: relative;
        bottom: 30px;
        width: 300px;
        border:0;
        border-bottom: 1px solid #fff;
        background: #ffffff00;
        color: #fff;
      }
      i{
        position: relative;
        top: 12px;
        color: #fff;
        font-size: 25px;
        float:left;
      }
      .el-form-item__error{
        left:50px;
        top: 65%;
      }
      .button{
      width: 200px;
      border-radius: 15px;
      border: 0;
      background: linear-gradient(to right, #5f2c82, #49a09d);
      margin-top: 15px;
      }
}
}
.changeSvg{
  color: #fff;
  border-bottom: 1px solid #fff;
  font-size: 0.8rem;
  cursor: pointer;
  position: relative;
  left: 120px;
  bottom: 15px;
  &:hover{
    color:#4169E1;
    border-color: #4169E1;
  }
}
.captcha{
  display: flex;
  align-items: end;
  justify-content: space-evenly;
  .inputCap{
     border-radius: 5px;
     background-clip: padding-box;
     border: 0px solid #eaeaea;
     outline: none;
     border-bottom: 1px solid #fff;
     background: #ffffff00;
     color: #fff;
     padding: 5px 0 10px 13px;
     margin-left: 7px;
  }
  .inputCap::placeholder{
    color:	#C0C0C0;
  }
  .svgImg{
    width: 100px;
    position: relative;
    bottom: 20px;
    right: 5px;
  }
}
</style>
