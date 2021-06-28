import request from '@/utils/request'

const baseUrl = 'api/cfg/tmodel'
export function zModel() {
  return request({
    url: `${baseUrl}`,
    
    method: 'get'
  })
}
export function addModel(data) {
  return request({
    url: `${baseUrl}`,
    method: 'post',
    data
  })
}
export function delModel(id) {
  return request({
    url: `${baseUrl}/${id}`,
    method: 'DELETE'
  })
}


