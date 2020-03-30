<template>
  <div class="content">
    <div class="toolbar">
      <el-form :inline="true" :model="search">
        <el-form-item>
          <el-input v-model="search.value" placeholder="输入姓名"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-search" type="primary" @click="searchUser">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table :data="users" highlight-current-row v-loading="listLoading" style="width:100%"
    :header-cell-style="{color:'#606266'}" >
      <el-table-column type="index" label="序号" header-align="center" align="center" width="75"></el-table-column>
      <el-table-column prop="name" label="姓名" header-align="center" align="center" min-width="130"></el-table-column>
      <el-table-column prop="sex" label="性别" header-align="center" align="center" min-width="130"></el-table-column>
      <el-table-column prop="age" label="年龄" header-align="center" align="center" min-width="150"></el-table-column>
      <el-table-column prop="department.name" label="部门" header-align="center" align="center" min-width="150"></el-table-column>
      <el-table-column prop="entrytime" label="入职时间" :formatter="formatter" header-align="center" align="center" min-width="170"></el-table-column>
      <el-table-column prop="phone" label="手机" header-align="center" align="center" min-width="170"></el-table-column>
    </el-table>
      <pagination style="float:right" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
  </div>
</template>

<script>
import dayjs from 'dayjs';
import Pagination from '../components/index'
export default {
  components:{Pagination},
  name: '',
  data() {
    return {
       search:{
        value:'',
      },
      listQuery:{
        page:1,
        limit:10
      },
      total:0,
      users:[],
      listLoading:false,
    };
  },
  methods: {
    formatter(row, column) {
        const time = dayjs(row.entrytime).format('YYYY-MM-DD')
        return time
      },
    getList(){
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
        this.getList()
      }
    },
  },
  mounted(){
    this.$nextTick(()=>{
      this.getList()
    })
  }
};
</script>

<style lang="scss" scoped>
.content{
  box-sizing: border-box;
  .toolbar{
    border-bottom: 1px solid #ccc;
    margin-bottom: 20px;
  }
}
</style>
