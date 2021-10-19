import { get, post } from '@/plugins/axios'

export default {
  // 推荐新音乐
  topSong: p => get('/top/song', p),
  // 获取音乐详情
  detail: p => get('/song/detail', p),
  // 获取音乐url
  url: p => get('/song/url', p),
  // 获取歌词
  lyric: p => get('/lyric', p)
}