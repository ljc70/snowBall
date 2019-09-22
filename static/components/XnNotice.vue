<!--
 * @Author: lanjicen
 * @LastEditors: lanjicen
 * @Description: 
 * @Date: 2019-08-15 14:50:28
 * @LastEditTime: 2019-08-15 15:16:51
 -->
<template>
  <div class="xn-notice" ref="notice">
    <div class="content">
      <p :style="adObj">{{content}}</p>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      data: ''
    }
  },
  props: {
    content: {
      type: String,
      default: '欢迎体验雪球系统'
    }
  },
  computed: {
    adObj() {
      const length = this.content.length
      let time = length > 24 ? Math.ceil(length / 3) : 8
      return {
        width: `${length}em`,
        animationDuration: `${time}s`
      }
    }
  }
}
</script>

<style lang="less" scoped>
.xn-notice {
  width: 375px;
  height: 45px;
  color: #ed6a0c;
  font-size: 12px;
  -webkit-overflow-scroll: touch;
  background: #fffbe8;
  display: flex;
  align-items: center;
  .content p {
    animation: notice-move linear infinite;
  }
}
@keyframes notice-move {
  0% {
    transform: translateX(100vw);
  }
  100% {
    transform: translateX(-100%);
  }
}
</style>
