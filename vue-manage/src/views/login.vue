<template>
  <div>
    <el-form :model="ruleForm" @submit.native.prevent="handleSubmit" :rules="rules" ref="ruleForm" label-position="left" label-width="0px" class="demo-ruleForm login-container">
    <h3 class="title">用户登录</h3>
    <el-form-item prop="username">
      <el-input type="text" v-model="ruleForm.username" auto-complete="off" placeholder="账号"></el-input>
    </el-form-item>
    <el-form-item prop="password">
      <el-input type="password" v-model="ruleForm.password" auto-complete="off" placeholder="密码"></el-input>
    </el-form-item>
    <el-form-item style="width:100%;">
      <el-button type="primary" style="width:100%;" native-type="submit">登录</el-button>
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

<style lang="scss" scoped>
.login-container{
      border-radius: 5px;
      background-clip: padding-box;
      width: 400px;
      margin: 180px auto;
      padding: 35px 35px 15px 35px;
      background: #fff;
      border:1px solid #eaeaea;
      box-shadow: 0 0 25px #cac6c6;
      .title{
        margin:0px auto 40px auto;
        text-align: center;
        color: #505458;
      }
}
</style>
