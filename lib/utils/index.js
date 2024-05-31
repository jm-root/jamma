import { arg2bool, arg2number } from './argv'
import cloneDeep from './clonedeep'

function merge (obj1, obj2) {
  if (typeof obj1 !== 'object' || !obj1) return obj1
  if (Array.isArray(obj1)) {
    obj2.forEach(function (item) {
      if (obj1.indexOf(item) === -1) {
        obj1.push(item)
      }
    })
    return obj1
  }
  const keys = Object.keys(obj2)
  keys.forEach(function (key) {
    if (obj1[key] && typeof obj1[key] === 'object' && typeof obj2[key] === 'object') {
      merge(obj1[key], obj2[key])
    } else {
      obj1[key] = obj2[key]
    }
  })
  return obj1
}

const utils = {
  // 高效slice
  slice: (a, start, end) => {
    start = start || 0
    end = end || a.length
    if (start < 0) start += a.length
    if (end < 0) end += a.length
    const r = new Array(end - start)
    for (let i = start; i < end; i++) {
      r[i - start] = a[i]
    }
    return r
  },

  formatJSON: (obj) => {
    return JSON.stringify(obj, null, 2)
  },

  getUriProtocol: function (uri) {
    if (!uri) return null
    return uri.substring(0, uri.indexOf(':'))
  },

  getUriPath: function (uri) {
    let idx = uri.indexOf('//')
    if (idx === -1) return ''
    idx = uri.indexOf('/', idx + 2)
    if (idx === -1) return ''
    uri = uri.substr(idx)
    idx = uri.indexOf('#')
    if (idx === -1) idx = uri.indexOf('?')
    if (idx !== -1) uri = uri.substr(0, idx)
    return uri
  },

  // ' a, b, c   ' => ['a', 'b', 'c']
  splitAndTrim: (value, sep = ',') => {
    if (value && typeof value === 'string') {
      value = value.split(sep)
      return value.map(item => item.trim())
    }
  },

  cloneDeep,
  merge,
  arg2bool,
  arg2number
}

export { utils }
export default utils
