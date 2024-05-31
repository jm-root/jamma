import mdl from '../../../lib/ms/http-client'
import MS from '../../../lib/ms/core'

const client = mdl.adapter
const ms = new MS()
const uri = 'http://api.jamma.cn'
describe('client', () => {
  test('adapter', async () => {
    const $ = await client(uri)
    await $.onReady()
    const doc = await $.request('/')
    console.log(doc)
    expect(doc).toBeTruthy()
  })

  test('client with adapter', async () => {
    const adapter = {
      async request (url, data, opts) {
        return { data: data }
      }
    }
    const $ = await client({ uri, adapter })
    await $.onReady()
    const doc = await $.request('/config', { name: 'jeff' })
    console.log(doc)
    expect(doc).toBeTruthy()
  })

  test('module', async () => {
    ms.use(mdl)
    const $ = await ms.client({ uri })
    await $.onReady()
    const doc = await $.request('/')
    console.log(doc)
    expect(doc).toBeTruthy()
  })
})
