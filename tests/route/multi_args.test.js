import Route from '../../lib/ms/route'
import _ from 'lodash'

const name = 'jeff'
const age = 18
const gender = 1
const fn = (opts, age) => {
  Object.assign(opts, { name, age })
  return opts
}

const fnFilter = (opts) => {
  Object.assign(opts, { gender })
}

describe('multi args', () => {
  test('one function', async () => {
    const o = new Route(fn)
    const doc = await o.execute({}, age)
    console.log(doc)
    expect(_.isEqual(doc, { name, age })).toBeTruthy()
  })

  test('chain', async () => {
    const o = new Route([fnFilter, fn])
    const doc = await o.execute({}, age)
    console.log(doc)
    expect(_.isEqual(doc, { name, age, gender })).toBeTruthy()
  })
})
