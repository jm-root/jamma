import { EventEmitter } from '..'
const { enableEvent, disableEvent } = EventEmitter

describe('event', () => {
  const test1 = function (o) {
    let i = 0
    o.on('test', function (v, v2, a, b, c) {
      expect(v === '123' && v2 === '456').toBeTruthy()
      expect(a === 1).toBeTruthy()
      expect(b === 2).toBeTruthy()
      expect(c === 3).toBeTruthy()
      i++
    })
    o.on('test', function (v) {
      expect(v === '123').toBeTruthy()
      i++
      return false // this will break the calls
    })
    o.on('test', function (v) {
      // this will not be called
      expect(v === '123').toBeTruthy()
      i++
    })
    o.emit('test', '123', '456', 1, 2, 3)
    expect(i === 2).toBeTruthy()
  }

  test('EventEmitter', () => {
    const o = new EventEmitter()
    test1(o)
  })

  test('caller', () => {
    const caller = {}
    const o = {}
    enableEvent(o)
    o.on('test', function (v) {
      expect(this === caller).toBeTruthy()
      expect(v === 1).toBeTruthy()
    }.bind(caller, 1))
    o.emit('test', '123')
  })

  test('once', () => {
    const o = {}
    enableEvent(o)
    let i = 0
    o.once('test', (v) => {
      expect(v === '123').toBeTruthy()
      i++
    })
    o.emit('test', '123')
    o.emit('test', '123')
    expect(i === 1).toBeTruthy()
  })

  test('prepend', () => {
    const o = {}
    enableEvent(o)
    o.on('test', (v) => {
      console.log('should be 2')
    })
    o.on('test', (v) => {
      console.log('should be 1')
    }, true)
    o.on('test', (v) => {
      console.log('should be 3')
    })
    o.once('test', (v) => {
      console.log('should be 0')
    }, true)
    o.emit('test', '123')
    o.emit('test', '123')
  })

  test('off', () => {
    const o = {}
    enableEvent(o)
    let i = 0
    o.on('test', (v) => {
      i++
    })
    o.emit('test', '123')
    o.off('test')
    o.emit('test', '123')
    expect(i === 1).toBeTruthy()
    expect(o.listeners('test').length === 0).toBeTruthy()
  })

  test('off in event', () => {
    const o = {}
    enableEvent(o)
    let i = 0
    o.on('test', (v) => {
      i++
      o.off('test')
    })
    o.on('test', (v) => {
      i++
    })
    o.emit('test', '123')
    o.emit('test', '123')
    expect(i === 2).toBeTruthy()
    expect(o.listeners('test').length === 0).toBeTruthy()
  })

  test('enableEvent', () => {
    const o = {}
    expect(enableEvent(o)).toBeTruthy()
    expect(!enableEvent(o)).toBeTruthy()
  })

  test('disableEvent', () => {
    const o = {}
    expect(enableEvent(o)).toBeTruthy()
    disableEvent(o)
    expect(o.emit === undefined).toBeTruthy()
  })

  test('enableEvent force', () => {
    const o = {}
    enableEvent(o)
    o
      .on('test', v => { console.log('test', v) })
      .emit('test', 123)

    // 保留事件
    expect(enableEvent(o, { force: true })).toBeTruthy()
    o.emit('test', 1234)

    // 清除事件
    expect(enableEvent(o, { force: true, clean: true })).toBeTruthy()
    o.emit('test', 12345)
  })
})
