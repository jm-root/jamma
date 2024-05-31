import { Modulable } from '..'
const { enableModule, disableModule } = Modulable

const o = {}

const mdlTest = function () {
  const app = this
  app.test = () => {
    return true
  }

  return {
    name: 'test',
    unuse: () => {
      delete app.test
    }
  }
}

function l (obj) {
  expect(obj.use).toBeTruthy()
  expect(obj.unuse).toBeTruthy()

  obj.use(mdlTest)
  console.log(obj.modules)

  expect(obj.test()).toBeTruthy()
  obj.unuse('test')
  expect(obj.test).not.toBeTruthy()
}

test('Modulable', function () {
  const obj = new Modulable()
  console.log(obj)
  l(obj)
})

test('enableModule', function () {
  expect(enableModule(o)).toBeTruthy()
  expect(enableModule(o)).not.toBeTruthy()
  l(o)
})

test('disableModule', function () {
  disableModule(o)
  expect(o.use === undefined).toBeTruthy()
})
