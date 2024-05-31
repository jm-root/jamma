import mdl from '../../../lib/ms/ws-client'
import MS from '../../../lib/ms/core'
const ms = new MS()
ms.use(mdl)

const uri = 'wss://api.jamma.cn'
const pingTimeout = 1000
const pongTimeout = 1000

let $ = null
beforeAll(async () => {
  $ = await ms.client({ uri, pingTimeout, pongTimeout, debug: true })
})

afterAll(async () => {
  $.close()
})

describe('ms-client', () => {
  test('request', async () => {
    const doc = await $.get('/')
    expect(doc).toBeTruthy()
  })

  test('request timeout', async () => {
    try {
      await $.get('/', {}, { timeout: 1 })
    } catch (e) {
      console.error(e)
    }
  })
})
