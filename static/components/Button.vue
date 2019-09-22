<template>
  <div class="xn-button">
    <button class="button">123</button>
  </div>
</template>
<script>
export default {
  data() {
    return {
      data: ''
    }
  },
  mounted() {
    let data = 1
    if (data > 0) {
      console.log('hahah')
    }
  },
  methods: {
    test() {
      console.log('jjjjjjj')
    },
    test11() {
      this.data = 'da'
    }
  }
}
</script>
<style lang="less" scoped>
 .button {
   background: green;
 }
</style>


