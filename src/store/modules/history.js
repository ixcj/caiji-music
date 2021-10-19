export default {
  namespaced: true,
  
  state: {
    // 路由历史记录
    historyArr: sessionStorage.getItem('historyArr') ? JSON.parse(sessionStorage.getItem('historyArr')) : [],
    // 搜索历史
    searchHistory: localStorage.getItem('searchHistory') ? localStorage.getItem('searchHistory').split(',') : [],
  },

  mutations: {
    // 设置路由历史记录
    setHistoryArr(state, routerInfo) {
      if(state.historyArr.length > 1) {
        const prevRouter = state.historyArr[state.historyArr.length - 2]
        if(prevRouter.name == routerInfo.name) {
          state.historyArr.pop()
        } else {
          state.historyArr.push(routerInfo)
        }
      } else {
        state.historyArr.push(routerInfo)
      }
      sessionStorage.setItem('historyArr', JSON.stringify(state.historyArr))
    },
    // 添加搜索历史
    addSearchHistory(state, item) {
      state.searchHistory.includes(item)
        ? (
            state.searchHistory.splice(state.searchHistory.indexOf(item), 1),
            state.searchHistory.splice(0, 0, item)
          )
        : state.searchHistory.unshift(item)
      if(state.searchHistory.length > 10) { // 只保留10个历史
        state.searchHistory.length = 10
      }
      localStorage.setItem('searchHistory', state.searchHistory)
    },
    // 删除搜索历史
    deleteSearchHistory(state, item) {
      item === 'all'
        ? state.searchHistory = []
        : state.searchHistory.splice(state.searchHistory.indexOf(item), 1)
      localStorage.setItem('searchHistory', state.searchHistory)
    },
  },

  actions: {},
}