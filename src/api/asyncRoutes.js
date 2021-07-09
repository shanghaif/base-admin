const asyncRoutes = [
  {
    path: '/device-manage',
    component: 'Layout',
    redirect: '/add-device/index',
    name: 'DeviceManage',
    meta: {
      title: '设备管理',
      icon: 'table',
      roles: ['admin', 'editor'] // you can set roles in root nav
    },
    children: [
     
      {
        path: '/add-device',
        component: () => import('@/views/add-device/index'),
        name: 'AddDevice',
        meta: { title: '添加设备', roles: ['admin', 'editor'] }
      }
      
    ]
  },
  {
    path: '/',
    component: 'Layout',
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: { title: 'dashboard', icon: 'dashboard', affix: true }
      }
    ]
  }
]



export default {
  asyncRoutes
}
