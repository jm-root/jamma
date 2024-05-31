import adapter from './ws'
import mdl from './mdl'

const $ = mdl(adapter)
$.adapter = adapter
export default $
