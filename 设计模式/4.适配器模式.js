/**
 * 适配器模式，解决兼容问题
 */

/**
 * 新的异步请求方法，使用 fetch 请求
 */
class SimpleAxios {
  static get(url) {
    return new Promise((resolve, reject) => {
      fetch(url)
        .then(response => response.json())
        .then(result => resolve(result))
        .catch(err => reject(err))
    })
  }
  static post(url, data) {
    return new Promise((resolve, reject) => {
      fetch(url, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json;charset=UTF-8'
        },
        body: JSON.stringify(data)
      })
        .then(response => response.json())
        .then(result => resolve(result))
        .catch(err => reject(err))
    })
  }
}
// 使用 SimpleAxios
SimpleAxios.get('xxx')
  .then(res => { console.log(res) })
  .catch(err => { console.log(err) })

// 旧的使用方法，使用 XMLHttpRequest 发送请求
function SimpleAjax(type, url, data, success, failed) {
  let xhr
  if (window.XMLHttpRequest) {
    xhr = new XMLHttpRequest()
  } else {
    xhr = new ActiveXObject('Microsoft.XMLHTTP')
  }
  type = type.toUpperCase()
  if (type === 'GET') {
    if (data) {
      xhr.open('GET', url + '?' + data, true)
    } else {
      xhr.open('GET', url, true)
    }
    xhr.send()
  } else if (type === 'POST') {
    xhr.open('POST', url, true)
    xhr.setRequestHeader('Content-Type', 'application/json')
    xhr.send(data)
  }
  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4) {
      if (xhr.status == 200) {
        success(xhr.responseText)
      } else {
        failed && failed(xhr.status)
      }
    }
  }
}
// 使用 SimpleAjax
SimpleAjax('get', 'xxx', void 0, res => {
  console.log(res);
})

/**
 * 定义适配器，入参与旧接口保持一致
 */
async function AjaxAdapter(type, url, data, success, failed) {
  type = type.toUpperCase()
  let result
  try {
    const methodMap = {
      GET: SimpleAxios.get,
      POST: SimpleAxios.post
    }
    result = await methodMap[type](url, data)
    // 假设成功对应的状态码为 1
    result.statusCode === 1 && success ? success(result) : failed && failed(result)
  } catch (error) {
    failed && failed(error)
  }
}
// 用适配器适配旧的 ajax 方法
async function UseAdapter(type, url, data,success,failed) {
  await AjaxAdapter(type, url, data,success,failed)
}

/**
 * axios 库中的适配器模式
 * axios的核心逻辑中{@link https://github.com/axios/axios/blob/master/lib/core/Axios.js}，
 * 实际上派发请求的是 dispatchRequest 方法{@link https://github.com/axios/axios/blob/main/lib/core/dispatchRequest.js},
 * 该方法主要做了两件事：
 * 1. 数据转换，转换请求体/响应体，可以理解为数据层面的适配
 * 2. 调用适配器
 */
// axios 默认的适配器
function getDefaultAdapter() {
  var adapter;
  // 判断当前是否是node环境
  if (typeof process !== 'undefined' && Object.prototype.toString.call(process) === '[object process]') {
    // 如果是node环境，调用node专属的http适配器
    adapter = require('./adapters/http');
  } else if (typeof XMLHttpRequest !== 'undefined') {
    // 如果是浏览器环境，调用基于xhr的适配器
    adapter = require('./adapters/xhr');
  }
  return adapter;
}
// http 适配器
function httpAdapter(config) {
  return new Promise(function dispatchHttpRequest(resolvePromise, rejectPromise) {
    // 具体逻辑
  })
}
// xhr 适配器
function xhrAdapter(config) {
  return new Promise(function dispatchXhrRequest(resolve, reject) {
    // 具体逻辑
  })
}
