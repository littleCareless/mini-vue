import { Observer } from '../observer/ob.js'
import Compile from '../../compiler/index.js'
import Watcher from '../observer/watch.js'
import { set,del } from '../observer/ob'
export default class MiniVue {
  constructor(options) {
    this.$data = options.data
    this.$el = options.el
    this.$options = options
    this.init()
  }
  init() {
    const vm = this
    if (this.$data) {
      console.log('处理data');
      this.initData(vm)
    }
    if(this.$el) {
      console.log('处理el')
      new Compile(this.$el, vm)
    }
  }
  initData(vm) {
    let data = new Observer(vm.$data)
  }

}

MiniVue.prototype.$watch = function (expOrFn, cb, options) {
  const vm = this;
  options  = options || {}

  console.log(vm.$data, expOrFn, cb, options)
  const watcher = new Watcher(vm.$data, expOrFn, cb, options)
  console.log(watcher)
  if(options.immediate) {
    console.log(vm,watcher.value);
    console.log(cb);
    cb.call(vm,watcher.value)
  }
  return function unwatchFn () {
    watcher.teardown()
  }
}
MiniVue.prototype.$set = set
MiniVue.prototype.$delete = del

window.MiniVue = MiniVue