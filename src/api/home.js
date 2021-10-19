import { get, post } from '@/plugins/axios'

export default {
  // banner
  banner: p => get('/banner', p),
}