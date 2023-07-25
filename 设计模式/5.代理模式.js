
/**
 * 业务中常见的四种代理模式：事件代理、虚拟代理、缓存代理、保护代理
*/

`
<div id='father'>
  <a href="#">链接1号</a>
  <a href="#">链接2号</a>
</div>

`
// #region 事件代理
/**
 * 借助事件冒泡，通过由父元素对事件进行处理、分发，间接将其作用为子元素。
 */
// const fatherEl = document.getElementById('father')
// fatherEl.addEventListener('click', function (e) {
//   if (e.target.tagName === 'a') {
//     e.preventDefault()
//     alert(`我是 ${e.target.innerText}`)
//   }
// })
// #endregion

// #region 虚拟代理

class PreLoadImage {
  constructor(imgNode) {
    // 获取真实的 dom 节点
    this.imgNode = imgNode
  }
  // 操作 img 节点的 src 属性
  setSrc(imgUrl) {
    this.imgNode.src = imgUrl
  }
}
class ProxyImage {
  // 占位图的 url 地址
  static LOADING_URL = 'xxx'
  constructor(targetImage) {
    // 目标 Image，即 PreLoadImage 实例
    this.targetImage = targetImage
  }
  // 该方法主要操作虚拟 Image，完成加载
  setSrc(targetUrl) {
    // 真实 img 节点初始化时展示的是一个占位图
    this.targetImage.setSrc(ProxyImage.LOADING_URL)
    // 创建一个帮我们加载图片的虚拟 Image 实例
    const virtualImg = new Image()
    // 监听目标图片加载的情况，完成时再将 DOM 上的真实 img 节点设置为目标图片的 url
    virtualImg.onload = () => {
      this.targetImage.setSrc(targetUrl)
    }
    // 设置 src 属性，虚拟 image 开始加载图片
    virtualImg.src = targetUrl
  }
}
// const img = new ProxyImage(new PreLoadImage(document.getElementById('#preload-img')))
// ProxyImage 帮我们调度了预加载相关的工作，我们可以通过 ProxyImage 这个代理，实现对真实 img 节点的间接访问，并得到我们想要的效果。
// #endregion

// #region 缓存代理

/**
 * addAll 方法会对你传入的所有参数做求和操作
 * @param  {...number} args 
 * @returns {number}
 */
const addAll = (...args) => {
  console.log('进行了一次新计算');
  let result = 0
  for (let i = 0; i < args.length; i++) {
    result += args[i]
  }
  return result
}
// 为求和方法创建代理
const proxyAddAll = (() => {
  // 求和结果创建缓存池
  const resultCache = new Map()
  return function (...args) {
    const argsStr = args.join()
    // 检查本次入参是否有对应的计算结果
    if (resultCache.has(argsStr)) {
      return resultCache.get(argsStr)
    }
    return resultCache.set(argsStr, addAll(...args)).get(argsStr)
  }
})()
// proxyAddAll 针对重复的入参只会计算一次，这将大大节省计算过程中的时间开销。
// #endregion

// #region 保护代理
// 所谓“保护代理”，就是在访问层面做文章，在 getter 和 setter 函数里去进行校验和拦截，确保一部分变量是安全的。
const targetDog = {
  name: '小黄',
  age: 3,
  sex: 'male'
}

const proxyDog = new Proxy(targetDog, {
  get(target, property) {
    console.log(...arguments);
    if(property === 'age') {
      return '充值vip才给看'
    }else {
      return Reflect.get(...arguments)
    }
  },
  set(target,property, newVal) {
    if(target.isVip) {
      return Reflect.set(...arguments)
    } else {
      console.log('充值vip才能修改添加');
    }
  }
})

// #endregion

const targetObj = {
  a: 1,
  b: 2,
  get value() {
    return this.b
  },
  set value(nv) {
    this.b = nv
  }
}
let handler = {
  get(target, prop, receiver) {
    console.log(prop, '@@',receiver);
    // Tip: ^ 上边输出 receiver 会报超出最大调用栈大小
    /**
     * 原因是：receiver: 通常是 proxy 本身，或继承 proxy 的对象
     * 1. 获取 otherObj.a，但是 otherObj 并没有 a 属性，于是沿原型链来到 proxyObj
     * 2. 获取 proxyObj.a 的过程触发 get陷阱
     * 3. get陷阱中尝试执行 console.log()
     * 4. console.log 输出 receiver (这里是 otherObj { test: 'name' })，实际上又会触发 proxyObj 的 get陷阱，而这个过程又会再次执行 console.log，从而形成无限循环。
     */
    return Reflect.get(...arguments)
  }
}
const proxyObj = new Proxy(targetObj, handler)

const otherObj = {
  test: 'name'
}

Object.setPrototypeOf(otherObj, proxyObj)
console.log(otherObj.a)