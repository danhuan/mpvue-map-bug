/**
 * 微信原生组件封装
 */
class WechatComponents {

  static toast (title, icon = 1) {
    wx.showToast({
      title,
      icon: ['success', 'none'][icon],
      duration: 2000
    })
  }

  static warn (content, title = '提示') {
    wx.showModal({
      title,
      content,
      showCancel:false,
      success: function (res) {

      }
    })
  }

  static confirm (content, title = '提示') {
    return new Promise((resolve,reject) => {
      wx.showModal({
        title,
        content,
        success: function (res) {
          if (res.confirm) {
            resolve(true)
          } else if (res.cancel) {
            resolve(false)
          }
        }
      })
    })
  }

  static showLoading ( title='' ) {
    wx.showLoading({
      title: '加载中'
    })
  }

  static hideLoading () {
    wx.hideLoading()
  }

  static downloadPic(imgSrc,callback){
    wx.downloadFile({
      url: imgSrc,
      success: function (res) {
        console.log(res);
        //图片保存到本地
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: function (data) {
            wx.showToast({
              title: '已保存到相册',
              icon: 'success',
              duration: 2000
            })
						callback(1);   //回调成功
          },
          fail: function (err) {
            console.log(err);
						
						callback(0);   //回调失败
						
            if (err.errMsg === "saveImageToPhotosAlbum:fail auth deny") {
              console.log("当初用户拒绝，再次发起授权")
              wx.openSetting({
                success(settingdata) {
                  console.log(settingdata)
                  if (settingdata.authSetting['scope.writePhotosAlbum']) {
                    console.log('获取权限成功，给出再次点击图片保存到相册的提示。')
                  } else {
                    console.log('获取权限失败，给出不给权限就无法正常使用的提示')
                  }
                }
              })
            }
          },
          complete(res){
            console.log(res);
          }
        })
      }
    })
  }

  static savePic(imgSrc,callback){
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.writePhotosAlbum']) {
          wx.authorize({
            scope:'scope.writePhotosAlbum',
            success() {
              WechatComponents.downloadPic(imgSrc,function(res){
								callback(res)
							})
            },
						fail(res){
							// console.log(res)
							
							// WechatComponents.toast("操作失败！");
							wx.showModal({
							title: '图片保存失败！',
							content: '请点击确定手动打开相册授权',
							success: function (sm) {
								if (sm.confirm) {
										wx.openSetting({
										  success(settingdata) {
										    console.log(settingdata)
										    if (settingdata.authSetting['scope.writePhotosAlbum']) {
										      WechatComponents.downloadPic(imgSrc,function(res){
										      	callback(res)
										      })
										    } else {
										      WechatComponents.toast("保存失败！");
													callback(0)
										    }
										  }
										})
									} else if (sm.cancel) {
										WechatComponents.toast("保存失败！");
										callback(0)
									}
								}
							})
							
						}
          })
        }else{
          WechatComponents.downloadPic(imgSrc,function(res){
          	callback(res)
          })
        }
      }
    })
  }

	
}

export default WechatComponents
