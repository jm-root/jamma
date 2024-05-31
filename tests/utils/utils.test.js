import { utils } from '../..'

describe('router', () => {
  test('slice', function () {
    expect(utils.slice).toBeTruthy()
  })

  test('formatJson', function () {
    expect(utils.formatJSON).toBeTruthy()
  })

  test('getUriProtocol', function () {
    expect(utils.getUriProtocol('http://test.com') === 'http').toBeTruthy()
  })

  test('getUriPath', function () {
    expect(utils.getUriPath('http://test.com/abc?acd=123') === '/abc').toBeTruthy()
  })

  test('cloneDeep', function () {
    const o = {
      t: new Date(),
      r: /[.*+?^${}()|[\]\\]/g,
      // eslint-disable-next-line
      b: new Boolean(true),
      // eslint-disable-next-line
      s: new String('123'),
      // eslint-disable-next-line
      n: new Number(123)
    }
    const oo = utils.cloneDeep(o)
    console.log(o)
    console.log(oo)
    console.log(utils.cloneDeep({ a: 1 }))
    console.log(utils.cloneDeep([1, 2, 3]))
    console.log(utils.cloneDeep({ a: null, b: { c: 1 } }))
  })

  test('merge', function () {
    let obj1 = null
    let obj2 = null
    console.log(utils.merge(obj1, obj2))

    obj1 = {}
    obj2 = { a: 123 }
    console.log(utils.merge(obj1, obj2))

    obj1 = { a: { b: 1 } }
    obj2 = { a: { c: 3 } }
    console.log(utils.merge(obj1, obj2))

    obj1 = [1, 3]
    obj2 = [1, 2, 4]
    console.log(utils.merge(obj1, obj2))

    obj1 = [{ a: 1 }]
    obj2 = [{ a: 2 }, { c: 2 }]
    console.log(utils.merge(obj1, obj2))
  })

  test('splitAndTrim', function () {
    console.log(utils.splitAndTrim(' a, b, c   '))
  })
})
