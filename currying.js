# function currying
# 在计算机科学中，柯里化（Currying）是把接受多个参数的函数变换成接受一个单一参数(最初函数的第一个参数)的函数，并且返回接受余下的参数且返回结果的新函数的技术。
# 参数服用、延迟计算

function curry(fn){
  let args = Array.prototype.slice.call(arguments,1);    
  return function() {
    let innerArgs = Array.prototype.slice.call(arguments);
    let finalArgs = args.concat(innerArgs);
    if(finalArgs.length < fn.length){         //fn.length为函数的参数个数
      return curry.call(this,fn,...finalArgs)
    }else{
        return fn.apply(null,finalArgs)
    }
  }
}

# Arrow function expressions
function currying(fn) {
  if (fn.length <= 1) return fn;
  const generator = (...args) => {
    if (fn.length === args.length) {
      return fn(...args)
    } else {
      return (...args2) => {
        return generator(...args, ...args2)
      }
    }
  }
  return generator
}

function returnAPI(host, proxy, api) {
  return host + proxy + api
}

// returnAPI('http://localhost:8080', '/api', '/login')

const oneFn = curry(returnAPI)
// const oneFn = curry(returnAPI, 'http://localhost:8080')
// const oneFn = curry(returnAPI, 'http://localhost:8080', '/api')

oneFn('http://localhost:8080')('/api')('/login')
oneFn('http://localhost:8080', '/api')('/login')
oneFn('http://localhost:8080', '/api', '/login')
