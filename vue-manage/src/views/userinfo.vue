<template>
  <div id="content">
    <div class="toolbar">
      <el-form :inline="true" :model="search">
        <el-form-item>
          <el-input v-model="search.value" placeholder="输入姓名"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-search" type="primary" @click="searchUser">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-plus" type="success" @click="newUser">添加</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 员工信息表格 -->
    <el-table :data="users" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width:100%"
    :header-cell-style="{color:'#606266'}" >
      <el-table-column type="selection" header-align="center" align="center" width="75"></el-table-column>
      <el-table-column type="index" label="序号" header-align="center" align="center" width="75"></el-table-column>
      <el-table-column prop="name" label="姓名" header-align="center" align="center" min-width="130"></el-table-column>
      <el-table-column prop="sex" label="性别" header-align="center" align="center" min-width="130"></el-table-column>
      <el-table-column prop="age" label="年龄" header-align="center" align="center" min-width="150"></el-table-column>
      <el-table-column prop="department.name" label="部门" header-align="center" align="center" min-width="150"></el-table-column>
      <el-table-column prop="entrytime" label="入职时间" header-align="center" align="center" min-width="170" :formatter="formatter"></el-table-column>
      <el-table-column prop="phone" label="手机" header-align="center" align="center" min-width="170"></el-table-column>
      <el-table-column label="操作"  header-align="center"  align="center" min-width="170">
				<template slot-scope="scope">
					<el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
					<el-button type="danger" size="small" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
				</template>
			</el-table-column>
    </el-table>
    <!-- 批量删除按钮 -->
    <el-button type="danger" @click="batchRemove" style="margin-top:15px" :disabled="this.seles.length===0">批量删除</el-button>
    <pagination   style="float:right" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getInfo" />

    <!-- 添加，编辑弹窗 -->
    <el-dialog :title="status=='new'?'添加信息':'编辑信息'" :visible.sync="dialogFormVisible" width="600px">
  <el-form :model="userForm" :rules="rules" ref="userForm" label-width="70px">
   <el-form-item label="姓名" prop="name">
     <el-input v-model="userForm.name"></el-input>
   </el-form-item>
   <el-form-item label="性别">
     <el-radio-group v-model="userForm.sex">
       <el-radio label="男"></el-radio>
       <el-radio label="女"></el-radio>
     </el-radio-group>
   </el-form-item>
   <el-form-item label="年龄" prop="age">
     <el-input-number v-model="userForm.age" :min="20" :max="55"></el-input-number>
   </el-form-item>
   <el-form-item label="部门" prop="department">
     <el-select v-model="userForm.department" placeholder="请选择部门">
        <el-option v-for="item in department" :key="item._id" :label="item.name" :value="item._id"></el-option>
     </el-select>
   </el-form-item>
   <el-form-item label="入职时间" prop="entrytime">
     	<el-date-picker type="date" :disabled="status == 'edit'" placeholder="选择日期" v-model="userForm.entrytime" :picker-options="pickerOptions"></el-date-picker>
   </el-form-item>
  <el-form-item label="手机" prop="phone">
    <el-input v-model="userForm.phone"></el-input>
  </el-form-item>
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="dialogFormVisible = false">取 消</el-button>
    <el-button type="primary" :loading="userLoading" @click="status=='new'?addUser('userForm'):editUser('userForm')">确 定</el-button>
  </div>
</el-dialog>
  </div>
  
</template>

<script>
import dayjs from 'dayjs';
import Pagination from '../components/index'
export default {
  inject:['reload'],
  name: '',
  components:{Pagination},
  data() {
    return {
      pickerOptions:{
        disabledDate(time){
          let now = Date.now()
          let prev = 2450*24*60*60*1000
          let betTime = now-prev
            return time.getTime()>now||time.getTime()<betTime
        }
      },
      status:'',
      search:{
        value:'',
      },
      users:[],
      listLoading:false,
      seles:[],
      department:[],
      userForm:{
        _id:undefined,
        name:'',
        sex:'',
        age:'',
        department:'',
        entrytime:'',
        phone:''
      },
      listQuery:{
        page:1,
        limit:5
      },
      total:0,
      rules:{
        name:[{required:true,message:'请输入姓名',trigger:'blur'}],
        department:[{required:true,message:'请选择部门',trigger:'blur'}],
        phone:[{required:true,message:'请输入电话号码',trigger:'blur'},
               {pattern:/^[1](([3][0-9])|([4][5-9])|([5][0-3,5-9])|([6][5,6])|([7][0-8])|([8][0-9])|([9][1,8,9]))[0-9]{8}$/,message:'请输入正确电话格式',trigger:'blur'}]
      },
      dialogFormVisible:false,
      userLoading:false
    };
  },
  methods: {
   formatter(row, column) {
        const time = dayjs(row.entrytime).format('YYYY-MM-DD')
        return time
      },
    selsChange(seles){
      return this.seles=seles
    },
    getInfo(){
      this.$api.get('/employee/list',{
        params:{
          page : this.listQuery.page,
          limit : this.listQuery.limit,
          value : this.search.value
        }
      }).then(res=>{
        this.users = res.data.employee
        this.total = res.data.total
      })
    },
    //获取部门
    async getDepartment(){
      const res = await this.$api.get('/v2/departments')
      this.department = res.data
    },
    searchUser(){
      this.listQuery.page = 1
      this.$api.get('/employee/list',{
        params:{
          page : this.listQuery.page,
          limit : this.listQuery.limit,
          value : this.search.value
        }
      }).then(res=>{
        this.users = res.data.searchUser
        this.total = res.data.total
      })
      if(this.search.value == ''){
        this.getInfo()
      }
    },
    //新建员工信息
    newUser(){
      this.dialogFormVisible = true
      this.userForm={
        name:'',
        sex:'',
        age:'',
        department:'',
        entrytime:'',
        phone:''
      }
      this.status='new'
    },
     addUser(formName){
      this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$api.post('/v2/employees',this.userForm).then(res=>{
              this.dialogFormVisible = false
              this.getInfo()
            })
          } else {
            return false;
          }
        });
    },
    //编辑员工信息
    async handleEdit(index,row){
      this.dialogFormVisible = true
      const editData = await this.$api.get(`/v2/employees/${row._id}`)
      this.userForm = editData.data
      this.status = 'edit'
    },
    editUser(formName){
      this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$api.put(`/v2/employees/${this.userForm._id}`,this.userForm).then(res=>{
              this.dialogFormVisible = false
              this.getInfo()
            })
          } else {
            return false;
          }
        });
    },
    //删除
     handleDelete(index,row){
       this.$confirm(`确认删除员工${row.name}？`,'提示',{type:'warning'}).then(async ()=>{
			const res = await this.$api.delete(`/v2/employees/${row._id}`)
      this.getInfo()
      })
    },
    //批量删除
    batchRemove(){
      let ids = this.seles.map(item=>item._id).toString()
      this.$confirm(`确认删除选中员工？`,'提示',{type:'warning'}).then(async ()=>{
			this.$api.delete(`/employee/delete/${ids}`)
      this.reload()
      })
      
    }
  },
  created(){
    this.getInfo()
    this.getDepartment()
  },
};
</script>

<style lang="scss" scoped>
#content{
  .toolbar{
    border-bottom: 1px solid #ccc;
    margin: 20px 0;
  }
}
</style>
