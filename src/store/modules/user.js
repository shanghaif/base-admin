import { login, logout, getInfo } from '@/api/user'
import { userData } from '@/api/userData'
import { getToken, setToken, removeToken, getLoginData, setLoginData} from '@/utils/auth'

import router, { resetRouter } from '@/router'

const state = {
  token: getToken(),
  name: '',
  avatar: '',
  introduction: '',
  roles: [],
  menu: [],
  permissions: [],
  userInfo: {},
  loginData: {}
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_PERMISSIONS: (state, permissions) => {
    state.permissions = permissions
  },
  SET_MENU: (state, menu) => {
    state.menu = menu
  },
  SET_USERINFO: (state, userInfo) => {
    state.userInfo = userInfo
  },
  SET_LOGINDATA: (state, loginData) => {
    state.loginData = loginData
  }
   
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ un: username.trim(), pd: password }).then(res => {
        // const res = userData
        const { token} = res.data.result
        commit('SET_LOGINDATA', userInfo)
        commit('SET_TOKEN', token)
        
        setToken(token)
        setLoginData(userInfo)
        resolve(res)
      }).catch(error => {
        reject(error)
      })
      // setTimeout(() => {
      //   const { token } = 'abc'
      //   commit('SET_TOKEN', token)
      //   setToken(token)
      //   resolve()
      // }, 0)
    })
  },
  getInfo({ commit }, userInfo) {
    const { username, password } = userInfo

    return new Promise((resolve, reject) => {
      login({ un: username.trim(), pd: password }).then(res => {
        // const res = userData
        const { menu, user, permissions, role } = res.data.result
        commit('SET_MENU', menu)
        commit('SET_PERMISSIONS', permissions)
        commit('SET_USERINFO', user)
        commit('SET_ROLES', [role.role_id])
        resolve(res)
      }).catch(error => {
        reject(error)
      })
      // setTimeout(() => {
      //   const { token } = 'abc'
      //   commit('SET_TOKEN', token)
      //   setToken(token)
      //   resolve()
      // }, 0)
    })
  },

  // // get user info
  // getInfo({ commit, state }) {
  //   return new Promise((resolve, reject) => {
  //     // getInfo(state.token).then(res => {
  //     //   // const { data } = response

  //     //   // if (!data) {
  //     //   //   reject('Verification failed, please Login again.')
  //     //   // }

  //     //   // const { roles, name, avatar, introduction } = data

  //     //   // roles must be a non-empty array
  //     //   // if (!roles || roles.length <= 0) {
  //     //   //   reject('getInfo: roles must be a non-null array!')
  //     //   // }

  //     //   // commit('SET_ROLES', roles)
  //     //   // commit('SET_NAME', name)
  //     //   // commit('SET_AVATAR', avatar)
  //     //   // commit('SET_INTRODUCTION', introduction)

        
  //     //   // 模拟返回的数据
  //     //   const obj = {
  //     //     roles: ['admin']
  //     //   }
  //     //   commit('SET_ROLES', obj.roles)
  //     //   resolve(obj)
  //     // }).catch(error => {
  //     //   reject(error)
  //     // })
  //     const roles = ['admin']
  //     setTimeout(() => {
  //       commit('SET_ROLES', roles)

  //       resolve({ roles})
  //     }, 0)
  //   })
  // },

  // user logout
  logout({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
    //   logout(state.token).then(() => {
    //     commit('SET_TOKEN', '')
    //     commit('SET_ROLES', [])
    //     removeToken()
    //     resetRouter()

      //     // reset visited views and cached views
      //     // to fixed https://github.com/PanJiaChen/vue-element-admin/issues/2485
      //     dispatch('tagsView/delAllViews', null, { root: true })

      //     resolve()
      //   }).catch(error => {
      //     reject(error)
      //   })
      setTimeout(() => {
        commit('SET_TOKEN', '')
        commit('SET_LOGINDATA', {})
        commit('SET_ROLES', [])
        commit('SET_MENU', [])
        commit('SET_PERMISSIONS', [])
       
        removeToken()
        resetRouter()
        dispatch('tagsView/delAllViews', null, { root: true })
        resolve()
      }, 0)
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      resolve()
    })
  },
 
  // dynamically modify permissions
  async changeRoles({ commit, dispatch }, role) {
    const token = role + '-token'

    commit('SET_TOKEN', token)
    setToken(token)

    const { roles } = await dispatch('getInfo')

    resetRouter()

    // generate accessible routes map based on roles
    const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })
    // dynamically add accessible routes
    router.addRoutes(accessRoutes)

    // reset visited views and cached views
    dispatch('tagsView/delAllViews', null, { root: true })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
