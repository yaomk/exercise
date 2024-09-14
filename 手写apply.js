// 原生 apply
const obj = {
  name: '坤坤',
  age: 10
}

function showInfo(time, hobby) {
  console.log("this =", this)
  console.log(`name = ${this.name}, age = ${this.age}, time = ${time}, hobby = ${hobby}`);
}

showInfo('两年半', '唱跳 rap')
showInfo.apply(obj, ['两年半', '唱跳 rap'])

// 手写实现
Function.prototype.myApply = function(context, args = []) {
  if(!Array.isArray(args)) throw new TypeError('args must be an array')
  context = context || globalThis
  const symbol = Symbol()
  context[symbol] = this // 这里的this，指向的是函数本身，即调用 myCall 的函数
  const result = context[symbol](...args)
  delete context[symbol]
  return result
}

showInfo.myApply(obj, ['两年半', '唱跳 rap'])