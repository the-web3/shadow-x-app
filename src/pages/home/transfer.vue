<template>
	<view class="transfer-container">
		<view class="tabs flex-between mt40">
			<navigator hover-class="none" :url="`./directTransfer?chain=${chain}`" class="tab-item flex-column flex-center">
				<image src="@/static/image/zhuanzhang-2@2x.png" mode=""></image>
				<view class="ft28 mt20">直接转账</view>
			</navigator>
			<view class="tab-item flex-column flex-center">
				<image src="@/static/image/dizhibu-2@2x.png" mode=""></image>
				<view class="ft28 mt20">地址簿转账</view>
			</view>
			<view class="tab-item flex-column flex-center">
				<image src="@/static/image/saoma-2@2x.png" mode=""></image>
				<view class="ft28 mt20">扫码转账</view>
			</view>
		</view>
		<view class="plr40 pb30">
			<view class="ft32 mb50">交易记录</view>
			<view class="list-item flex-between alcenter h80" v-for="(item, index) in recordList" :key="index" @tap="goDetail(item)">
				<view class="flex alcenter">
					<image v-if="item.txreceipt_status == 2" src="@/static/image/shibai@2x.png" mode="" class="mr40"></image>
					<image v-if="item.tx_in_out == 'to' && item.txreceipt_status == 3" src="@/static/image/transfer.png" mode="" class="mr40"></image>
					<image v-if="item.tx_in_out == 'from' && item.txreceipt_status == 3" src="@/static/image/zhuanchu@2x.png" mode="" class="mr40"></image>
					<image v-if="item.txreceipt_status == 1" src="@/static/image/deng@2x.png" mode="" class="mr40"></image>
					<view style="width: 300rpx;">
						<view class="ft36">{{item.txreceipt_status == 1 ? '转账失败' : item.tx_in_out == 'from' && item.txreceipt_status == 3 ? 
						'转出' : item.tx_in_out == 'from' && item.txreceipt_status != 3 ? 
						'待转出' : item.tx_in_out == 'to' && item.txreceipt_status == 3 ? '收款' : '待收款'}}</view>
						<view class="c_9397AF line-one">{{item.from}}</view>
					</view>
				</view>
				<view class="flex-one" style="overflow: hidden;">
					<view class="ft36 line-one" style="text-align: right;">{{ item.value }}</view>
					<view class="c_9397AF" style="text-align: right;">{{item.date_time}}</view>
				</view>
			</view>
			<image v-if="recordList.length == 0" src="/static/image/kong@2x.png" mode="" class="empty-img"></image>
		</view>
	</view>
</template>

<script lang="ts">
	import { onLoad, onPullDownRefresh, onReachBottom } from '@dcloudio/uni-app';
	import { ref, defineComponent, getCurrentInstance, ComponentInternalInstance } from 'vue'
	export default defineComponent({
		setup() {
			const { proxy } = getCurrentInstance() as ComponentInternalInstance;
			const recordList = ref<any[]>([])
			const page = ref(1)
			const page_size = ref(10)
			const hasMore = ref<boolean>(false)
			const currentWallet = ref<Record<string, any>>({})
			const chain = ref('')
			onLoad((options)=>{
				chain.value = options.chain
				currentWallet.value = uni.getStorageSync('currentWallet')
				loadRecord()
			})
			onPullDownRefresh(()=>{
				page.value = 1
				loadRecord().then(() => {
					uni.stopPullDownRefresh()
				}).catch(() => {
					uni.stopPullDownRefresh()
				})
			}) 
			onReachBottom(()=>{
				if(hasMore.value) {
					page.value += 1
					loadRecord()
				}else{
					
				}
			}) 
			const loadRecord = () => {
				const { symbol, address }= currentWallet.value
				return new Promise((resolve, reject) => {
					proxy?.$api.get_tx_by_address({
						network: "mainnet",
						chain: chain.value,
						symbol,
						address,
						contract_addr: "",
						page: page.value.toString(),
						page_size: page.value.toString()
					}).then(res => {
						if(!res.result || res.result.length < page.value) {
							hasMore.value = false
						}else{
							hasMore.value = true
						}
						if(page.value == 1) {
							recordList.value = res.result || []
						}else{
							recordList.value = recordList.value.concat(res.result || [])
						}
						resolve(res)
					}).catch((err) => {
						console.log(err)
						reject(err)
					})
				})
			}
			const goDetail = (item: any) => {
				uni.navigateTo({
					url: `./recordDetail?detail=${JSON.stringify(item)}`
				})
			}
			return {
				recordList,
				page,
				page_size,
				hasMore,
				currentWallet,
				chain,
				loadRecord,
				goDetail
			}
		},
	})
</script>

<style lang="scss">
	.transfer-container{
		.tabs{
			padding: 0 38rpx;
			margin-bottom: 68rpx;
			.tab-item{
				width: 200rpx;
				height: 200rpx;
				background: #FFFFFF;
				box-shadow: 0rpx 20rpx 20rpx 0rpx rgba(76, 110, 245, 0.1);
				border-radius: 20rpx;
				image{
					width: 60rpx;
					height: 60rpx;
				}
			}
		}
		.list-item{
			margin-bottom: 70rpx;
			image{
				width: 80rpx;
				height: 80rpx;
				flex-shrink: 0;
			}
		}
		.empty-img{
			display: block;
			width: 480rpx;
			height: 480rpx;
			margin: 0 auto;
		}
	}
</style>
