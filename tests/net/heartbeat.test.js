import { HeartBeat } from '../../lib/net'
import logger from '../../lib/logger'

const pingTimeout = 1100
const pongTimeout = 110

const heart = new HeartBeat({ pingTimeout, pongTimeout })

test('opts', async () => {
  let h = new HeartBeat()
  expect(h.pingTimeout === HeartBeat.PingTimeout).toBeTruthy()
  expect(h.pongTimeout === HeartBeat.PongTimeout).toBeTruthy()

  h = new HeartBeat({ pingTimeout, pongTimeout })
  expect(h.pingTimeout === pingTimeout).toBeTruthy()
  expect(h.pongTimeout === pongTimeout).toBeTruthy()
})

test('reset', async () => {
  heart
    .off()
    .reset()

  let times = 0
  return new Promise((resolve, reject) => {
    heart
      .on('heartBeat', () => {
        times++
        logger.debug('heartBeat', times)

        setTimeout(() => {
          heart.reset()
          if (times === 3) {
            heart.stop()
            resolve()
          }
        }, 1)

        return true
      })
  })
})

test('dead', async () => {
  heart
    .off()
    .reset()

  return new Promise((resolve) => {
    heart
      .on('heartBeat', () => {
        console.log('heartBeat')
        return true
      })
      .on('heartDead', () => {
        console.log('heartDead')
        resolve()
      })
  })
})
