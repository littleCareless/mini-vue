export default class Dep {
  constructor() {
    this.subs = []
  }
  addSub(sub) {
    this.subs.push(sub)
  }
  // 删除依赖
  removeSub(sub) {
    remove(this.subs, sub)
  }
  // 添加一个依赖
  depend() {
    console.log('收集依赖');
    if(window.target) {
      console.log('depend',window.target);
      this.addSub(window.target)
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
    if (arr.length) {
      const index = arr.indexOf(item)
      if(index > -1) {
        return arr.splice(index,1)
      }
    }
  }
}
