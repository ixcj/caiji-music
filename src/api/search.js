import { get, post } from '@/plugins/axios'

export default {
  // 搜索
  search: p => get('/cloudsearch', p),
  // 搜索默认关键词
  default: p => get('/search/default', p),
  // 热门搜索
  hot: p => get('/search/hot/detail', p),
  // 搜索建议
  suggest: p => get('/search/suggest', p)
}