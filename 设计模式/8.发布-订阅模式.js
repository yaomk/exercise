/**
 * 观察者模式与发布-订阅模式的区别
 *
 * 观察者模式：发布者直接触及到订阅者。
 * 发布-订阅模式：发布者不直接触及到订阅者，而是由第三方来完成实际的通信操作。
 */

class EventBus {
  #eventMap = new Map()
  on(eventName, cb) {
    if (!this.#eventMap.has(eventName)) {
      this.#eventMap.set(eventName, [])
    }
    this.#eventMap.get(eventName).push(cb)
  }
  emit(eventName, payload) {
    if (!this.#eventMap.has(eventName)) return
    const handlers = this.#eventMap.get(eventName);
    // once挂载的事件执行完后会改变数组长度，需要用个拷贝再遍历
    [...handlers].forEach(cb => {
      cb(payload)
    })
  }
  off(eventName, cb) {
    if (!this.#eventMap.has(eventName)) return
    const handlers = this.#eventMap.get(eventName)
    if (cb) {
      handlers.indexOf(cb) !== -1 && handlers.splice(handlers.indexOf(cb), 1)
    } else {
      this.#eventMap.delete(eventName)
    }
  }
  clear() {
    this.#eventMap.clear()
  }
  once(eventName, cb) {
    const wrapper = (arg) => {
      cb(arg)
      this.off(eventName, wrapper)
    }
    this.on(eventName, wrapper)
  }
}

// example
let eb = new EventBus()
eb.on('update:modelValue',(arg) => {
  console.log('modelValue的值', arg)
})
eb.emit('update:modelValue', 'modelValue 更新了')
