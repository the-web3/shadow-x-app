<template>
	<view class="gather-container">
		<uni-nav-bar statusBar fixed left-icon="back" title="收款" @clickLeft="goBack" @clickRight="handleRight">
			<view slot="right" class="flex-column flex-center">
				<image src="@/static/image/shou@2x.png" mode="" class="nav-img"></image>
			</view>
		</uni-nav-bar>
		<view class="gather-box">
			<view class="address-title ft32 relative mb10">收款地址</view>
			<view class="flex">
				<view class="fle-one address ft28">{{address}}</view>
				<image src="@/static/image/fuzhi-2@2x.png" mode="" class="copy-img" @tap="handleCopy"></image>
			</view>
			<!-- <image src="@/static/image/erweima@2x.png" mode="" class="code-img"></image> -->
			<!-- <uqrcode ref="uqrcode" class="code-img"/> -->
			<tki-qrcode ref="uqrcode" class="code-img" :val="address" :size="360" :onval="onval" :loadMake="loadMake" :usingComponents="true" @result="qrR" />
			<view class="ft28 flex-center mt20">扫一扫向我支付</view>
		</view>
		<button class="share-btn" @tap="handleSave">保存</button>
	</view>
</template>

<script lang="ts">
	import { onLoad, onReady } from '@dcloudio/uni-app';
	import { ref, defineComponent, getCurrentInstance, ComponentInternalInstance } from 'vue'
	export default defineComponent({
		setup() {
			const { proxy } = getCurrentInstance() as ComponentInternalInstance;
			const address = ref('')
			const qrcodeSrc = ref('')
			const src = ref('')
			const uqrcode = ref()
			const onval = ref(true)// val值变化时自动重新生成二维码
			const loadMake = ref(true)// 组件加载完成后自动生成二维码
			onLoad((options)=>{
				address.value = options?.address
			})
			onReady(()=>{
				// uni.showLoading({
				// 	mask: true,
				// 	title: '生成中...'
				// })
				// uqrcode.value._makeCode().then
				// uqrcode.value._makeCode?.({
				// 		size: 180,
				// 		value: address.value,
				// 		enableDelay: false // 启用延迟绘制
				// 	})
				// 	.then((res: any) => {
				// 		// 返回的res与uni.canvasToTempFilePath返回一致
				// 		console.log(res)
				// 		console.log(`生成二维码耗时：${res.time}ms`)
				// 		qrcodeSrc.value = res.tempFilePath
				// 	})
				// 	.finally(() => {
				// 		uni.hideLoading()
				// 	})
			}) 
			const goBack = () =>{
				uni.navigateBack()
			}
			const handleRight = () =>{
				uni.showActionSheet({
				    itemList: ['刷新地址', '地址管理'],
				    success: (res) => {
				        console.log('选中了第' + (res.tapIndex + 1) + '个按钮');
						if(res.tapIndex == 0) {
							proxy?.$alert('刷新成功')
						}else{
							uni.navigateTo({
								url: '/pages/my/addressBook'
							})
						}
				    },
				    fail: (res) => {
				        console.log(res.errMsg);
				    }
				});
			}
			const handleCopy = () =>{
				uni.setClipboardData({
					data: address.value,
					success: () => {
						uni.showToast({
							title: '复制成功',
							icon: 'none'
						})
					}
				})
			}
			const handleSave = () =>{
				// #ifdef H5
				uni.showToast({
					icon: 'none',
					title: '长按图片保存'
				})
				return
			}
			const qrR = (res: string) => {
				src.value = res
			}
			return {
				address,
				qrcodeSrc,
				uqrcode,
				onval,
				loadMake,
				goBack,
				handleCopy,
				handleRight,
				handleSave,
				qrR
			}
		},
	})
</script>

<style lang="scss">
	$status_Height: var(--status-bar-height);
	.gather-container{
		.nav-img{
			width: 44rpx;
			height: 44rpx;
		}
		.gather-box{
			width: 670rpx;
			height: 834rpx;
			background: #FFFFFF;
			box-shadow: 0rpx 20rpx 20rpx 0rpx rgba(76, 110, 245, 0.1);
			border-radius: 16rpx;
			padding: 32rpx 18rpx 0 54rpx;
			margin: 30rpx auto 86rpx;
			background-image: url(@/static/image/pic.png);
			background-size: 100% 308rpx;
			background-position: center bottom;
			background-repeat: no-repeat;
			box-sizing: border-box;
			.address-title{
				&:after{
					content: '';
					position: absolute;
					left: -20rpx;
					top: 50%;
					transform: translateY(-50%);
					width: 6rpx;
					height: 20rpx;
					background: #1878FF;
					border-radius: 4rpx;
				}
			}
			.address{
				word-break: break-word;
				color: #77818C;
			}
			.copy-img{
				width: 44rpx;
				height: 44rpx;
				margin-left: 48rpx;
			}
			.code-img{
				display: block;
				width: 360rpx;
				height: 360rpx;
				margin: 56rpx auto 0;
			}
		}
		.share-btn{
			width: 686rpx;
			line-height: 96rpx;
			height: 96rpx;
			font-size: 32rpx;
			color: #ffffff;
			background: #4C6EF5;
			box-shadow: 0rpx 20rpx 40rpx 0rpx rgba(76, 110, 245, 0.5);
			border-radius: 20rpx;
			margin: 0 auto;
		}
	}
</style>
