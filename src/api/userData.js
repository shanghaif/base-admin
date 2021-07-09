const userData = {
  menu: [{
    children: [{
      path: 'device/add-tmodel'
    },
    {
      path: 'device/add-thing'
    }
    ],
    path: 'device'
  }],
  permissions: [{
    id: 'tmodel',
    Permission: [
      'add',
      'delete',
      'edit',
      'view'
    ]
  },
  {
    id: 'protocol',
    Permission: [
      'add',
      'delete',
      'edit',
      'view'
    ]
  },
  {
    id: 'station',
    Permission: [
      'add',
      'delete',
      'edit',
      'view'
    ]
  },
  {
    id: 'thing',
    Permission: [
      'add',
      'delete',
      'edit',
      'view'
    ]
  },
  {
    id: 'user',
    Permission: [
      'add',
      'delete',
      'edit',
      'view'
    ]
  },
  {
    id: 'role',
    Permission: [
      'add',
      'delete',
      'edit',
      'view'
    ]
  }
  ],
  role: {
    'role_desc': '超级管理员',
    'role_id': 1001,
    'role_name': 'super',
    'stations': null
  },
  token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2MjU3MzE0NzIsIlJvbGUiOiJzdXBlciIsInVpZCI6InRlc3QwIn0.UwiwjpbappDnZVq5QG8eomN_EjOcm4b4gMEJ2fxaFPg',
  user: {
    uid: 1001,
    user_name: 'test0',
    nick_name: '测试',
    password: 'admin',
    email: '123@test.com',
    phone: '456',
    address: 'addr',
    role_id: 1001,
    role_name: ''
  }
}

export {
  userData
}
