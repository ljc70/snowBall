<template>
  <div class="xn-list">
    <ul>
      <li v-for="(item, index) in xnList" :key="index">{{item}}</li>
    </ul>
  </div>
</template>
<script>
export default {
  data() {
    return {
      xnList: ['欢', '迎', '体', '验', '雪', '球', '系', '统']
    }
  },
  methods: {
    test() {
      console.log('sss')
    }
  }
}
</script>
<style lang="less" scoped>
.xn-list {
  ul {
    li {
      height: 40px;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #333;
      border-bottom: 1px solid #e6e6e6;
    }
  }
}
</style>