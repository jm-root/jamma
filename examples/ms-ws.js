import { MS } from '..'

const uri = 'wss://api.jamma.cn'
const ms = new MS()

async function test () {
  let $ = null
  $ = await ms.client({ uri, debug: true })
  const doc = await $.get('/')
  console.log(doc)
  $.close()
}

test()
