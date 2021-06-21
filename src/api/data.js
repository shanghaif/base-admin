const companyData = {
  result: {
    stations: [
      {
        area_id: 1,
        area_name: '云端',
        area_path: '',
        area_whole_name: '云端',
        lat: '',
        level: 1,
        lon: '',
        model_id: 'm_qzIuThYd42vqxz0lkp7nV',
        parent_id: '',
        s_name: '云南分公司',
        status_used: 1,
        uid: 'e7813a6f-528f-4bcd-8b26-b04471cdd3fa'
      },
      {
        area_id: 1,
        area_name: '云端',
        area_path: '',
        area_whole_name: '云端',
        lat: '',
        level: 0,
        lon: '',
        model_id: 'm_qzIuThYd42vqxz0lkp7nV',
        parent_id: '',
        s_name: '云端测试站',
        status_used: -1,
        uid: 'bf5abb88-0265-4935-a3b3-e819f2708a7c'
      }
    ],
    stations_count: 2
  }
}

const factoryData = {
  result: {
    stations: [
      {
        area_id: 1,
        area_name: '云端',
        area_path: '',
        area_whole_name: '云端',
        lat: '',
        level: 0,
        lon: '',
        model_id: 'm_qzIuThYd42vqxz0lkp7nV',
        parent_id: 'e7813a6f-528f-4bcd-8b26-b04471cdd3fa',
        s_name: '电解铝二厂',
        status_used: -2,
        uid: 'c727e71c-e31c-446e-92bd-5f4d8783cceb'
      },
      {
        area_id: 1,
        area_name: '云端',
        area_path: '',
        area_whole_name: '云端',
        lat: '',
        level: 1,
        lon: '',
        model_id: 'm_qzIuThYd42vqxz0lkp7nV',
        parent_id: 'e7813a6f-528f-4bcd-8b26-b04471cdd3fa',
        s_name: '电解铝一厂',
        status_used: -2,
        uid: 'caf64df1-e008-45b6-b1b4-322b66f8e50f'
      }
    ],
    stations_count: 2
  }
}
const areaData = {
  result: {
    'stations': [
      {
        'area_id': 1,
        'area_name': '云端',
        'area_path': '',
        'area_whole_name': '云端',
        'lat': '',
        'level': 0,
        'lon': '',
        'model_id': 'm_qzIuThYd42vqxz0lkp7nV',
        'parent_id': '57000a03-55a7-4b27-a2aa-7047ba607ff9',
        's_name': '电解槽2002',
        'status_used': -2,
        'uid': '164f4921-25e9-4052-bbd6-f7e73c432502'
      },
      {
        'area_id': 1,
        'area_name': '云端',
        'area_path': '',
        'area_whole_name': '云端',
        'lat': '',
        'level': 0,
        'lon': '',
        'model_id': 'm_qzIuThYd42vqxz0lkp7nV',
        'parent_id': '57000a03-55a7-4b27-a2aa-7047ba607ff9',
        's_name': '电解槽2001',
        'status_used': -2,
        'uid': '476b6901-afee-408c-a0a4-a8bcf282401e'
      }
    ],
    'stations_count': 2
  }
}
const deviceData = {
  result: {
    devices: [
      {
        is_proxy: false,
        is_station: false,
        level: 2,
        model_id: 'm_YWBJlaGocgnhzw67DMAhO',
        protocol_path: null,
        proxy_thing_id: '',
        s_name: 'run-2.exe',
        sno: 1,
        status_used: 1,
        uid: 'temperature@run-2.exe'
      },
      {
        is_proxy: false,
        is_station: false,
        level: 2,
        model_id: 'm_YWBJlaGocgnhzw67DMAhO',
        protocol_path: null,
        proxy_thing_id: '',
        s_name: 'run-3.exe',
        sno: 2,
        status_used: 1,
        uid: 'temperature@run-3.exe'
      },
      {
        is_proxy: false,
        is_station: false,
        level: 2,
        model_id: 'm_YWBJlaGocgnhzw67DMAhO',
        protocol_path: null,
        proxy_thing_id: '',
        s_name: 'run-4.exe',
        sno: 3,
        status_used: 1,
        uid: 'temperature@run-4.exe'
      }
    ],
    devices_count: 99,
    stations: null,
    stations_count: 0
  }
}
export {
  companyData,
  factoryData,
  areaData,
  deviceData

}
