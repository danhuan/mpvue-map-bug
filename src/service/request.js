import wxComps from '../utils/wxComps'
import { vueRouter } from '@/main'
// import { toLogin } from '@/utils/sessionAuth'
import { TOKEN } from '@/utils/constants'

/**
 * 网络请求封装
 */
// const API_PATH_NEW = ''
// const API_PATH = ''
const API_PATH_NEW = ''
const API_PATH = ''

export {API_PATH, API_PATH_NEW}

class Request {

  static get({
    url,
    data = {},
    header = {},
    showLoading = false,
    extraFn = undefined
  }) {
    const method = 'GET'
    return http({
      url,
      data,
      method,
      header,
      extraFn,
      showLoading
    })
  }

  static post({
    url,
    data = {},
    header = {},
    showLoading = false,
    extraFn = undefined,
  }) {
    const method = 'POST'
    return http({
      url,
      data,
      method,
      header,
      showLoading,
      extraFn
    })
  }

}

//网络请求
function http({
  url,
  data,
  method,
  header,
  showLoading,
  extraFn
}) {
  const token = wx.getStorageSync(TOKEN)
  const _API_PATH = url.indexOf('v1')>-1?API_PATH_NEW:API_PATH
  return checkNetWork().then(netWorkStatus => {

    if (!netWorkStatus) {
      wxComps.toast('网络异常')
      return false
    }
    let _header = header
    if (token) {
      _header = Object.assign({
        token: token
      }, header)
    }
    showLoading && wx.showLoading({
      title: '加载中...'
    })
    return new Promise((resolve, reject) => {

      wx.request({
        url: `${_API_PATH}${url}`,
        header: _header,
        method,
        data,
        dataType: 'json',
        success: (res) => {
          showLoading && wx.hideLoading()
          res = res.data
          if (res.code === 200 || res.status === 10000) {
            resolve(res.data || res.body)
          } else {
            extraFn&&extraFn(res)
            errorHandle(res.code, res.msg)
            reject(res)
          }
        },
        fail: res => {
          showLoading && wx.hideLoading()
          if(res) {
            errorHandle(null, res.errMsg)
            reject(res)
          }
        },
        complete: res => {
          
        }
      })
    })
  })
}

function checkNetWork() {
  return new Promise(resolve => {
    wx.getNetworkType({
      success: res => {
        let networkType = res.networkType
        if (networkType === 'none' || networkType === 'unknown') {
          resolve(false)
        } else {
          resolve(true)
        }
      },
      fail: () => {
        resolve(false)
      }
    })
  })
}
/**
 * 异常处理
 * @param  {Object} [error={errorCode] [description]
 * @param  {[type]} message            [description]
 * @return {[type]}                    [description]
 */
function errorHandle(errorCode, errorMessage) {
  switch (errorCode) {
    case 502:
      wxComps.toast('服务器异常')
      break
    case -301:
      wx.setStorageSync(TOKEN,'')
      // toLogin().then(() => {
      //   if (getCurrentPages().length != 0) {
      //       //刷新当前页面的数据
      //       getCurrentPages()[getCurrentPages().length - 1].onLoad()
      //   }
      // })
      break
    default:
      errorMessage && wxComps.toast(errorMessage)
      break
  }
}

export default Request
