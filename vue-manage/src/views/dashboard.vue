<template>
  <div>
    <el-row :gutter="10">
      <el-col :span="10">
        <el-card shadow="hover" class="card" style="height:300px">
          <div slot="header" >
            <span>当前登录用户</span>
          </div>
          <div class="userinfo">
          <img v-if="userAvatar" :src="userAvatar">
          <avatar v-else :fullname="name" style="cursor:default" :size="140"></avatar>
          <p>{{name}}</p>
          <span>{{role}}</span>
          </div>
        </el-card>
        <el-card shadow="hover" style="height:270px;margin-top:20px">
          <div slot="header">
            <span>快捷方式</span>
          </div>
        <ul>
          <li v-for="item in menu" :key="item.index"><router-link :to="`/${item.index}`"><i :class="`${item.icon}`"></i><p>{{item.title}}</p></router-link></li>
        </ul>
        </el-card> 
      </el-col>
      <el-col :span="14">
        <el-card shadow="hover" style="height:590px;padding-left:0">
          <div slot="header">
            <span>待办事项</span>
            <el-button style="float: right; padding: 3px 0" type="text" @click="showAdd">添加</el-button>
          </div>
          <el-table :show-header="false" :data="List" style="width:100%;">
            <el-table-column width="40">
              <template slot-scope="scope">
                <el-checkbox v-model="scope.row.status"></el-checkbox>
              </template>
            </el-table-column>
            <el-table-column>
              <template slot-scope="scope">
                <div class="item" :class="{'item-done':scope.row.status}">
                  {{scope.row.title}}
                </div>
              </template>
            </el-table-column>
            <el-table-column width="70">
              <template slot-scope="scope"> 
                <i class="el-icon-edit" @click="showEdit(scope.row)"></i>
                <i class="el-icon-delete" @click="Delete(scope.row._id)"></i>
              </template>
            </el-table-column>
          </el-table> 
        </el-card>
      </el-col>
    </el-row>
    <!-- 事项弹窗 -->
    <el-dialog :title="status == 'edit'?'编辑事项':'添加事项'" :visible.sync="dialogFormVisible">
      <el-form :model="form" ref="form" :rules="ruleForm">
    <el-form-item label="事项"  prop="title" label-width="50px">
      <el-input v-model="form.title" autocomplete="off"></el-input>
    </el-form-item>
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="dialogFormVisible = false">取 消</el-button>
    <el-button type="primary" @click="status=='edit'?editThing('form'):newThing('form')">确 定</el-button>
  </div>
</el-dialog>
  </div>
</template>

<script>
import Avatar from 'vue-avatar-component'
import dayjs from 'dayjs'
export default {
  name: '',
  components:{ Avatar },
  data() {
    return {
       dialogFormVisible:false,
      form:{
        title:'',
      },
      ruleForm:{
        title:[{ required: true, message: '请输入待办事项', trigger: 'blur' },]
      },
      status:'',
      userAvatar:'',
      name:'',
      role:'',
      timer:'',
      List:[],
      title:'',
      menu:[],
      userID:''
    };
  },
  methods: {
    //获取事项
     async getReadyTings(){
      const id = JSON.parse(localStorage.user)._id
      //const res =  await this.$api.get('/v2/things')
       const res = await this.$api.get(`/user/things?id=${id}`)
       console.log(res);
       this.List = res.data
    },
    //新建事项
    showAdd(){
      this.status = 'new',
      this.form = {
        title:''
      }
      this.dialogFormVisible = true
    },
    newThing(formName){
      this.$refs[formName].validate((valid) => {
        if (valid) {
        const para = {
          title:this.form.title,
          userId:this.userID
        }
        this.$api.post('/v2/things',para).then(res=>{
          this.dialogFormVisible = false
          this.getReadyTings()
        })
        } else {
          console.log('error submit!!');
          return false;
        }
    });
    },
    //编辑事项
    showEdit(row){
      this.status = 'edit'
      this.form = Object.assign({},row)
      this.dialogFormVisible = true
    },
    editThing(formName){
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$api.put(`/v2/things/${this.form._id}`,this.form).then(res=>{
            this.dialogFormVisible = false
            this.getReadyTings()
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
  //删除事项
   Delete(id){
    this.$confirm('确认删除该事项？','提示',{type:'warning'}).then(async ()=>{
        await this.$api.delete(`/v2/things/${id}`)
        this.getReadyTings()
      })
  }
  },
  created(){
    this.getReadyTings()
    let user = JSON.parse(localStorage.getItem('user'))
    this.userID = user._id
    this.userAvatar = user.avatar;
    this.name = user.name;
    this.role = user.role;
    this.menu = JSON.parse(localStorage.path)
  },
};
</script>

<style lang="scss" scoped>
.card{
  
  .userinfo{
  width: 100%;
  height: 150px;
  padding-bottom: 20px;
  img{
    width: 150px;
    height: 150px;
    border-radius: 50%;
  }
  p{
    position: relative;
    left: 170px;
    bottom:130px;
    font-size: 50px;
  }
  span{
    position: relative;
    left: 170px;
    bottom:120px;
    font-size: 25px;
    color: lightslategrey
  }
}
  .time{
    margin: 10px auto;
    font-size: 20px;
  }
}
.weather{
  height:250px;
  margin-bottom: 10px;
  padding:  0 10px;
}
.item{
  font-size: 14px;
}
.item-done{
  text-decoration: line-through;
  color: #999;
}
i{
  margin-right: 10px;
  cursor: pointer;
}
ul{
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  li{
    float: left;
    margin:0 20px;
    line-height: 2rem;
    width: 4rem;
    i{
      display: inline-block;
      width: 100%;
      height: 60px;
      line-height: 60px;
      text-align: center;
      border-radius: 2px;
      background-color: #f8f8f8;
      font-size: 30px;
      color: #333;
      transition: all .3s;
    }
    li:first-child{
      position: relative;
      left: 15px;
    }
    p{
      text-align: center;
      display: block;
      color: #666;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
      font-size: 13px;
    }
  }
}


</style>
