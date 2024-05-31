export default function (adapter) {
  const $ = function (name = 'ms-http-server') {
    const app = this
    app.serverModules.http = adapter
    app.serverModules.https = adapter

    return {
      name: name,
      unuse: () => {
        delete app.serverModules.http
        delete app.serverModules.https
      }
    }
  }

  return $
}
