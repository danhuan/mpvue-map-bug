import request from './request'

export default {
  /**
   * 登录
   * @param {Boolean}} showLoading
   */
  login (data, showLoading) {
    return request.post({ url: '/v1/weixin', data, showLoading })
  },
  
  /**
   * 更新用户信息
   * @param {Boolean}} showLoading
   */
  update (data, showLoading) {
    return request.post({ url: '/api/user/update-profile', data, showLoading })
  },
}
