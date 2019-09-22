<!--
 * @Author: lanjicen
 * @LastEditors: lanjicen
 * @Description: 
 * @Date: 2019-08-15 15:20:50
 * @LastEditTime: 2019-08-15 15:29:42
 -->
<template>
  <div class="xn-tab">
    <ul>
      <li
        v-for="(item, index) in xnTabList"
        :class="tabIndex === index ? 'active' : ''"
        :key="index"
        @click="tab(index)">
        {{item}}
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  data() {
    return {
      tabIndex: 0,
      xnTabList: ['tab1', 'tab2', 'tab3']
    }
  },
  methods: {
    tab(index) {
      this.tabIndex = index
    }
  }
}
</script>
<style lang="less" scoped>
.xn-tab {
  ul {
    display: flex;
    li {
      flex: 1;
      color: #333;
      height: 60px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    li.active {
      color: #ff4444;
      border-bottom: 1px solid #ff4444;
    }
  }
}
</style>