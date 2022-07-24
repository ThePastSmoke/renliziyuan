import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import { getTime } from '@/utils/auth'
import router from '@/router'
import { error } from 'autoprefixer/lib/utils'

const request = axios.create({
  baseURL: process.env['VUE_APP_BASE_API']
})
// 设置token过期的逻辑
const timeOut = 3600
const checkTime = () => {
  return (Date.now() - getTime()) / 1000 < timeOut
}

// 请求拦截器
request.interceptors.request.use(config => {
  const token = store.getters.token
  // 如果token存在把token注入请求拦截器里
  if (token) {
    // 如果在时间内就存入token
    if (checkTime()) {
      config.headers.Authorization = `Bearer ${token}`
    } else {
      //  超出了token的过期时间跳转到登录界面，删除vuex里的token和用户信息，并提醒用户
      store.dispatch('user/logOut')
      Message.error('登录过期，请重新登录')
      router.push('/login')
      return Promise.reject(error)
    }
  }
  return config
}, error => Promise.reject(error))

// 响应拦截器
request.interceptors.response.use((response) => {
  // 赋值结构
  const { data: { data, message, success }} = response
  // 如果success成功返回正确的数据
  if (success) {
    return data
  }
  // 如果请求数据失败走到这里 提示错误信息，并且往下抛出错误
  Message.error(message || '系统错误')
  return Promise.reject(message || '系统错误')
}, error => {
  // 被动处理
  if (error.response.status === 401) {
    store.dispatch('user/logOut')
    router.push('/login')
  }
  Message.error(error.response?.data?.message || '系统错误')
  return Promise.reject(error)
})

export default request

