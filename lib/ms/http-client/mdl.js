export default function (adapter) {
  const $ = function (name = 'ms-http-client') {
    const app = this
    app.clientModules.http = adapter
    app.clientModules.https = adapter

    return {
      name: name,
      unuse: () => {
        delete app.clientModules.http
        delete app.clientModules.https
      }
    }
  }

  return $
}
