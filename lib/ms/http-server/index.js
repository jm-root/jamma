import adapter from './express'
import mdl from './mdl'

const $ = mdl(adapter)
$.adapter = adapter

export default $
