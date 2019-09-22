<template>
  <div class="xn-input">
    <label class="label-box" :style="styleObj">
      <h4 class="title">{{title}}</h4>
      <input :placeholder="msg" ref="inp" type="text" v-bind="$attrs" @input="inputchange($event)" @focus="blueBorder($event)" @blur="lightBorder" :value="value"/>
      <div class="clear-box" v-show="showClose" @click="clear">
        <em></em>
      </div>
    </label>
  </div>
</template>
<script>
export default {
  data() {
    return {
      showClose: false,
      styleObj: {
        borderBottom: '1px solid #EDEDED'
      }
    }
  },
  props: {
    title: {
      type: String,
      default: ''
    },
    msg: {
      type: String,
      default: ''
    },
    value: {
      type: String,
      default: ''
    }
  },
  methods: {
    inputchange (e) {
      this.showClose = e.target.value !== ''
      this.$emit('input', e.target.value)
    },
    clear () {
      this.showClose = false
      this.$refs.inp.value = ''
      this.$emit('input', '')
    },
    lightBorder () {
      this.showClose = false
      this.styleObj.borderBottom = '1px solid #EDEDED'
    },
    blueBorder (e) {
      this.showClose = e.target.value !== '' && e.target.getAttribute('readonly') === null
      if (e.target.getAttribute('readonly') === null) {
        this.styleObj.borderBottom = '1px solid #4763FF'
      }
    }
  }
}
</script>

<style scoped lang="less">
.xn-input {
  .label-box {
    display: block;
    margin: 0 50px;
    position: relative;
    padding-top: 40px;
    .title {
      font-family: PingFangSC-Regular;
      font-size: 13px;
      color: #A9AFB8;
      line-height: 13px;
      font-weight: normal;
    }
    input {
      width: 100%;
      height: 42px;
      padding: 2px 0 16px;
      font-size: 15px;
      font-family: PingFangSC-Regular;
      color: #3F4567;
      caret-color: #2C4AF0;
    }
    input[disabled],input:disabled,input.disabled{
      color: #3F4567;
      -webkit-text-fill-color:#3F4567;
      opacity: 1;
    }
    .clear-box {
      width: 42px;
      height: 64px;
      position: absolute;
      right: 0;
      bottom: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      em {
        display: block;
        width: 26px;
        height: 26px;
        background: url('//images.51nbapi.com/images/sassH5/realName/icon_sc@2x.png') no-repeat;
        background-size: 100% 100%;
      }
    }
  }
}
</style>
