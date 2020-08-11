const arrayProto = Array.prototype;
export const arrayMethods = Object.create(arrayProto);

const methodsToPatch = [
  'push',
  'pop',
  'shift',
  'unshift',
  'splice',
  'sort',
  'reverse'
]

methodsToPatch.forEach((method)=>{
  // 缓存原始方法
  const original = arrayProto[method]
  // 将可以改变数组自身内容的方法进行封装
  Object.defineProperty(arrayMethods,method,{
    value: function mutator (...args) {
      const ob = this.__ob__
      ob.dep.notify()
      return original.apply(this,args)
    },
    enumerable: false,
    writable: true,
    configurable: true
  })
  // 当使用push方法时候 实际上调用的是arrayMethods.push 执行的是 函数 mutator
  // 在函数 mutator中 执行 original original是缓存的衍生方法 用来做他应该做的事情
})