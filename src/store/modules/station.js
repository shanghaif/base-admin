// import { company, factory, area, device } from '@/api/station'
// import { companyData, factoryData, areaData, deviceData } from '@/api/data'
import { getCell, setCell, getAlarmItem, setAlarmItem, getCurrentFactory} from '@/utils/auth'


const state = {
  currentCompany: {},
  currentFactory: getCurrentFactory(),
  // currentFactory: {},
  alarmList: [],
  alarmItem: getAlarmItem(),
  currentCell: getCell()
}

const mutations = {
  SET_COMPANY: (state, currentCompany) => {
    state.currentCompany = currentCompany
  },
  SET_FACTORY: (state, currentFactory) => {
    state.currentFactory = currentFactory
  },
  SET_AREA: (state, areaData) => {
    state.areaData = areaData
    setCell(areaData)
  },
  SET_CELL: (state, currentCell) => {
    state.currentCell = currentCell
  },
  SET_DEVICE: (state, deviceData) => {
    state.deviceData = deviceData
  },
  SET_ALARMITEM: (state, alarmItem) => {
    state.alarmItem = alarmItem
    setAlarmItem(alarmItem)
  },
  SET_ALARMLIST: (state, alarmList) => {
    state.alarmList = alarmList
  }
}

// const actions = {
//   // 获取分公司
//   getCompany({ commit }) {
//     return new Promise((resolve, reject) => {
//       company().then(res => {
//         const { result } = res.data
//         commit('SET_COMPANY', result)
//         resolve(res)
//       }).catch(error => {
//         reject(error)
//       })
//       // setTimeout(() => {
//       //   const res = companyData
//       //   commit('SET_COMPANY', companyData)

//       //   resolve(res)
//       // }, 0)
//     })
//   },
//   // 获取分厂
//   getFactory({ commit }) {
//     return new Promise((resolve, reject) => {
//       factory().then(res => {
//         const { result } = res.data
        
//         commit('SET_FACTORY', result)
//         resolve(res)
//       }).catch(error => {
//         reject(error)
//       })
//     })
//   },
//   // 获取分区
//   getArea({ commit }) {
//     return new Promise((resolve, reject) => {
//       area().then(res => {
//         const { result } = res.data
        
//         commit('SET_AREA', result)
//         resolve(res)
//       }).catch(error => {
//         reject(error)
//       })
//     })
//   },
//   // 获取设备
//   getDevice({ commit }) {
//     return new Promise((resolve, reject) => {
//       device().then(res => {
//         const { result } = res.data
        
//         commit('SET_DEVICE', result)
//         resolve(res)
//       }).catch(error => {
//         reject(error)
//       })
//     })
//   }
   

  
// }
/* const actions = {
  getCompany({ commit }) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const res = companyData
        commit('SET_COMPANY', companyData.result.stations)

        resolve(res)
      }, 0)
    })
  },
  getFactory({ commit }) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const res = factoryData
        commit('SET_FACTORY', factoryData)

        resolve(res)
      }, 0)
    })
  },
  getArea({ commit }) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const res = areaData
        commit('SET_AREA', areaData)

        resolve(res)
      }, 0)
    })
  },
  getDevice({ commit }) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const res = deviceData
        commit('SET_DEVICE', deviceData)

        resolve(res)
      }, 0)
    })
  }
} */
export default {
  namespaced: true,
  state,
  mutations
  // actions
}
