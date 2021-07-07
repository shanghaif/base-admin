import request from '@/utils/request'
import qs from 'qs'
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
    size: obj.size || 5,
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
  const params = {
    temperature: true
  }
  return request({
    url: `api/cfg/tmodelprotocol`,
    method: 'get',
    params
  })
}
export function updateTmodelProtocol(obj, isNew) {
  const params = {
    new: true,
    path: obj.protocol_path,
    param: obj.param

  }
  debugger
  const method = isNew ? 'post' : 'PUT'
  const url = `api/cfg/tmodelprotocol/?` + qs.stringify(params)
  return request({
    url,
    method
    
  })
}
export function delTmodelProtocol(obj) {
  const data = {
    model_id: obj.model_id,
    protocols: []
  }
  return request({
    url: 'api/cfg/tmodelprotocol',
    method: 'post',
    data
    
  })
}

// 温度传感器增删改查

export function tmodelNew(obj, isNew) {
  const params = { ...{
    new: true
  },
  ...obj
  }
  const method = isNew ? 'post' : 'PUT'
  const url = `api/cfg/tmodel/?` + qs.stringify(params)
  return request({
    url,
    method
    
  })
}

export function updateDevice(obj, isNew) {
  const params = { ...{
    new: true
  },
  ...obj
  }
  const method = isNew ? 'post' : 'PUT'
  const url = `api/cfg/thing/?` + qs.stringify(params)
  return request({
    url,
    method
    
  })
}

export function updateStation(data, isNew) {
  const method = isNew ? 'post' : 'PUT'
  const url = `api/cfg/station`
  return request({
    url,
    method,
    data
    
  })
}
export function delStation(id) {
  const method = 'DELETE'
  const url = `api/cfg/station/${id}`
  return request({
    url,
    method
    
  })
}

