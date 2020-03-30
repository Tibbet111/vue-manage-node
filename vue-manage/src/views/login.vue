<template>
  <div id="container">
    <el-form :model="ruleForm" @submit.native.prevent="handleSubmit" :rules="loginRules" ref="ruleForm" label-position="left" label-width="0px" class="login-container">
    <h3 class="title">用户登录</h3>
    <el-form-item prop="username">
      <i class="el-icon-user"></i><el-input type="text" v-model="ruleForm.username" auto-complete="off" placeholder="账号"></el-input>
    </el-form-item>
    <el-form-item prop="password">
      <i class="el-icon-lock"></i><el-input type="password" v-model="ruleForm.password" auto-complete="off" placeholder="密码"></el-input>
    </el-form-item>
    <div class="captcha">
    <!-- <input type="text" v-model="captcha" placeholder="请输入验证码" class="inputCap"> -->
    <el-form-item prop="captcha">  
      <i class="iconfont icon-yanzhengma" style="right:30px;top:20px"></i><el-input v-model="ruleForm.captcha" placeholder="请输入验证码"></el-input>
    </el-form-item>
    <div v-html="svgData" class="svgImg"></div>
    </div>
    <a @click.prevent="toggleVerify" class="changeSvg">看不清？点击换一张图片</a>
    <el-form-item style="width:100%;">
      <el-button type="primary" style="width:100%;" native-type="submit" class="button">登录</el-button>
    </el-form-item>
    <a @click.prevent="register" class="register">点我注册</a>
    </el-form>

    <!-- 注册 -->
    <el-dialog title="注册" :visible.sync="dialogFormVisible" width="500px" :modal-append-to-body='false'>
      <el-form :model="roleForm" :rules="registerRules" ref="roleForm" label-width="70px">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="roleForm.name"></el-input>
        </el-form-item>
        <el-form-item label="用户名" prop="username">
          <el-input v-model="roleForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="roleForm.password"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkpass">
          <el-input type="password" v-model="roleForm.checkpass"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
    <el-button @click="clear">清 空</el-button>
    <el-button type="primary" :loading="roleLoading" @click="addRole('roleForm')">确 定</el-button>
  </div>
    </el-dialog>
  </div>
</template>
<script>

export default {
  name: '',
  data() {
     var checkPass = (rule,value,callback)=>{
			if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.roleForm.password) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
		}
    return {
        ruleForm:{
            username:'',
            password:'',
            captcha:''
        },
        loginRules:{
            username:[{required:true,message:'请输入账号',trigger:'blur'}],
            password:[{required:true,message:'请输入密码',trigger:'blur'}],
            captcha:[{required:true,message:'请输入验证码',trigger:'blur'}]
        },
        verifyLoadState:false,
        dialogFormVisible:false,
        svgData:'',
        svgText:'',
        captcha:'',
        roleForm:{
            name:'',
            username:'',
            password:'',
            checkpass:'',
        },
        registerRules:{
          name:[{required:true,message:'请输入姓名',trigger:'blur'}],
          username:[{required:true,message:'请输入用户名',trigger:'blur'}],
					password:[{required:true,message:'请输入密码',trigger:'blur'},
										{min:6,max:11,message:'请输入6-11位密码',trigger:'blur'}],
					checkpass:[{validator:checkPass,trigger:'blur'}],
        },
        roleLoading:false
    };
  },
  methods: {
       clear(){
         this.roleForm={
            name:'',
            username:'',
            password:'',
            checkpass:'',
        }
       },
       register(){
         this.dialogFormVisible = true
         this.roleForm={
            name:'',
            username:'',
            password:'',
            checkpass:'',
         }
       },
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
           if(this.svgText == this.ruleForm.captcha.toLowerCase()){
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
      },
      // 注册
      async addRole(formName){
    	this.$refs[formName].validate(async (valid) => {
      if (valid) {
        const res = await this.$api.post('/register',this.roleForm)
        this.dialogFormVisible = false
        this.$message({
          type:'success',
          message:'请等待管理员审核'
        })
      } else {
        console.log('error submit!!');
        return false;
      }
   	});
		},
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
      }
}
}
.changeSvg{
  color: #fff;
  border-bottom: 1px solid #fff;
  font-size: 0.8rem;
  cursor: pointer;
  position: relative;
  left: 125px;
  bottom: 40px;
  &:hover{
    color:#4169E1;
    border-color: #4169E1;
  }
}
.register{
  color: #fff;
  cursor: pointer;
  position: relative;
  left: 11rem;
  &:hover{
    color:#4169E1;
  }
}
.captcha{
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  .el-input__inner{
    width: 160px !important;
  }
  .el-form-item__error{
        left:20px !important;
        top: 70% !important;
      }
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
