class Info {
  constructor(name, age) {
    this.name = name
    this.age = age
  }
}

console.log(new Info('kk', 10) instanceof Info)

// 手写 instanceof 运算符
/*
instanceof 运算符用于检测构造函数的 prototype 属性是否出现在某个实例对象的原型链上。
*/

function myInstanceof(obj, fn) {
  let proto = Object.getPrototypeOf(obj)
  // 循环取值判断 obj.__proto__ 是否等于 fn.prototype
  while(true) {
    if(!proto) return false
    if (proto === fn.prototype) return true

    proto = Object.getPrototypeOf(proto)
  }
}

console.log(myInstanceof(new Info('kk', 10), Info))
console.log(myInstanceof(new Info('kk', 10), Object))
console.log(myInstanceof(new Info('kk', 10), Date))