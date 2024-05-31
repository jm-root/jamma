import { MS } from '..'

async function test () {
  const uri = 'http://api.jamma.cn'
  const ms = new MS()
  const router = ms.router()
  await router.proxy('/config', uri)
  const doc = await router.get('/config')
  console.log(doc)
}

test()
