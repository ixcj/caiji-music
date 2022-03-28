import { get, post } from '@/plugins/axios'

export default {
  // 推荐新音乐
  topSong: p => post('/top/song', p),
  // 获取音乐详情
  detail: p => post('/song/detail', p),
  // 获取音乐url
  url: p => post('/song/url', p),
  // 获取歌词
  lyric: p => post('/lyric', p)
}