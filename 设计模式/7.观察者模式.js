/**
 * 观察者模式定义了一种一对多的依赖关系，让多个观察者对象同时监听某一个目标对象，当这个目标对象的状态发生变化时，会通知所有观察者对象，使它们能够自动更新。
 */
/**
 * 观察者模式有一个“别名”，叫发布 - 订阅模式
 * （之所以别名加了引号，是因为两者之间存在着细微的差异）。
 * 这个别名非常形象地诠释了观察者模式里两个核心的角色要素——“发布者”与“订阅者”。
 */

/**
 * 定义发布者类
 * @desc 发布者基本能力：（可以想象为群主，添加成员，@成员，移除成员）
 * - 增加订阅者
 * - 通知订阅者
 * - 移除订阅者
 */
class Publisher {
  constructor() {
    this.observers = []
    console.log('Publisher created')
  }
  // 增加订阅者
  add(observer) {
    console.log('Publisher.add invoked')
    this.observers.push(observer)
    return this
  }
  // 移除订阅者
  remove(observer) {
    console.log('Publisher.remove invoked')
    const targetIdx = this.observers.findIndex((e) => e === observer)
    targetIdx !== -1 && this.observers.splice(targetIdx, 1)
    return this
  }
  // 通知所有订阅者
  notify() {
    console.log('Publisher.notify invoked')
    this.observers.forEach((item) => {
      item.update(this)
    })
  }
}
/**
 * 定义订阅者类
 * @desc 想想订阅者能干啥 —— 其实订阅者的能力非常简单，作为被动的一方，它的行为只有两个:
 * 被通知、去执行（本质上是接受发布者的调用，这步我们在Publisher中已经做掉了）。
 * 既然我们在Publisher中做的是方法调用，那么我们在订阅者类里要做的就是方法的定义。
 */
class Observer {
  constructor() {
    console.log('Observer created')
  }
  update() {
    console.log('Observer.update invoked')
  }
}

/**
 * 实际业务开发中，所有的定制化的发布者/订阅者逻辑都可以基于这两个基本类来改写。
 * 比如我们可以通过拓展发布者类，来使所有的订阅者来监听某个特定状态的变化。
 * 比如产品经理下发prd，开发者们来监听需求文档（prd）的变化
 */
class PrdPublisher extends Publisher {
  constructor() {
    super()
    // 初始化需求文档
    this.prdState = null
    console.log('PrdPublisher created')
  }
  // 该方法用于获取当前的prd状态
  getPrd() {
    console.log('PrdPublisher.getPrd invoked')
    return this.prdState
  }
  // 该方法用于改变prd状态
  setPrd(state) {
    console.log('PrdPublisher.setPrdStete invoked')
    // prd的值发生改变
    this.prdState = state
    // 需求文档变更，通知所有开发者
    this.notify()
  }
}

/**
 * 作为订阅者，开发者任务变得具体起来：接受需求文档，开始干活
 */
class DeveloperObserver extends Observer {
  constructor() {
    super()
    // 需求文档一开始还不存在
    this.prdState = null
    console.log('DeveloperObserver created')
  }
  // 重写一个具体的update方法
  update(Publisher) {
    console.log('Developer.update invoked')
    // 更新需求文档
    this.prdState = Publisher.getPrd()
    // 调用工作函数，开始工作
    this.work()
  }
  // work方法，一个专门搬砖的方法
  work() {
    // 获取需求文档
    const prd = this.prdState
    // 开始基于需求文档提供的信息搬砖。。。
    console.log(`prd: ${JSON.stringify(prd)}, 996 begins...`)
  }
}

// ******  分割线  ****** //

// 创建产品
const productManage = new PrdPublisher()
// 创建开发人员
const bricklayerA = new DeveloperObserver()
const bricklayerB = new DeveloperObserver()
// 产品将开发拉入群中
productManage.add(bricklayerA).add(bricklayerB)
// 需求文档弄好了
const prd = {
  target: '建一座shi山',
}
// 产品在群里发送了prd文档，并@了所有人
productManage.setPrd(prd)
