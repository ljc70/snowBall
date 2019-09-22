<template>
  <div class="demo">111</div>
</template>
<script>
  module.export = {
    data() {
      return {
        haha: '123'
      }
    },
    created() {
      console.log('hahaha')
    },
    mounted() {
      console.log('111')
      console.log('11190')
    },
    methods: {
      test() {
        console.log(123)
      }
    }
  }
</script>
<style scoped>
  .demo {
    display: block;
    background: #66FF00;
  }
</style>