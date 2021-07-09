import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'
const LoginData = 'LoginData'
const CellKey = 'cell'
const alarmItem = 'alarmItem'
const CurrentFactory = 'CurrentFactory'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(val) {
  return Cookies.set(TokenKey, val)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}




export function getCurrentFactory() {
  return Cookies.get(CurrentFactory) && JSON.parse( Cookies.get(CurrentFactory))
}

export function setCurrentFactory(val) {
  return Cookies.set(CurrentFactory, val)
}

export function removeCurrentFactory() {
  return Cookies.remove(CurrentFactory)
}



export function getLoginData() {
  return Cookies.get(LoginData)
}

export function setLoginData(val) {
  return Cookies.set(LoginData, val)
}

export function removeLoginData() {
  return Cookies.remove(LoginData)
}




export function getCell() {
  return Cookies.get(CellKey) && JSON.parse( Cookies.get(CellKey))
}

export function setCell(val) {
  return Cookies.set(CellKey, val)
}

export function removeCell() {
  return Cookies.remove(CellKey)
}



export function getAlarmItem() {
  return Cookies.get(alarmItem) && JSON.parse( Cookies.get(alarmItem))
}

export function setAlarmItem(val) {
  return Cookies.set(alarmItem, val)
}

export function removeAlarmItem() {
  return Cookies.remove(alarmItem)
}
