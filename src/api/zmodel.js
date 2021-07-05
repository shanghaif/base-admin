import request from '@/utils/request'

const baseUrl = 'api/cfg/tmodel'
export function zModel() {
  return request({
    url: `${baseUrl}`,
    
    method: 'get'
  })
}
export function zModelPage(obj) {
  const params = {
    page: obj.page || 1,
    size: obj.page || 5,
    ...obj
  }
  return request({
    url: `${baseUrl}`,
    
    method: 'get',
    params
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
export function tmodelProtocol() {
  return request({
    url: `api/cfg/tmodelprotocol`,
    method: 'post'
  })
}


// 温度传感器增删改查

export function tmodelNew(obj) {
  const data = {
    new: true
  }
  
  return request({
    url: `api/cfg/tmodelprotocol`,
    method: 'post',
    data
  })
}
