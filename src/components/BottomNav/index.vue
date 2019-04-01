<template>
	<div class="c-bottom-nav-container">
    <div :class="['item',item.highlight?'highlight':'',item.large?'large':'' ]" v-for="(item, index) in btns" :key="index" @tap="handleItemLink(index,item.url)">
    	<img :src="item.img" />
    	<span>{{item.text}}</span>
    </div>
	</div>
</template>

<script>
import { mapState } from 'vuex';
import { toLogin,checkLoginStatus } from 'u/sessionAuth.js'

export default {
  name: "bottom-nav",
  props: ['btns','currentPage'],
  computed:{
  	...mapState(['sUserInfo'])
  },
  data() {
    return {
    	
    }
  },
  methods: {
  	handleItemLink(index, url){
  		let needLogin = ['/pages/vipStore/main']
  		let needTips = ['/pages/newDevice/main']
  		if(needTips.indexOf(url)>-1){
  			this.$wxComps.toast('敬请期待')
  			return
  		}
		// console.log(this.globalData.gujiaDone);
		
		if(index == this.currentPage){
			if(this.globalData.gujiaDone == true && index == 0){
				
			}else{
				return
			}
		}
		if(index == 0){this.globalData.gujiaDone = false;}
		
  		if(needLogin.indexOf(url)>-1){
  			if(checkLoginStatus()){
//   				this.$router.replace({
// 					url: url
// 				})
				this.$router.push({
					url: url
				})
  			}else{
				this.$router.push({
					url:'/pages/login/main'
				})
  			}
  		}else{
  			this.$router.push({
	        url: url
	      })
  		}
    },
  },
  onLoad(option){
	// console.log(this.currentPage)
  },
};
</script>

<style scoped lang="scss">
	.c-bottom-nav-container {
		width: 100%;
		height: 56px;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: space-around;
		position: fixed;
		bottom: 0;
		left: 0;
		background-color: #F7F6F7;
		border-top: 1px solid #CCCCCC;
		.item {
			position: relative;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			flex:1;

			>img {
				width: 15px;
				height: 15px;
				display: block;
				margin-bottom: 6px;
			}
			>span {
				color: #434343;
				font-size: 12px;
			}
			&.highlight {
				>span {
					color: #C60A1E;
					font-size: 12px;
				}
			}
			&.large {
				margin-top: -30px;
				>img {
					width: 45px;
					height: 45px;
				}	
			}
		}
	}
</style>
