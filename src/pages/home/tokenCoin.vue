<template>
	<view class="token-coin-container">
		<navigator hover-class="none" open-type="switchTab" url="./home" class="list-item bg-white flex-between alcenter h120 plr40">
			<view class="ft32">首页资产</view>
			<image src="@/static/image/arrow-right.png" mode="" class="arrow"></image>
		</navigator>
		<navigator hover-class="none" url="/pages/my/property" class="list-item bg-white flex-between alcenter h120 plr40 mb10">
			<view class="ft32">我的资产</view>
			<image src="@/static/image/arrow-right.png" mode="" class="arrow"></image>
		</navigator>
		<view class="ft32 bg-white hot-title flex alcenter plr40 h100">热门代币</view>
		<view class="list-item bg-white flex-between alcenter h120 plr40" v-for="(item, index) in hotList" :key="index">
			<view class="flex alcenter" style="width: 500rpx;">
				<image :src="`${config.imgUrl + item.active_logo}`" mode="" class="mr20"></image>
				<view style="overflow: hidden;">
					<view class="ft32">{{item.token_symbol}}</view>
					<view class="c_9397AF line-one">{{item.contract_addr}}</view>
				</view>
			</view>
			<image v-if="allContractAddress.includes(item.contract_addr)" src="@/static/image/jinzhi@2x.png" mode="" class="arrow" @tap="handleDelete(item)"></image>
			<image v-else src="@/static/image/add.png" mode="" class="arrow" @tap="handleAdd(item)"></image>
		</view>
		<scroll-view v-if="list.length > 0" @scrolltolower="handleBottom" class="scroll-box" scroll-y="true" :style="{'height': scrollHeight + 'px'}">
			<view class="list-item bg-white flex-between alcenter h120 plr40" v-for="(item, index) in list" :key="index">
				<view class="flex alcenter" style="width: 500rpx;">
					<image :src="`${config.imgUrl + item.active_logo}`" mode="" class="mr20"></image>
					<view style="overflow: hidden;">
						<view class="ft32">{{item.token_symbol}}</view>
						<view class="c_9397AF">{{item.contract_addr}}</view>
					</view>
				</view>
				<image v-if="allContractAddress.includes(item.contract_addr)" src="@/static/image/jinzhi@2x.png" mode="" class="arrow" @tap="handleDelete(item)"></image>
				<image v-else src="@/static/image/add.png" mode="" class="arrow" @tap="handleAdd(item)"></image>
			</view>
		</scroll-view>
	</view>
</template>

