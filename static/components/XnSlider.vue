<template>
  <div class="xn-slider" ref="slider">
    <div class="item">1</div>
    <div class="item">2</div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      data: ''
    }
  },
  methods: {}
}
</script>
<style lang="less" scoped>
.xn-slider {
  width: 750px;
  height: 160px;
  clear: both;
  animation: move 4s infinite;
  .item {
    float: left;
    width: 375px;
    height: 100%;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #1989fa;
  }
}

@keyframes move {
  0% {
    transform: translateX(0px);
  }
  50% {
    transform: translateX(-375px);
  }
  100% {
    transform: translateX(0px);
  }
}
</style>