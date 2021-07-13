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



// 当前工厂
export function getCurrentFactory() {
  let res = {}
  try {
    res = JSON.parse( Cookies.get(CurrentFactory))
  } catch (err) {
    console.log('cookie undefind')
  }
  return res
}

export function setCurrentFactory(val) {
  return Cookies.set(CurrentFactory, val)
}

export function removeCurrentFactory() {
  return Cookies.remove(CurrentFactory)
}


// 当前登录账号密码
export function getLoginData() {
  let res = {}
  try {
    res = JSON.parse( Cookies.get(LoginData))
  } catch (err) {
    console.log('cookie undefind')
  }
  return res
}

export function setLoginData(val) {
  return Cookies.set(LoginData, val)
}

export function removeLoginData() {
  return Cookies.remove(LoginData)
}




export function getCell() {
  let res = {}
  try {
    res = JSON.parse( Cookies.get(CellKey))
  } catch (err) {
    console.log('cookie undefind')
  }
  return res
}

export function setCell(val) {
  return Cookies.set(CellKey, val)
}

export function removeCell() {
  return Cookies.remove(CellKey)
}


// 当前告警
export function getAlarmItem() {
  let res = {}
  try {
    res = JSON.parse( Cookies.get(alarmItem))
  } catch (err) {
    console.log('cookie undefind')
  }
  return res
}

export function setAlarmItem(val) {
  return Cookies.set(alarmItem, val)
}

export function removeAlarmItem() {
  return Cookies.remove(alarmItem)
}
