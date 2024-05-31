const argsClass = '[object Arguments]'
const arrayClass = '[object Array]'
const boolClass = '[object Boolean]'
const dateClass = '[object Date]'
const funcClass = '[object Function]'
const numberClass = '[object Number]'
const objectClass = '[object Object]'
const regexpClass = '[object RegExp]'
const stringClass = '[object String]'

/** Used to identify object classifications that `cloneDeep` supports */
const cloneableClasses = {}
cloneableClasses[funcClass] = false
cloneableClasses[argsClass] = true
cloneableClasses[arrayClass] = true
cloneableClasses[boolClass] = true
cloneableClasses[dateClass] = true
cloneableClasses[numberClass] = true
cloneableClasses[objectClass] = true
cloneableClasses[regexpClass] = true
cloneableClasses[stringClass] = true

const ctorByClass = {}
ctorByClass[arrayClass] = Array
ctorByClass[boolClass] = Boolean
ctorByClass[dateClass] = Date
ctorByClass[objectClass] = Object
ctorByClass[numberClass] = Number
ctorByClass[regexpClass] = RegExp
ctorByClass[stringClass] = String

/** Used to match regexp flags from their coerced string values */
const reFlags = /\w*$/

const cloneDeep = function (obj) {
  if (typeof obj !== 'object' || !obj) return obj
  if (Array.isArray(obj)) {
    const ret = []
    obj.forEach(function (item) {
      ret.push(cloneDeep(item))
    })
    return ret
  }
  const className = toString.call(obj)
  if (!cloneableClasses[className]) {
    return obj
  }
  const Ctor = ctorByClass[className]
  switch (className) {
    case boolClass:
    case dateClass:
      return new Ctor(+obj)

    case numberClass:
    case stringClass:
      return new Ctor(obj)

    case regexpClass:
      return Ctor(obj.source, reFlags.exec(obj))
  }

  const ret = {}
  const keys = Object.keys(obj)
  keys.forEach(function (key) {
    ret[key] = cloneDeep(obj[key])
  })
  return ret
}

export { cloneDeep }
export default cloneDeep
