<template>
	<view class="reset-password-container">
		<textarea class="text-area ft26" v-model="word" placeholder="输入助记词，用空格做分隔" placeholder-style="font-size: 26rpx;color: #9397AF;"/>
		<view class="form-item">
			<view class="ft32 mb20">设置密码</view>
			<input class="h60 ft26" password v-model="newPassword" placeholder="密码不少于8位数" placeholder-style="font-size: 26rpx;color: #9397AF;" />
		</view>
		<view class="form-item">
			<view class="ft32 mb20">确认密码</view>
			<input class="h60 ft26" password v-model="confirmPassword" placeholder="密码不少于8位数" placeholder-style="font-size: 26rpx;color: #9397AF;" />
		</view>
		<button class="create-btn" :disabled="isDisabled" @tap="handleSave">完成</button>
	</view>
</template>

<script lang="ts">
	import { computed, defineComponent, ref } from 'vue'
	import { onLoad } from '@dcloudio/uni-app';
	import { rules } from '@/common/utils/validation';
	import { showToast, updateCurrentWallet } from '@/common/utils';
	import * as base from '@/common/wallet';
	export default defineComponent({
		setup() {
			const currentWallet = ref<Record<string, any>>({})
			const words = ref('')
			const word = ref('')
			const newPassword = ref('')
			const confirmPassword = ref('')
			const isDisabled = computed(() => {
				return words.value === '' || newPassword.value === '' || confirmPassword.value === ''
			})
			onLoad(async ()=>{
				currentWallet.value = uni.getStorageSync('currentWallet')
				words.value = await base.DecodeMnemonic({encrytMnemonic: currentWallet.value.mnemonic_code, language:"english"})
			})
			const handleSave = () => {
				if(word.value != words.value) {
					return showToast('助记词无效')
				}
				
				if(newPassword.value.length < 8) {
					return showToast('密码不少于8位数')
				}else if(newPassword.value != confirmPassword.value){
					return showToast('密码不一致')
				}else if(!rules.password.isVaild(newPassword.value)){
					return showToast(rules.password.message)
				}else{
					currentWallet.value.password = newPassword.value
					updateCurrentWallet(currentWallet.value).then(res=>{
						uni.navigateBack()
					}).catch(e=>{
						showToast('重置密码失败, 请稍后再试')
					})
				}
			}
			return {
				currentWallet,
				words,
				word,
				newPassword,
				confirmPassword,
				isDisabled,
				handleSave
			}
		},
	})
</script>
<style lang="scss">
	.reset-password-container{
		.form-item{
			padding: 34rpx 24rpx 0 38rpx;
			input{
				border-bottom: 1rpx solid #EBEBED;
			}
		}
		.text-area{
			margin: 34rpx 24rpx 0 38rpx;
			width: 670rpx;
			height: 180rpx;
			padding: 24rpx 18rpx;
			background: #F8F8F7;
			border-radius: 20rpx;
			border: 1rpx solid #D9DDE1;
			box-sizing: border-box;
		}
		.create-btn{
			position: fixed;
			bottom: 160rpx;
			left: 30rpx;
			width: 686rpx;
			height: 96rpx;
			line-height: 96rpx;
			font-size: 32rpx;
			color: #ffffff;
			background: #4C6EF5;
			box-shadow: 0rpx 20rpx 40rpx 0rpx rgba(76, 110, 245, 0.5);
			border-radius: 20rpx;
			&[disabled]{
				background: #94A9FF;
			}
			&:after{
				border: none;
			}
		}
	}
</style>
