import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'
const CellKey = 'cell'
const alarmItem = 'alarmItem'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(val) {
  return Cookies.set(TokenKey, val)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
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
