import store from '@/store'

export const mixins = {
  methods: {
    checkPermission(key) {
      // console.log(store.state.user.userInfo.roles?.points)
      return !store.state.user.userInfo?.roles?.points.includes(key)
    }
  }
}
