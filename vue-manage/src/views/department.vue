<template>
  <div>
    <el-button icon="el-icon-plus" type="primary" style="margin-bottom:20px;float:right" @click="newDepartment">添加</el-button>
    <el-table :data="departments" highlight-current-row v-loading="loading" style="100%" :header-cell-style="{color:'#606266'}" >
      <el-table-column type="index" label="序号" header-align="center" align="center" min-width="150"></el-table-column>
      <el-table-column prop="name" label="部门名称" header-align="center" align="center" min-width="300"></el-table-column>  
      <el-table-column prop="owner.name" label="负责人" header-align="center" align="center" min-width="300"></el-table-column>
      <el-table-column label="操作"  header-align="center"  align="center" min-width="300">  
        <template slot-scope="scope">
		  <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
		</template>
	  </el-table-column>
    </el-table>

    <el-dialog :title="status=='new'?'添加部门':'修改部门'" :visible.sync="dialogFormVisible" width="700px">
      <el-form :model="departmentForm" :rules="rules" ref="departmentForm" label-width="80px">
        <el-form-item label="部门名称" prop="name">
          <el-input v-model="departmentForm.name"></el-input>
        </el-form-item>
        <el-form-item label="负责人">
          <el-select v-model="departmentForm.owner" placeholder="请选择负责人">
        <el-option v-for="item in member" :key="item._id" :label="item.name" :value="item._id"></el-option>
        </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
    <el-button @click="dialogFormVisible = false">取 消</el-button>
    <el-button type="primary" @click="status=='new'?addDepartment('departmentForm'):editDepartment('departmentForm')">确 定</el-button>
  </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: '',
  data() {
    return {
        departments:[],
        loading:false,
        departmentForm:{
            name:'',
            owner:''
        },
        member:[],
        dialogFormVisible:false,
        status:'',
        rules:{
			name:[{required:true,message:'请输入部门名称',trigger:'blur'}],
        }
    };
  },
  methods: {
      async getDepartment(){
          this.loading = true
          const res = await this.$api.get('/v2/departments')
          this.departments = res.data
          this.loading = false
      },
      async newDepartment(){
        this.dialogFormVisible = true
        const allMember = await this.$api.get('/v2/employee')
        this.member = allMember.data
        this.departmentForm={
        name:'',
        owner:''
      }
      this.status='new'
      },
      async addDepartment(formName){
    	this.$refs[formName].validate((valid) => {
      if (valid) {
        this.$api.post('/v2/departments',this.departmentForm).then(res=>{
            this.dialogFormVisible = false
            this.getDepartment()
        })
      } else {
        console.log('error submit!!');
        return false;
      }
   	});
	},
    async  handleEdit(index,row){
        this.dialogFormVisible = true
        const res = await this.$api.get('/department/owner',{
            params:{
                name:row.name
            }
        })
        this.member = res.data[0].owner
        const editData = await this.$api.get(`/v2/departments/${row._id}`)
        this.departmentForm = editData.data
        this.status = 'edit'
      },
      editDepartment(formName){
    	this.$refs[formName].validate((valid) => {
      if (valid) {
        this.$api.put(`/v2/departments/${this.departmentForm._id}`,this.departmentForm).then(res=>{
            this.dialogFormVisible = false
            this.getDepartment()
        })
      } else {
        console.log('error submit!!');
        return false;
      }
   	});
  }
  },
  mounted() {
      this.getDepartment()
  },
};
</script>

<style scoped>

</style>
