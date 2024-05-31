import MS from '../../lib/ms'

const ms = new MS()
const router = ms.router()
router.use(opts => {
  return opts
})

const uri = 'http://api.jamma.cn'
describe('ms', () => {
  test('server', async () => {
    const doc = await ms.server(router, { type: 'http', port: 3000 })
    console.log(doc)
    expect(doc).toBeTruthy()
    await doc.close()
  })

  test('http-client', async () => {
    const client = await ms.client({ uri })
    const doc = await client.get('/')
    console.log(doc)
    expect(doc).toBeTruthy()
  })

  test('proxy', async () => {
    router.clear()
    await router.proxy('/', uri)
    const doc = await router.get('/')
    console.log(doc)
    expect(doc).toBeTruthy()
  })
})
