import MS from './core'
import httpClient from './http-client'
import wsClient from './ws-client/browser'

class $ extends MS {
  constructor (opts = {}) {
    super(opts)

    const { disableClient, disableServer } = opts
    if (!disableClient) {
      this
        .use(httpClient)
        .use(wsClient)
    }

  }
}

const ms = new $()
export { $ as MS, ms }
export default $
