<template>
	<view class="record-detail-container plr40">
		<view class="flex-column flex-center top-detail">
			<image v-if="detail.is_error == 1" src="@/static/image/shibai@2x.png" mode=""></image>
			<image v-if="detail.is_error != 1 && detail.tx_in_out == 'to' && detail.txreceipt_status == 3" src="@/static/image/transfer.png" mode=""></image>
			<image v-if="detail.is_error != 1 && detail.tx_in_out == 'from' && detail.txreceipt_status == 3" src="@/static/image/zhuanchu@2x.png" mode=""></image>
			<image v-if="detail.is_error != 1 && detail.txreceipt_status != 3" src="@/static/image/deng@2x.png" mode=""></image>
			<view class="ft28 mt10">{{detail.txreceipt_status == 2 ? '转账失败' : detail.tx_in_out == 'from' && detail.txreceipt_status == 3 ?
			'转出成功' : detail.tx_in_out == 'from' && detail.txreceipt_status != 3 ? 
			'待转出' : detail.tx_in_out == 'to' && detail.txreceipt_status == 3 ? '收款成功' : '待收款'}}</view>
			<view class="ft40 mt20">{{detail.tx_in_out == 'from' ? '-' : '+'}}{{detail.value}}{{detail.asset_name}}</view>
		</view>
		<view class="form-item mb30">
			<view class="label ft28 c_9397AF">发款方</view>
			<view class="ft32 line-one mt10">{{detail.from}}</view>
		</view>
		<view class="form-item mb30">
			<view class="label ft28 c_9397AF">收款方</view>
			<view class="ft32 line-one mt10">{{detail.to}}</view>
		</view>
		<view class="form-item mb30">
			<view class="label ft28 c_9397AF">矿工费用</view>
			<view class="ft32 line-one mt10">{{detail.fee}} ETH</view>
		</view>
		<view class="flex-between mt120">
			<view style="width: 380rpx;">
				<view class="form-item mb30">
					<view class="label ft28 c_9397AF">哈希值</view>
					<view class="flex alcenter mt10">
						<view class="ft32 line-one">{{detail.hash}}</view>
						<image src="@/static/image/fuzhi.png" mode="" class="copy-img ml10" @tap="handleCopy(detail.hash)"></image>
					</view>
				</view>
				<view class="form-item mb30">
					<view class="label ft28 c_9397AF">区块号</view>
					<view class="flex alcenter mt10">
						<view class="ft32 line-one">{{detail.block_number}}</view>
						<image src="@/static/image/fuzhi.png" mode="" class="copy-img ml10" @tap="handleCopy(detail.block_number)"></image>
					</view>
				</view>
				<view class="form-item mb30">
					<view class="label ft28 c_9397AF">交易时间</view>
					<view class="ft32 line-one mt10">{{detail.date_time}}</view>
				</view>
			</view>
			<view>
				<!-- <uqrcode ref="qrCode" class="code-img"/> -->
				<tki-qrcode ref="qrCode" class="code-img" :val="`https://etherscan.io/tx/${detail.hash}`" :size="360" :onval="true" :loadMake="true" :usingComponents="true" />
				<view class="flex-center mt10">
					<view class="ft28">查询链接</view>
					<image src="@/static/image/fuzhi.png" mode="" class="copy-img ml10" @tap="handleCopy(`https://etherscan.io/tx/${detail.hash}`)"></image>
				</view>
			</view>
		</view>
	</view>
</template>

<script lang="ts">
	import { defineComponent, ref } from 'vue'
	import { onLoad, onReady } from '@dcloudio/uni-app';
	export default defineComponent({
		setup() {
			const detail = ref<Record<string, any>>({})
			const qrCodeSrc = ref('')
			const qrCode = ref()
			onLoad(async (options)=>{
				detail.value = JSON.parse(options?.detail)
			})
			onReady(()=>{
				// uni.showLoading({
				// 	mask: true,
				// 	title: '生成中...'
				// })
				// qrCode.value.make({
				// 		size: 100,
				// 		text: `https://etherscan.io/tx/${detail.value.hash}`,
				// 		enableDelay: false // 启用延迟绘制
				// 	})
				// 	.then((res: any) => {
				// 		// 返回的res与uni.canvasToTempFilePath返回一致
				// 		console.log(res)
				// 		console.log(`生成二维码耗时：${res.time}ms`)
				// 		qrCodeSrc.value = res.tempFilePath
				// 	})
				// 	.finally(() => {
				// 		uni.hideLoading()
				// 	})
			})
			const handleCopy = (data: any) => {
				uni.setClipboardData({
					data: data,
					success: () => {
						uni.showToast({
							title: '复制成功'
						})
					}
				})
			}
			return {
				detail,
				qrCodeSrc,
				qrCode,
				handleCopy
			}
		},
	})
</script>

<style lang="scss">
	.record-detail-container{
		.top-detail{
			padding-top: 38rpx;
			padding-bottom: 38rpx;
			image{
				width: 80rpx;
				height: 80rpx;
			}
		}
		.copy-img{
			width: 24rpx;
			height: 24rpx;
			flex-shrink: 0;
		}
		.code-img{
			display: block;
			width: 200rpx;
			height: 200rpx;
		}
	}
</style>
