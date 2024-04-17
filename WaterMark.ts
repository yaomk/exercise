type TWatermark = {
  /* 渲染水印的同时并创建水印被修改的观察器 */
  init: () => void
  /** 卸载观察器 */
  uninstallObserver: () => void
}

type WaterMarkConfig = {
  /** 水印盒子元素 */
  wrapperElement: HTMLElement,
  /** 字体大小 */
  fontSize?: number,
  /** 水印字体颜色 */
  color?: string,
  /** 水印之间的间隙 */
  gap?: number,
  /** 水印文字 */
  text?: string,
}

class WaterMark implements TWatermark {
  protected observer: MutationObserver
  protected watermarkEl: HTMLElement | null = null
  protected config: Required<WaterMarkConfig>
  constructor(config: WaterMarkConfig, isAutoInit:boolean = false) {
    this.config = Object.assign({
      wrapperElement: config.wrapperElement,
      fontSize: config.fontSize || 20,
      color: config.color || 'rgba(0,0,0,0.3)',
      gap: config.gap || 10,
      text: config.text || 'watermark'
    }, config)
    this.observer = new MutationObserver(this.handleMutation.bind(this))
    if (isAutoInit) {
      this.init()
    }
  }
  // 渲染水印
  public init() {
    this.uninstallObserver()
    if(!this.config.wrapperElement) return
    this.config.wrapperElement.style.position = 'relative'
    this.resetWatermark()
    // 配置 MutationObserver 在 DOM 更改匹配给定选项时，通过其回调函数开始接收通知
    this.observer.observe(this.config.wrapperElement, {
      childList: true, // 监听子节点新增或删除
      subtree: true, // 监听以 target 为根节点的整个子树，包括子树中所有节点的属性
      attributes: true // 节点属性值的变化
    })
  }
  // 卸载观察器
  public uninstallObserver() {
    // 阻止 MutationObserver 实例继续接收通知
    this.observer.disconnect()
    this.watermarkEl && this.watermarkEl.remove()
    this.watermarkEl = null
  }
  // MutationObserver 回调
  private handleMutation(entries: MutationRecord[]) {
    for(const entry of entries) {
      // 删除
      for(const node of entry.removedNodes) {
        // 如果删除的元素是水印元素
        if(node === this.watermarkEl) {
          this.resetWatermark()
        }
      }
      // 修改，如果修改的元素是水印元素
      if(entry.target === this.watermarkEl) {
        this.resetWatermark()
      }
    }
  }
  // 绘制水印
  private resetWatermark() {
    if(!this.config.wrapperElement) {
      console.warn('未获取到父元素')
      return
    }
    if (this.watermarkEl) {
      this.watermarkEl.remove()
    }
    const bg = this.watermarkBg()
    if(!bg) return
    this.watermarkEl = document.createElement('div')
    Object.assign(this.watermarkEl.style, {
      position: 'absolute',
      inset: 0,
      zIndex: 9999,
      pointerEvents: 'none',
      backgroundSize: `${bg.size}px ${bg.size}px`,
      backgroundImage: `url(${bg.base64})`,
      backgroundRepeat: 'repeat'
    })
    this.config.wrapperElement.appendChild(this.watermarkEl)
  }
  // 绘制canvas生成水印背景
  private watermarkBg() {
    const canvas = document.createElement('canvas')
    // 当前显示设备的物理像素分辨率与 CSS 像素分辨率之比
    const devicePixelRatio = window.devicePixelRatio || 1
    // 绘制的字体实际大小
    const fontSize = this.config.fontSize * devicePixelRatio
    const font = `${fontSize}px "Microsoft YaHei", sans-serif`
    const ctx = canvas.getContext('2d')
    if (!ctx) {
      console.warn('创建 canvas 失败')
      return null
    }
    // 测量文本宽度
    const {width} = ctx.measureText(this.config.text)
    const canvasSize = Math.max(100, width) + this.config.gap * devicePixelRatio
    canvas.width = canvas.height = canvasSize
    // 移动 canvas 顶点
    ctx.translate(canvasSize / 2, canvasSize / 2)
    // 旋转，旋转中心点默认是canvas的起始点（左上角顶点）
    ctx.rotate((Math.PI / 180) * 45)
    ctx.font = font
    ctx.fillStyle = this.config.color
    // 绘制文本时，文本的对齐方式
    ctx.textAlign = 'center'
    // 绘制文本时，文本的基线
    ctx.textBaseline = 'middle'
    // 指定坐标绘制文本字符串，并使用当前的 fillStyle 对其进行填充
    ctx.fillText(this.config.text, 0, 0)
    return {
      base64: canvas.toDataURL('image/png'),
      size: canvasSize / devicePixelRatio
    }
  }
}

export default WaterMark