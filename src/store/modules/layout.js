import { noCachedPages } from '@/router/routerViewConfig'

export default {
  namespaced: true,
  
  state: {
    // 全局消息框
    message: {
      content: '',
      color: '',
      timeout: -1,
      isShow: false
    },
    // 不缓存的页面
    exclude: noCachedPages
  },

  mutations: {    
    // 设置message
    setMessage(state, value) {
      const message = {
        content: '',
        color: 'success',
        timeout: 3000,
        isShow: true
      }
      if(typeof value == 'string') {
        message.content = value
      } else {
        Object.keys(value).map(key => {
          message[key] = value[key]
        })
      }
      state.message = message
    }
  },

  actions: {},
}