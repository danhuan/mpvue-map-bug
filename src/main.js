import Vue from 'vue'
import App from './App'
import '@/libs'
import store from './store'
import wxComps from './utils/wxComps'
import regExps from './utils/regExps'
import router from './router'
import request from '@/service/request';
import utils from 'u'
import {loginHandle} from '@/utils/sessionAuth'

const systemInfo = wx.getSystemInfoSync()
store.state.sSystemInfo = systemInfo

Vue.prototype.$wxComps = wxComps
Vue.prototype.$regExps = regExps
Vue.prototype.$store = store
Vue.prototype.isx = utils.isIphoneX()
Vue.prototype.$imgOrigin = 'https://ken.mynatapp.cc'
Vue.prototype.$ImgAssetsPath = ''
Vue.prototype.$SaleAssetsPath = ''
const vueRouter = new router('/pages/index/main')
Vue.prototype.$router = vueRouter
export {
  vueRouter
}

const routeMap = new Map()

Vue.prototype.__mount = Vue.prototype.$mount
Vue.prototype.$mount = function(el, hydrating) {
  if (this.$root.$options.__file) {
    const url = this.$root.$options.__file.replace('src', '').replace('index.vue', 'main') + ''
    this.$router.routerMap.set(url, {
      url,
      vm: this.$root
    })
  }
  this.__mount()
}

Vue.prototype.q = function() {
  return this.$root.$mp.query
}

Vue.config.productionTip = false
App.mpType = 'app'

const app = new Vue(App)
app.$mount()
Vue.prototype.globalData = getApp().globalData


if(wx.canIUse('getUpdateManager')){
  const updateManager = wx.getUpdateManager()

  updateManager.onCheckForUpdate(function (res) {
    // 请求完新版本信息的回调
    console.log(res.hasUpdate)
  })

  updateManager.onUpdateReady(function () {
    wx.showModal({
      title: '更新提示',
      content: '新版本已经准备好，是否重启应用？',
      success: function (res) {
        if (res.confirm) {
          // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
          updateManager.applyUpdate()
        }
      }
    })
    
  })
  updateManager.onUpdateFailed(function () {
    // 新的版本下载失败
  })
}

