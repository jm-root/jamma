import mdl from '../../../lib/ms/ws-server'
import MS from '../../../lib/ms/core'

const { adapter } = mdl
const ms = new MS()
const router = ms.router()
router.config = { debug: true }
router
  .use('/ping', async opts => {
    const { session } = opts
    return session.request({ uri: '/pong' })
  })
  .use(opts => opts)

describe('ws server', () => {
  test('adapter', async () => {
    const doc = adapter(router, { port: 3000 })
    expect(doc).toBeTruthy()
    await doc.close()
  })

  test('module', async () => {
    ms.use(mdl)
    const doc = await ms.server(router, { type: 'ws', port: 3000 })
    expect(doc).toBeTruthy()
    await doc.close()
  })
})
