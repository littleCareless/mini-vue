import { Observer } from '../observer/ob.js'
import Compile from '../../compiler/index.js'
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



window.MiniVue = MiniVue