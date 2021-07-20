import num from './num'
const install = function(Vue) {
  Vue.directive('num', num)
}
num.install = install
export default num

