// es5 构造函数
function Info(name, age) {
  this.name = name
  this.age = age
}

Info.prototype.showInfo = function () {
  console.log(`name = ${this.name}, age = ${this.age}`)
}
// es6 class
// class Info {
//   name = ''
//   age = ''
//   constructor(name, age) {
//     this.name = name
//     this.age = age
//   }
//   showInfo() {
//     console.log(`name = ${this.name}, age = ${this.age}`)
//   }
// }

// 调用 new 运算符
const insInfo = new Info('KunKun', 18)
console.log(insInfo)
insInfo.showInfo()

// 手写 new
/*
1. 创建一个新对象
2. 将这个新对象的 __proto__ 指向构造函数的 prototype 对象
3. 将 this 指向这个新对象，并执行构造函数
4. 如果执行完构造函数有返回值，且类型为 object（且不为 null） 或者 function，则返回这个返回值，否则返回新对象
 */
function myNew(fn, ...args) {
  const obj = Object.create(fn.prototype)
  const result = fn.apply(obj, args)
  if(typeof result === 'object' && result !== null || typeof result === 'function') {
    return result
  }
  return obj
}

let insMyInfo = myNew(Info, 'kk', 10)
console.log(insMyInfo)
insMyInfo.showInfo()