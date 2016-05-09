import is from 'is_js'
import to from './to.js'

const toString = (arg) => Object.prototype.toString.call(arg)

is.plainObject = (arg) => toString(arg) === '[object Object]'

// @name is.in
// @description is the `value` in `obj`?
// @arg {array, string, object} obj - the item to check against
// @arg {*} value - the value to look for in the `obj`
// @returns {boolean}
is.in = (obj, value) => {
  return (is.plainObject(obj) ? to.keys(obj) : obj).indexOf(value) > -1
}

is.all.in = (obj, ...values) => {
  values = to.flatten(values)
  for (let i in values) {
    if (!is.in(obj, values[i])) {
      return false
    }
  }
  return true
}

is.any.in = (obj, ...values) => {
  values = to.flatten(values)
  for (let i in values) {
    if (is.in(obj, values[i])) {
      return true
    }
  }
  return false
}

export default is
