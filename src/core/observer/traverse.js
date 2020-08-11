const seenObjects = new Set()

export function traverse(val) {
  _traverse(val, seenObjects)
  seenObjects.clear()
}

function _traverse(val, seen) {
  let i, keys
  const isA = Array.isArray(val)
  // 先判断val的类型 如果他不是array和object 或者已被冻结 那么直接返回
  if ((!isA && !isObject(val)) || Object.isFrozen(val)) {
    return
  }
  // 如果val已是响应式
  if (val.__ob__) {
    // 拿到dep.id 用id来保证不会重复收集依赖
    const depId = val.__ob__.dep.id
    if (seen.has(depId)) {
      return
    }
    seen.add(depId)
  }
  // 如果是数组
  if (isA) {
    // 循环数组 将数组的每一项递归调用
    i = val.length
    while (i--) _traverse(val[i], seen)
  } else {
    // 如果是Object类型的数据 循环所有key 然后执行读取操作再递归子值
    keys = Object.keys(val)
    i = keys.length
    // val[keys[i]]会触发getter 这时 window.target还没被清空 会将当前的watcher收集进去
    while (i--) _traverse(val[keys[i]], seen)
  }
}
