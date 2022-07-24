import store from '@/store'
import router from '@/router'
import NProgress from 'nprogress' // 引入一份进度条插件
import 'nprogress/nprogress.css' // 引入进度条样式

const loginPath = '/login'
const noeFoundPath = '/404'

const WhiteList = [loginPath, noeFoundPath]
// 前置守卫
router.beforeEach(async(to, from, next) => {
  NProgress.start() // 开启进度条
  // 引入vuex里的token
  const token = store.getters.token
  // 判断是否存在token
  if (token) {
    // 当token存在 并且用户个人信息id为空的时候去请求用户的个人信息
    if (!store.getters.userId) {
      await store.dispatch('user/getUserInfo')
    }
    // 存在token并且要去的是login界面
    if (to.path === loginPath) {
      // 强制跳转主页
      next('/')
    } else {
      // 有token的情况跳转别的页面 放行
      next()
    }
  } else {
    // 没有token的情况 要去往白名单 放行
    if (WhiteList.includes(to.path)) {
      next()
    } else {
      // 否则跳转登录界面
      next(loginPath)
    }
  }
})

// 后置守卫
router.afterEach(function() {
  NProgress.done() // 关闭进度条
})
