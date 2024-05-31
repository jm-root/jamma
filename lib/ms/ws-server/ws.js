import { WebSocketServer } from 'ws'
import proxyaddr from 'proxy-addr'
import Session from '../session'
import event from '../../event'
import log from 'jm-log4js'
const logger = log.getLogger('ms-ws-server')
const defaultPort = 80

const defineGetter = function (obj, name, getter) {
  Object.defineProperty(obj, name, {
    configurable: true,
    enumerable: true,
    get: getter
  })
}

const trust = function () {
  return true
}

class ServerSession extends Session {
  async onRequest (opts) {
    opts.session = this
    opts.ip || (opts.ip = this.ip)
    opts.ips || (opts.ips = this.ips)
    opts.ips && opts.ips.length && (opts.ip = opts.ips[0])
    opts.protocol = 'ws'
    return super.onRequest(opts)
  }

  toJSON () {
    const { id, uri, timeout, debug } = this
    return { id, uri, timeout, debug }
  }
}

export default function (router, opts = { port: defaultPort }) {
  let id = 0
  const sessions = {}

  const doc = {
    sessions,
    broadcast: function (data) {
      const sessions = this.sessions
      for (const i in sessions) {
        sessions[i].send(data, err => { }) // eslint-disable-line
      }
    }
  }
  event.enableEvent(doc, { async: true })

  const wss = new WebSocketServer(opts)
  wss.on('connection', function (ws, req) {
    const { headers, url: uri } = req
    const { config = {} } = router
    const { debug = false } = config

    const session = new ServerSession({
      debug,
      logger,
      router
    })
    Object.assign(session, {
      id: id++,
      headers,
      uri,
      send: function () {
        ws.send.apply(ws, arguments)
      },
      close: function () {
        ws.close.apply(ws, arguments)
      }
    })

    logger.info(`session ${session.id} connected.`, { uri, headers })

    defineGetter(req, 'ip', function () {
      return proxyaddr(this, trust)
    })

    defineGetter(req, 'ips', function () {
      const addrs = proxyaddr.all(this, trust)
      return addrs.slice(1).reverse()
    })

    session.ip = req.ip
    session.ips = req.ips

    sessions[session.id] = session
    doc.emit('connection', session)
    ws.on('message', function (message) {
      doc.emit('message', message, session)
      session.emit('message', message)
    })
    ws.onclose = function () {
      logger.info(`session ${session.id} disconnected.`)
      delete sessions[session.id]
      doc.emit('close', session)
      session.emit('close')
    }
  })

  doc.close = async function () {
    return new Promise((resolve, reject) => {
      wss.close((e) => {
        if (e) {
          reject(e)
        } else {
          resolve()
        }
      })
    })
  }

  return doc
}
