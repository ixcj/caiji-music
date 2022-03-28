import { get, post } from '@/plugins/axios'

export default {
  // 获取歌单详情
  playlistDetail: p => post('/playlist/detail', p),
  // 获取专辑详情
  album: p => post('/album', p),
}