<template>
	<view class="article-detail-container">
		<view class="title-text border_bottom">
			{{ detail && detail.title }}
		</view>
		<view class="auth-info-box flex-between">
			<text>{{ detail && detail.author }}</text>
			<text>{{ detail && detail.created_at }}</text>
		</view>
		<view class="detail-box" v-html="detail&&detail.detail"></view>
	</view>
</template>
<script lang="ts">
import { getArcticleDetail } from '@/api/circle'
import { onLoad } from '@dcloudio/uni-app';
	import { ref, defineComponent } from 'vue'
	export default defineComponent({
		name:'newsDetail',
		setup() {
			const id = ref<any>(null)
			const type = ref<any>(null)
			const detail = ref<any>(null)
			onLoad((option?: AnyObject)=>{
				id.value = +option?.id
				type.value = +option?.type
				getArcticleDetailInfo()
			})
			const getArcticleDetailInfo = async() => {
				try {
					const res = await getArcticleDetail({ type: type.value, article_id: id.value })
					if (res.code === 200) {
						detail.value = res.result || null
					}
				} catch (e) {
					console.log(e)
				}
			}
			return {
				id,
				type,
				detail,
			}
		},
	})
</script>

<style lang="scss">
	.article-detail-container{
		width: 100%;
		.title-text{
			font-size: 44rpx;
			font-family: PingFangSC-Medium, PingFang SC;
			font-weight: 500;
			color: #222222;
			line-height: 60rpx;
			width: 100%;
			box-sizing: border-box;
			padding: 0 48rpx;
		}
		.auth-info-box{
			width: 100%;
			border-bottom: 1px solid #F0F0F0;
			font-size: 28rpx;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
			color: #9397AF;
			line-height: 40rpx;
			width: 100%;
			box-sizing: border-box;
			padding: 20rpx 48rpx;
		}
		.detail-box{
			width: 100%;
			box-sizing: border-box;
			padding: 40rpx;
			font-size: 28rpx;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
			color: #222222;
			line-height: 40rpx;
			text-align: justify;
		}
	}
</style>