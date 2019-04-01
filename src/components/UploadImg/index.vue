<template>
	<div class="upload-btn" @tap="uploadImg()">
    <div class="wrapper">
      <img src="../../images/pub-icon.png" />{{text}}
    </div>
	</div>
</template>
 
<script>
  import WechatComponents from 'u/wxComps.js'
  import { API_PATH } from '@/service/request'
	import { checkLoginStatus } from 'u/sessionAuth.js'
	import Request from 'r'
	import qiniuUploader from 'u/qiniuUploader.js'
	// import * as qiniu from 'qiniu-js'
	
  export default {
    props:["text","max","srcs","checkLog"],
    data(){
      return {
        urls:[]
      }
    },
    mounted(){
      this.urls = this.srcs || [];
    },
    methods:{
      uploadFile(imgPaths,count,length){
				wx.showLoading({
          title: '加载中'
        })
        var that = this;
        wx.uploadFile({
          filePath: imgPaths,
          url: `${API_PATH}/api/used-m/upload-img`,
          name: 'imgs[]',
          formData: {
            index: count
          },
          success:function(e){
						console.log(e)
            const data = JSON.parse(e.data)
            that.urls.push(data.data[0])
						
						//这里图片是一个一个返回的 
						that.$emit("uploadCb",that.urls);
						that.urls = []
						//
          },
          fail:function(e){
            
          },
          complete:function(e){
						wx.hideLoading()
            if(that.urls.length===length){
//               that.$emit("uploadCb",that.urls);
//               that.urls = []
            }
          }
        })
      },
      uploadImg(){
        let that = this;
				// console.log(that.checkLog)
				if(that.checkLog == 1){
					if(!checkLoginStatus()){
						that.$emit("checkToLogin");
						return;
					}
				}
					
        wx.chooseImage({
          count: that.max || 9,
          sizeType: ['compressed'],
          sourceType: ['album', 'camera'],
          success: function (res) {
// 						console.log("图片")
// 						console.log(res)
// 						wx.getImageInfo({//获取图片信息
// 							src: res.tempFilePaths[0],
// 							success:function(res){
// 								console.log(res)
// 							}
// 						})
            let length = res.tempFilePaths.length; //总数
            for(let i=0;i<length;i++){
              // that.uploadFile(res.tempFilePaths[i],i,length)
							that.qiniuUpload(res.tempFilePaths[i])
            }

          }
        })
      },
			qiniuUpload(filePath){
				var that = this;
				var token="";
				var key="";    //文件资源名
				// var file = filePath;
				
				wx.showLoading({
				  title: '加载中'
				})
				Request.get({
					url: '/v1/file'
				}).then((res)=>{
					token = res.token
					key = res.key
// 					console.log("qiniu-token:")
// 				  console.log(token+" - "+key)
					// console.log(filePath.split("."))
					var pathArr=filePath.split(".")
					var pathLast=pathArr[pathArr.length-1]
					
					
					qiniuUploader.upload(filePath, (res) => {
						
// 					    that.setData({
// 					      'imageURL': res.imageURL,
// 					    });

						wx.hideLoading()
						that.urls.push(res.imageURL)
						//这里图片是一个一个返回的 
						that.$emit("uploadCb",that.urls);
						that.urls = []
// 							console.log(res)
// 					    console.log('file url is: ');
							
					  }, (error) => {
							console.log('error: ');
							console.log(error);
					  }, {
					    region: 'ECN',
					    domain: 'https://assets.gongji58.com/', // // bucket 域名，下载资源时用到。如果设置，会在 success callback 的 res 参数加上可以直接使用的 ImageURL 字段。否则需要自己拼接
					    key: key+'.'+pathLast, // [非必须]自定义文件 key。如果不设置，默认为使用微信小程序 API 的临时文件名
					    // 以下方法三选一即可，优先级为：uptoken > uptokenURL > uptokenFunc
					    uptoken: token, // 由其他程序生成七牛 uptoken
					    // uptokenURL: 'UpTokenURL.com/uptoken', // 从指定 url 通过 HTTP GET 获取 uptoken，返回的格式必须是 json 且包含 uptoken 字段，例如： {"uptoken": "[yourTokenString]"}
					    // uptokenFunc: function() {return '[yourTokenString]';}
					  }, (res) => {
					      console.log('上传进度', res.progress)
					      console.log('已经上传的数据长度', res.totalBytesSent)
					      console.log('预期需要上传的数据总长度', res.totalBytesExpectedToSend)
					  }, () => {
					    // 取消上传
					  }, () => {
					    // `before` 上传前执行的操作
					  }, (err) => {
					    // `complete` 上传接受后执行的操作(无论成功还是失败都执行)
// 							console.log("err")
// 							console.log(err)
this.$wxComps.toast(err)
					  });
					
					
				})
				// console.log(qiniu)		
			}
			
    }
  }
	
	
</script>
 
<style scoped lang="scss">
  .upload-btn {
    display: inline-block;
    overflow: hidden;
    width: 100px;
    height: 100px;
    border: 1px dotted #959595;
    .wrapper {
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      font-size: 12px;
      color: #959595;
      img {
        width: 30px;
        height: 30px;
        margin-bottom: 10px;
      }
    }	
	}
</style>