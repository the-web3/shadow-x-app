<template>
	<view class="update-password-container">
		<view class="form-item">
			<view class="ft32 mb20">当前密码</view>
			<input class="h60 ft26" password v-model="password" placeholder="请输入当前密码" placeholder-style="font-size: 26rpx;color: #9397AF;" />
		</view>
		<view class="form-item">
			<view class="ft32 mb20">新密码</view>
			<input class="h60 ft26" password v-model="newPassword" placeholder="密码不少于8位数" placeholder-style="font-size: 26rpx;color: #9397AF;" />
		</view>
		<view class="form-item">
			<view class="ft32 mb20">确认密码</view>
			<input class="h60 ft26" password v-model="confirmPassword" placeholder="密码不少于8位数" placeholder-style="font-size: 26rpx;color: #9397AF;" />
		</view>
		<button class="create-btn" :disabled="isDisabled" @tap="handleSave" >完成</button>
	</view>
</template>
<script lang="ts">
	import { computed, defineComponent, ref } from 'vue'
	import { onLoad } from '@dcloudio/uni-app';
	import { rules } from '@/common/utils/validation';
	import { showToast, updateCurrentWallet } from '@/common/utils';
	export default defineComponent({
		setup() {
			const currentWallet = ref<Record<string, any>>({})
			const password = ref('')
			const newPassword = ref('')
			const confirmPassword = ref('')
			const isDisabled = computed(() => {
				return password.value === '' || newPassword.value === '' || confirmPassword.value === ''
			})
			onLoad(async ()=>{
				currentWallet.value = uni.getStorageSync('currentWallet')
			})
			const handleSave = () => {
				if(!password.value) {
					return showToast('请输入当前密码')
				}else if(password.value != currentWallet.value.password) {
					return showToast('当前密码错误')
				}else if(newPassword.value.length < 8) {
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
						showToast('修改密码失败, 请稍后再试')
					})
				}
			}
			return {
				currentWallet,
				password,
				newPassword,
				confirmPassword,
				isDisabled,
				handleSave
			}
		},
	})
</script>

<style lang="scss">
	.update-password-container{
		.form-item{
			padding: 34rpx 24rpx 0 38rpx;
			input{
				border-bottom: 1rpx solid #EBEBED;
			}
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
