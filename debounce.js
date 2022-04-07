/**
 * 函数防抖，控制次数，需等待 wait 后才会再次执行
 * @param {Function} fn 函数
 * @param {number} wait 延迟执行毫秒数
 * @param {boolean} immediate 是否立即执行，默认值为 true
 * @returns 
 */
function debounce(fn, wait, immediate = true) {
  let timer
  return function (...args) {
    if (timer) {
      clearTimeout(timer)
    }
    if (immediate) {
      let callNow = !timer
      if (callNow) {
        fn(...args)
      }
      timer = setTimeout(() => {
        timer = null
      }, wait);
    } else {
      timer = setTimeout(() => {
        fn(...args)
      }, wait);
    }
  }
}
