import Vue from 'vue'
import {
  add0,
  timestampToMinute,
  formatDate
} from '@/utils/dateTime'

// 补0
Vue.filter('add0', n => add0(n))

// 毫秒转分钟
Vue.filter('timestampToMinute', timestamp => timestampToMinute(timestamp))

// 时间戳格式转换
Vue.filter('formatDate', timestamp => formatDate(timestamp))