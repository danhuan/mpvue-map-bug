import request from '@/service/request'
// import api from "@/static/api/common"
import { loginHandle , checkLoginStatus } from './sessionAuth'

export default {

    formIds:[],

    pushFormId(id) {
        if(!id) return 
        const len = this.formIds.push(id)
        if(len >= 1) {
            checkLoginStatus().then(()=>{
                this.uploadFormIds()
            })
        }
    },
    uploadFormIds() {
        if(this.formIds.length<=0) return
        request.post({ url: "/v1/weixin", data: {formIds:this.formIds.join(',')} }).then(res => {
          this.formIds = res.status == 1 ? [] : this.formIds
        })
    },
	
	collectFormId(id){
		loginHandle().then((e)=>{
			request.post({ 
				url: "/v1/weixin", 
				data: {
					token: wx.getStorageSync('token'),
					action:"form",
					plat_name:"fcb",
					formId:id
				} ,
			}).then(res => {
// 				console.log("formId Submit")
// 				console.log(res)
			})
		})
	}

}