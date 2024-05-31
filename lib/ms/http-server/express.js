import http from 'node:http'
import https from 'node:https'
import express from 'express'
import { Err } from '../../err'
import log from 'jm-log4js'

const logger = log.getLogger('ms-http-server')
const defaultPort = 80

function createApp (opts = {}) {
  const { type, host = null, port = defaultPort } = opts
  const app = express()
  let server
  if (type === 'https') {
    server = https.createServer(opts, app).listen(port, host)
  } else {
    server = http.createServer(app).listen(port, host)
  }
  app.close = async function () {
    return new Promise((resolve, reject) => {
      server.close((e) => {
        if (e) {
          reject(e)
        } else {
          resolve()
        }
      })
    })
  }
  return app
}

export default function (router, opts = {}) {
  const { config: { debug } = {} } = router
  debug && (logger.setLevel('debug'))
  let { app } = opts
  if (!app) {
    app = createApp(opts)
    app.use(express.json())
    app.use(express.urlencoded({ extended: true }))
    app.set('trust proxy', true) // 支持代理后面获取用户真实ip

    // 设置跨域访问
    app.use(function (req, res, next) {
      const { headers = {} } = opts
      res.header('Access-Control-Allow-Origin', headers['Access-Control-Allow-Origin'] || '*')
      res.header('Access-Control-Allow-Headers', headers['Access-Control-Allow-Headers'] || 'X-Forwarded-For, X-Requested-With, Content-Type, Content-Length, Authorization, Accept')
      res.header('Access-Control-Allow-Methods', headers['Access-Control-Allow-Methods'] || 'PUT, POST, GET, DELETE, OPTIONS, HEAD')
      res.header('Content-Type', headers['Content-Type'] || 'application/json;charset=utf-8')
      if (req.method === 'OPTIONS' || req.method === 'HEAD') {
        res.status(200).end()
      } else if (req.url.indexOf('/favicon.ico') >= 0) {
        res.status(404).end()
      } else {
        next()
      }
    })
  }

  app.use(function (req, res, next) {
    if (app.middle) {
      return app.middle(req, res, next)
    }
    next()
  })

  app.use(function (req, res) {
    const data = Object.assign({}, req.query, req.body)
    const opts = {
      uri: req.path,
      type: req.method.toLowerCase(),
      data,
      protocol: req.protocol,
      hostname: req.hostname,
      headers: req.headers,
      ip: req.ip,
      ips: req.ips
    }
    if (req.headers.lng) opts.lng = req.headers.lng
    router.request(opts)
      .then(doc => {
        if (debug) {
          logger.debug(`ok. request:\n${JSON.stringify(opts, null, 2)}\nresponse:\n${JSON.stringify(doc, null, 2)}`)
        }
        if (typeof doc === 'string') {
          res.type('html')
        }
        res.send(doc)
      })
      .catch(e => {
        if (debug) {
          logger.debug(`fail. request:\n${JSON.stringify(opts, null, 2)}\nresponse:\n${JSON.stringify(e.data, null, 2)}`)
        }
        logger.error(e)
        const doc = e.data || Object.assign({}, Err.FA_INTERNALERROR, { status: e.status, msg: e.message })
        return res.status(e.status || doc.status || Err.FA_INTERNALERROR.err).send(doc)
      })
  })

  return app
}
