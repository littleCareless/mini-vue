let uid = 0
export default class Dep {
  constructor() {
    this.id = uid++
    this.subs = []
  }
  addSub(sub) {
    this.subs.push(sub)
  }
  // 删除依赖
  removeSub(sub) {
    this.remove(this.subs, sub)
  }
  // 添加一个依赖
  depend() {
    console.log('收集依赖');
    if(window.target) {
      console.log('depend',window.target);
      // this.addSub(window.target)
      window.target.addDep(this)
      // dep会记录 数据发生变化时需要通知哪些watcher watcher也记录了自己会被哪些dep通知
    }
  }
  // 通知更新所有依赖
  notify() {
    console.log('notify','更新依赖');
    const subs = this.subs.slice()
    console.log('---',subs,'---');
    for(let i = 0,len= subs.length;i<len;i++) {
      subs[i].update()
    }
  }
  // 删除
  remove(arr, item) {
    // 把watcher从sub中删除调 当数据发生变化时 就不会通知这个已被删除的watcher unwatch原理
    if (arr.length) {
      const index = arr.indexOf(item)
      if(index > -1) {
        return arr.splice(index,1)
      }
    }
  }
}
