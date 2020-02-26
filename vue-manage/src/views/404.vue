<template>
  <div class="container">
    <div class="http404">
      <div class="pic-404">
        <img class="pic-404-parent" src="../assets/404.png">
        <img class="pic-404-child left" src="../assets/404_cloud.png">
        <img class="pic-404-child mid" src="../assets/404_cloud.png">
        <img class="pic-404-child right" src="../assets/404_cloud.png">
      </div>
      <div class="bullshit">
        <div class="bullshit-oops">Oops!</div>
        <div class="bullshit-headline">出错了，无法访问该页面！</div>
        <div class="bullshit-info">请检查你输入的URL是否出错，或者点击下方按钮返回首页</div>
        <a href="" class="bullshit-return" @click.prevent="back">返回首页</a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: '',
  data() {
    return {
    };
  },
  methods: {
    back(){
      this.$router.push('/')
    }
  },
};
</script>

<style lang="scss" scoped>
.container{
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-40%,-50%);
  .http404{
    position: relative;
    float: left;
    padding: 0 50px;
    overflow: hidden;
    width: 1200px;
    .pic-404{
      position: relative;
      float: left;
      width: 600px;
      overflow: hidden;
      &-parent{
        width: 100%;
      }
      &-child{
        position: absolute;
        &.left{
          width: 80px;
          top: 17px;
          left: 220px;
          opacity: 0;
          animation: leftCloud 2s linear 1s infinite  forwards;
        }
        &.mid{
          width: 46px;
          top: 10px;
          left: 420px;
          opacity: 0;
          animation: midCloud 2s linear 1.2s infinite  forwards;
        }
        &.right{
          width: 62px;
          top: 100px;
          left: 500px;
          opacity: 0;
          animation: rightCloud 2s linear 1s infinite  forwards;
        }
        @keyframes leftCloud {
          0%{
            top: -3px;
            left: 200px;
            opacity: 0;
          }
          20%{
            top: 13px;
            left: 168px;
            opacity: 1;
          }
          80%{
            top: 61px;
            left: 72px;
            opacity: 1;
          }
          100%{
            top: 77px;
            left: 40px;
            opacity: 0;
          }
        }
        @keyframes midCloud {
          0%{
            top: 10px;
            left: 420px;
            opacity: 0;
          }
          20%{
            top: 40px;
            left: 360px;
            opacity: 1;
          }
          80%{
            top: 130px;
            left: 180px;
            opacity: 1;
          }
          100%{
            top: 160px;
            left: 120px;
            opacity: 0;
          }
        }
        @keyframes rightCloud {
          0%{
            top: 100px;
            left: 500px;
            opacity: 0;
          }
          20%{
            top: 120px;
            left: 460px;
            opacity: 1;
          }
          80%{
            top: 180px;
            left: 340px;
            opacity: 1;
          }
          100%{
            top: 200px;
            left: 300px;
            opacity: 0;
          }
        }
      }
    }
    .bullshit{
      position: relative;
      float: left;
      width: 300px;
      padding: 30px 0;
      overflow: hidden;
      &-oops{
        font-weight: bold;
        font-size: 32px;
        line-height: 40px;
        color: #1482f0;
        opacity: 0;
        animation: slideUp .5s forwards;
      }
      &-headline{
        font-size: 20px;
        color: #222;
        line-height: 24px;
        font-weight: bold;
        margin: 20px 0;
        opacity: 0;
        animation: slideUp .5s .1s forwards;
      }
      &-info{
        color: gray;
        line-height: 21px;
        font-size: 13px;
        margin: 20px 0;
        opacity: 0;
        animation: slideUp .5s .2s forwards;
      }
      &-return{
        display: block;
        float: left;
        width: 110px;
        height: 36px;
        border-radius: 100px;
        color: #ffffff;
        font-size: 14px;
        background: #1482f0;
        line-height: 36px;
        cursor: pointer;
        text-align: center;
        opacity: 0;
        animation: slideUp .5s .3s forwards;
      }
      @keyframes slideUp {
        0%{
          transform: translateY(60px);
          opacity: 0;
        }
        100%{
          transform: translateY(0);
          opacity: 1;
        }
      }
    }
  }
}
</style>
