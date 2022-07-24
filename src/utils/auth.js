// token存入cookie借助第三方库
import Cookies from 'js-cookie'

const TokenKey = 'hrsass-tokne'
const timeKey = 'time_key'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

// 登陆的时候存入时间戳
export function setTime() {
  return Cookies.set(timeKey, Date.now())
}

// 获取时间戳
export function getTime() {
  return Cookies.get(timeKey)
}
