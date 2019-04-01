import {loginHandle} from '../utils/sessionAuth'

export default {
  name:'interceptor',
  authList:{
    '/pages/vipStore/main':'/pages/vipStore/main',
    // '/pages/saleDetail/main':'/pages/saleDetail/main'
  },
  auth(opts) {
    return new Promise((resolve,reject) => {
      // resolve()
      if(this.checkList(opts.url)){
        const _url = opts.url
        loginHandle(_url).then(status => {
          if(status === 1) {
            //登录成功
            resolve()
          }
        })
      }else{
        resolve()
      }
    })
  },
  checkList(url) {
    const _path = url ? url.split('?')[0] : ''
    return this.authList[_path]
  },
  isReLaunch(url) {
    // const path = this.checkList(url)
    return url === '/pages/mine/main' || url === '/pages/index/main' || url === '/pages/message/main'
  },
  use(opts) {

  }
}
