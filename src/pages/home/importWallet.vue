<template>
	<view class="import-wallet-container">
		<uni-nav-bar statusBar fixed left-icon="back" :title="title" @clickLeft="goBack" @clickRight="handleRight">
			<view slot="right" class="flex-column flex-center">
				<image src="@/static/image/scan.png" mode="" class="nav-img"></image>
			</view>
		</uni-nav-bar>
		<textarea class="text-area ft26" v-model="words" @input="handleInput" placeholder="输入助记词，用空格做分隔" placeholder-style="font-size: 26rpx;color: #9397AF;"/>
		<view class="form-item">
			<view class="ft32 mb20">设置身份钱包名</view>
			<input class="h60 ft26" type="text" v-model="walletName" placeholder="请输入名称,大小写字母+数字+下划线" placeholder-style="font-size: 26rpx;color: #9397AF;" />
		</view>
		<view class="form-item">
			<view class="ft32 mb20">设置密码</view>
			<input class="h60 ft26" password v-model="password" placeholder="密码不少于8位,至少包含1个字母和一个数字" placeholder-style="font-size: 26rpx;color: #9397AF;" />
		</view>
		<view class="form-item">
			<view class="ft32 mb20">确认密码</view>
			<input class="h60 ft26" password v-model="confirmPassword" placeholder="密码不少于8位,至少包含1个字母和一个数字" placeholder-style="font-size: 26rpx;color: #9397AF;" />
		</view>
		<view class="flex flex-wrap alcenter pl40 mt40">
			<checkbox value="cb" :checked="checked" color="#94A9FF" @tap="handleCheck" style="border-radius: 50%;"/>
			我已阅读并同意
			<text class="c_4C6EF5">《用户协议》</text>
			以及
			<text class="c_4C6EF5">《隐私政策》</text>
		</view>
		<button type="default" class="create-btn" :class="{'active': isActive}" @tap="handleSave">导入钱包</button>
		<scroll-view v-if="fixedBottom > 0 && tipWords.length > 0" scroll-x class="word-scroll" :style="{'bottom': fixedBottom + 'px'}">
			<view v-for="(item, index) in tipWords" :key="index" @tap="handleSelect(item)">{{item}}</view>
		</scroll-view>
	</view>
</template>
<script lang="ts">
	import { ComponentInternalInstance, computed, defineComponent, getCurrentInstance, ref } from 'vue'
	import { onLoad } from '@dcloudio/uni-app';
	import { allTipWords } from '@/common/word'
	const INIT_TITLE = '导入身份钱包'
	import { rules } from '@/common/utils/validation';
	import { showToast } from '@/common/utils';
	import { postWalletInfo, getDeviceInfo } from '@/common/utils';

	export default defineComponent({
		setup() {
			const { proxy } = getCurrentInstance() as ComponentInternalInstance;
			const tipWords = ref<any>([])
			const words = ref('sniff erosion close power mosquito reveal wall parent talent success hurt find')
			const walletName = ref('amy')
			const password = ref('1234567a')
			const confirmPassword = ref('1234567a')
			const mnemonicCode = ref('')
			const deviceId = ref('')
			const checked = ref(false)
			const fixedBottom = ref(0)
			const chain_name = ref('')
			const title = ref(INIT_TITLE)
			const isActive = computed(() => {
				return words.value && walletName.value && password.value.length >= 8 && password.value == confirmPassword.value && checked.value
			})
			onLoad(async(options: any)=>{
				
				if(options.chain_name) {
					chain_name.value = options.chain_name;
					title.value =  `导入${options.chain_name}钱包`
					uni.setNavigationBarTitle({
						title: `导入${options.chain_name}钱包`
					})
				}
				// 获取设备信息
				const deviceInfo = await getDeviceInfo()
				deviceId.value = deviceInfo.device_id
				uni.onKeyboardHeightChange((res) =>{
					if(res.height == 0) {
						tipWords.value = []
					}
					fixedBottom.value = res.height
				})
			})
			const handleInput = (e: any) => {
				let list = e.detail.value.split(' ')
				tipWords.value = allTipWords.filter(item => {
					return item.indexOf(list[list.length - 1]) != -1
				})
			}
			const handleSelect = (word: string) =>  {
				let wordList = words.value.split(' ')
				wordList.pop()
				if(words.value.length == 0) {
					words.value = words.value += `${word}`
				}else{
					words.value  = wordList.join('') + ` ${word}`
				}
			}
			const handleCheck = () =>  {
				checked.value = !checked.value
			}
			const goBack = () =>  {
				uni.navigateBack()
			}
			const handleRight = ()  => {
				// uni.scanCode({
				// 	success: (res) => {
						
				// 	}
				// })
			}
			const handleSave = async() =>  {
				console.log(1111111, isActive.value)
				if(!isActive.value) return 
				if(!rules.password.isVaild(password.value)){
					showToast(rules.password.message)
					return
				}
				if(!rules.walletName.isVaild(walletName.value)){
					showToast(rules.walletName.message)
					return
				}
				postWalletInfo({
					chain_name: chain_name.value,
					words: words.value,
					wallet_name: walletName.value,
					password: password.value,
				})
			}
			return {
				allTipWords,
				tipWords,
				words,
				walletName,
				password,
				confirmPassword,
				mnemonicCode,
				deviceId,
				checked,
				fixedBottom,
				chain_name,
				title,
				isActive,
				handleInput,
				handleSelect,
				handleCheck,
				goBack,
				handleRight,
				handleSave
			}
		},
	})
</script>

<style lang="scss">
	.import-wallet-container{
		.nav-img{
			width: 44rpx;
			height: 44rpx;
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
			background: #94A9FF;
			box-shadow: 0rpx 20rpx 40rpx 0rpx rgba(76, 110, 245, 0.5);
			border-radius: 20rpx;
			&.active{
				background: #4C6EF5;
			}
			&:after{
				border: none;
			}
		}
		.word-scroll{
			position: fixed;
			left: 0;
			background-color: #f8f8f7;
			z-index: 10;
			padding: 20rpx;
			display: flex;
			white-space: nowrap;
			box-sizing: border-box;
			view{
				display: inline-flex;
				flex-direction: column;
				height: 60rpx;
				line-height: 60rpx;
				background-color: #ffffff;
				padding: 0 20rpx;
				font-size: 28rpx;
				margin: 0 28rpx;
				border-radius: 8rpx;
			}
		}
	}
</style>
