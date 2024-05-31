import mdl from './mdl'
import fnclient from './fnclient'

const adapter = fnclient()
const $ = mdl(adapter)
$.adapter = adapter
export default $
