<template>
	<view class="backup-step-container flex-column alcenter">
		<view class="ft28 tip">请安顺序写下12个单词并保存在安全的地方（安全起见，请不要截图形式）</view>
		<view class="word-container c_4C6EF5 relative mb30">
			<view class="step ft32">NO.{{stepIndex + 1}}/{{words.length}}</view>
			<view class="word ft60">{{words[stepIndex]}}</view>
		</view>
		<text class="ft28 c_D85151 w-540">
			注意：
			请勿将助记次透露给任何人
			助记词一旦丢失，资产将无法恢复
			请勿通过截、网络传输的方式进行备份保存
			遇到任何情况，请不要轻易卸载app
		</text>
		<view class="flex-between alcenter btns">
			<image src="@/static/image/button_f_l@2x.png" mode="" @tap="handlePrev"></image>
			<image src="@/static/image/button_f_rr@2x.png" mode="" @tap="handleNext"></image>
		</view>
	</view>
</template>
<script lang="ts">
	import { defineComponent, onMounted, ref } from 'vue'
	import * as base from '@/common/wallet';
	import { onLoad } from '@dcloudio/uni-app';
	export default defineComponent({
		setup() {
			const walletName = ref('')
			const password = ref('')
			const words = ref<string[]>([])
			const stepIndex = ref(0)
			const chain_name = ref('')
			onLoad(async (options)=>{
				walletName.value = options?.walletName ||''
				password.value  = options?.password ||''
				const wordsInfo = await base.CreateMnemonic({
					number: 12, 
					language: "english"
				});
				console.log(1111111, wordsInfo)
				words.value = wordsInfo.split(' ')
				chain_name.value  = options?.chain_name||''
			})
			const handlePrev = ()=> {
				stepIndex.value == 0 ? 0 : stepIndex.value -= 1
			}
			const handleNext = ()=> {
				stepIndex.value += 1
				if(stepIndex.value == words.value.length) {
					uni.navigateTo({
						url: `./validateWord?chain_name=${chain_name.value}&walletName=${walletName.value}&password=${password.value}&words=${words.value.join(' ')}`
					})
					stepIndex.value = 0
				}
			}
			return {
				walletName,
				password,
				words,
				stepIndex,
				chain_name,
				handlePrev,
				handleNext,
			}
		},
	})
</script>

<style lang="scss">
	.backup-step-container{
		.tip{
			width: 534rpx;
			line-height: 40rpx;
			text-align: center;
			margin: 38rpx auto 26rpx;
		}
		.w-540{
			width: 540rpx;
		}
		.word-container{
			width: 540rpx;
			height: 474rpx;
			background-image: url(@/static/image/kuang@2x.png);
			background-repeat: no-repeat;
			background-size: 100% 100%;
			.step{
				position: absolute;
				top: 36rpx;
				left: 32rpx;
			}
			.word{
				position: absolute;
				top: 150rpx;
				left: 50%;
				transform: translateX(-50%);
			}
		}
		.btns{
			margin: 72rpx 117rpx;
			image{
				width: 220rpx;
				height: 220rpx;
			}
		}
	}
</style>
