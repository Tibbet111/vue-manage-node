<template>
  <div class="container">
      <el-card shadow="hover">
          <div slot="header" >
            <span>修改个人信息</span>
          </div>
      <el-form  :model="userInfo" :rules="rules" ref="userInfo" label-width="100px" style="margin-top:20px">
        <el-form-item label="头像">
              <el-upload
  class="avatar-uploader"
  :action="uploadUrl"
  :headers="getAuthHeaders()"
  :before-upload="beforeAvatarUpload"
  :show-file-list="false"
  :on-success="res => $set(userInfo,'avatar',res.url)">
  <img v-if="userInfo.avatar" :src="userInfo.avatar" class="avatar">
  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
</el-upload>
          </el-form-item>
        <el-form-item label="我的角色" style="width:350px">
            <el-input :disabled="true" v-model="userInfo.role"></el-input>
        </el-form-item>
        <el-form-item label="用户名" style="width:350px">
            <el-input :disabled="true" v-model="userInfo.username"></el-input>
        </el-form-item>
        <el-form-item label="姓名" style="width:350px">
            <el-input  v-model="userInfo.name"></el-input>
        </el-form-item>
        <el-form-item label="密码" style="width:350px" prop="password">
            <el-input v-model="userInfo.password" type="password"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" style="width:350px" prop="checkpass">
            <el-input v-model="userInfo.checkpass" type="password"></el-input>
        </el-form-item>
        
          <el-button type="primary" @click="submit('userInfo')" class="button">确认</el-button>
          <el-button @click="reset" class="button">重新填写</el-button>
      </el-form>
      </el-card>
  </div>
</template>

<script>
export default {
    inject:['reload'],
  name: '',
  data() {
      var checkPass = (rule,value,callback)=>{
			if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.userInfo.password) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
		}
    return {
        userInfo:{
            name:'',
            username:'',
            avatar:'',
            password:'',
            checkpass:'',
            role:''
        },
        rules:{
            password:[{message:'请输入密码',trigger:'blur'},
					  {min:6,max:11,message:'请输入6-11位密码',trigger:'blur'}],
			checkpass:[{validator:checkPass,trigger:'blur'}],
        },
         curId : JSON.parse(localStorage.user)._id

    };
  },
  methods: {
      beforeAvatarUpload(file){
        const isJPG = file.type === 'image/jpeg';
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return isJPG && isLt2M;
      },
     async getUserInfo(){
         const res = await this.$api.get(`/admin/info?id=${this.curId}`)
         this.userInfo = res.data
     },
      submit(formName){
        this.$refs[formName].validate((valid) => {
        if (valid) {
            this.$api.put(`v2/admin_users/${this.curId}`,this.userInfo).then(res=>{
                localStorage.user = JSON.stringify(res.data.items)
                this.reload();
                this.$router.push('/')
            })
        } else {
        console.log('error submit!!');
        return false;
      }
   	});
    },
    reset(){
        this.userInfo.name = ''
        this.userInfo.avatar = ''
        this.userInfo.password = ''
        this.userInfo.checkpass = ''
    }
  },
  created(){
      this.getUserInfo()
  }
};
</script>

<style lang="scss">
.container{
    width: 100%;
    .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409eff;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    min-width: 6rem;
    height: 6rem;
    line-height: 6rem;
    text-align: center;
  }
  .avatar {
    min-width: 6.2rem;
    height: 6rem;
    display: block;
  }
  .button{
      width: 6rem;
      position: relative;
      left: 6rem;
      margin-right: 10px;
  }
}
</style>
