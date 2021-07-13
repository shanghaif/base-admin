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


export function queryRole(params) {
  return request({
    url: 'api/role/allrole',
    method: 'get',
    params
  })
}
export function queryUser(params) {
  return request({
    url: 'api/user/alluser',
    method: 'get',
    params
  })
}
export function deleteUser(uid) {
  const data = {uid}
  return request({
    url: 'api/user/del',
    method: 'delete',
    data
  })
}
export function updateUser(data, isNew) {
  let method, url
  if (isNew) {
    method = 'post'
    url = 'api/user/add'
  } else {
    method = 'put'
    url = 'api/user/edit'
  }
  return request({
    url,
    method,
    data
  })
}
export function updateRole(data, isNew) {
  let method, url
  if (isNew) {
    method = 'post'
    url = 'api/role/add'
  } else {
    method = 'put'
    url = 'api/role/edit'
  }
  return request({
    url,
    method,
    data
  })
}
 

export function deleteRole(role_name) {
  const data = {role_name}
  return request({
    url: 'api/role/del',
    method: 'delete',
    data
  })
}
