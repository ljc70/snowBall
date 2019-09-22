<template>
  <div class='test'>这里是测试组件～～～</div>
</template>

<script>
  // @ is an alias to /src
  export default {
    components: {},
    data() {
      return {

      }
    },
    computed: {},
    watch: {},
    methods: {
      hello() {
        console.log('l')
      }
    },
    created() {},
    mounted() {},
    updated() {},
    beforeDestroy() {}
  }
</script>
<style lang='less' scoped>
  .test {
    width: 300px;
    height: 40px;
    color: #fff;
    background: blue;
  }
</style>