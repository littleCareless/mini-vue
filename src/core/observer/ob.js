import Dep from './dep'

export class Observer {
  constructor(value) {
    this.value = value
    if(!Array.isArray(value)) {
      this.walk(value)
    }else {
      // val为数组时的逻辑
    }
  }
  walk(obj) {
    console.log('walk',obj);
    const keys = Object.keys(obj)
    console.log(keys);
    for(let i = 0,len = keys.length;i<len;i++) {
      // 将当前的对象 当前的key 以及 value 传入
      defineReactive(obj,keys[i],obj[keys[i]])
    }
  }
}


function defineReactive(data,key,val) {
  // 递归 如果 value是对象的话
  if(typeof val === 'object') {
    new Observer(val)
  }
  // 创建一个dep实例
  let dep = new Dep()
  Object.defineProperty(data, key, {
    configurable: true,
    enumerable: true,
    // 在getter时候收集依赖
    get() {
      // dep.push(window.target)
      console.log(`${key}属性被读取了`)
      // 在读取时候收集依赖
      dep.depend()
      return val
    },
    // 在setter时候触发依赖
    set(newVal) {
      console.log(`${key}属性被修改了`)
      if (val === newVal) {return}
      // for(let i = 0, len = dep.length; i < len; i++) {
      //   dep[i](newVal,val)
      // }
      val = newVal
      // 修改时候 触发依赖 更新
      dep.notify()
    },
  })
}