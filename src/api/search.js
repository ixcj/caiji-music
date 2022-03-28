import { get, post } from '@/plugins/axios'

export default {
  // 搜索
  search: p => post('/cloudsearch', p),
  // 搜索默认关键词
  default: p => post('/search/default', p),
  // 热门搜索
  hot: p => post('/search/hot/detail', p),
  // 搜索建议
  suggest: p => post('/search/suggest', p)
}