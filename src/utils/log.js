export default {
  install(Vue){
    Vue.prototype.$log = function(obj){
      var filter = ['top', 'window', 'document', 'localStorage', 'sessionStorage', 'cookie'] // 不会解析该属性。
      var x = null // 没用的临时变量
      var n = '\n<br/>' // 换行
      var Parse = {
        parse_obj: function(obj, blank, parse_obj_times){ // 解析对象和数组
          !parse_obj_times && (parse_obj_times = 0)
          if (parse_obj_times > 20) { return '' }
          switch (typeof obj){
            case 'object':
              var temp = '{'
              var isobj = true
              temp += n
              blank = blank || 1
              '' + {}.toString.call(obj) === '[object Array]' && (isobj = false)
              isobj ? temp = '{' + n : temp = '[' + n
              for (x in obj) {
                if (typeof obj[x] === 'object') {
                  if (filter.indexOf(x) !== -1 ) continue
                  parse_obj_times++
                  temp += this.get_blank(blank) + x + ' : ' + this.parse_obj(obj[x], blank + 1, parse_obj_times) + ',' + n
                } else {
                  temp += this.get_blank(blank) + x + ' : ' + this.parse_sign(obj[x]) + ',' + n
                }
              }
              temp = temp.substr(0, temp.length - (',' + n).length) + n
              return temp + this.get_blank(blank - 1) + (isobj ? '}' : ']') 
            default :
              return obj
          }
        },
        parse_sign: function(str){ // 解析特殊符号
          return ('' + str).replace(/</g, '<').replace(/>/g, '>').replace(/\n|\n\r/g, '<br>')
            .replace(/\t/g, '  ').replace(/\s\s/g, ' ')
        },
        get_blank: function(num){ // 返回相应num的空白
          for (var i = 0, blank = ''; i < num; i++) {
            blank += '    '
          }
          return blank
        }
      }
      return Parse.parse_obj(obj)
    }    
  }    
}
