import Watcher from '../core/observer/watch'

export default class Compile {
  constructor(el, vm) {
    this.$el = document.querySelector(el)
    this.$vm = vm
    if (this.$el) {
      console.log('el',this.$el);
      this.$fragment = this.getNodeChirdren(this.$el)
      this.compile(this.$fragment)
      this.$el.appendChild(this.$fragment)
    }
  }
  getNodeChirdren(el) {
    const frag = document.createDocumentFragment()
    let child
    while ((child = el.firstChild)) {
      frag.appendChild(child)
    }
    return frag
  }
  compile(el) {
    const childNodes = el.childNodes
    Array.from(childNodes).forEach((node) => {
      if (node.nodeType == 1) {
      } else if (node.nodeType == 2) {
      } else if (node.nodeType == 3) {
        //3为文本节点
        this.compileText(node)
      }

      // 递归子节点
      if (node.childNodes && node.childNodes.length > 0) {
        this.compile(node)
      }
    })
  }

  compileText(node) {
    console.log('compileText')
    /**
     * . 表示任意单个字符，不包含换行符
     * + 表示匹配前面多个相同的字符
     * ？表示非贪婪模式，尽可能早的结束查找
     * */
    const reg = /\{\{(.+?)\}\}/
    var param = node.textContent
    if (reg.test(param)) {
      //  $1表示匹配的第一个
      const key = RegExp.$1.trim()
      node.textContent = param.replace(reg, this.$vm.$data[key])
      // 编译模板的时候，创建一个watcher实例，并在内部挂载到Dep上
      console.log(this.$vm.$data)
      console.log(key)
      console.log(this.$vm.$data[key])
      new Watcher(this.$vm.$data, key, (newValue) => {
        // 通过回调函数，更新视图
        console.log('通过回调函数，更新视图', newValue)
        node.textContent = newValue
      })
    }
  }
}
