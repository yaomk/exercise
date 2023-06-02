/**
 * generator 函数实现 async await
 */

const getData = () =>
  new Promise((resolve) =>
    setTimeout(() => {
      resolve(Date.now())
    }, 1000)
  )
// #region async await 函数
async function asyncFn() {
  const dataTime = await getData()
  console.log('time now: ', dataTime)
  const dataTime2 = await getData()
  console.log('time now2: ', dataTime2)
  return 'succes'
}

asyncFn().then(res => console.log(res))
// #endregion

// #region generator 函数手动执行实现
function* generatorFn() {
  const dataTime = yield getData()
  console.log('generator time now: ', dataTime)
  const dataTime2 = yield getData()
  console.log('generator time now2: ', dataTime2)
  yield Promise.reject('err 12')
  return 'success'
}

let gf = generatorFn()
let gfv = gf.next()
gfv.value.then(res => {
  let gfv2 = gf.next(res)
  gfv2.value.then(res2 => {
    let gfv3 = gf.next(res2)
    console.log(gfv3.value)
  })
})
// #endregion

/**
 * 实现目标：generator 实现最终的结果 asyncFn().then(res => console.log(res))
 * 思路：对 generator 函数进行包装，实现自动执行（自动调用 next 方法）
 * 1. const test = asyncToGenerator(generatorFn)
 * 2. test().then(res => console.log(res))
 */

function asyncToGenerator(fn = function* () { }) {
  return function (...args) {
    const gen = fn(...args)
    return new Promise((resolve, reject) => {
      let generatorResult
      function step(fnName, val) {
        try {
          generatorResult = gen[fnName](val)
        } catch (error) {
          return reject(error)
        }
        const { value, done } = generatorResult
        if (done) {
          resolve(value)
        } else {
          Promise.resolve(value).then(val => step('next', val)).catch(err => step('throw', err))
        }
      }
      step('next')
    })
  }
}

let test = asyncToGenerator(generatorFn)
test().then(res => {
  console.log(res)
})