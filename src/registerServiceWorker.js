/* eslint-disable no-console */

import { register } from 'register-service-worker'

if (process.env.NODE_ENV === 'production') {
  register(`${process.env.BASE_URL}service-worker.js`, {
    ready () {
      console.log(
        '应用正在由一个service worker从缓存中提供服务.\n' +
        '欲了解更多详情，请访问 https://goo.gl/AFskqB'
      )
    },
    registered () {
      console.log('ServiceWorker已注册.')
    },
    cached () {
      console.log('内容已缓存以供脱机使用.')
    },
    updatefound () {
      console.log('正在下载新内容.')
    },
    updated (registration) {
      console.log('提供新内容,请刷新.')
      window.newVersionLoad(registration)
    },
    offline () {
      console.log('没有找到互联网连接,应用正在离线模式下运行.')
    },
    error (error) {
      console.error('注册ServiceWorker时出错:', error)
    }
  })
}
