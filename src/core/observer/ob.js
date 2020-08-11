import Dep from './dep'
import { arrayMethods } from './array'
import { def } from '../../../util/lang'
import { isObject, hasOwn, isValidArrayIndex } from '../../shared/util'
// 用来判断档期那浏览器是否支持 __proto__
const hasProto = '__proto__' in {}
const arrayKeys = Object.getOwnPropertyNames(arrayMethods)

export class Observer {
  constructor(value) {
    this.value = value
    // 新增 dep 将array的依赖存放在 observer中
    this.dep = new Dep()
    // 数组在getter中收集依赖 在拦截器中触发依赖 所以这个依赖保存必须在getter和拦截器中都可以访问到
    // 在value上新增一个不可枚举的属性__ob__ 这个属性的值就是当前的Observer实例
    def(value, '__ob__', this)
    // 通过数组数据的__ob__属性拿到Observer实例 就可以拿到__ob__ 上的dep
    if (!Array.isArray(value)) {
      this.walk(value)
    } else {
      // val为数组时的逻辑
      // 判断浏览器是否支持 __proto__ 如果支持执行 protoAugment（覆盖原型） 否则执行 copyAugment（将方法挂载到value）
      const augment = hasProto ? protoAugment : copyAugment
      augment(value, arrayMethods, arrayKeys)
      // 将 拦截器赋值给value._proto_ 通过_proto_可以很巧妙的实现覆盖value原型的功能
      // value.__proto__ = arrayMethods

      this.observeArray(value)
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
  /**
   * 侦测Array中的每一项
   */
  observeArray(items) {
    console.log('侦测Array中的每一项')
    for (let i = 0, len = items.length; i < len; i++) {
      observe(items[i])
    }
  }
}
export function set(target, key, val) {
  // 对 target是数组的情况进行处理
  if (Array.isArray(target) && isValidArrayIndex(key)) {
    // 如果target是个数组 并且 key是个有效的索引值
    // 设置length属性
    target.length = Math.max(target.length, key)
    // 将val设置到target的指定位置
    target.splice(key, 1, val)
    // 使用splice方法将val设置到target中时候 会侦测到target发生变化 把新增的val变为响应式
    return val
  }

  // 处理参数中key已存在于target的情况
  if (key in target && !(key in Object.prototype)) {
    // 修改数据会被vue侦测到 所以 数据改变后 向依赖发通知
    target[key] = val
    return val
  }

  // 处理target上新增的key
  // 获取target上的__ob__属性
  const ob = target.__ob__
  // 判断是不是vue实例 判断是不是根数据对象 什么是根数据 $data就是根数据
  if (target._isVue || (ob && ob.vmCount)) {
    console.warn(
      'Avoid adding reactive properties to a Vue instance or its root $data ' +
        'at runtime - declare it upfront in the data option.'
    )
    return val
  }
  // 处理target不是响应式的情况
  if (!ob) {
    target[key] = val
    return val
  }
  // 如果前面的所有判断条件都不满足 说明是在响应式数据上新增了一个属性 这种情况需要追踪这个新增属性的变化  将这个属性转换为getter/setter即可
  defineReactive(ob.value, key, val)
  // 向target的依赖触发变化通知
  ob.dep.notify()
  //
  return val
}
export function del(target, key) {
  // 对 target是数组的情况进行处理
  if (Array.isArray(target) && isValidArrayIndex(key)) {
    // 如果target是个数组 并且 key是个有效的索引值
    // 将key删除
    target.splice(key, 1)
    // 使用splice方法将val设置到target中时候 会侦测到target发生变化 把新增的val变为响应式
    return
  }
  // 获取target上的__ob__属性
  const ob = target.__ob__
  // 判断是不是vue实例 判断是不是根数据对象 什么是根数据 $data就是根数据
  if (target._isVue || (ob && ob.vmCount)) {
    console.warn(
      'Avoid deleting properties on a Vue instance or its root $data ' +
        '- just set it to null.'
    )
    return val
  }
  // 如果key不是target自身属性 则终止程序继续执行
  if (!hasOwn(target, key)) {
    return
  }
  delete target[key]
  // 如果ob不存在 数据不是响应式 直接终止程序继续执行
  if (!ob) {
    return
  }
  ob.dep.notify()
}
/**
 *
 * 尝试为value创建一个Observer实例
 * 如果创建成功 直接返回新创建的Observer实例
 * 如果value 已经存在一个Observer实例 则直接返回它
 */
function observe(value, asRootData) {
  if (!isObject(value)) {
    return
  }
  let ob

  if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
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

      if (childOb) {
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
  for (let i = 0, len = keys.length; i < len; i++) {
    const key = keys[i]
    def(target, key, src[key])
  }
}
