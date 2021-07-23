// 字符串补位
const fillStr = function(value, len, str) {
  return value.length < len ? fillStr(str + value, len) : value
}

// 格式化日期
const formatDate = function(date) {
  const d = new Date(date)
  return d.getFullYear() + '-' + fillStr((d.getMonth() + 1).toString(), 2, 0) + '-' + fillStr(d.getDate().toString(), 2, 0)
}

// 格式化时间
const formatTime = function(date) {
  const d = new Date(date)
  return d.getFullYear() + '-' + fillStr((d.getMonth() + 1).toString(), 2, 0) + '-' + fillStr(d.getDate().toString(), 2, 0) + ' ' +
    fillStr(d.getHours().toString(), 2, 0) + ':' + fillStr(d.getMinutes().toString(), 2, 0)
}

module.exports = {
  fillStr,
  formatDate,
  formatTime
}
