/**
 * 需要检查session是否过期的页面引入
 * 钩子函数:
 * onSessionChecked   当检查完session可用时调用
 */
import {
  loginHandle, checkLoginStatus, toLogin
} from '@/utils/sessionAuth'

export default {
  created() {},
  methods: {
    //只检查登录状态
    checkLoginOnlyMix() {
      return checkLoginStatus()
    },
    //登录校验
    checkAuthMix() {
      loginHandle().then(status => {
        if(status === 1) {
          //登录成功调用onSessionChecked
          this.onSessionChecked && this.onSessionChecked()
        }
      })
    },

    toLoginMix() {
      toLogin().then(status => {
        if(status === 1) {
          //登录成功调用onSessionChecked
          this.onSessionChecked && this.onSessionChecked()
        }
      })
    }

  }
}
