import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'
const CellKey = 'cell'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}
export function getCell() {
  return Cookies.get(CellKey)
}

export function setCell(cell) {
  return Cookies.set(CellKey, cell)
}

export function removeCell() {
  return Cookies.remove(CellKey)
}
