/**
 * module.
 * @module module
 */

/**
 * Class representing a modulable object.
 *
 */
class Modulable {
  /**
     * Create an modulable object.
     */
  constructor () {
    this._modules = {}
  }

  /**
     * modules
     * @return {Object}
     */
  get modules () {
    return this._modules
  }

  /**
     * use a module
     * @param {Function} fn module function
     * @param args any arguments
     * @return {Modulable} for chaining
     */
  use (fn, ...args) {
    const m = fn.apply(this, args)
    if (m && m.name) {
      this._modules[m.name] = m
    }
    return this
  }

  /**
     * unuse a module
     * @param {Object|String} nameOrModule module or name to be unused
     * @return {Modulable} for chaining
     */
  unuse (nameOrModule) {
    let m = nameOrModule
    if (typeof m === 'string') m = this._modules[m]
    if (m && m.unuse) {
      if (m.name) {
        delete this._modules[m.name]
      }
      m.unuse()
    }
    return this
  }
}

const prototype = Modulable.prototype
const M = {
  _modules: {},
  use: prototype.use,
  unuse: prototype.unuse
}

/**
 * enable modulable support for obj
 * @param {Object} obj target object
 * @return {boolean}
 */
const enableModule = (obj) => {
  if (obj.use !== undefined) return false
  for (const key in M) {
    obj[key] = M[key]
  }
  obj._modules = {}

  Object.defineProperty(
    obj,
    'modules',
    {
      value: obj._modules,
      writable: false
    }
  )

  return true
}

/**
 * disable modulable support for obj
 * @param {Object} obj target object
 */
const disableModule = (obj) => {
  if (obj.use === undefined) return
  for (const key in M) {
    delete obj[key]
  }
}

Object.assign(Modulable, { enableModule, disableModule })

export {
  Modulable
}

export default Modulable
