// 补0
export function add0 (n) {
  return n < 10 ? '0' + n : n
}

// 毫秒或秒转分钟
export function timestampToMinute (val) {
  const second = val > 3600 ? parseInt(val / 1000) : val
  return `${add0(parseInt(second / 60))}:${add0(parseInt(second % 60))}`
}

// 计算村龄
export function villageAge (timestamp) {
  const date = new Date(Date.now() - timestamp)
  return `${ date.getFullYear() - 1970 }年${ date.getMonth() ? `${ date.getMonth() }个月` : '' }`
}

// 时间戳转换
export function formatDate (timestamp, format = 'YYYY-MM-DD') {
  if(!timestamp) return
  
  const date = new Date(timestamp.length === 10 ? timestamp * 1000 : timestamp);
  let YYYY = date.getFullYear(),
      MM = add0((date.getMonth() + 1)),
      DD = add0(date.getDate()),
      hh = add0(date.getHours()),
      mm = add0(date.getMinutes()),
      ss = add0(date.getSeconds());
  return format.replace('YYYY', YYYY).replace('MM', MM).replace('DD', DD).replace('hh', hh).replace('mm', mm).replace('ss', ss)
}