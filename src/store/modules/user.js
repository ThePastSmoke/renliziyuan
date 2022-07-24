// 状态
import { getToken, removeToken, setTime, setToken } from '@/utils/auth'
import { getUserDetailById, getUserInfo, login } from '@/api/user'

const state = {
  token: getToken(),
  userInfo: {}
}
// 修改状态
const mutations = {
  // 存储token vuex cookie
  setToken(state, token) {
    state.token = token
    setToken(token)
  },
  // 删除token
  removeToken(state) {
    state.token = null
    removeToken()
  },
  // 清空用户个人信息
  removeUserInfo(state) {
    state.userInfo = {}
  },
  // 修改userinfo数据
  setUserInfo(state, userInfo) {
    state.userInfo = userInfo
  }
}
// 执行异步
const actions = {
  // 登录存储用户token
  async login(context, data) {
    const res = await login(data)
    setTime()
    context.commit('setToken', res)
  },
  //  请求用户个人信息
  async getUserInfo(context) {
    const res = await getUserInfo()
    const baseImg = await getUserDetailById(res.userId)
    context.commit('setUserInfo', { ...res, ...baseImg })
  },
  // 退出用户
  logOut(context) {
    context.commit('removeToken')
    context.commit('removeUserInfo')
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
