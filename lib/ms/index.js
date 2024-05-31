import MS from './core'
import httpServer from './http-server'
import wsServer from './ws-server'
import httpClient from './http-client'
import wsClient from './ws-client'

class $ extends MS {
  constructor (opts = {}) {
    super(opts)

    const { disableClient, disableServer } = opts
    if (!disableClient) {
      this
        .use(httpClient)
        .use(wsClient)
    }

    if (!disableServer) {
      this
        .use(httpServer)
        .use(wsServer)
    }
  }
}

export { $ as MS }
export default $
