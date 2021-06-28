import { zModel, addModel, delModel } from '@/api/zmodel'
// import { companyData, factoryData, areaData, deviceData } from '@/api/data'
// import { getCell, setCell, removeCell } from '@/utils/auth'


const state = {
  zModels: []
}

const mutations = {
  SET_ZMODELS: (state, zModels) => {
    state.zModels = zModels
  }
  
}

const actions = {
  // 获取物模型
  getModel({ commit }) {
    return new Promise((resolve, reject) => {
      zModel().then(res => {
        const { result } = res.data
        commit('SET_ZMODELS', result)
        resolve(res)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 增加物模型
  refreshModel({ commit }, item) {
    return new Promise((resolve, reject) => {
      addModel(item).then(res => {
        resolve(res)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 增加物模型
  deleteModel({ commit }, id) {
    return new Promise((resolve, reject) => {
      delModel(id).then(res => {
        resolve(res)
      }).catch(error => {
        reject(error)
      })
    })
  }
  
   

  
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
