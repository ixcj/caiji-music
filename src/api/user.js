import { get, post } from '@/plugins/axios'

export default {
  // 获取用户信息
  userAccount: p => post('/user/account', p)
}