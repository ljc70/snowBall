import Vue from 'vue'
import axios from 'axios'

import App from './App'
import router from './router'
import store from './store'
import './assets/js/element'
import './assets/js/setOutFileBase'
import './assets/style/reset.css'
import { runExec } from '../renderer/assets/js/runTmp'
// 先查询1112端口是否被占用，如果被占用找到对应到pid并杀掉进程，释放1112端口
import '../renderer/assets/js/stopTmp'

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

// 演示进程启动好之后在启动主进程
runExec(res => {
  res = res.toString()
  console.log('runExecSuccess~~~', res)
  if (res.includes('webpack output is served')) {
    console.log('jjj')
    /* eslint-disable no-new */
    new Vue({
      components: { App },
      router,
      store,
      template: '<App/>'
    }).$mount('#app')
  }
})
