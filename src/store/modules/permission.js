import {
  asyncRoutes,
  constantRoutes
} from '@/router'
import Layout from '@/layout'
/**
 * 通过meta.role判断是否与当前用户权限匹配
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

/**
 * 递归过滤异步路由表，返回符合用户角色权限的路由表
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  const res = []
  routes.forEach(route => {
    const tmp = {
      ...route
    }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}

// 定义全部的路由对应关系
const routerMapComponents = {
  'add-device': () => import('@/views/add-device/index'),
  'view-device': () => import('@/views/add-device/QueryDevice'),
  'alarm-history': () => import('@/views/alarm-manage/index'),
  'user-manage': () => import('@/views/permission-manage/AddUser'),
  'role-manage': () => import('@/views/permission-manage/AddRole'),
  'log-history': () => import('@/views/alarm-manage/Log'),
  'device_data': () => import('@/views/data-manage/index')
}
const nameMap = {
  device: 'Device',
  'add-device': 'AddDevice',
  'view-device': 'QueryDevice',
  'alarm': 'AlarmManage', // 告警管理
  'alarm-history': 'AlarmHistory', // 告警管理
  'permission': 'UserManage',
  'user-manage': 'AddUser',
  'role-manage': 'AddRole',
  'data_manage': 'dataManage',
  'device_data': 'dataDevice',
  'log': 'logManage',
  'log-history': 'Log'
}
const iconMap = {
  device: 'table',
  'alarm': 'el-icon-message-solid',
  'permission': 'el-icon-s-custom',
  'log': 'el-icon-s-opportunity',
  'data_manage': 'el-icon-s-data'
}

// 递归将封装list
const getList = function (menu) {
  const rootList = []
  // menu.push({path: 'log-manage', children: [{path: 'log'}]})
  // menu.push({path: 'data-manage', children: [{path: 'device_data'}]})
  // menu[0].children.push({path: 'query-device'})
  menu.forEach(v => {
    const childrenList = []
    const childrens = v.children
    const {path} = v
    const pNode = {
      path: `/${path}`,
      component: Layout,
      // redirect: `/${path}`,
      // name: nameMap[path],
      alwaysShow: true,
      name: nameMap[path],
      meta: {
        title: nameMap[path],
        icon: iconMap[path]
      }
      
    }
    if (childrens) {
      childrens.forEach(item => {
        const cPath = item.path
        const cNode = {
          path: `${cPath}`,
          component: routerMapComponents[cPath],
          name: nameMap[cPath],
          meta: {
            title: nameMap[cPath]
          }
          
        }
        childrenList.push(cNode)
      })
      pNode.children = childrenList
    }
    rootList.push(pNode)
  })
  rootList.push({
    path: '*',
    redirect: '/404',
    hidden: true
  })
  
  return rootList
}

// 递归将路由加载
const formatRoutes = function (routes) {
  routes.forEach(route => {
    if (route.component === 'Layout') {
      route.component = Layout
      if (route['name'] === 'error') {
        route.hidden = true
      }
    }
    if (route.children) {
      route.children.forEach(v => {
        v.component = routerMapComponents[v.component]
      })
      formatRoutes(route.children)
    }
  })
}
const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  generateRoutes({
    commit
  }, res) {
    return new Promise(resolve => {
      const { menu } = res.data.result
      // formatRoutes(vueMenuList) // 将后台返回的表放到函数递归对照,加载路由
      const accessedRoutes = getList(menu)
      // this.$log(accessedRoutes)
      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
