import { EventEmitter } from '..'
const { enableEvent } = EventEmitter

const eventHandle = function (opts, intro) {
  console.info('1.', opts, intro)
}
const eventHandle2 = async function (opts, intro) {
  console.info('2.', opts, intro)
  return false // eventHandle3 will not be called before this line block the event.
}
const eventHandle3 = function (opts, intro) {
  console.info('3.', opts, intro)
}

function test (o) {
  o.once('addTag', function (opts, intro) {
    console.info('once addTag', opts, intro)
  })
  o.on('addTag', eventHandle.bind(o))
  o.on('addTag', eventHandle2)
  o.on('addTag', eventHandle3)
  o.emit('addTag', 'tag1', 'tag1 intro')
  o.emit('addTag', 'tag2')
}

// 注意参数 async 导致eventHandle3不会被执行
let o = new EventEmitter({ async: true })
test(o)

o = {}
enableEvent(o)
test(o)
