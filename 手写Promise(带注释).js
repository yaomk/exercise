// https://github.com/yuanyuanbyte/Promise

class MyPromise {
  // 用 static 创建静态属性，用来管理状态
  static PENDING = 'pending'
  static FULFILLED = 'fulfilled'
  static REJECTED = 'rejected'

  // 构造函数：通过new命令生成对象实例时，自动调用类的构造函数
  constructor(fn) {
    this.PromiseState = MyPromise.PENDING // 指定Promise对象的状态属性 PromiseState，初始值为pending
    this.PromiseResult = null // 指定Promise对象的结果 PromiseResult
    this.onFulfilledCallbacks = [] // 保存成功回调
    this.onRejectedCallbacks = [] // 保存失败回调
    try {
      /**
       * fn() 传入 resolve 和 reject ，
       * resolve() 和 reject() 方法在外部调用，这里需要用 bind 修正一下 this 指向
       * new 对象实例时，自动执行 fn()
       */
      fn(this.resolve.bind(this), this.reject.bind(this))
    } catch (error) {
      // 生成实例时(执行 resolve 和 reject)，如果报错，就把错误信息传入给 reject() 方法，并且直接执行 reject() 方法
      this.reject(error)
    }
  }
  resolve(result) { // result为成功态时接收的终值
    // 只能由 pending 状态 => fulfilled 状态 (避免调用多次 resolve reject)
    if (this.PromiseState === MyPromise.PENDING) {
      this.PromiseState = MyPromise.FULFILLED
      this.PromiseResult = result
      /**
       * 在执行 resolve 或者 reject 的时候，遍历自身的 callbacks 数组，
       * 看看数组里面有没有 then 那边保留过来的待执行函数，
       * 然后逐个执行数组里面的函数，执行的时候会传入相应的参数
       */
      this.onFulfilledCallbacks.forEach(callback => {
        callback(result)
      })
    }
  }
  reject(reason) {// reason为拒绝态时接收的终值
    // 只能由 pending 状态 => rejected 状态 (避免调用多次 resolve reject)
    if (this.PromiseState === MyPromise.PENDING) {
      this.PromiseState = MyPromise.REJECTED
      this.PromiseResult = reason
      this.onRejectedCallbacks.forEach(callback => {
        callback(reason)
      })
    }
  }
  /**
   * 注册 fulfilled 状态 / rejected 状态对应的回调函数
   * @param {function} onFulfilled fulfilled 状态时 执行的函数
   * @param {function} onRejected rejected 状态时 执行的函数
   * @returns {MyPromise} newPromise 返回一个新的 promise 对象
   */
  then(onFulfilled, onRejected) {
    // 2.2.7规范 then 方法必须返回一个 promise 对象
    const promise2 = new MyPromise((resolve, reject) => {
      if (this.PromiseState === MyPromise.FULFILLED) {
        /**
         * 为什么这里要加定时器setTimeout？
         * 2.2.4规范 onFulfilled 和 onRejected 只有在执行环境堆栈仅包含平台代码时才可被调用。 注1
         * 这里的平台代码指的是引擎、环境以及 promise 的实施代码。
         * 实践中要确保 onFulfilled 和 onRejected 方法异步执行，且应该在 then 方法被调用的那一轮事件循环之后的新执行栈中执行。
         * 这个事件队列可以采用“宏任务（macro-task）”机制，比如setTimeout 或者 setImmediate；也可以采用“微任务（micro-task）”机制来实现， 比如 MutationObserver 或者process.nextTick。
         */
        setTimeout(() => {
          try {
            if (typeof onFulfilled !== 'function') {
              /// 2.2.7.3规范 如果 onFulfilled 不是函数且 promise1 成功执行， promise2 必须成功执行并返回相同的值
              resolve(this.PromiseResult)
            } else {
              // 2.2.7.1规范 如果 onFulfilled 或者 onRejected 返回一个值 x ，则运行下面的 Promise 解决过程：[[Resolve]](promise2, x)，即运行resolvePromise()
              let x = onFulfilled(this.PromiseResult)
              resolvePromise(promise2, x, resolve, reject)
            }
          } catch (error) {
            // 2.2.7.2规范 如果 onFulfilled 或者 onRejected 抛出一个异常 error ，则 promise2 必须拒绝执行，并返回拒因 error
            reject(error) // 捕获前面 onFulfilled 中抛出的错误
          }
        })
      } else if (this.PromiseState === MyPromise.REJECTED) {
        setTimeout(() => {
          try {
            if (typeof onRejected !== 'function') {
              // 2.2.7.4规范 如果 onRejected 不是函数且 promise1 拒绝执行， promise2 必须拒绝执行并返回相同的据因
              reject(this.PromiseResult)
            } else {
              let x = onRejected(this.PromiseResult)
              resolvePromise(promise2, x, resolve, reject)
            }
          } catch (error) {
            reject(error)
          }
        })
      } else if (this.PromiseState === MyPromise.PENDING) {
        // pending 状态保存的 onFulfilled() 和 onRejected() 回调也要符合 2.2.7.1, 2.2.7.2, 2.2.7.3, 2.2.7.4 规范
        this.onFulfilledCallbacks.push(() => {
          setTimeout(() => {
            try {
              if (typeof onFulfilled !== 'function') {
                resolve(this.PromiseResult)
              } else {
                let x = onFulfilled(this.PromiseResult)
                resolvePromise(promise2, x, resolve, reject)
              }
            } catch (e) {
              reject(e)
            }
          })
        })
        this.onRejectedCallbacks.push(() => {
          setTimeout(() => {
            try {
              if (typeof onRejected !== 'function') {
                reject(this.PromiseResult)
              } else {
                let x = onRejected(this.PromiseResult)
                resolvePromise(promise2, x, resolve, reject)
              }
            } catch (e) {
              reject(e)
            }
          })
        })
      }
    })
    return promise2
  }
  catch(onRejected) {
    return this.then(undefined, onRejected)
  }
  /**
   *
   * @param {function} callback 无论结果为 fulfilled 或者 rejected ，都会执行的回调函数
   * @returns
   */
  finally(callback) {
    return this.then(callback, callback)
  }
  /**
   * Promise.resolve()
   * @param {[type]} value 要解析为 Promise 对象的值
   */
  static resolve(value) {
    // 如果这个值是一个 promise ，那么将返回这个 promise
    if (value instanceof MyPromise) {
      return value
    } else if (value instanceof Object && 'then' in value) {
      // 如果这个值是thenable（即带有`"then" `方法），返回的promise会“跟随”这个thenable的对象，采用它的最终状态；
      return new MyPromise((resolve, reject) => {
        value.then(resolve, reject)
      })
    }
    // 否则返回的promise将以此值完成，即以此值执行`resolve()`方法 (状态为fulfilled)
    return new MyPromise((resolve) => {
      resolve(value)
    })
  }
  /**
   * Promise.reject()
   * @param {*} reason 表示Promise被拒绝的原因
   * @returns
   */
  static reject(reason) {
    return new MyPromise((resolve, reject) => {
      reject(reason)
    })
  }
  /**
   * promises-aplus-tests 库检测 promise 是否符合 promise/A+ 规范
   * @returns {{promise: MyPromise, resolve: function, reject: function}}
   */
  static deferred() {
    let result = {}
    result.promise = new MyPromise((resolve, reject) => {
      result.resolve = resolve
      result.reject = reject
    })
    return result
  }
}

