<template>
	<view class="property-container">
		<view class="top-container flex-column flex-center c-white">
			<view class="flex alcenter">
				<view class="ft28">我的资产</view>
				<image src="@/static/image/eye.png" mode="" class="ml40"></image>
			</view>
			<view class="ft64 mt20">{{showNum ? `${assetDetail.total_asset_usd || 0}` : '***'}}</view>
		</view>
		<view class="search-container flex alcenter">
			<image src="@/static/image/search.png" mode="" class="mr20"></image>
			<input class="ft26" type="text" v-model="searchName" />
		</view>
		<view class="single-list bg-white plr40 pb40 mb20" v-for="(item, index) in assetDetail.token_list" :key="index">
			<view class="item-title flex alcenter h100 ft32">{{item.wallet_name}}</view>
			<view class="list-item flex-between alcenter h80 mb40"  v-for="(wallet, walletIndex) in item.wallet_balance" :key="walletIndex">
				<view class="flex alcenter">
					<image :src="`${config.imgUrl + wallet.logo}`" mode="" class="mr40"></image>
					<view>
						<view class="ft36">{{wallet.symbol}}</view>
						<view class="c_9397AF">{{wallet.chain}}</view>
					</view>
				</view>
				<view>
					<view class="ft36 text-right">{{wallet.balance}}</view>
					<view class="c_9397AF text-right">${{wallet.asset_usd }}</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script lang="ts">
	import { onLoad } from '@dcloudio/uni-app';
	import { ref, defineComponent, getCurrentInstance, ComponentInternalInstance } from 'vue'
	import config from '@/config'
	import { getDeviceInfo } from '@/common/utils';
	export default defineComponent({
		setup() {
			const { proxy } = getCurrentInstance() as ComponentInternalInstance;
			const deviceId = ref('')
			const showNum = ref<boolean>(true)
			const searchName = ref('')
			const assetDetail = ref<Record<string, any>>({
				total_asset: 0
			})
			onLoad(()=>{
				loadData()
			})
			const loadData = async()=> {
				// 获取设备信息
				const deviceInfo = await getDeviceInfo()
				deviceId.value = deviceInfo.device_id
				uni.showLoading({
					title: '加载中'
				})
				proxy?.$api.get_wallet_asset({
					device_id: deviceId.value
				}).then(res => {
					uni.hideLoading()
					assetDetail.value = res.result
				}).catch(() => {
					uni.hideLoading()
				})
			}
			return {
				config,
				deviceId,
				showNum,
				searchName,
				assetDetail,
				loadData
			}
		},
	})
</script>

<style lang="scss">
	page{
		background-color: #F7F8FC;
	}
	.property-container{
		.top-container{
			height: 220rpx;
			background: #4C6EF5;
			box-shadow: 0rpx 20rpx 40rpx 0rpx rgba(76, 110, 245, 0.5);
			border-radius: 40rpx;
			margin: 20rpx 40rpx 46rpx;
			image{
				width: 44rpx;
				height: 44rpx;
			}
		}
		.search-container{
			height: 80rpx;
			background: #FFFFFF;
			border-radius: 20px;
			padding: 0 26rpx;
			margin: 0 40rpx 30rpx;
			image{
				width: 44rpx;
				height: 44rpx;
			}
			input{
				flex: 1;
				height: 44rpx;
			}
		}
		.single-list{
			.list-item{
				image{
					width: 80rpx;
					height: 80rpx;
				}
				&:last-child{
					margin-bottom: 0!important;
				}
			}
		}
	}
</style>
