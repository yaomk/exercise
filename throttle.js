/**
 * 函数节流，控制频率，每隔 wait 执行一次
 * @param fn 函数
 * @param wait 频率时间毫秒
 * @returns 
 */
function throttleBySetTimeout(fn, wait) {
  let timer
  return function(...args) {
    if(timer) return
    timer = setTimeout(()=>{
      timer = null
      fn(...args)
    }, wait)
  }
}

/**
 * 函数节流，控制频率，每隔 wait 执行一次
 * @param fn 函数
 * @param wait 频率时间毫秒
 * @returns 
 */
function throttleByDate(fn, wait) {
  let timer = 0
  return function(...args) {
    let now = Date.now()
    if(now - timer > wait) {
      fn(...args)
      timer = now
    }
  }
}
