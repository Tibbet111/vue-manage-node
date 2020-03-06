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
            username:'ybw',
            password:'980726',
        },
        rules:{
            username:[{required:true,message:'请输入账号',trigger:'blur'}],
            password:[{required:true,message:'请输入密码',trigger:'blur'}]
        },
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
      }
  },
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
      .button{
      width: 200px;
      border-radius: 15px;
      border: 0;
      background: linear-gradient(to right, #5f2c82, #49a09d);
      }
}
}
</style>
