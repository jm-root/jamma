import { Err, err } from '..'
const { validErr, errMsg } = Err

function isNumber (obj) {
  return typeof obj === 'number' && isFinite(obj)
}
function isValidStatus (status) {
  return status !== undefined && isNumber(status) && status >= 100 && status <= 600
}

describe('err', function () {
  it('validErr', function () {
    // console.log(validErr('test'))
    // console.log(validErr(Err.FAIL))
    for (const key of Object.keys(Err)) {
      const item = Err[key]
      const { status } = validErr(item)
      expect(isValidStatus(status)).toBeTruthy()
      if (isValidStatus(item.status)) {
        expect(status === item.status).toBeTruthy()
      }
      if (isValidStatus(item.err) && !isValidStatus(item.status)) {
        expect(status === item.err).toBeTruthy()
      }
      if (!isValidStatus(item.err) && !isValidStatus(item.status)) {
        expect(status === 500).toBeTruthy()
      }
    }
  })

  it('errMsg', function () {
    // eslint-disable-next-line
    let msg = errMsg('err param: ${param} paramNum: ${num}', {
      param: 'abc',
      num: 123
    })
    expect(msg === 'err param: abc paramNum: 123').toBeTruthy()
  })

  it('err', function () {
    const E = Err.SUCCESS
    let e = err(E)
    expect(e.message === E.msg).toBeTruthy()

    const ee = new Error('test')
    ee.data = { name: '12' }
    e = err(ee)
    expect(e.data.name === ee.data.name).toBeTruthy()
    // console.log(e)

    // eslint-disable-next-line
    e = err('err param: ${param} paramNum: ${num}', {
      param: 'abc',
      num: 123
    })
    expect(e.message === 'err param: abc paramNum: 123').toBeTruthy()
  })

  it('t', function () {
    const msg = Err.t(Err.FAIL.msg, 'zh_CN')
    // console.log(msg)
    expect(msg).toBeTruthy()
  })
})
