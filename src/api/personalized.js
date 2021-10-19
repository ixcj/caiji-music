import { get, post } from '@/plugins/axios'

export default {
  // 推荐新音乐
  newSong: p => get('/personalized/newsong', p),
  // 推荐歌单
  songlist: p => get('/personalized', p),
  // 推荐MV
  mv: p => get('/personalized/mv', p)
}