import mdl from '../../../lib/ms/http-server'
import MS from '../../../lib/ms/core'
import log from 'jm-log4js'
const logger = log.getLogger('ms-http-server')
logger.level = 'debug'

const { adapter } = mdl
const ms = new MS()
const router = ms.router()
router.config = { debug: true }
router.use(opts => {
  return opts
})

describe('server', () => {
  test('adapter', async () => {
    const doc = await adapter(router, { port: 3000 })
    console.log(doc)
    expect(doc).toBeTruthy()
    await doc.close()
  })

  test('module', async () => {
    ms.use(mdl)
    const doc = await ms.server(router, { type: 'http', port: 3000 })
    console.log(doc)
    expect(doc).toBeTruthy()
    await doc.close()
  })
})
