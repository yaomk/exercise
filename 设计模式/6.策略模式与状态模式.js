/**
 * 策略模式：定义一系列的算法,把它们一个个封装起来, 并且使它们可相互替换。
 * @desc 对算法的封装
 */
/**
 * example：
 * 需求：做一个差异化询价系统。同一个商品，通过在后台给它设置不同的价格类型，可以让它展示不同的价格。具体的逻辑如下：
 * 1. 当价格类型为“预售价”时，满 100 - 20，不满 100 打 9 折
 * 2. 当价格类型为“大促价”时，满 100 - 30，不满 100 打 8 折
 * 3. 当价格类型为“返场价”时，满 200 - 50，不叠加
 * 4. 当价格类型为“尝鲜价”时，直接打 5 折
 * @desc 预售价 - pre
 *       大促价 - onSale
 *       返场价 - back
 *       尝鲜价 - fresh
 */
/**
 * 询价方法，接受价格标签和原价为入参。
 * 未使用策略模式，最初版。不好的地方😓
 * 1。违背了“单一功能”原则。假如其中一行代码出了 Bug，那么整个询价逻辑都会崩坏；或有bug时，很难定位到某个逻辑代码块出了问题；难以抽离复用。
 * 2. 违背了“开放封闭”原则（对扩展开放，对修改封闭），假如需求增加：价格类型为“新人价”时，直接打 5 折。只能继续在主函数中继续if-else，测试时只能针对整个 askPrice 进行回归测试。
 */
function askPrice(tag, originPrice) {
  // 处理预热价
  if (tag === 'pre') {
    if (originPrice >= 100) {
      return originPrice - 20
    }
    return originPrice * 0.9
  }
  // 处理大促价
  if (tag === 'onSale') {
    if (originPrice >= 100) {
      return originPrice - 30
    }
    return originPrice * 0.8
  }
  // 处理返场价
  if (tag === 'back') {
    if (originPrice >= 200) {
      return originPrice - 50
    }
    return originPrice
  }
  // 处理尝鲜价
  if (tag === 'fresh') {
    return originPrice * 0.5
  }
}
// 针对以上问题，采用策略模式优化
// 定义一个询价处理器对象
const priceProcessor = {
  pre(originPrice) {
    if (originPrice >= 100) {
      return originPrice - 20
    }
    return originPrice * 0.9
  },
  onSale(originPrice) {
    if (originPrice >= 100) {
      return originPrice - 30
    }
    return originPrice * 0.8
  },
  back(originPrice) {
    if (originPrice >= 200) {
      return originPrice - 50
    }
    return originPrice
  },
  fresh(originPrice) {
    return originPrice * 0.5
  },
}
// 询价函数
function askPrice(tag, originPrice) {
  return priceProcessor[tag]?.(originPrice)
}


/**
 * 状态模式：允许一个对象在其内部状态改变时改变它的行为，对象看起来似乎修改了它的类。
 * @desc 状态模式主要解决的是当控制一个对象状态的条件表达式过于复杂时的情况。把状态的判断逻辑转移到表示不同状态的一系列类中，可以把复杂的判断逻辑简化。
 */
/**
 * @desc - 美式咖啡态（american)：只吐黑咖啡
        - 普通拿铁态(latte)：黑咖啡加点奶
        - 香草拿铁态（vanillaLatte）：黑咖啡加点奶再加香草糖浆
        - 摩卡咖啡态(mocha)：黑咖啡加点奶再加点巧克力
 */
class CoffeeMaker {
  constructor() {
    /**
     * 这里略去咖啡机中与咖啡状态切换无关的一些初始化逻辑
     */
    // 初始化状态，没有切换任何咖啡模式
    this.state = 'init';
    // 初始化牛奶的存储量
    this.leftMilk = '500ml';
  }
  stateToProcessor = {
    that: this,
    american() {
      // 尝试在行为函数里拿到咖啡机实例的信息并输出
      console.log('咖啡机现在的牛奶存储量是:', this.that.leftMilk)
      console.log('我只吐黑咖啡');
    },
    latte() {
      this.american()
      console.log('加点奶');
    },
    vanillaLatte() {
      this.latte();
      console.log('再加香草糖浆');
    },
    mocha() {
      this.latte();
      console.log('再加巧克力');
    }
  }

  // 关注咖啡机状态切换函数
  changeState(state) {
    this.state = state;
    if (!this.stateToProcessor[state]) {
      return;
    }
    this.stateToProcessor[state]();
  }
}

const mk = new CoffeeMaker();
// 如此一来，我们就可以在 stateToProcessor 轻松拿到咖啡机的实例对象，进而感知咖啡机这个主体了。
mk.changeState('latte');

// 策略模式和状态模式确实是相似的，它们都封装行为、都通过委托来实现行为分发。
// 但策略模式中的行为函数是”潇洒“的行为函数，它们不依赖调用主体、互相平行、各自为政，井水不犯河水。而状态模式中的行为函数，首先是和状态主体之间存在着关联，由状态主体把它们串在一起；另一方面，正因为关联着同样的一个（或一类）主体，所以不同状态对应的行为函数可能并不会特别割裂。