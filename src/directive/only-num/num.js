 

export default {
  bind(el) {
    // el.onkeypress = (event) => {
    //   return (/[\d]/.test(String.fromCharCode(event.keyCode || event.which))) || event.which === 8
    // }
    const reg = /^-?[0-9]+.?[0-9]*/
    el.oninput = () => {
      const val = el.children[0].value
      if (!reg.test(val) && val !== '-') {
        el.children[0].value = ''
      }
      // el.children[0].value = el.children[0].value.replace(/[^\d.]/g, '')
    }
  }
  
  
}
