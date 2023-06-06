/**
 * 工厂模式 —— 简单工厂
 */
class User {
  constructor({ name, age, career }) {
    this.name = name
    this.age = age
    this.career = career
  }
}
const user = new User('name', 'age', 'career')

/**
 * 工厂模式 —— 抽象工厂
 * @desc 分离一个系统中变与不变的部分。
 * @desc 围绕一个超级工厂创建其他工厂。
 */

// 抽象工厂 AbstractFactory
class MobilePhoneFactory {
  constructor() {
    if (new.target === MobilePhoneFactory) {
      throw new Error('抽象工厂不可直接调用。')
    }
  }
  // 提供操作系统的接口
  createOS() {
    throw new Error('抽象工厂方法，需重写')
  }
  // 提供硬件的接口
  createHardWare() {
    throw new Error('抽象工厂方法，需重写')
  }
}

/**
 * 抽象产品
 * 定义操作系统这类产品的抽象产品类
 */
class OS {
  controlHardWare() {
    throw new Error('抽象产品方法不允许直接调用，你需要将我重写！')
  }
}
/**
 * 具体产品
 * 定义具体操作系统的具体产品类
 */
class AndroidOS extends OS {
  controlHardWare() {
    console.log('安卓系统')
  }
}
class AppleOS extends OS {
  controlHardWare() {
    console.log('苹果系统')
  }
}
/**
 * 抽象产品
 * 定义手机硬件这类产品的抽象产品类
 */
class HardWare {
  operateByOrder() {
    throw new Error('抽象产品方法不允许直接调用，你需要将我重写！')
  }
}
/**
 * 具体产品
 * 定义具体硬件的具体产品类
 */
class QualcommHardWare extends HardWare {
  operateByOrder() {
    console.log('高通硬件');
  }
}

// 具体工厂
class MiFactory extends MobilePhoneFactory {
  os
  hardWare
  constructor() {
    super()
    this.os = this.createOS()
    this.hardWare = this.createHardWare()
  }
  createOS() {
    // 提供安卓系统实例
    return new AndroidOS()
  }
  createHardWare() {
    // 提供高通硬件实例
    return new QualcommHardWare()
  }
  printSpec() {
    this.os.controlHardWare()
    this.hardWare.operateByOrder()
  }
}
const miInstance = new MiFactory
// 当要生产另外一部手机，不需要对抽象工厂进行修改，只需扩展它的种类
class AppleFactory extends MobilePhoneFactory {
  createOS() {
    return new AppleOS()
  }
  createHardWare() {
    return new QualcommHardWare()
  }
}