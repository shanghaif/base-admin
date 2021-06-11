import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/* Router Modules */
import componentsRouter from './modules/components'
import chartsRouter from './modules/charts'
import tableRouter from './modules/table'
import nestedRouter from './modules/nested'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: { title: 'dashboard', icon: 'dashboard', affix: true }
      }
    ]
  },
  {
    
    path: '/big-screen',
    component: () => import('@/views/big-screen/index'),
    hidden: true,
    
    meta: {
      
      index: 1
    }
  },
  {
    
    path: '/big-screen/detail',
    component: () => import('@/views/big-screen/detail'),
    hidden: true,

    meta: {
      
      index: 2
    }
  },
  {
    path: '/permission',
    component: Layout,
    redirect: '/permission/page',
    alwaysShow: true, // will always show the root menu
    name: 'Permission',
    meta: {
      title: 'permission',
      icon: 'lock',
      roles: ['admin', 'editor'] // you can set roles in root nav
    },
    children: [
      {
        path: 'page',
        component: () => import('@/views/permission/page'),
        name: 'PagePermission',
        meta: {
          title: 'pagePermission',
          roles: ['admin'] // or you can only set roles in sub nav
        }
      },
      {
        path: 'directive',
        component: () => import('@/views/permission/directive'),
        name: 'DirectivePermission',
        meta: {
          title: 'directivePermission'
          // if do not set roles, means: this page does not require permission
        }
      },
      {
        path: 'role',
        component: () => import('@/views/permission/role'),
        name: 'RolePermission',
        meta: {
          title: 'rolePermission',
          roles: ['admin']
        }
      }
    ]
  },
  {
    path: '/z_device',
    component: Layout,
    redirect: '/z_device/gateway',
    name: 'Z_device',
    meta: {
      title: '设备管理',
      icon: 'table',
      roles: ['admin', 'editor'] // you can set roles in root nav
    },
    children: [
      {
        path: '/z_device/gateway',
        component: () => import('@/views/z_device/gateway'),
        name: 'Gateway',
        meta: { title: '网关管理', roles: ['admin', 'editor'] }
      },
      {
        path: '/z_device/point',
        component: () => import('@/views/z_device/point'),
        name: 'Point',
        meta: { title: '测温点位管理', roles: ['admin', 'editor'] }
      }
    ]
  },
  {
    path: '/z_data',
    component: Layout,
    children: [
      {
        path: 'z_data',
        component: () => import('@/views/z_data/index'),
        name: 'Data',
        meta: { title: '数据管理', icon: 'chart' }
      }
    ]
  },
  {
    path: '/z_cell',
    component: Layout,
    children: [
      {
        path: 'z_cell',
        component: () => import('@/views/z_cell/demo'),
        name: 'Cell',
        meta: { title: '电解槽', icon: 'chart' }
      }
    ]
  },
  {
    path: '/z_alert',
    component: Layout,
    redirect: '/z_alert/info',
    name: 'Z_alert',
    meta: {
      title: '告警管理',
      icon: 'el-icon-message-solid',
      roles: ['admin', 'editor'] // you can set roles in root nav
    },
    children: [
      // {
      //   path: '/z_alert/info',
      //   component: () => import('@/views/z_device/gateway'),
      //   name: 'Info',
      //   meta: { title: '告警汇总', roles: ['admin', 'editor'] }
      // },
      {
        path: '/z_alert/log',
        component: () => import('@/views/z_alert/log'),
        name: 'Log',
        meta: { title: '告警日志', roles: ['admin', 'editor'] }
      },
      {
        path: '/z_alert/push',
        component: () => import('@/views/z_alert/push'),
        name: 'Push',
        meta: { title: '推送设置', roles: ['admin', 'editor'] }
      }
    ]
  }
   
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */


const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
