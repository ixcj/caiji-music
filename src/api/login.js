import { get, post } from '@/plugins/axios'

export default {
  // 手机登录
  phoneLogin: p => post(`/login/cellphone`, p),
  // 邮箱登录
  emailLogin: p => post(`/login`, p),

  // 二维码key生成
  qrKey: p => post(`/login/qr/key`, p),
  // 二维码生成
  qrCreate: p => post(`/login/qr/create`, p),
  // 二维码检测扫码状态
  qrCheck: p => post(`/login/qr/check`, p),

  // 发送验证码
  captchaSent: p => post('/captcha/sent', p),
  // 验证验证码
  captchaVerify: p => post('/captcha/verify', p),
  // 检测手机号码是否已注册
  cellphoneCheck: p => post('/cellphone/existence/check', p),

  // 刷新登录
  refreshLogin: p => post('/login/refresh', p),
  
  // 退出登录
  logout: p => post('/logout', p)
}