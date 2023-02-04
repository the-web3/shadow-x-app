<template>
	<view class="backup-container flex-column alcenter">
		<image src="@/static/image/pic4@2x.png" mode=""></image>
		<view class="word">
			<view class="ft32">如果您的手机丢失或损坏，纸密码是你找回钱包的唯一途径，</view>
			<view class="ft32">（安全起见，请不要截图形式）</view>
		</view>
		<button type="default" class="confirm-btn" @tap="handleConfirm">我知道了</button>
	</view>
</template>
<script lang="ts">
	import { defineComponent, ref } from 'vue'
	import { onLoad } from '@dcloudio/uni-app';
	export default defineComponent({
		setup() {
			const walletName = ref('')
			const password = ref('')
			const chain_name = ref('')
			onLoad((options)=>{
				walletName.value = options?.walletName ||''
				password.value = options?.password ||''
				chain_name.value = options?.chain_name ||''
			})
			const handleConfirm = ()=> {
				uni.navigateTo({
					url: `./backupStep?chain_name=${chain_name.value}&walletName=${walletName.value}&password=${password.value}`
				})
			}
			return {
				walletName,
				password,
				chain_name,
				handleConfirm
			}
		},
	})
</script>

<style lang="scss">
	.backup-container{
		image{
			width: 460rpx;
			height: 460rpx;
			margin-top: 142rpx;
		}
		.word{
			width: 576rpx;
			text-align: center;
		}
		.confirm-btn{
			width: 686rpx;
			height: 96rpx;
			line-height: 96rpx;
			font-size: 32rpx;
			color: #ffffff;
			background: #4C6EF5;
			box-shadow: 0rpx 20rpx 40rpx 0rpx rgba(76, 110, 245, 0.5);
			border-radius: 20rpx;
			margin:148rpx auto;
		}
	}
</style>
