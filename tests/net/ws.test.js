import { WebSocket, HeartBeat } from '../../lib/net'
import logger from '../../lib/logger'
import event from '../../lib/event'
import _WebSocket from 'ws'

const reconnectTimeout = 1000
const reconnectAttempts = 0
const pingTimeout = 500
const pongTimeout = 500

class Adapter {
  constructor (uri) {
    event.enableEvent(this)

    const ws = new _WebSocket(uri)

    ws.on('message', opts => {
      this.emit('message', opts)
    })
    ws.onopen = opts => {
      this.emit('open', opts)
    }
    ws.onerror = opts => {
      this.emit('error', opts)
    }
    ws.onclose = opts => {
      this.emit('close', opts)
    }

    this.ws = ws
  }

  send () {
    this.ws.send(...arguments)
  }

  close () {
    if (!this.ws) return
    this.ws.close(...arguments)
    this.ws = null
  }
}

const ws = new WebSocket({ Adapter, reconnectTimeout, reconnectAttempts, pingTimeout, pongTimeout })
const uri = 'https://api.jamma.cn'

ws
  .on('open', () => {
    logger.debug('opened')
  })
  .on('close', opts => {
    logger.debug('closed', opts.code, opts.reason)
  })
  .on('error', opts => {
    // logger.debug('error', opts.error)
  })
  .on('message', opts => {
    logger.debug('received', opts)
  })
  .on('heartBeat', () => {
    logger.debug('heartBeat')
  })
  .on('heartDead', () => {
    logger.debug('heartDead')
  })
  .on('connect', () => {
    logger.debug('connecting...')
  })
  .on('reconnect', () => {
    logger.debug('reconnect', `${ws.reconnectAttempts}/${ws.maxReconnectAttempts}`)
  })
  .on('connectFail', () => {
    logger.debug('connectFail')
  })

test('opts', async () => {
  let o = new WebSocket({ Adapter })
  expect(o.reconnectTimeout === WebSocket.ReconnectTimeout).toBeTruthy()
  expect(o.maxReconnectAttempts === WebSocket.MaxReconnectAttempts).toBeTruthy()
  let h = o.heart
  expect(h.pingTimeout === HeartBeat.PingTimeout).toBeTruthy()
  expect(h.pongTimeout === HeartBeat.PongTimeout).toBeTruthy()

  o = ws
  expect(o.reconnectTimeout === reconnectTimeout).toBeTruthy()
  expect(o.maxReconnectAttempts === reconnectAttempts).toBeTruthy()
  h = o.heart
  expect(h.pingTimeout === pingTimeout).toBeTruthy()
  expect(h.pongTimeout === pongTimeout).toBeTruthy()
})

test('connect and close', async () => {
  await ws.connect(uri)
  expect(ws.ready).toBeTruthy()
  ws.close()
  expect(!ws.ready).toBeTruthy()
})

/**
 * 模拟心跳失败2次，测试是否会自动重连
 */
test('heartBeat fail', async () => {
  await ws.connect(uri)
  return new Promise((resolve, reject) => {
    let times = 0
    let oktimes = 0
    ws
      .off('heartBeat')
      .on('heartBeat', () => {
        logger.debug('heartBeat')
        oktimes++
        if (oktimes <= 2) {
          setTimeout(() => {
            ws.heart.reset()
          }, 100)
        }
        return true
      })
      .on('close', () => {
        times++
        if (times === 2) {
          resolve()

          setTimeout(() => {
            ws.close()
          }, 2000)
        }
      })
  })
})

test('send', async () => {
  try {
    await ws.connect(uri)
    ws.send('ping')
    await ws.close()
  } catch (e) {
  }
})
