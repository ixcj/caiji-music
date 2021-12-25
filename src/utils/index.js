// 判断是否是一个触摸设备
export const isTouchDevice = 'ontouchstart' in document.documentElement

// 判断一个数据是否为空
export function isEmpty (val) {
  if (val === undefined || val === null || val === '') {
    return true
  } else if (typeof val === 'object') {
    let arr
    Array.isArray(val)
      ? arr = val
      : arr = Object.keys(val)
    return !Boolean(arr.length)
  }

  return false
}