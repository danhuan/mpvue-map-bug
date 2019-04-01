import interceptors from './interceptor'
import Vue from 'vue'
/**
 * 路由控制器
 */
class Router {

  /**
   * 初始化函数
   * @param {[type]} _store      [store实例]
   * @param {[type]} initialPage [首页]
   */
  constructor(initialPage) {
    //历史记录栈
    this.history = []
    //待跳转页面
    this.waitAuthPage = {}
    this.routerMap = new Map()

    initialPage = typeof initialPage === 'string' ? {url: initialPage} : initialPage
    this.history.push(initialPage)
  }

  //跳转
  push (opts) {
    return interceptors.isReLaunch(opts.url) ? this.handleRouter(opts, 'reLaunch') : this.handleRouter(opts, 'navigateTo')
  }

  //tab切换
  switchTab (opts) {
    return this.handleRouter(opts, 'switchTab')
  }

  //返回上一页
  back (opts) {
    this.history.pop()
    wx.navigateBack(opts)
  }

  //替换重定向
  replace (opts) {
    return interceptors.isReLaunch(opts.url) ? this.handleRouter(opts, 'reLaunch') : this.handleRouter(opts, 'redirectTo')
  }

  //清空栈内所有页面，跳转下一页
  reLaunch (opts) {
    return this.handleRouter(opts, 'reLaunch')
  }

  getPrev(delta) {
    const pages = getCurrentPages()
    const prev = pages[pages.length - 1 - (delta||1)] || {}
    return this.routerMap.get('/' + prev.route) || {}
  }

  getVmByUrl(url) {
    const _vm = this.routerMap.get(url) || {}
    return _vm.vm
  }

  handleRouter (opts, method) {
    if(opts && opts.url) opts.url = pathTransform(opts.url)
    interceptors.auth(opts).then(res => {
      switch (method) {
        case 'switchTab':
        case 'navigateTo':
          this.history.push(opts)
        break;
        case 'redirectTo':
          this.history[this.history.length-1] = opts
        break;
        case 'reLaunch':
          this.history[0] = opts
        break;
        default:
        break;
      }
			
			Vue.prototype.globalData.hisLength = this.history.length;
// 			console.log("history:"+Vue.prototype.globalData.hisLength)
// 			console.log(this.history)
// 			console.log(this.routerMap)
// 			console.log(getCurrentPages())
      //调用微信的router方法
      wx[method].call(null, opts)
    })
  }
}

//相对地址转换
function pathTransform(path) {
  if(path.startsWith('/')) return path
  if(path.startsWith('pages')) return `/${path}`

  let arr = []
  const length = getCurrentPages().length
  const currentRoute = getCurrentPages()[length - 1].route
  let currentRouteArray = currentRoute.split('/')
  const currentLength = currentRouteArray.length

  let pathArray = path.split('/')
  const pointers = path.match(/\.\./g) || []
  const level = currentLength - pointers.length - 2

  pathArray.splice(0, pointers.length)
  arr = currentRouteArray.slice(0, level+1).concat(pathArray)
  return '/' + arr.join('/')
}

export default Router
