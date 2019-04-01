import user from '@/service/user'
import {
  TOKEN
} from '@/utils/constants'
import {
  $
} from "@/utils"
import store from '../store'
import { vueRouter } from '../main'
import request from 'r'
import Vue from 'vue'

const redirectFn=(res)=>{
  if(res.status === 80003){
    vueRouter.push({
      url: '/pages/login/main'
    })
  }
}

//校验登录状态
export const checkLoginStatus = (url) => {
  const token = wx.getStorageSync(TOKEN)
  if(token){
    return true
  }
  return false
  // return new Promise((resolve, reject) => {
  //   request.get({ url: '/v1/check', data: {token},showLoading: false, extraFn: redirectFn }).then(user => {
  //     if(user.nickname.indexOf('未知') === 0){
  //       vueRouter.push({
  //         url: '/pages/login/main'
  //       })
  //     }else if(token){
  //       resolve()
  //     }else{
  //       reject()
  //     }
  //   })
  // })
}

//去登录
export const toLogin = (redirectUrl,params) => {
  const _redirect = redirectUrl ? `?redirectUrl=${redirectUrl}` : ''
  return new Promise((resolve,reject) => {
    $(wx.login).then(wxres => {
      const data = {
        ...params,
        code: wxres.code,
        plat: 'wa',
        plat_name: 'fcb',
      }
      //获取登录token
      user.login(
        data,
        {
          showLoading: true
        }
      ).then(res => {
        console.log('as:',res)   
        if(res.token){
          wx.setStorageSync(TOKEN, res.token)
          resolve()
        } else{
          wx.setStorageSync(TOKEN, '')
          reject()
        }
      })
    })
    
  })
}

function setUserInfo(){
  $(wx.getUserInfo, {withCredentials:false}).then(r => {
    const userInfo = r.userInfo
    const data = {nickname:userInfo.nickName, avatar:userInfo.avatarUrl, sex:userInfo.gender}
    user.update(data).then(res => {
      return Promise.resolve()
    })
  })
}

//完整登录流
export const loginHandle = (url) => {
  return new Promise((resolve, reject) => {
		Vue.prototype.globalData.loginUrl = undefined;
    if(checkLoginStatus()){
      resolve(1)
    }else{
			if(url){
				Vue.prototype.globalData.loginUrl = url;
			}
      vueRouter.push({
        url: '/pages/login/main'
      })
    }
  })
}
