// 参数值转为boolean
function arg2bool (value) {
  if (value === undefined) return value
  const type = typeof value
  if (type === 'boolean') {
    return value
  } else if (type === 'string') {
    if (value === 'true') return true
    return !!Number(value)
  } else if (type === 'number') {
    return !!value
  }
  return false
}

// 参数值转为数字
function arg2number (value) {
  if (value === undefined) return value
  const type = typeof value
  if (type === 'number') {
    return value
  } else if (type === 'boolean') {
    return value ? 1 : 0
  } else if (type === 'string') {
    if (value === 'false') {
      return 0
    } else if (value === 'true') {
      return 1
    } else {
      return Number(value)
    }
  }
  return 0
}

export {
  arg2bool,
  arg2number
}
