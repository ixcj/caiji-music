export const tel = /^(?:(?:\+|00)86)?1[3-9]\d{9}$/
export function validateTel(val) {
  return tel.test(val)
}

export const email = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
export function validateEmail(val) {
  return email.test(val)
}