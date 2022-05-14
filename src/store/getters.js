export default {
  // 布局
  message: state => state.layout.message,

  // 用户
  userInfo: state => state.user.userInfo,
  vipType: state => state.user.userInfo.vipType,
  cookie: state => state.user.userInfo.cookie,

  // 历史
  historyArr: state => state.history.historyArr,
  searchHistory: state => state.history.searchHistory,

  // 设置
  mainColor: state => state.setting.theme.mainColor,
  textColor: state => state.setting.theme.textColor,
  autoTextColor: state => state.setting.theme.autoTextColor,
  bgColor: state => state.setting.theme.bgColor,
  animationTime: state => state.setting.theme.animationTime,
  pageAnimation: state => state.setting.theme.pageAnimation,
  dynamicEffect: state => state.setting.theme.dynamicEffect,
  playType: state => state.setting.playType,
  isTranslate: state => state.setting.isTranslate,

  // 歌曲
  currentSongInfo: state => state.song.currentSongInfo,
  currentPlayTime: state => state.song.currentPlayTime,
  waitingPlayList: state => state.song.waitingPlayList,
  musicUrl: state => state.song.musicUrl
}