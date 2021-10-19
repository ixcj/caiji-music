import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store'
import Layout from '@/components/Layout'

import routerViewConfig from './routerViewConfig'

// 改写push方法
const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}
// 改写replace方法
const originalReplace = VueRouter.prototype.replace
VueRouter.prototype.replace = function replace(location) {
  return originalReplace.call(this, location).catch(err => err)
}


Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login'),
    meta: {
      title: '登录网易云账号'
    }
  },
  {
    path: '/',
    component: Layout,
    children: routerViewConfig
  },
]

const router = new VueRouter({
  mode: 'history',
  routes,
  scrollBehavior (to, from, savedPosition) {
    if(to.name === from.name) return
    return new Promise((resolve, reject) => {
      if(savedPosition) {
        setTimeout(() => {
          Vue.nextTick(() => {
            resolve(savedPosition)
          })
        }, store.getters.animationTime + 30)
      } else {
        setTimeout(() => {
          resolve({ x: 0, y: 0 })
        }, store.getters.animationTime)
      }
    })
  }
})

router.beforeEach((to, from, next) => {
  const mustLogin = ['User'] // 必须要登录的页面
  if(to.name === 'Login') {
    if(store.getters.userInfo.userId) {
      next({
        name: 'User'
      })
      return
    }
  } else if(mustLogin.includes(to.name)) {
    if(!store.getters.userInfo.userId) {
      next({
        name: 'Login'
      })
      return
    }
  }
  next()
})

router.afterEach((to, from) => {
  const { name, params, query, path } = to
  // 记录路由历史
  store.commit('history/setHistoryArr', { name, params, query, path })
})

// 节流,给back函数添加500ms冷却时间
let state = true
router.back = function() {
  if(state) {
    state = false
    this.go(-1)
    setTimeout(() => {
      state = true
    }, 500)
  }
}

export default router
