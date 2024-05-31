import axios from 'axios'
import qs from 'qs'

// axios 比 flyio 快3倍, 所以服务器端选用 axios
export default {
  async request (url, data, opts) {
    const o = Object.assign({ url }, opts)
    if (data) {
      const { method } = o
      if (method === 'post' || method === 'put' || method === 'patch') {
        o.data = data
      } else {
        o.params = data
        o.paramsSerializer = function (params) {
          return qs.stringify(params, { encodeValuesOnly: true })
        }
      }
    }
    return axios(o)
  }
}
