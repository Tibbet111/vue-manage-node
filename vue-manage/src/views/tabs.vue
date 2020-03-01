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
                <el-button size="small" @click="readMessage(scope.$index,scope.row)">标为已读</el-button>
              </template>
            </el-table-column>
          </el-table>
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
        </el-table>       
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
      curId : JSON.parse(localStorage.user)._id
    };
  },
  methods: {
    formatter(row, column) {
        const time = dayjs(row.date).format('YYYY-MM-DD HH:mm:ss')
        return time
      },
    async init(){
      const res = await this.$api.get('/v2/messages')
      const unreadMsg = res.data
      const readMsg = await this.$api.get(`/message/msg?id=${this.curId}`)
      const readMessage = readMsg.data
      const arr = []
      for(let i =0;i<unreadMsg.length;i++){
        const item = unreadMsg[i]
        if(!readMessage.some(v=> v.messageId._id === item._id)){
          arr.push(item)
        }
      }
      arr.sort((a,b)=>a>b?1:-1)
      this.unread = arr
      this.read = readMessage.map(item=>{
        return item.messageId
      })
      bus.$emit('message',this.unread.length)
    },
    //读消息
    readMessage(index,row){
      const item = this.unread.splice(index,1)
      this.read = this.read.concat(item)
      let para = {
        userId:this.curId,
        messageId:row._id
      }
      this.$api.post('/message/readMessage',para).then(res=>{
        console.log(res);
      })
      bus.$emit('message',this.unread.length)
    },    
  },
  created(){
    this.init()
  }
};
</script>

<style scoped>

</style>
