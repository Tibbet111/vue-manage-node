<template>
  <div class="content">
    <vue-editor v-model="model.message" placeholder="请输入消息内容"></vue-editor>
    <el-button type="primary" @click="publish" class="position">发布</el-button>
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
  margin-top:15px;
  float:right
}
}
</style>
