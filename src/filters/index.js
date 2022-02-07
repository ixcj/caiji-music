import Vue from 'vue'
import {
  add0,
  timestampToMinute,
  formatTime
} from '@/utils/dateTime'

// 补0
Vue.filter('add0', n => add0(n))

// 毫秒转分钟
Vue.filter('timestampToMinute', timestamp => timestampToMinute(timestamp))

// 时间戳格式转换
Vue.filter('formatTime', timestamp => formatTime(timestamp))