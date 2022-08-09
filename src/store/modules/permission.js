import { constantRoutes, asyncRoutes } from '@/router'

const state = {
  routes: constantRoutes
}

const mutations = {
  setRouts(state, newRoutes) {
    state.routes = [...constantRoutes, ...newRoutes]
  }
}
const actions = {
  filterRoutes(context, menus) {
    const resRoutes = asyncRoutes.filter(item => {
      return menus.includes(item.name)
    })
    context.commit('setRouts', resRoutes)
    return resRoutes
  }
}

export default {
  // 开启独立的命名空间
  namespaced: true,
  state,
  mutations,
  actions
}