/**
 * 对resolve()、reject() 进行改造增强 针对 resolve() 和 reject() 中不同值情况 进行处理
 * @param {promise} promise2  promise1.then 方法返回的新的 promise 对象
 * @param {[type]} x promise1中 onFulfilled 或 onRejected 的返回值
 * @param {[type]} resolve  promise2 的 resolve 方法
 * @param {[type]} reject  promise2 的 reject 方法
 */
function resolvePromise(promise2, x, resolve, reject) {
  // 如果从 onFulfilled 或 onRejected 中返回的 x 就是 promise2，会导致循环引用报错
  if (x === promise2) {
    throw new TypeError('Chaining cycle detected for promise')
  }
  if (x instanceof MyPromise) {
    /**
     * 2.3.2 如果 x 为 Promise ，则使 promise2 接受 x 的状态
     * 也就是继续执行 x，如果执行的时候拿到一个 y，还要继续解析 y
     */
    x.then(y => {
      resolvePromise(promise2, y, resolve, reject)
    }, reject)
  } else if (x !== null && (typeof x === 'object' || typeof x === 'function')) {
    let then
    // 2.3.3 如果 x 为对象或者函数
    try {
      // 2.3.3.1 把 x.then 赋值给 then
      then = x.then
    } catch (error) {
      // 2.3.3.2 如果取 x.then 的值时抛出错误 error，则以 error 为拒因拒绝 promise
      return reject(error)
    }

    /**
     * 2.3.3.3
     * 如果 then 是函数，将 x 作为函数的作用域 this 调用之。
     * 传递两个回调函数作为参数，
     * 第一个参数叫做 `resolvePromise` ，第二个参数叫做 `rejectPromise`
     */
    if (typeof then === 'function') {
      // 2.3.3.3.3 如果 resolvePromise 和 rejectPromise 均被调用，或者被同一个参数调用了多次，则优先采用首次调用并忽略剩下的调用。
      let called = false // 避免多次调用
      try {
        then.call(x,
          // 2.3.3.3.1 如果 resolvePromise 以值 y 为参数被调用，则运行 [[Resolve]](promise, y)
          y => {
            if (called) return
            called = true
            resolvePromise(promise2, y, resolve, reject)
          },
          // 2.3.3.3.2 如果 rejectPromise 以据因 r 为参数被调用，则以据因 r 拒绝 promise
          r => {
            if (called) return
            called = true
            reject(r)
          })
      } catch (error) {
        /**
         * 2.3.3.3.4 如果调用 then 方法抛出了异常 error
         * 2.3.3.3.4.1 如果 resolvePromise 或 rejectPromise 已经被调用，则忽略之
         */
        if (called) return
        called = true
        /**
         * 2.3.3.3.4.2 否则以 error 为拒因拒绝 promise
         */
        reject(error)
      }
    } else {
      // 2.3.3.4 如果 then 不是函数，以 x 为参数执行 promise
      resolve(x)
    }
  } else {
    // 2.3.4 如果 x 不为对象或者函数，以 x 作为参数执行promise
    resolve(x)
  }
}

// module.exports = MyPromise
