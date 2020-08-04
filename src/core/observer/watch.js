import {parsePath} from '../../../util/lang'
export default class Watcher {
  constructor(vm,expOrFn,cb) {
    console.log(vm, expOrFn, cb)
    this.vm = vm;
    // 执行this.getter() 就可以读取data.a.b.c的内容
    this.getter = parsePath(expOrFn);
    console.log(this.getter)
    this.cb = cb;
    this.value = this.get();
  }
  get() {
    // 把实例自身赋给了全局的一个唯一对象window.target上
    window.target = this
    // 获取一下被依赖的数据，获取被依赖数据的目的是触发该数据上面的getter
    console.log(this.getter);
    let value = this.getter.call(this.vm, this.vm)
    console.log(value);
    window.target = undefined
    return value
  }
  update() {
    console.log('update','更新依赖');
    const oldValue = this.value
    this.value = this.get()
    this.cb.call(this.vm,this.value,oldValue)
  }
}