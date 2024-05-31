import { logger, getLogger } from '../lib/logger'

const l = function (logger) {
  const levels = ['debug', 'info', 'warn', 'error']
  expect(logger).toBeTruthy()
  logger.level = 'info'
  console.log(logger)
  levels
    .forEach(function (level) {
      logger[level](level)
      expect(logger[level]).toBeTruthy()
    })
}

test('logger', () => {
  l(logger)
})

test('getLogger', () => {
  l(getLogger('main'))
})
