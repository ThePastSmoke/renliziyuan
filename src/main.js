import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets
// 全局组件
import components from '@/components/index'
// 引入全局过滤器
import * as filter from '@/filters/index'

Object.keys(filter).forEach(item => {
  Vue.filter(item, filter[item])
})
Vue.use(components)

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en' // lang i18n
import Print from 'vue-print-nb'

Vue.use(Print)
import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control

// 一次性注册多个指令
import * as directive from '@/directives/index'

for (const key in directive) {
  Vue.directive(key, directive[key])
}

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
// if (process.env.NODE_ENV === 'production') {
//   const { mockXHR } = require('../mock')
//   mockXHR()
// }

// set ElementUI lang to EN
// Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
Vue.use(ElementUI)

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