<script lang="ts">
	import { ComponentInternalInstance, defineComponent, getCurrentInstance, ref } from 'vue'
	import { onLoad, onNavigationBarButtonTap, onNavigationBarSearchInputChanged, onNavigationBarSearchInputConfirmed, onReady } from '@dcloudio/uni-app';
	import config from '@/config'
	import DB from "@/common/utils/sqlite";
	import { postTokenInfo, getDeviceInfo, updateCurrentWallet } from '@/common/utils';
	export default defineComponent({
		setup() {
			const { proxy } = getCurrentInstance() as ComponentInternalInstance;
			const deviceId = ref('')
			const token_name = ref('')
			const page = ref(1)
			const page_size = ref(10)
			const hasMore = ref(false)
			const list = ref<any[]>([])
			const scrollHeight = ref(0)
			const currentMainCoin = ref<Record<string, any>>({})
			const allContractAddress = ref<string[]>([])
			const chain = ref('')
			const hotList = ref<any[]>([])
			onNavigationBarButtonTap(()=>{
				uni.navigateBack()
			}) 
			onNavigationBarSearchInputChanged((e)=>{
				token_name.value = e.text
				if(!token_name.value) {
					list.value = []
				}else{
					page.value = 1
					loadData()
				}
			}) 
			onNavigationBarSearchInputConfirmed((e)=>{
				token_name.value = e.text
				if(!token_name.value) {
					list.value = []
				}else{
					page.value = 1
					loadData()
				}
			}) 
			onLoad(async (options) =>{
				chain.value = options?.chain
				// 获取设备信息
				const deviceInfo = await getDeviceInfo()
				deviceId.value = deviceInfo.device_id
				scrollHeight.value = uni.getSystemInfoSync().windowHeight
				loadHotList()
				setAllContractAddress()
			})
			//热门代币
			const loadHotList = ()  => {
				proxy?.$api?.hot_token_list({
					chain: chain.value,
				}).then(res => {
					hotList.value = res.result
				})
			}
			const loadData = ()  => {
				proxy?.$api?.sourch_add_token({
					chain: chain.value,
					token_name: token_name.value,
					page: page.value,
					page_size: page.value_size
				}).then(res => {
					if(!res.result || res.result.length < page.value_size) {
						hasMore.value = false
					}else{
						hasMore.value = true
					}
					if(page.value == 1) {
						list.value = res.result || []
					}else{
						list.value = list.value.concat(res.result || [])
					}
				})
			}
			const handleBottom = ()  => {
				console.log('handleBottom')
				if(hasMore.value) {
					page.value += 1
					loadData()
				}else{
					
				}
			}
			const setAllContractAddress = ()  => {
				currentMainCoin.value = uni.getStorageSync('currentWallet')
				allContractAddress.value = (currentMainCoin.value.token_list||[]).filter((item: any) => {
					return item.contract_addr.length > 0
				}).map((item: any) => {
					return item.contract_addr
				})
			}
			const handleDelete = ({contract_addr, token_symbol}: any) => {
				const { wallet_uuid, chain_id } = currentMainCoin.value;
				proxy?.$api?.delete_wallet_token({
					chain: chain.value,
					device_id: deviceId.value, // 设备ID
					wallet_uuid: wallet_uuid,
					symbol: token_symbol,
					contract_addr,
				}).then(res => {
					currentMainCoin.value.token_list = currentMainCoin.value.token_list.filter((item: any) => {
						return item.contract_addr !== contract_addr
					})
					updateCurrentWallet(currentMainCoin.value).then(async ()=>{
						await DB.updateTableData('asset', `is_del = '1'`, "chain_id", chain_id, "contract_addr", contract_addr)
						setAllContractAddress()
					})
				})
			}
			const handleAdd = (item: any) => {
				const { wallet_uuid, chain, wallet_name, address } = currentMainCoin.value
				postTokenInfo({
					chain,
					wallet_uuid,
					symbol: item.token_symbol,
					wallet_name,
					address,
					contract_addr: item.contract_addr,
					unit: item.unit,
					token_name: item.token_name
				},()=>{
					proxy?.$api?.getWalletBalance({
						device_id: deviceId.value,
						wallet_uuid,
						chain
					}).then(res => {
						let { token_list, asset_cny, asset_usd } = res.result
						currentMainCoin.value.token_list = token_list;
						currentMainCoin.value.asset_cny = asset_cny;
						currentMainCoin.value.asset_usd = asset_usd;
						updateCurrentWallet(currentMainCoin.value).then(async ()=>{
							setAllContractAddress()
						})
					})
				})
			}
			return {
				config,
				deviceId,
				token_name,
				hotList,
				page,
				page_size,
				hasMore,
				list,
				scrollHeight,
				currentMainCoin, //当前主链币
				allContractAddress,
				chain,
				loadHotList,
				loadData,
				handleBottom,
				setAllContractAddress,
				handleDelete,
				handleAdd
			}
		},
	})
</script>

<style lang="scss">
	page{
		background-color: #F7F8FC;
	}
	.token-coin-container{
		.list-item{
			image{
				width: 88rpx;
				height: 88rpx;
				flex-shrink: 0;
			}
			.arrow{
				width: 44rpx;
				height: 44rpx;
				flex-shrink: 0;
			}
		}
		.hot-title{
			position: sticky;
			top: 0;
			left: 0;
			z-index: 20;
		}
		.scroll-box{
			position: fixed;
			top: 0;
			/* #ifdef H5 */
			top: 44px;
			/* #endif */
			left: 0;
			z-index: 20;
			background-color: #ffffff;
		}
	}
</style>
