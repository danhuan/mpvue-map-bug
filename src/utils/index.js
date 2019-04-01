import Qs from 'qs'
import wxComps from './wxComps'
import request from "r";
import { vueRouter } from "../main";
const wxSystemInfo = wx.getSystemInfoSync()
/**
 * promise化wxApi
 * @param {Function} fn wxApi
 * @param {Object} params wxApi参数
 */
const promisifyWxApi = (fn = function () { }, params = {}) => {
  return new Promise((resolve, reject) => {
    params = Object.assign(params, {
      success: res => {
        resolve(res)
      },
      fail: err => {
        reject(err)
      }
    })
    fn(params)
  })
}
const $ = promisifyWxApi

export { $ }

export default {
  name: 'tools',
  $,
  /**
   * isEmpty
   * @param  {String}  value [description]
   * @return {Boolean}       [description]
   */
  isEmpty(value) {
    return value === null || value === undefined || value.trim() === ''
  },

  /**
   * [queryStringToObject description]
   */
  queryStringToObject() {
    var queryString = (location.search.length > 0 ? location.search.substring(1) : '')
    const urlParams = Qs.parse(queryString)
    return urlParams
  },

  /**
   * [objectToQueryString description]
   * @param  {Object} obj [description]
   * @return {string}     [description]
   */
  objectToQueryString(obj) {
    if (!obj || !Object.keys(obj).length) {
      return ''
    }
    return '?' + Object.keys(obj).map((key) => {
      return `${key}=${obj[key]}`
    }).join('&')
  },

  /**
   * setKeyToValue
   * @param  {Object} obj [description]
   * @return {Object}     [description]
   */
  setKeyToValue(obj) {
    let newObj = {}
    let key
    for (key in obj) {
      if (!obj.hasOwnProperty(key)) {
        continue
      }
      newObj[key] = key
    }
    return newObj
  },

  /**
   * [processingData description]
   * @param  {[type]} res [description]
   * @return {[type]}     [description]
   */
  processingData(res) {
    if (res.status && res.status == 1) {
      if (!!res.result && !!res.result.data) {
        return res.result
      } else {
        return null
      }
    } else {
      return null
    }
  },
  /**
   * [htmlEncode description]
   * @param  {[type]} str [description]
   * @return {[type]}     [description]
   */
  htmlEncode(str) {
    str = str.replace(/\n/g, '<br>');
    str = str.replace(/&/g, '&amp;');
    str = str.replace(/"/g, '&quot;');
    str = str.replace(/'/g, '&#39;');
    str = str.replace(/\+/g, ' &#43;');
    str = str.replace(/ /g, '&nbsp;');
    str = str.replace(/</g, '&lt;');
    str = str.replace(/>/g, '&gt;');
    str = str.replace(/\t/g, '&nbsp;&nbsp;&nbsp;&nbsp;');
    return str;
  },
  /**
   * [htmlDecode description]
   * @param  {[type]} str [description]
   * @return {[type]}     [description]
   */
  htmlDecode(str) {
    str = str.replace(/&lt;/gi, '<');
    str = str.replace(/&gt;/gi, '>');
    str = str.replace(/<br>/gi, '\n');
    str = str.replace(/&amp;/gi, '&');
    str = str.replace(/&quot;/gi, '"');
    str = str.replace(/&#39;/g, "'");
    str = str.replace(/&#43;/g, '+');
    str = str.replace(/&nbsp;/gi, ' ');
    return str;
  },
  /**
   * [htmlEncoding description]
   * @param  {[type]} str [description]
   * @return {[type]}     [description]
   */
  htmlEncoding(str) {
    // str = str.replace(/\n/g,'<br>');
    str = str.replace(/\+/g, '&#43;');
    return str;
  },
  /**
   * [htmlDecoding description]
   * @param  {[type]} str [description]
   * @return {[type]}     [description]
   */
  htmlDecoding(str) {
    // str = str.replace(/<br>/gi, '\n');
    str = str.replace(/&#43;/g, '+');
    return str;
  },

  /**
   * 数据简单复制
   * @param {*} source
   * @param {*} keys
   */
  copy(source, keys = []) {
    if (!source) {
      return source
    }
    let d = Object.create(null)
    keys.forEach(k => { d[k] = source[k] })
    return d
  },
  bottomVisible() {
    const scrollY = window.scrollY
    const visible = document.documentElement.clientHeight
    const pageHeight = document.documentElement.scrollHeight
    const bottomOfPage = visible + scrollY >= pageHeight - 20
    return bottomOfPage || pageHeight < visible
  },
  GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return (r[2]); return null;
  },
  /**
   * 格式化时间
   * @param {Long}} time 时间毫秒
   * @param {String} pattern 格式化模式
   */
  formatTime(time, pattern = 'dd天hh时mm分ss秒') {
    time = Math.floor(time / 1000)
    let day, hour, minute, second
    if (time >= 0) {
      day = Math.floor(time / (60 * 60 * 24))
      hour = Math.floor(time / (60 * 60)) - (day * 24)
      minute = Math.floor(time / 60) - (day * 24 * 60) - (hour * 60)
      second = Math.floor(time) - (day * 24 * 60 * 60) - (hour * 60 * 60) - (minute * 60)
    }
    if (day < 10) day = '0' + day
    if (hour < 10) hour = '0' + hour
    if (minute < 10) minute = '0' + minute
    if (second < 10) second = '0' + second
    const res = pattern.replace('dd', day).replace('hh', hour).replace('mm', minute).replace('ss', second)
    return res
  },
  //校验格式
  checkFormat(args) {
    args = Object.prototype.toString.call(args) === '[object Object]' ? [args] : args
    for (let i = 0; i < args.length; i++) {
      const item = args[i]
      const reg = new RegExp(item.regExp)
      if (!reg.test(item.val)) {
        wxComps.toast(`${item.msg}格式不正确`)
        return {
          status: false,
          mark: i
        }
      }
    }
    return { status: true }
  },
  // 价格格式
  formatPrice(price) {
    price = Number(price).toFixed(2)
    price = String(price)
    let lastIndex
    for (let i = 0; i < 3; i++) {
       lastIndex = price.length - 1
      if (price[lastIndex] == 0 || price[lastIndex] == '.') {
        price = price.substring(0, lastIndex)
      }
    }
    return price
  },
  /**
   * vuex action处理逻辑工厂
   * @param {String}} url
   */
  actionRequestFactory(url) {
    const fn = ({ commit }, opts = {}) => {
      const { data, showLoading } = opts
      return request.post({ url, data, showLoading })
    }
    return fn
  },
  /**
   * 简化wx.getStorageSync
   * @param {String} key
   */
  get(key) {
    return wx.getStorageSync(key)
  },
  /**
   * 简化wx.setStorageSync
   * @param {String} key
   * @param {*} val
   */
  set(key, val) {
    wx.setStorageSync(key, val)
  },
  /**
   * wx.navigateTo
   * @param {String}} url
   */
  go(url) {
    vueRouter.push({
      url
    })
  },
  /**
   * 重定向
   * @param {String} url
   */
  rd(url) {
    wx.redirectTo({
      url
    })
  },
  /**
   * 地址返回
   * @param {Number} delta
   */
  back(delta) {
    wx.navigateBack({
      delta
    })
  },
  loading() {
    wx.showLoading({
      title: '加载中'
    })
  },
  loaded() {
    wx.hideLoading()
  },
  isIphoneX() {
    return wxSystemInfo.model.indexOf('iPhone X') > -1
  },
  isIOS() {
    return wxSystemInfo.model.indexOf('iPhone') > -1
  }
}
