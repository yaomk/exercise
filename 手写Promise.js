/*
  https://www.ituring.com.cn/article/66566
  Promises/A+ 规范（译文）
*/

class MyPromise {
  static PENDING = 'pending'
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
      queueMicrotask(() => {
        this.#PromiseState = MyPromise.FULFILLED
        this.#PromiseResult = result
        while (this.#onFulfilledList.length) {
          this.#onFulfilledList.shift()(result)
        }
      })
    }
  }
  reject(reason) {
    if (this.#PromiseState === MyPromise.PENDING) {
      queueMicrotask(() => {
        this.#PromiseState = MyPromise.REJECTED
        this.#PromiseResult = reason
        while (this.#onRejectedList.length) {
          this.#onRejectedList.shift()(reason)
        }
      })
    }
  }
  then(onFulfilled, onRejected) {
    const promise2 = new MyPromise((resolve, reject) => {
      const fulfilledMicrotask = () => {
        queueMicrotask(() => {
          try {
            if (typeof onFulfilled !== 'function') {
              resolve(this.#PromiseResult)
            } else {
              const x = onFulfilled(this.#PromiseResult)
              resolvePromise(promise2, x, resolve, reject)
            }
          } catch (error) {
            reject(error)
          }
        })
      }
      const rejectedMicrotask = () => {
        queueMicrotask(() => {
          try {
            if (typeof onRejected !== 'function') {
              reject(this.#PromiseResult)
            } else {
              const x = onRejected(this.#PromiseResult)
              resolvePromise(promise2, x, resolve, reject)
            }
          } catch (error) {
            reject(error)
          }
        })
      }
      if (this.#PromiseState === MyPromise.FULFILLED) {
        fulfilledMicrotask()
      } else if (this.#PromiseState === MyPromise.REJECTED) {
        rejectedMicrotask()
      } else if (this.#PromiseState === MyPromise.PENDING) {
        this.#onFulfilledList.push(fulfilledMicrotask)
        this.#onRejectedList.push(rejectedMicrotask)
      }
    })
    return promise2
  }
  catch(onRejected) {
    return this.then(undefined, onRejected)
  }
  finally(fn) {
    return this.then(
      value => {
        return MyPromise.resolve(fn()).then(() => value)
      },
      reason => {
        return MyPromise.resolve(fn()).then(() => {
          throw reason
        })
      }
    )
  }
  // Promise.resolve()
  static resolve(v) {
    if (v instanceof MyPromise) {
      return v
    }
    if (v instanceof Object && 'then' in v) {
      return new MyPromise((resolve, reject) => {
        v.then(resolve, reject)
      })
    }
    return new MyPromise(resolve => resolve(v))
  }
  // Promise.reject()
  static reject(v) {
    return new MyPromise((resolve, reject) => reject(v))
  }
  /**
   * Promise.all()
   * @param {Iterable} promiseList
   * @returns
   * @description 返回一个 Promise。当所有输入的 Promise 都被兑现时，返回的 Promise 也将被兑现（即使传入的是一个空的可迭代对象），并返回一个包含所有兑现值的数组。如果输入的任何 Promise 被拒绝，则返回的 Promise 将被拒绝，并带有第一个被拒绝的原因。
   */
  static all(promiseList) {
    return new MyPromise((resolve, reject) => {
      if (!Array.isArray(promiseList)) {
        return reject(new TypeError('Argument is not iterable'))
      }
      const resultList = []
      const length = promiseList.length
      // 如果传入的是一个空数组，那么就直接返回一个 fulFilled 的空数组 promise 对象
      if (length === 0) {
        return resolve(resultList)
      }
      let count = 0
      for (let i = 0; i < length; i++) {
        MyPromise.resolve(promiseList[i]).then(
          value => {
            resultList[i] = value
            count++
            if (count === length) {
              resolve(resultList)
            }
          }, err => {
            reject(err)
          }
        )
      }
    })
  }
  /**
   * Promise.allSettled()
   * @param {Iterable} promiseList
   * @returns
   * @description 返回一个单独的 Promise。当所有输入的 Promise 都已敲定时，返回的 Promise 将被兑现，并带有描述每个 Promise 结果的对象数组。
   */
  static allSettled(promiseList) {
    return new MyPromise((resolve, reject) => {
      if (!Array.isArray(promiseList)) {
        return reject(new TypeError('Argument is not iterable'))
      }
      const resultList = []
      const length = promiseList.length
      // 如果传入的是一个空数组，那么就直接返回一个 fulFilled 的空数组 promise 对象
      if (length === 0) {
        return resolve(resultList)
      }
      let count = 0
      for (let i = 0; i < length; i++) {
        MyPromise.resolve(promiseList[i]).then(
          value => {
            count++
            resultList[i] = {
              status: MyPromise.FULFILLED,
              value
            }
            if (count === length) {
              resolve(resultList)
            }
          }, err => {
            count++
            resultList[i] = {
              status: MyPromise.REJECTED,
              reason: err
            }
            if (count === length) {
              resolve(resultList)
            }
          }
        )
      }
    })
  }
  /**
   * Promise.any()
   * @param {Iterable} promiseList
   * @returns
   * @description 返回一个 Promise。当输入的任何一个 Promise 兑现时，这个返回的 Promise 将会兑现，并返回第一个兑现的值。当所有输入 Promise 都被拒绝（包括传递了空的可迭代对象）时，它会以一个包含拒绝原因数组的 AggregateError 拒绝。
   */
  static any(promiseList) {
    return new MyPromise((resolve, reject) => {
      if (!Array.isArray(promiseList)) {
        return reject(new TypeError('Argument is not iterable'))
      }
      const errors = []
      const length = promiseList.length
      // 如果传入的是一个空数组，那么就直接返回一个 rejected 的包含拒绝原因数组的 AggregateError
      if (length === 0) {
        return reject(new AggregateError([], 'All promises were rejected'))
      }
      let count = 0
      for (let i = 0; i < length; i++) {
        MyPromise.resolve(promiseList[i]).then(
          value => {
            resolve(value)
          }, err => {
            count++
            errors.push(err)
            if (count === length) {
              reject(new AggregateError(errors, 'All promises were rejected'))
            }
          }
        )
      }
    })
  }
  /**
   * Promise.race()
   * @param {Iterable} promiseList 可迭代对象
   * @returns
   * @description 返回一个 Promise。这个返回的 promise 会随着第一个 promise 的敲定而敲定。如果传入的 iterable 为空，则一直处于 pending 状态。
   */
  static race(promiseList) {
    return new MyPromise((resolve, reject) => {
      if (!Array.isArray(promiseList)) {
        return reject(new TypeError('Argument is not iterable'))
      }
      const length = promiseList.length
      for (let i = 0; i < length; i++) {
        MyPromise.resolve(promiseList[i]).then(
          value => {
            resolve(value)
          }, err => {
            reject(err)
          }
        )
      }
    })
  }
  // PromiseA+ 测试函数
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
    x.then(y => {
      resolvePromise(promise2, y, resolve, reject)
    }, reject)
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
