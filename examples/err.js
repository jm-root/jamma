import { Err, err } from '..'
const { t, errMsg } = Err

function test (obj) {
  console.info(JSON.stringify(Err, null, 2))
  // eslint-disable-next-line
  console.info(errMsg('SUCCESS ${name}:${value}', { name: 'jeff', value: 123 }))
  console.info(err(Err.SUCCESS))
  console.info(t(Err.SUCCESS.msg, 'zh_CN'))
  // eslint-disable-next-line
  console.info(err('SUCCESS ${name}:${value}', { name: 'jeff', value: 123 }))
  console.info(err(Object.assign(Err.SUCCESS, { data2: { test: 1 } })))
}

test()
