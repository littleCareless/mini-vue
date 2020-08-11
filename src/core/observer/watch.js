import { parsePath } from '../../../util/lang'
export default class Watcher {
  constructor(vm, expOrFn, cb, options) {
    console.log(vm, expOrFn, cb, options)
    this.vm = vm

    if (options) {
      this.deep = !!options.deep
    } else {
      this.deep = false
    }
    //
    this.deps = []
    this.depIds = new Set()
    // 执行this.getter() 就可以读取data.a.b.c的内容
    // expOrFn 参数支持函数
    console.log()
    if (typeof expOrFn === 'function') {
      console.log('expOrFn - function')
      this.getter = expOrFn
    } else {
      console.log('expOrFn - noFunction')
      this.getter = parsePath(expOrFn)
    }
    this.cb = cb
    this.value = this.get()
    console.log()
    console.log(this.getter, cb, this.value, expOrFn)

  }
  get() {
    // 把实例自身赋给了全局的一个唯一对象window.target上
    window.target = this
    // 获取一下被依赖的数据，获取被依赖数据的目的是触发该数据上面的getter
    console.log(this.getter,this.vm)
    let value = this.getter.call(this.vm, this.vm)
    console.log(value)
    if (this.deep) {
      traverse(value)
    }
    window.target = undefined
    return value
  }
  update() {
    console.log('update', '更新依赖')
    const oldValue = this.value
    this.value = this.get()
    this.cb.call(this.vm, this.value, oldValue)
  }
  // 记录自己都订阅过哪些dep
  addDep(dep) {
    const id = dep.id
    // 使用depIds 来判断是否已订阅了该dep 只有第一次getter时候 才会收集依赖
    if (!this.depIds.has(id)) {
      // 记录当前watcher已订阅了这个dep
      this.depIds.add(id)
      // 记录自己都订阅了那些dep
      this.deps.push(dep)
      // 将自己订阅到dep中
      dep.addSub(this)
    }
  }
  /**
   * 从所有依赖项的dep列表中将自己移除
   */
  teardown() {
    let i = this.deps.length
    // 循环订阅列表 分别执行removesub方法 把自己从依赖列表中移除
    while (i--) {
      this.deps[i].removeSub(this)
    }
  }
}
