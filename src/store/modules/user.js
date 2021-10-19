import login from '@/api/login'

export default {
  namespaced: true,
  
  state: {
    // 用户信息
    userInfo: localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : {}
  },

  mutations: {
    // 保存用户信息
    setUserInfo(state, value) {
      state.userInfo = value
      localStorage.setItem('userInfo', JSON.stringify(state.userInfo))
    }
  }
}