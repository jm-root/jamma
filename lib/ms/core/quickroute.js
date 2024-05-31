import { Types } from './consts'
import utils from './utils'
const { uniteParams } = utils

/**
 * 快速添加路由
 */
export default class {
  constructor (router, uri) {
    Object.assign(this, { router, uri })
    for (const type of Types) {
      this[type] = (...args) => {
        return this.add(...args)
      }
    }
  }

  add (...args) {
    const { uri } = this
    const opts = uniteParams(...args)
    if (uri) {
      opts.uri = opts.uri ? `${uri}${opts.uri}` : uri
    }
    this.router.add(opts)
    return this
  }

  use (...args) {
    const { uri } = this
    const opts = uniteParams(...args)
    if (uri) {
      opts.uri = opts.uri ? `${uri}${opts.uri}` : uri
    }
    this.router.use(opts)
    return this
  }
}
