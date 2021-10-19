import songApi from '@/api/song'
import { waitingPlayListMaxLength } from '@/config'

export default {
  namespaced: true,

  state: {
    // 当前播放音乐的信息
    currentSongInfo: localStorage.getItem('currentSongInfo') ? JSON.parse(localStorage.getItem('currentSongInfo')) : {},
    // 当前播放时间
    currentPlayTime: localStorage.getItem('currentPlayTime') ? JSON.parse(localStorage.getItem('currentPlayTime')) : 0,
    // 等待播放的列表
    waitingPlayList: localStorage.getItem('waitingPlayList') ? JSON.parse(localStorage.getItem('waitingPlayList')) : [],
    // 当前播放音乐的Url
    musicUrl: ''
  },

  mutations: {
    setCurrentSongInfo(state, value) {
      state.currentSongInfo = value
      localStorage.setItem('currentSongInfo', JSON.stringify(state.currentSongInfo))
    },
    setCurrentPlayTime(state, value) {
      state.currentPlayTime = value
      localStorage.setItem('currentPlayTime', JSON.stringify(state.currentPlayTime))
    },
    setWaitingPlayList(state, value) {
      state.waitingPlayList = value
      state.waitingPlayList.length > waitingPlayListMaxLength
        && (state.waitingPlayList.length = waitingPlayListMaxLength)
      localStorage.setItem('waitingPlayList', JSON.stringify(state.waitingPlayList))
    },
    setMusicUrl(state, object) {
      const { url, bottomPlayer } = object
      if(url && bottomPlayer) {
        bottomPlayer.musicPause()
        bottomPlayer.player.currentTime = bottomPlayer.currentTime = 0
      }
      state.musicUrl = url
      if(bottomPlayer) {
        setTimeout(() => {
          bottomPlayer.loading = false
          bottomPlayer.musicPlay()
        }, 50);
      }
    }
  },

  actions: {
    playAll(context, object) {
      const { playlist, bottomPlayer } = object
      
      context.commit('setWaitingPlayList', playlist)
      context.commit('setCurrentSongInfo', playlist[0])
      context.dispatch('getCurrentSongUrl', { bottomPlayer })
    },
    getSongInfoAndUrl(context, object) {
      const { songInfo, bottomPlayer } = object
      const isId = songInfo?.id ? false : true
      const id = isId ? songInfo : songInfo.id
      
      // 同一首歌直接开始播放
      if(id === context.state.currentSongInfo.id) {
        bottomPlayer.musicPlay()
        return
      }

      // bottomPlayer.musicPause()
      // bottomPlayer.player.currentTime = bottomPlayer.currentTime = 0

      const waitingPlayList = [...context.state.waitingPlayList]
      const index = waitingPlayList.findIndex(item => item.id == id)

      if(index == -1) {
        if(isId) {
          bottomPlayer.loading = true

          songApi.detail({
            ids: id
          }).then(res => {
            const songInfo = res.songs[0]
            const privilege = res.privileges[0]
            privilege && (songInfo.privilege = privilege)
            context.dispatch('getCurrentSongUrl', { songInfo, bottomPlayer })
          }).catch(() => {
            bottomPlayer.loading = false
          })
        } else {
          context.dispatch('getCurrentSongUrl', { songInfo, bottomPlayer })
        }
      } else {
        // context.commit('setCurrentSongInfo', waitingPlayList[index])
        context.dispatch('getCurrentSongUrl', { songInfo: waitingPlayList[index], bottomPlayer, index })
      }
    },

    getCurrentSongUrl(context, param) {
      const songInfo = param?.songInfo || null
      const bottomPlayer = param?.bottomPlayer || null
      const index = param?.index

      const currentSongInfo = songInfo || context.state.currentSongInfo
      const { id } = currentSongInfo

      function setSongInfo() {
        if(index || index === 0) {
          context.commit('setCurrentSongInfo', songInfo)
        } else if(songInfo) {
          const waitingPlayList = [...context.state.waitingPlayList]
          waitingPlayList.unshift(songInfo)
          context.commit('setWaitingPlayList', waitingPlayList)
          context.commit('setCurrentSongInfo', songInfo)
        }
      }

      // if(bottomPlayer) {
      //   bottomPlayer.musicPause()
      //   bottomPlayer.player.currentTime = bottomPlayer.currentTime = 0
      // }

      if(currentSongInfo.privilege.fee !== 1 && currentSongInfo.privilege.fee !== 4) {
        setSongInfo()
        context.commit('setMusicUrl', { url: `https://music.163.com/song/media/outer/url?id=${ id }.mp3`, bottomPlayer })
      } else {
        if(bottomPlayer) {
          bottomPlayer.loading = true
        }
        
        songApi.url({ id }).then(res => {
          const url = res.data[0].url ? res.data[0].url.replace('http://', '//') : null
          if(url) {
            setSongInfo()
            context.commit('setMusicUrl', { url, bottomPlayer })
          } else {
            context.commit('layout/setMessage',{
              content: `获取歌曲资源失败！${!res.data[0]?.freeTrialPrivilege.userConsumable && '该歌曲不支持免费试听！'}`,
              color: 'error',
              timeout: 3000,
              isShow: true
            }, {root: true})
          }
          
          if(res.data[0].freeTrialInfo !== null) {
            const auditionLength = res.data[0].freeTrialInfo.end - res.data[0].freeTrialInfo.start

            context.commit('layout/setMessage',{
              content: `VIP曲库，您可试听${ auditionLength }秒`,
              color: 'warning',
              timeout: 3000,
              isShow: true
            }, {root: true})
          }
        }).finally(() => {
          if(bottomPlayer) {
            bottomPlayer.loading = false
          }
        })
      }
    }
  },
}