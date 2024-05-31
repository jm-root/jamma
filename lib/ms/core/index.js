import { Err, err } from '../../err'
import MyErr from './err'
import EventEmitter from '../../event'
import Modulable from '../../module'
import utils from './utils'
import Router from './router'
const { enableEvent } = EventEmitter
const { enableModule } = Modulable
const { getUriProtocol } = utils

/**
 * Class representing a root.
 */
class Root {
  /**
   * create a root.
   * @param {Object} opts 参数
   * @example
   * opts参数:{
   *  logging 是否打印日志，默认false
   *  benchmark 是否计算耗时，默认false
   * }
   */
  constructor (opts = {}) {
    enableModule(this)
    enableEvent(this)
    this.utils = utils
    this.clientModules = {}
    this.serverModules = {}
    this.logging = opts.logging || false
    this.benchmark = opts.benchmark || false
  }

  /**
   * create a router
   * @param {Object} opts
   * @return {Router}
   */
  router (opts = {}) {
    const self = this
    const _opts = Object.assign({}, { logging: this.logging, benchmark: this.benchmark }, opts)
    const app = new Router(_opts)

    /**
     * 添加代理
     * proxy({uri:uri, target:target, changeOrigin:true})
     * proxy(uri, target, changeOrigin)
     * proxy(uri, target)
     * @param {String} uri
     * @param {String} target
     * @param {boolean} changeOrigin 是否改变原始uri
     */
    app.proxy = async function (uri = {}, target, changeOrigin) {
      let opts = uri
      if (typeof uri === 'string') {
        opts = {
          uri,
          target,
          changeOrigin
        }
      }
      if (!opts.target) {
        const doc = Err.FA_PARAMS
        const e = err(doc)
        throw e
      }
      this.emit('proxy', opts)
      if (typeof opts.target === 'string') {
        opts.target = { uri: opts.target }
      }
      const client = await self.client(opts.target)

      if (opts.changeOrigin) {
        app.use(opts.uri, client.request.bind(client))
      } else {
        app.use(opts.uri, client)
      }
    }
    return app
  }

  /**
   * create a client
   * @param {Object} opts
   * @example
   * opts参数:{
   *  type: 类型(可选, 默认http)
   *  uri: uri(可选, 默认http://127.0.0.1)
   *  timeout: 请求超时(可选, 单位毫秒, 默认0表示不检测超时)
   * }
   * @return {Promise}
   */
  async client (opts = {}) {
    if (typeof opts === 'string') {
      opts = { uri: opts }
    }
    if (!opts.uri) throw err(Err.FA_PARAMS)
    let e = null
    let doc = null
    let type = 'http'
    opts.uri && (type = getUriProtocol(opts.uri))
    opts.type && (type = opts.type)
    type = type.toLowerCase()
    const fn = this.clientModules[type]
    if (!fn) {
      doc = MyErr.FA_INVALID_TYPE
      e = err(doc)
      throw e
    }
    doc = await fn(opts)
    if (doc) utils.enableType(doc, ['get', 'post', 'put', 'delete'])
    return doc
  }

  /**
   * create a server
   * @param {Object} app
   * @param {Object} opts
   * @example
   * opts参数:{
     *  uri: 网址(可选)
     *  type: 类型(可选, 默认http)
     *  host: 主机(可选, 默认127.0.0.1)
     *  port: 端口(可选, 默认80, 根据type不同默认值也不同)
     * }
   * @return {Promise}
   */
  async server (app = null, opts = {}) {
    let e = null
    let doc = null
    let type = 'http'
    opts.uri && (type = getUriProtocol(opts.uri))
    opts.type && (type = opts.type)
    type = type.toLowerCase()
    const fn = this.serverModules[type]
    if (!fn) {
      doc = Err.FA_INVALID_TYPE
      e = err(doc)
      throw e
    }
    app.emit('server', opts)
    doc = await fn(app, opts)
    return doc
  }

  /**
   * 创建一个代理路由
   * 支持多种参数格式, 例如
   * proxy({uri:uri})
   * proxy(uri)
   * @param {Object} opts 参数
   * @example
   * opts参数:{
     *  uri: 目标uri(必填)
     * }
   * @return {Promise}
   */
  async proxy (opts = {}) {
    let e = null
    let doc = null
    if (typeof opts === 'string') {
      opts = { uri: opts }
    }
    if (!opts.uri) {
      doc = Err.FA_PARAMS
      e = err(doc)
      throw e
    }
    const app = this.router()
    const client = await this.client(opts)
    app.use(client.request.bind(client))
    app.client = client
    return app
  }
}

Root.utils = utils
export default Root
