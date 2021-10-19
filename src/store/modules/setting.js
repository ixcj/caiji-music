import { theme as themeConfig } from '@/config'
import { autoTextColor } from '@/utils/color'

// 防止添加主题配置项后老版本有缓存而不更新
const theme = localStorage.getItem('theme')
  ? JSON.parse(localStorage.getItem('theme'))
  : Object.assign({}, themeConfig)
Object.keys(themeConfig).map(key => {
  if(!theme[key]) {
    theme[key] = themeConfig[key]
  }
})

export default {
  namespaced: true,

  state: {
    // 主题
    theme,
    // 播放方式，循环-单曲-随机
    playType: localStorage.getItem('playType')
      ? localStorage.getItem('playType')
      : 'orderPlay'
  },

  mutations: {
    // 设置主题色
    setMainColor(state, value) {
      if(state.theme.autoTextColor) {
        state.theme.textColor = autoTextColor(value)
      }
      state.theme.mainColor = value
      localStorage.setItem('theme', JSON.stringify(state.theme))
    },
    // 设置文字颜色
    setTextColor(state, value) {
      state.theme.textColor = value
      localStorage.setItem('theme', JSON.stringify(state.theme))
    },
    // 是否自动文字颜色
    setAutoTextColor(state, value) {
      state.theme.autoTextColor = value
      localStorage.setItem('theme', JSON.stringify(state.theme))
    },
    // 设置背景色
    setBgColor(state, value) {
      state.theme.bgColor = value
      localStorage.setItem('theme', JSON.stringify(state.theme))
    },
    // 设置动画速度
    setAnimationTime(state, value) {
      state.theme.animationTime = value
      localStorage.setItem('theme', JSON.stringify(state.theme))
    },
    // 设置页面动画
    setPageAnimation(state, value) {
      state.theme.pageAnimation = value
      localStorage.setItem('theme', JSON.stringify(state.theme))
    },
    // 设置封面动效
    setDynamicEffect(state, value) {
      state.theme.dynamicEffect = value
      localStorage.setItem('theme', JSON.stringify(state.theme))
    },

    // 设置播放方式
    setPlayType(state, value) {
      state.playType = value
      localStorage.setItem('playType', state.playType)
    },
  },

  actions: {}
}