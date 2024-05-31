import t from './locale'

function isNumber (obj) {
  return typeof obj === 'number' && isFinite(obj)
}

/**
 * common error defines
 *
 */
const Err = {
  SUCCESS: {
    err: 0,
    msg: 'Success'
  },

  FAIL: {
    err: 1,
    msg: 'Fail'
  },

  FA_SYS: {
    err: 2,
    msg: 'System Error'
  },

  FA_NETWORK: {
    err: 3,
    msg: 'Network Error'
  },

  FA_PARAMS: {
    err: 4,
    msg: 'Parameter Error'
  },

  FA_BUSY: {
    err: 5,
    msg: 'Busy'
  },

  FA_TIMEOUT: {
    err: 6,
    msg: 'Time Out'
  },

  FA_ABORT: {
    err: 7,
    msg: 'Abort'
  },

  FA_NOTREADY: {
    err: 8,
    msg: 'Not Ready'
  },

  FA_NOTEXISTS: {
    err: 9,
    msg: 'Not Exists'
  },

  FA_EXISTS: {
    err: 10,
    msg: 'Already Exists'
  },

  FA_VALIDATION: {
    err: 11,
    msg: 'Validation Error'
  },

  OK: {
    err: 200,
    msg: 'OK'
  },

  FA_BADREQUEST: {
    err: 400,
    msg: 'Bad Request'
  },

  FA_NOAUTH: {
    err: 401,
    msg: 'Unauthorized'
  },

  FA_NOPERMISSION: {
    err: 403,
    msg: 'Forbidden'
  },

  FA_NOTFOUND: {
    err: 404,
    msg: 'Not Found'
  },

  FA_INTERNALERROR: {
    err: 500,
    msg: 'Internal Server Error'
  },

  FA_UNAVAILABLE: {
    err: 503,
    msg: 'Service Unavailable'
  }
}

/**
 * return message from template
 *
 * ```javascript
 * errMsg('sampe ${name} ${value}', {name: 'jeff', value: 123});
 * // return 'sample jeff 123'
 * ```
 *
 * @param {String} msg message template
 * @param {Object} opts params
 * @return {String} final message
 */
function errMsg (msg, opts) {
  if (opts) {
    for (const key in opts) {
      msg = msg.split('${' + key + '}').join(opts[key])
    }
  }
  return msg
}

function isValidStatus (status) {
  return status !== undefined && isNumber(status) && status >= 100 && status <= 600
}

/**
 * return an Err object
 * @param {Object|String} E Err object or a message
 * @return {Err}
 */
function validErr (E) {
  typeof E === 'string' && (E = { msg: E })
  const { SUCCESS, FAIL, FA_INTERNALERROR } = Err
  let { err = FAIL.err, status } = E
  if (!isValidStatus(status)) {
    isValidStatus(err) && (status = err)
    err === SUCCESS.err && (status = 200)
  }
  !isValidStatus(status) && (status = FA_INTERNALERROR.err)
  Object.assign(E, { err, status })
  return E
}

/**
 * return an Error Object
 * @param {Object|String} E Err object or a message template
 * @param {Object} [opts] params
 * @return {Error}
 */
function err (E, opts) {
  if (E instanceof Error) {
    const { code, status, message: msg, data } = E
    const EE = validErr({ err: code, status })
    Object.assign(E, EE)
    data || (E.data = {
      ...EE,
      msg
    })
    return E
  }
  E = validErr(E)
  const { err, status } = E
  const msg = errMsg(E.msg || E.message, opts)
  const e = new Error(msg)
  Object.assign(e, {
    code: err,
    status,
    data: {
      ...E,
      msg
    }
  })
  return e
}

Object.assign(Err, { t, validErr, errMsg })

export {
  Err,
  err
}

export default Err
