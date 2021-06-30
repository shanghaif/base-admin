import request from '@/utils/request'

const baseUrl = 'api/cfg/station'

function getpparams(key, flag) {
  const params = {}
  if (flag) {
    params[key] = true
    params.new = true
  } else {
    params[key] = true
  }
  return params
}
export function company(flag) { // 获取分公司  
  const params = getpparams('company', flag)
  return request({
    url: baseUrl,
    
    method: 'get',
    params
  })
}
export function factory(id, flag) { // 获取厂房   
  const params = getpparams('factory', flag)
  // let params = {}
  // if (flag) {
  //   params = {
  //     factory: true, new: true 
  //   }
  // } else {
  //   params = {
  //     factory: true
  //   }
  // }
  return request({
    url: `${baseUrl}/${id}`,
    
    method: 'get',
    params
  })
}
export function area(id, flag) { // 获取分区   
  const params = getpparams('area', flag)
  // let params = {}
  // if (flag) {
  //   params = {
  //     area: true, new: true 
  //   }
  // } else {
  //   params = {
  //     area: true
  //   }
  // }
  return request({
    url: `${baseUrl}/${id}`,
    
    method: 'get',
    params
  })
}
export function areaPage(id) { // 获取分区   
  // let params = {}
  // if (flag) {
  //   params = {
  //     area: true, new: true 
  //   }
  // } else {
  //   params = {
  //     area: true
  //   }
  // }
  return request({
    url: `api/data/status`,
    
    method: 'get',
    params: {factory_id: id}
  })
}
export function handelAlarm(id) { // 告警处理
  // let params = {}
  // if (flag) {
  //   params = {
  //     area: true, new: true 
  //   }
  // } else {
  //   params = {
  //     area: true
  //   }
  // }
  return request({
    url: `api/alarm/statistic`,
    
    method: 'get',
    params: {factory_id: id}
  })
}
export function cell(id, flag) { // 获取电解槽   
  let params = {}
  if (flag) {
    params = {
      bath: true, new: true 
    }
  } else {
    params = {
      bath: true
    }
  }
  return request({
    url: `${baseUrl}/${id}`,
    
    method: 'get',
    params
  })
}
export function device(id, flag, page) { // 获取设备   
  let params = {}
  if (flag) {
    params = {
      bath: true, new: true, size: 10, page: page || 1, children: true
    }
  } else {
    params = {
      bath: true
    }
  }
  return request({
    url: `${baseUrl}/${id}`,
    
    method: 'get',
    params
  })
}
export function devicePoint(id) { // 获取设备   
  return request({
    url: `api/data/real/station/${id}`,
    
    method: 'get'
  })
}
export function deviceHistory(obj) { // 获取设备   
  const params = {
    begin_time: obj.sTime,
    end_time: obj.eTime,
    tid: obj.id,
    pid: 'temperature',
    is_page: true,
    page: 1,
    size: 100
  }
  return request({
    url: `api/data/history`,
    
    method: 'get',
    params
  })
}
export function warningAll(obj) { // 获取告警   
  const params = {...{factory: true, alarm_id: 'all'}, ...obj}
  return request({
    url: `api/alarm/history`,
    method: 'get',
    params
  })
}
export function deviceStatus(id) { // 
  return request({
    url: `api/data/status`,
    
    method: 'get',
    params: { factory_id: id}
  })
}
export function editThings(data) { // 编辑设备
  return request({
    url: `api/cfg/thing`,
    method: 'PUT',
    data: data
  })
}
export function deleteThings(id) { // 编辑设备
  return request({
    url: `api/cfg/thing/${id}`,
    method: 'delete'
  })
}


