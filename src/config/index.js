// 网站title
const title = process.env.VUE_APP_TITLE || '菜鸡音乐'
// 作者
const author = process.env.VUE_APP_AUTHOR ||'xcj'
// 域
const domain = process.env.VUE_APP_DOMAIN || 'music.xcj.im'
// 完整的域
const fullDomain = process.env.VUE_APP_FULL_DOMAIN || 'https://music.xcj.im/'
// 网站关键词
const keywords = `${ title },${ author },${ domain },音乐,播放器,前端,VUE`
// 网站描述
const description = `${ title }是一款由${ author }编写的在线音乐应用，提供歌曲搜索、免费歌曲在线试听、MV播放等功能。`
// og:image
const ogImage = `${ fullDomain }img/icons/android-chrome-192x192.png`

// 接口地址
const BASE_API = process.env.VUE_APP_BASE_API || 'https://api.music.xcj.im/'
// 本地调试接口地址
const DEV_API = '/dev-api'
// 调试时是否启用代理
const devServerProxy = true

// 播放列表最大长度
const waitingPlayListMaxLength = 1000
// 默认专辑封面
const defaultAlbumArt = 'https://s4.music.126.net/style/web2/img/default/default_album.jpg'

// 默认主题
const theme = {
  mainColor: '#1e88e5', // 主题色
  textColor: '#ffffff', // 文字颜色
  autoTextColor: true, // 自动文字颜色
  bgColor: '#f9f9f9', // 页面背景色
  animationTime: 200, // 动画时间
  pageAnimation: 'scroll-x-transition', // 页面动画
  dynamicEffect: 'LonelyPlanet', // 完整播放器封面动效
}

// about页面的链接
const aboutUrls = [
  {
    text: 'github',
    value: 'https://github.com/ixcj/caiji-music'
  }
]

// 菜单列表
const menuList = [
  {
    to: '/',
    icon: 'mdi-home',
    text: '首页'
  },
  {
    to: '/setting',
    icon: 'mdi-cog',
    text: '设置'
  },
  {
    to: '/about',
    icon: 'mdi-information',
    text: '关于'
  }
]

module.exports = {
  title,
  author,
  domain,
  fullDomain,
  keywords,
  description,
  ogImage,
  BASE_API,
  DEV_API,
  devServerProxy,
  theme,
  waitingPlayListMaxLength,
  defaultAlbumArt,

  // 接口超时时间
  timeout: 10000,
  // 接口请求失败重新请求次数
  retry: 3,
  // 重新请求间隔时间
  retryDelay: 3000,

  aboutUrls,
  
  menuList,
}