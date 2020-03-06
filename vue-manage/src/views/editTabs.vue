<template>
  <div class="content">
    <el-card style="height:37rem">
      <div slot="header" >
            <span>发布消息</span>
          </div>
    <vue-editor v-model="model.message" placeholder="请输入消息内容" style="height:18rem"></vue-editor>
    <el-button type="primary" @click="publish" class="position">发布</el-button>
  </el-card>
  </div>
</template>

<script>
import { VueEditor } from "vue2-editor";

export default {
  name: '',
  components: {
    VueEditor
  },
  data() {
    return {
      model:{
        message:'',
      }
    };
  },
  methods: {
    async publish(){
      const res = await this.$api.post('/v2/messages',this.model)
      this.model.message = ''
    }
  },
};
</script>

<style lang="scss" scoped>
.content{
  .position{
  margin-top:4.5rem;
  float:right
}
}
</style>
