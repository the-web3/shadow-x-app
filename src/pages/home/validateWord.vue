<template>
	<view class="validate-word-container">
		<view class="ft28 pl40 mt20 mb50">请根据您抄写的助记词，按顺序选择填充</view>
		<view class="fill-container flex flex-wrap">
			<view class="fill-item ft28 c_4C6EF5 flex-center" v-for="(item, index) in fillWords" :key="index" @tap="handleUnSelectWords(item, index)">
				{{item}}
				<uni-icons v-if="index === fillWordsBack.length-1 && item" type="minus" size="16" class="icon-del"/>
			</view>
		</view>
		<view class="word-container flex flex-wrap">
			<view class="word-item ft28 flex-center" :class="{'active': fillWordsBack.includes(index)}" 
			v-for="(item, index) in shuffleWords" :key="index" @tap="handleSelect(item, index)">
				{{item}}
			</view>
		</view>
		<button class="confirm-btn" @tap="handleConfirm">确认</button>
	</view>
</template>
<script lang="ts">
	import { ComponentInternalInstance, defineComponent, getCurrentInstance, ref } from 'vue'
	import { onLoad } from '@dcloudio/uni-app';
	import { postWalletInfo } from '@/common/utils';
	export default defineComponent({
		setup() {
			const { proxy } = getCurrentInstance() as ComponentInternalInstance;
			const walletName = ref('')
			const password = ref('')
			const words = ref<string[]>([])
			const shuffleWords = ref<string[]>([])
			const fillWords = ref<string[]>(new Array(12).fill(''))
			const fillWordsBack = ref<number[]>([])
			const address = ref('')
			const privateKey = ref('')
			const chain_name = ref('')
			onLoad(async(options)=>{
				// options = {
				// 	chain_name: 'eth',
				// 	walletName: 'amy',
				// 	password: '1234567a',
				// 	words: 'ozone trade gasp snake own hire spell secret kite spice team arrive'
				// }
				chain_name.value = options?.chain_name || ''
				walletName.value = options?.walletName|| ''
				password.value = options?.password|| ''
				words.value = options?.words.split(' ')|| []
				shuffleWords.value = shuffle(words.value)
			})
			const shuffle = (arr: string[])=> {
				const array = [...arr];
				let len = array.length;
				for (let i = len - 1; i > 0; i--) {
					let j = Math.floor(Math.random() * (i + 1));
					[array[i], array[j]] = [array[j], array[i]];
				}
				return array
			}
			const handleUnSelectWords = (item: any, index: any)=> {
				if(index === fillWordsBack.value.length-1){
					fillWordsBack.value.pop();
					fillWords.value.splice(index, 1, "")
				}
			}
			const handleSelect = (item: any, index: any) =>{
				if(fillWordsBack.value.includes(index)) return
				const fillIndex = fillWords.value.findIndex(item => {
					return item.length == 0
				})
				fillWords.value.splice(fillIndex, 1, item)	
				fillWordsBack.value.push(index)	
			}
			const handleConfirm = ()=> {
				let flag = fillWords.value.every(item => {
					return item
				})
				if(flag) {
					if(fillWords.value.toString() == words.value.toString()) {
						postWalletInfo({
							chain_name: chain_name.value,
							words: words.value.join(' '),
							wallet_name: walletName.value,
							password: password.value,
						})
					}else{
						uni.showToast({
							title: '助记词顺序有误',
							icon: 'error'
						})
					}
				}else{
					proxy?.$alert('请选择助记词')
				}
			}
			return {
				walletName,
				password,
				words,
				shuffleWords,
				fillWords,
				fillWordsBack,
				address,
				privateKey,
				chain_name,
				shuffle,
				handleUnSelectWords,
				handleSelect,
				handleConfirm
			}
		},
	})
</script>

<style lang="scss">
	.validate-word-container{
		.fill-container{
			width: 700rpx;
			height: 400rpx;
			background: #F7F8FC;
			border-radius: 30rpx;
			margin-left: 25rpx;
			padding: 14rpx 4rpx 14rpx 18rpx;
			margin-bottom: 92rpx;
			box-sizing: border-box;
			.fill-item{
				position: relative;
				width: 210rpx;
				height: 80rpx;
				background: #FFFFFF;
				border-radius: 30rpx;
				margin-right: 16rpx;
				margin-bottom: 16rpx;
			}
			.icon-del{
				position: absolute;
				top: 8rpx;
				right: 8rpx;
			}
		}
		.word-container{
			margin: 0 44rpx 74rpx;
			.word-item{
				width: 210rpx;
				height: 80rpx;
				border-radius: 30rpx;
				border: 2rpx solid #D6D9E0;
				margin-right: 16rpx;
				margin-bottom: 16rpx;
				box-sizing: border-box;
				&:nth-child(3n) {
					margin-right: 0;
				}
				&.active{
					border-color: #4C6EF5;
					background-color: #4C6EF5;
					color: #ffffff;
				}
			}
		}
		.confirm-btn{
			margin: 0 auto;
			width: 686rpx;
			height: 96rpx;
			line-height: 96rpx;
			font-size: 32rpx;
			color: #ffffff;
			background: #4C6EF5;
			box-shadow: 0rpx 20rpx 40rpx 0rpx rgba(76, 110, 245, 0.5);
			border-radius: 20rpx;
			&:after{
				border: none;
			}
		}
	}
</style>
