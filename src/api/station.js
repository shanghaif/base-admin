import request from '@/utils/request'

const baseUrl = 'api/cfg/station'
export function company() { // 获取分公司    
  return request({
    url: baseUrl,
    
    method: 'get',
    params: { company: true }
  })
}
export function factory(id) { // 获取厂房   
  return request({
    url: `${baseUrl}/${id}`,
    
    method: 'get',
    params: { factory: true }
  })
}
export function area(id) { // 获取分区   
  return request({
    url: `${baseUrl}/${id}`,
    
    method: 'get',
    params: { area: true }
  })
}
export function cell(id) { // 获取电解槽   
  return request({
    url: `${baseUrl}/${id}`,
    
    method: 'get',
    params: { bath: true }
  })
}
export function device(id) { // 获取设备   
  return request({
    url: `${baseUrl}/${id}`,
    
    method: 'get',
    params: { bath: true, children: true, page: 1, size: 10 }
  })
}
export function devicePoint(id) { // 获取设备   
  return request({
    url: `api/data/real/station/${id}`,
    
    method: 'get'
  })
}
export function warningAll(page) { // 获取告警   
  return request({
    url: `api/alarm/active`,
    
    method: 'get',
    params: { tid: 'all', page, size: 8 }
  })
}

