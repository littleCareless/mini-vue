import Dep from './dep'
import { arrayMethods } from './array'
import { def } from '../../../util/lang'
// 用来判断档期那浏览器是否支持 __proto__
const hasProto = '__proto__' in {}
export class Observer {
  constructor(value) {
    this.value = value
    // 新增 dep 将array的依赖存放在 observer中
    this.dep = new Dep()
    // 数组在getter中收集依赖 在拦截器中触发依赖 所以这个依赖保存必须在getter和拦截器中都可以访问到
    // 在value上新增一个不可枚举的属性__ob__ 这个属性的值就是当前的Observer实例
    def(value,'__ob__',this)
    // 通过数组数据的__ob__属性拿到Observer实例 就可以拿到__ob__ 上的dep
    if (!Array.isArray(value)) {
      this.walk(value)
    } else {
      // val为数组时的逻辑
      // 判断浏览器是否支持 __proto__ 如果支持执行 protoAugment（覆盖原型） 否则执行 copyAugment（将方法挂载到value）
      const augment = hasProto ? protoAugment : copyAugment
      augment(value, arrayMethods, arrayKeys)
      // 将 拦截器赋值给value._proto_ 通过_proto_可以很巧妙的实现覆盖value原型的功能
      value.__proto__ = arrayMethods
    }
  }
  walk(obj) {
    console.log('walk', obj)
    const keys = Object.keys(obj)
    console.log(keys)
    for (let i = 0, len = keys.length; i < len; i++) {
      // 将当前的对象 当前的key 以及 value 传入
      defineReactive(obj, keys[i], obj[keys[i]])
    }
  }
}
/**
 *
 * 尝试为value创建一个Observer实例
 * 如果创建成功 直接返回新创建的Observer实例
 * 如果value 已经存在一个Observer实例 则直接返回它
 */
function observe (value,asRootData) {
  if(!isObject(value)) {
    return
  }
  let ob

  if(hasOwn(value,'__ob__') && value.__ob__ instanceof Observer) {
    ob = value.__ob__
  } else {
    ob = new Observer(value)
  }
  return ob
}
function defineReactive(data, key, val) {
  // 递归 如果 value是对象的话
  if (typeof val === 'object') {
    new Observer(val)
  }
  let childOb = observe(val)
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

      if(childOb) {
        childOb.dep.depend()
      }
      // 这里收集array的依赖
      return val
    },
    // 在setter时候触发依赖
    set(newVal) {
      console.log(`${key}属性被修改了`)
      if (val === newVal) {
        return
      }
      // for(let i = 0, len = dep.length; i < len; i++) {
      //   dep[i](newVal,val)
      // }
      val = newVal
      // 修改时候 触发依赖 更新
      dep.notify()
    },
  })
}

function protoAugment(target, src, keys) {
  target.__proto__ = src
}

function copyAugment(target, src, keys) {
  for (let i = 0, i = keys.length; i < 1; i++) {
    const key = keys[i]
    def(target, key, src[key])
  }
}
