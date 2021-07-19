import { company, factory, area, cell } from '@/api/station'


const state = {
  companyList: null
}

const mutations = {
  SET_COMPANYLIST: (state, companyList) => {
    state.companyList = companyList
  }
   
   
}

const actions = {
  // user login
  queryCompany({ commit }) {
    return new Promise((resolve, reject) => {
      company(1).then((res) => {
        const arr = (res.data.result && res.data.result.stations) || []
        commit('SET_COMPANYLIST', arr)
        

        resolve(arr)
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
