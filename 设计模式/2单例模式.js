class SingleDog {
  name = 'single dog'
  // 借助静态属性/方法实现单例模式
  static instance
  static getInstance() {
    // Tip: 静态方式里的 this 指向类本身
    if (!this.instance) {
      this.instance = new SingleDog()
    }
    return this.instance
  }
  show() {
    console.log('单例对象');
  }
  getName() {
    return this.name
  }
}
// 借助闭包实现
SingleDog.getInstanceByClosure = (() => {
  let instance
  return () => {
    if (!instance) {
      instance = new SingleDog()
    }
    return instance
  }
})()
let s1 = SingleDog.getInstance()
let s2 = SingleDog.getInstance()
console.log(s1 === s2);

/**
 * vuex 里的单例模式
 * 假单例模式，vuex 源码中没有涉及单例模式，只是在整个项目中使用的是一个实例
 * vuex 不直接在源码中实现单例的原因：同一个页面中，我们可以使用多个 Vue 应用，每个 Vue 应用都可以拥有自己的 Store 实例
 * vuex 源码 {@link https://github.com/vuejs/vuex/blob/main/src/store.js}
 */
class Store {
  // 部分源码实现
  constructor(options = {}) {
    this._actions = Object.create(null)
    this._mutations = Object.create(null)
    this._wrappedGetters = Object.create(null)
    this._modulesNamespaceMap = Object.create(null)
    this._subscribers = []
    const store = this
    const { dispatch, commit } = this
    // 绑定 this
    this.dispatch = function boundDispatch(type, payload) {
      return dispatch.call(store, type, payload)
    }
    this.commit = function boundCommit(type, payload, options) {
      return commit.call(store, type, payload, options)
    }
  }
  dispatch(_type, _payload) {
    console.log('dispatch: ', _type, _payload, this);
  }
  commit(_type, _payload, _options) {
    console.log('commit: ', _type, _payload, _options, this);
  }
  install(app, injectKey) {
    app.provide(injectKey || 'store', this)
    app.config.globalProperties.$store = this
  }
}
function createStore(options) {
  return new Store(options)
}
/**
 * vuex 工作原理
 * 回顾下项目中 vuex 的使用
 * 1. 创建 store
 * 2. vuex3.0 的方式(对应vue2)：Vue.use(Vuex) {@link https://v3.vuex.vuejs.org/zh/guide/#%E6%9C%80%E7%AE%80%E5%8D%95%E7%9A%84-store}
 * 
 *    vuex4.0 的方式(对应vue3)：app.use(store) {@link https://vuex.vuejs.org/zh/guide/#%E6%9C%80%E7%AE%80%E5%8D%95%E7%9A%84-store}
 */
function createApp(rootComponent, rootProps = null) {
  // app.use 部分源码实现（vue3）
  const installedPlugins = new Set()
  const isFunction = (val) => {
    return typeof val === 'function'
  }
  const context = {
    config: {
      globalProperties: {},
    },
    provides: Object.create(null),
  }
  const app = {
    _uid: 'uid',
    _component: rootComponent,
    _props: rootProps,
    _container: null,
    _context: context,
    _instance: null,
    version: '3.0.0',
    get config() {
      return context.config
    },
    use(plugin, ...options) {
      if (installedPlugins.has(plugin)) {
        console.warn('插件已经安装过。')
      } else if (plugin && isFunction(plugin.install)) {
        installedPlugins.add(plugin)
        plugin.install(app, ...options)
      } else if (isFunction(plugin)) {
        installedPlugins.add(plugin)
        plugin(app, ...options)
      } else {
        console.warn('插件必须是一个函数, 或者包含 install 方法的对象.')
      }
      return app
    },
    provide(key, value) {
      if (key in context.provides) {
        console.warn(`app 已经提供了key为"${key}"的属性, 它将被新值覆盖.`)
      }
      context.provides[key] = value
      return app
    }
  }
  return app
}
