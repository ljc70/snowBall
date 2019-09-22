import Vue from 'vue'
import Router from 'vue-router'

const Home = resolve => require(['@/view/home/Home'], resolve) // 主页

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
