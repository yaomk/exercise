/*
  https://www.ituring.com.cn/article/66566
  Promises/A+ 规范（译文）
*/

class MyPromise {
  static PENDING = 'pengding'
  static FULFILLED = 'fulfilled'
  static REJECTED = 'rejected'
  #onFulfilledList = []
  #onRejectedList = []
  #PromiseState = MyPromise.PENDING
  #PromiseResult = null
  get PromiseState() {
    return this.#PromiseState
  }
  get PromiseResult() {
    return this.#PromiseResult
  }
  constructor(fn) {
    try {
      fn(this.resolve.bind(this), this.reject.bind(this))
    } catch (error) {
      this.reject(error)
    }
  }
  resolve(result) {
    if (this.#PromiseState === MyPromise.PENDING) {
      setTimeout(() => {
        this.#PromiseState = MyPromise.FULFILLED
        this.#PromiseResult = result
        this.#onFulfilledList.forEach(callback => {
          callback(result)
        })
      });
    }
  }
  reject(reason) {
    if (this.#PromiseState === MyPromise.PENDING) {
      setTimeout(() => {
        this.#PromiseState = MyPromise.REJECTED
        this.#PromiseResult = reason
        this.#onRejectedList.forEach(callback => {
          callback(reason)
        })
      });
    }
  }
  then(onFulfilled, onRejected) {
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value
    onRejected = typeof onRejected === 'function' ? onRejected : reason => { throw reason }
    const promise2 = new MyPromise((resolve, reject) => {
      if (this.#PromiseState === MyPromise.FULFILLED) {
        setTimeout(() => {
          try {
            const x = onFulfilled(this.#PromiseResult)
            resolvePromise(promise2, x, resolve, reject)
          } catch (error) {
            reject(error)
          }
        });
      } else if (this.#PromiseState === MyPromise.REJECTED) {
        setTimeout(() => {
          try {
            const x = onRejected(this.#PromiseResult)
            resolvePromise(promise2, x, resolve, reject)
          } catch (error) {
            reject(error)
          }
        });
      } else if (this.#PromiseState === MyPromise.PENDING) {
        this.#onFulfilledList.push(() => {
          try {
            const x = onFulfilled(this.#PromiseResult)
            resolvePromise(promise2, x, resolve, reject)
          } catch (error) {
            reject(error)
          }
        })
        this.#onRejectedList.push(() => {
          try {
            const x = onRejected(this.#PromiseResult)
            resolvePromise(promise2, x, resolve, reject)
          } catch (error) {
            reject(error)
          }
        })
      }
    })
    return promise2
  }
  catch(onRejected) {
    return this.then(undefined, onRejected)
  }
  static deferred() {
    let result = {}
    result.promise = new MyPromise((resolve, reject) => {
      result.resolve = resolve
      result.reject = reject
    })
    return result
  }
}

function resolvePromise(promise2, x, resolve, reject) {
  if (promise2 === x) {
    return reject(new TypeError('不能返回同一个promise'))
  }
  if (x instanceof MyPromise) {
    if (x.PromiseState === MyPromise.FULFILLED) {
      resolve(x.PromiseResult)
    } else if (x.PromiseState === MyPromise.REJECTED) {
      reject(x.PromiseResult)
    } else if (x.PromiseState === MyPromise.PENDING) {
      x.then(y => {
        resolvePromise(promise2, y, resolve, reject)
      }, reject)
    }
  } else if (x && typeof x === 'object' || typeof x === 'function') {
    let then
    try {
      then = x.then
    } catch (error) {
      return reject(error)
    }
    if (typeof then === 'function') {
      let called = false
      try {
        then.call(x, y => {
          if (called) return
          called = true
          resolvePromise(promise2, y, resolve, reject)
        }, r => {
          if (called) return
          called = true
          reject(r)
        })
      } catch (error) {
        if (called) return
        called = true
        reject(error)
      }
    } else {
      resolve(x)
    }
  } else {
    resolve(x)
  }
}

// module.exports = MyPromise
