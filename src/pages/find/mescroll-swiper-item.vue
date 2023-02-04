<template>
	<mescroll-uni :fixed="false" top="0" :down="downOption" @down="downCallback" :up="upOption" @up="upCallback" @init="mescrollInit">
		<!-- 数据列表 -->
		<view class="list">
			<view class="list-item flex alcenter plr40 mb40" v-for="(item, index) in list" :key="index">
				<image src="http://image.wufazhuce.com/Fn7g1GKNvdKFIog6zbFG-dlzgeKM" mode=""></image>
				<view>
					<view class="ft28">小工具</view>
					<view class="c_9397AF">APP文本描述APP文本描述APP文本描述</view>
				</view>
			</view>
		</view>
	</mescroll-uni>
</template>

<script lang="ts">
	import { ref, defineComponent, onMounted, watch } from 'vue'
	//TODO:重构
	// import MescrollUni from "@/components/mescroll-uni/mescroll-uni.vue";
	export default defineComponent({
		props: {
			i: [Number,String], // 每个tab页的专属下标
			index: { // 当前tab的下标
				type: [Number,String],
				default(){
					return 0
				}
			},
		},
		components: {
			// MescrollUni,
		},
		setup(props) {
			const isInit = ref(false)// 列表是否已经初始化
			const mescroll = ref(null)//mescroll实例对象
			const downOption = ref({
					use: false,
					auto:false, // 不自动加载
				})
			const upOption = ref({
					auto:false, // 不自动加载
					noMoreSize: 4, 
					empty:{
						tip: '~ 空空如也 ~'
					}
				})
			const list = ref([])
			onMounted(()=>{
				if(props.i === 0){
					isInit.value = true; // 标记为true
					mescroll?.value?.resetUpScroll?.()
				}
			})
			watch(
				() => props.index,
				(val) => {
					if (props.i === val && !isInit.value) {
					isInit.value = true; // 标记为true
					mescroll?.value?.resetUpScroll?.()
				}
				}
			)
			const goDetail = (row) => {}

			const handleAdd = () => {
				uni.showToast({
					title: '加入购物车',
					icon: 'none'
				})
			}
			// mescroll组件初始化的回调,可获取到mescroll对象
			const mescrollInit = (mescroll) => {
				mescroll.value = mescroll;
			}
			/*下拉刷新的回调 */
			const downCallback = (mescroll) => {
				// 这里加载你想下拉刷新的数据, 比如刷新轮播数据
				// loadSwiper();
				// 下拉刷新的回调,默认重置上拉加载列表为第一页 (自动执行 mescroll.num=1, 再触发upCallback方法 )
				mescroll.resetUpScroll()
			}
			/*上拉加载的回调: mescroll携带page的参数, 其中num:当前页 从1开始, size:每页数据条数,默认10 */
			const upCallback = (mescroll) => {
				//联网加载数据
				getListDataFromNet(mescroll.num, mescroll.size, (curPageData)=>{
					//联网成功的回调,隐藏下拉刷新和上拉加载的状态;
					mescroll.endSuccess(curPageData.length);
					//设置列表数据
					if(mescroll.num == 1) list.value = []; //如果是第一页需手动制空列表
					list.value = list.value.concat(curPageData); //追加新数据
				}, () => {
					//联网失败的回调,隐藏下拉刷新的状态
					mescroll.endErr();
				})
			}
			const getListDataFromNet = (pageNum,pageSize,successCallback,errorCallback) => {
				successCallback && successCallback(new Array(10).fill(0));
				// this.$api.homeDownData({
				// 	page: pageNum,
				// 	page_size: pageSize,
				// 	index_cat_id: this.i
				// }).then(res => {
				// 	successCallback && successCallback(res.data.gds_lst);
				// }).catch(err => {
				// 	errorCallback && errorCallback();
				// })
			}

			return {
				isInit,
				mescroll,
				downOption,
				upOption,
				list,
				goDetail,
				handleAdd,
				mescrollInit,
				downCallback,
				upCallback,
				getListDataFromNet,
			}
		},
	})
</script>

<style lang="scss">
	.list-item{
		image{
			width: 88rpx;
			height: 88rpx;
			background: #D8D8D8;
			border-radius: 20rpx;
			margin-right: 32rpx;
		}
	}
</style>
