export default function (adapter) {
  const $ = function (name = 'ms-ws-client') {
    const app = this
    app.clientModules.ws = adapter
    app.clientModules.wss = adapter

    return {
      name: name,
      unuse: () => {
        delete app.clientModules.ws
        delete app.clientModules.wss
      }
    }
  }

  return $
}
