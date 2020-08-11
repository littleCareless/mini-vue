/**
 * Quick object check - this is primarily used to tell
 * Objects from primitive values when we know the value
 * is a JSON-compliant type.
 */
export function isObject(obj){
  return obj !== null && typeof obj === 'object'
}

/**
 * Check whether an object has the property.
 */
const hasOwnProperty = Object.prototype.hasOwnProperty
export function hasOwn (obj, key) {
  return hasOwnProperty.call(obj, key)
}
/**
 * Check if val is a valid array index.
 */
export function isValidArrayIndex (val) {
  const n = parseFloat(String(val))
  return n >= 0 && Math.floor(n) === n && isFinite(val)
}
