import { get, post } from '@/plugins/axios'

export default {
  // 推荐新音乐
  newSong: p => post('/personalized/newsong', p),
  // 推荐歌单
  songlist: p => post('/personalized', p),
  // 推荐MV
  mv: p => post('/personalized/mv', p)
}