<template>
  <div class="content">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-message" style="padding-right:3px"></i>消息</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <el-tabs v-model="message">
        <el-tab-pane :label="`未读消息(${unread.length})`" name="first">
          <el-table :data="unread" :show-header="false" style="width:100%">
            <el-table-column>
              <template slot-scope="scope">
                <span class="message_title" v-html="`${scope.row.message}`"></span>
              </template>            
            </el-table-column>
            <el-table-column prop="date" width="200" :formatter="formatter"></el-table-column>
            <el-table-column width="120">
              <template slot-scope="scope">
                <el-button size="small" @click="readMessage(scope.$index)">标为已读</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="buttonstyle">
            <el-button type="primary" size="medium" @click="readAll">全部标为已读</el-button>
          </div>
        </el-tab-pane>
        <!-- 已读消息 -->
        <el-tab-pane :label="`已读消息(${read.length})`" name="second">
          <el-table :data="read" :show-header="false" style="width:100%">
            <el-table-column>
              <template slot-scope="scope">
                <span class="message_title" v-html="`${scope.row.message}`"></span>
              </template>            
            </el-table-column>
            <el-table-column prop="date" width="180" :formatter="formatter"></el-table-column>
            <el-table-column width="120">
              <template slot-scope="scope">
                <el-button size="small" type="danger" @click="delMessage(scope.$index)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="buttonstyle">
            <el-button type="danger" size="medium" @click="delAll">全部删除</el-button>
          </div>
        </el-tab-pane>
        <!-- 删除消息 -->
        <el-tab-pane :label="`回收站(${recycle.length})`" name="third">
          <el-table :data="recycle" :show-header="false" style="width:100%">
            <el-table-column>
              <template slot-scope="scope">
                <span class="message_title" v-html="`${scope.row.message}`"></span>
              </template>            
            </el-table-column>
            <el-table-column prop="date" width="180" :formatter="formatter"></el-table-column>
            <el-table-column width="120">
              <template slot-scope="scope">
                <el-button size="small" type="primary" @click="resMessage(scope.$index)">还原</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="buttonstyle">
            <el-button type="danger" size="medium" @click="emptyMes">清空回收站</el-button>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import dayjs from 'dayjs';
import bus from '../components/bus'
export default {
  name: '',
  data() {
    return {
      message:'first',
      unread:[],
      read:[],
      recycle:[]
    };
  },
  methods: {
    formatter(row, column) {
        const time = dayjs(row.date).format('YYYY-MM-DD HH:mm:ss')
        return time
      },
    async init(){
      const res = await this.$api.get('/v2/messages')
      this.unread = res.data
      bus.$emit('message',this.unread.length)
    },
    readMessage(index){
      const item = this.unread.splice(index,1)
      this.read = this.read.concat(item)
      bus.$emit('message',this.unread.length)
    },
    readAll(){
      const items = this.unread.splice(0)
      this.read = this.read.concat(items)
      bus.$emit('message',this.unread.length)
    },
    delMessage(index){
      const item = this.read.splice(index,1);
      this.recycle = this.recycle.concat(item)
    },
    delAll(){
      const items = this.read.splice(0);
      this.recycle = this.recycle.concat(items)
    },
    resMessage(index){
      const item = this.recycle.splice(index,1);
      this.read = this.read.concat(item)
    },
     emptyMes(){
       let newArray = [];
       this.recycle.forEach(item=>{
         (item._id || item._id==0)&& newArray.push(item._id)
       })
       this.$api.delete(`/multiple/${newArray.toString()}`)
       this.recycle = []
    }
  },
  created(){
    this.init()
  }
};
</script>

<style scoped>
.buttonstyle{
  margin-top: 20px;
}
</style>
