import event from '../event'
import HeartBeat from './heartbeat'

const PingFailedCode = 4999 // 心跳失败后，关闭 code, 4000 至 4999 之间
const MaxReconnectAttempts = 0 // 默认重试次数0 表示无限制
const ReconnectTimeout = 3000 // 默认自动重连延时 3 秒

class WebSocket {
  constructor (opts = {}) {
    event.enableEvent(this)

    const { Adapter, reconnect = true, reconnectTimeout = ReconnectTimeout, reconnectAttempts = MaxReconnectAttempts, pingFailedCode = PingFailedCode } = opts

    if (!Adapter) throw new Error('invalid Adapter')
    this.Adapter = Adapter

    this.pingFailedCode = pingFailedCode

    this.reconnect = reconnect
    this.reconnectTimeout = reconnectTimeout
    this.maxReconnectAttempts = reconnectAttempts

    this.reconnectAttempts = 0

    this._reconnectTimer = null

    this.uri = null
    this.ws = null
    this.connecting = null // or a promise instance

    const heart = new HeartBeat(opts)
    this.heart = heart
    heart
      .on('heartBeat', () => {
        return this.emit('heartBeat')
      })
      .on('heartDead', () => {
        if (this.emit('heartDead')) return
        this.close(this.pingFailedCode, 'heartbeat timeout')
      })
  }

  get ready () {
    return !!this.ws
  }

  onReady () {
    if (this.ws) return
    return this.connect()
  }

  connect (uri) {
    uri && (this.uri = uri)
    if (!this.connecting) {
      this.connecting = this._connect()
    }
    return this.connecting
  }

  async send () {
    await this.onReady()
    this.ws.send(...arguments)
    this.heart.reset()
  }

  close () {
    this._stopReconnect()
    if (!this.ws) return
    this.ws.close(...arguments)
    this.ws = null
    this.connecting = null
  }

  async _connect () {
    const { uri } = this

    if (!uri) throw new Error('invalid uri')

    if (this.ws) return

    this.emit('connect')

    return new Promise((resolve, reject) => {
      let ws = null
      try {
        ws = new this.Adapter(uri)
      } catch (e) {
        return reject(e)
      }

      ws
        .on('message', opts => {
          this.heart.reset()
          this.emit('message', opts)
        })
        .on('open', opts => {
          this.emit('open', opts)
          this.ws = ws
          this.connecting = null
          this.heart.reset()
          this._stopReconnect()
          resolve()
        })
        .on('error', e => {
          this.emit('error', e)
          reject(e)
        })
        .on('close', opts => {
          this.emit('close', opts)
          this.heart.stop()
          this.ws = null
          this.connecting = null

          const { wasClean = true, code } = opts
          if (wasClean && code !== this.pingFailedCode) return
          if (this.reconnect) {
            this._reconnect()
          }
        })
    })
  }

  _reconnect () {
    if (this.maxReconnectAttempts && this.reconnectAttempts >= this.maxReconnectAttempts) {
      this.emit('connectFail')
      this._stopReconnect()
      return
    }
    this.reconnectAttempts++
    this.emit('reconnect')
    this._reconnectTimer = setTimeout(() => {
      this._reconnectTimer = null
      this
        .connect()
        .catch(() => {})
    }, this.reconnectTimeout)
  }

  _stopReconnect () {
    if (this._reconnectTimer) {
      clearTimeout(this._reconnectTimer)
      this._reconnectTimer = null
    }
    this.reconnectAttempts = 0
  }
}

WebSocket.MaxReconnectAttempts = MaxReconnectAttempts
WebSocket.ReconnectTimeout = ReconnectTimeout

WebSocket.PingFailedCode = PingFailedCode

export default WebSocket
