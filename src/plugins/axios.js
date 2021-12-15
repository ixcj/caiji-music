import Vue from 'vue'
import router from '@/router'
import store from '@/store'
import axios from 'axios'
import VueAxios from 'vue-axios'
import { randomIP } from '@/utils/random'
import { BASE_API, DEV_API, timeout, retry, retryDelay } from '@/config'

Vue.use(VueAxios, axios)

if (process.env.NODE_ENV === 'development') {
  axios.defaults.baseURL = DEV_API
} else if (process.env.NODE_ENV === 'production') {
  axios.defaults.baseURL = BASE_API
}
axios.defaults.timeout = timeout;
axios.defaults.retry = retry;
axios.defaults.retryDelay = retryDelay;

// 请求拦截器
axios.interceptors.request.use(config => {
  // 添加cookie
  let cookie = store.getters.cookie || undefined
  if(config.method === 'get') {
    if(!config.params?.cookie) {
      config.params = { 
        ...config.params,
        cookie
      }
    }
    config.params.t = Date.now()
    config.params.realIP = randomIP()
  } else if(config.method === 'post') {
    config.data.realIP = randomIP()
    config.params
      ? config.params.t = Date.now()
      : config.params = {
        t: Date.now()
      }
    if(!config.data?.cookie) {
      config.data = { 
        ...config.data,
        cookie
      }
    }
  }
  return config
})

// 响应拦截器
axios.interceptors.response.use(
  function (response) {
    const codeArr = [200, 301, 800, 801, 802, 803] // 不提示错误的状态码
    if(!codeArr.includes(response.data.code)) {
      store.commit('layout/setMessage', {
        content: response.data.msg || response.data.message || '未知错误',
        color: 'error',
        timeout: 3000,
        isShow: true
      })
    }
    return response
  },
  function (error) {
    store.commit('layout/setMessage', {
      content: error.response.data.msg || error.response.data.message || '未知错误',
      color: 'error',
      timeout: 3000,
      isShow: true
    })
    return error.response
  }
);

// 导出get方法
export function get(url, params) {
  return new Promise((resolve, reject) => {
    axios.get(url, {
      params: params
    }).then(res => {
      resolve(res.data)
    }).catch(err => {
      reject(err)
    }).finally(() => {
    })
  })
}

// 导出post方法
export function post(url, data = {}){
  return new Promise((resolve, reject) => {
    axios.post(url, data)
      .then(res => {
        resolve(res.data);
      },err => {
        reject(err)
      }).finally(() => {
      })
  })
}