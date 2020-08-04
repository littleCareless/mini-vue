/**
 * Parse simple path.
 */
export const unicodeRegExp = /a-zA-Z\u00B7\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u037D\u037F-\u1FFF\u200C-\u200D\u203F-\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD/
/**
 * Parse simple path.
 * 把一个形如'data.a.b.c'的字符串路径所表示的值，从真实的data对象中取出来
 * 例如：
 * data = {a:{b:{c:2}}}
 * parsePath('a.b.c')(data)  // 2
 */
const bailRE = new RegExp(`[^${unicodeRegExp.source}.$_\\d]`)
export function parsePath (path){
  console.log(path);
  console.log(bailRE.test(path))
  if (bailRE.test(path)) {
    return
  }
  const segments = path.split('.')
  console.log(segments)
  console.log(unicodeRegExp.source)
  return function (obj) {
    console.log(obj);
    for (let i = 0; i < segments.length; i++) {
      console.log(i,segments[i]);
      if (!obj) return
      obj = obj[segments[i]]
    }
    return obj
  }
}
