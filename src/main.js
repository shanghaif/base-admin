import Vue from 'vue'

import Cookies from 'js-cookie'
import dayjs from 'dayjs'
import 'normalize.css/normalize.css' // a modern alternative to CSS resets
// import iView from 'iview'
import Element from 'element-ui'
import './styles/element-variables.scss'
// import './styles/my-ivew-theme.less'
import 'iview/dist/styles/iview.css' // ivew
import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import i18n from './lang' // internationalization
import './icons' // icon
import './permission' // permission control
import './utils/error-log' // error log
// import '@/utils/log'
import * as filters from './filters' // global filters
 
// 大屏暗黑主题使用ivew
import { Button, DatePicker, Modal, Dropdown, DropdownMenu, DropdownItem, Select, OptionGroup, Option, Poptip} from 'iview'
Vue.component('Button', Button)
Vue.component('DatePicker', DatePicker)
Vue.component('Modal', Modal)
Vue.component('Dropdown', Dropdown)
Vue.component('DropdownMenu', DropdownMenu)
Vue.component('DropdownItem', DropdownItem)
Vue.component('Select', Select)
Vue.component('OptionGroup', OptionGroup)
Vue.component('Option', Option)
Vue.component('Poptip', Poptip)
/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
// if (process.env.NODE_ENV === 'production') {
//   const { mockXHR } = require('../mock')
//   mockXHR()
// }
// Vue.use(iView)
Vue.prototype.$dayjs = dayjs// 可以全局使用dayjs
// Vue.use(Checkbox)
Vue.use(Element, {
  size: Cookies.get('size') || 'small', // set element-ui default size
  i18n: (key, value) => i18n.t(key, value)
})

// register global utility filters
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: h => h(App)
})
