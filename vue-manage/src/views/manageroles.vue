<template>
  <div> 
    <el-button icon="el-icon-plus" type="primary" style="margin-bottom:20px;float:right" @click="newUser">添加</el-button>
    <el-table :data="userRole" highlight-current-row v-loading="loading" style="100%" :header-cell-style="{color:'#606266'}" >
      <el-table-column type="index" label="序号" header-align="center" align="center" min-width="180"></el-table-column>
      <el-table-column prop="name" label="姓名" header-align="center" align="center" min-width="180"></el-table-column>  
      <el-table-column prop="username" label="用户名" header-align="center" align="center" min-width="180"></el-table-column>
      <el-table-column prop="role" label="权限" header-align="center" align="center" min-width="180" :formatter="formatRole"></el-table-column>
      <el-table-column prop="status" label="状态" header-align="center" align="center" min-width="180">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status" type="success">已激活</el-tag>
          <el-tag v-else type="info">未激活</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作"  header-align="center"  align="center" min-width="180">  
        <template slot-scope="scope">
		  <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
		  <el-button type="danger" size="small" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
		</template>
	  </el-table-column>
    </el-table>
    <!-- 弹窗 -->
    <el-dialog :title="status=='new'?'添加角色':'修改角色'" :visible.sync="dialogFormVisible" width="500px">
      <el-form :model="roleForm" :rules="rules" ref="roleForm" label-width="70px">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="roleForm.name" :disabled="status=='edit'"></el-input>
        </el-form-item>
        <el-form-item label="用户名" prop="username">
          <el-input v-model="roleForm.username" :disabled="status=='edit'"></el-input>
        </el-form-item>
        <el-form-item v-show="status == 'new'" label="密码"  prop="password">
          <el-input type="password" v-model="roleForm.password"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" v-show="status == 'new'" prop="checkpass">
          <el-input type="password" v-model="roleForm.checkpass"></el-input>
        </el-form-item>
        <el-form-item label="权限" required>
            <el-radio-group v-model="roleForm.role">
                <el-radio label="admin">管理员</el-radio>
                <el-radio label="user">普通用户</el-radio>
            </el-radio-group>
        </el-form-item>
        <el-form-item label="激活状态">
          <el-switch  v-model="roleForm.status" active-text="激活" inactive-text="未激活">
          </el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
    <el-button @click="dialogFormVisible = false">取 消</el-button>
    <el-button type="primary" :loading="roleLoading" @click="status=='new'?addRole('roleForm'):editRole('roleForm')">确 定</el-button>
  </div>
    </el-dialog>
    </div>
</template>

<script>
export default {
  name: '',
  inject:['reload'],
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
      userRole:[],
      loading:false,
      status:'',
      roleLoading:false,
      dialogFormVisible:false,
      roleForm:{
            id:undefined,
            name:'',
            username:'',
            password:'',
            checkpass:'',
            role:'',
            status:false
        },
        rules:{
          name:[{required:true,message:'请输入姓名',trigger:'blur'}],
          username:[{required:true,message:'请输入姓名',trigger:'blur'}],
					password:[{message:'请输入密码',trigger:'blur'},
										{min:6,max:11,message:'请输入6-11位密码',trigger:'blur'}],
					checkpass:[{validator:checkPass,trigger:'blur'}],
        }
    };
  },
  methods: {
    formatRole(row,column){
      return row.role == 'admin'?'管理员':'普通用户'
    },
    async getUser(){
      this.loading = true
      const res = await this.$api.get('/v2/admin_users')
      this.loading = false
      this.userRole = res.data
    },
    //新建权限角色
    newUser(){
      this.status = 'new',
			this.roleForm = {
				_id:undefined,
        name:'',
        username:'',
        password:'',
        checkpass:'',
        role:''
			},
			this.dialogFormVisible = true
    },
    async addRole(formName){
    	this.$refs[formName].validate(async (valid) => {
      if (valid) {
        const res = await this.$api.post('/register',this.roleForm)
        this.dialogFormVisible = false
        this.getUser()
      } else {
        console.log('error submit!!');
        return false;
      }
   	});
		},
    //编辑权限角色
    handleEdit(index,row){
      this.roleForm = Object.assign({},row)
			this.status = 'edit',
			this.dialogFormVisible = true
    },
    editRole(formName){
    	this.$refs[formName].validate((valid) => {
      if (valid) {
        //alert('编辑!');
        const res = this.$api.put(`/v2/admin_users/${this.roleForm._id}`,this.roleForm)
        this.dialogFormVisible = false
        this.reload();
      } else {
        console.log('error submit!!');
        return false;
      }
   	});
    },
    async handleDelete(index,row){
      this.$confirm(`确认删除${row.name}？`,'提示',{type:'warning'}).then(async ()=>{
			const res = await this.$api.delete(`/v2/admin_users/${row._id}`)
      this.getUser()
      })
    }
  },
  created(){
    this.getUser()
  }
};
</script>

<style scoped>

</style>
