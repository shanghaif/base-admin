import request from '@/utils/request'
// import { request } from '@/utils/request1'

export function login(data) {
  return request({
    url: 'api/su/login',
    method: 'post',
    data
  })

  // return request('su/login', 'post', data)
}

export function getInfo(token) {
  return request({
    url: '/auth/menu',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/logout',
    method: 'post'
  })
}
 
