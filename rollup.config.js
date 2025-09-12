import roll from 'jm-rollup'
function fn (opts) {
  return roll('', opts)
}

export default [
  fn(),
  fn({
    inputFilename: 'lib/browser',
    outputFilename: 'dist/browser'
  })
]
