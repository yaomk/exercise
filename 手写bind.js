// 原生 bind
const obj = {
  name: '坤坤',
  age: 10
}

function showInfo(time, hobby) {
  console.log("this =", this)
  console.log(`name = ${this.name}, age = ${this.age}, time = ${time}, hobby = ${hobby}`);
}

// showInfo('两年半', '唱跳 rap')
const fn = showInfo.bind(obj, '两年半')
fn('唱跳 rap')
// 如果通过 new 关键字调用函数则 bind 绑定的 this 会被忽略
new fn('sing dance rap')

// 手写实现
Function.prototype.myBind = function(context, ...args) {
  context = context || globalThis
  const _this = this // 即调用 myBind 的函数
  return function cb () {
    // 如果使用了 new，则忽略 context，返回调用 myBind 函数的实例对象
    if(new.target === cb) {
      return new _this(...args, ...arguments)
    }
    return _this.call(context, ...args, ...arguments)
  }
}

showInfo.myBind(obj, '两年半', '唱跳 rap')()
const classFn = showInfo.myBind(obj, 'two years')
new classFn('sing dance rap')