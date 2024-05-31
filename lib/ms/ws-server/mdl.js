export default function (adapter) {
  const $ = function (name = 'ms-ws-server') {
    const app = this
    app.serverModules.ws = adapter
    app.serverModules.wss = adapter

    return {
      name: name,
      unuse: () => {
        delete app.serverModules.ws
        delete app.serverModules.wss
      }
    }
  }

  return $
}
