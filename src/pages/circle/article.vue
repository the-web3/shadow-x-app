<template>
	<view class="news-container">
		<view class="status-bar"></view>
		<view class="top-box h100">
			<view class="flex-center top-container">
				<v-tabs class="flex-center" v-model="currentTab" :tabs="tabs" :scroll="false"></v-tabs>
			</view>
		</view>
		<swiper :current="currentTab" @change="listChange" :interval="3000" :duration="1000" :style="{height: scrollHeight + 'px'}">
			<swiper-item>
				<!-- <mescroll-uni 
					top="0" 
					:down="fastMescroll.downOption"  
					:up="fastMescroll.upOption" 
					@up="fastUpCallback" 
					@init="fastMescrollInit"
					>
					<view class="content-box">
						<view class="fast-article">
							<view 
								class="fast-article-list"
								v-for="(item, index) in fastList"
								:key="index"
							>
								<view class="date">{{ item.add_time }}</view>
								<view class="fast-article-item">
									<view class="article-item">
										<view class="title-box flex alcenter">
											<view class="circle-icon"></view>
											<text class="time">{{ item.add_time }}</text>
											<view class="icon">快讯</view>
										</view>
										<view class="article-item-box">
											<view class="title-text line-two">{{ item.title }}</view>
											<view class="desc-text">{{ item.abstract }}</view>
											<image class="more-img" src="../../static/image/shenglve.png" mode=""></image>
											<navigator class="all-btn" :url="`/pages/circle/detail?id=${item.id}&type=${item.type}`">查看全文</navigator>
											<view class="auth-box flex-between alcenter"><text calss="auth">{{ item.author }}</text>
											</view>
										</view>
									</view>
								</view>
							</view>
						</view>
					</view>
				</mescroll-uni> -->
			</swiper-item>
			<swiper-item>
				<!-- <mescroll-uni
					top="0" 
					:down="articleMescroll.downOption"  
					:up="articleMescroll.upOption" 
					@up="articleUpCallback" 
					@init="articleMescrollInit"
					>
					<view class="content-box">
						<view class="article-list-box">
							<navigator :url="`/pages/circle/detail?id=${item.id}&type=${item.type}`" class="flex" v-for="(item, index) in articleList" :key="index">
								<view class="article-list-item flex-between">
									<view class="img-box flex-center">
										<image class="img" :src="`${config.base_url + item.image}`" mode="aspectFit"></image>
									</view>
									<view class="article-info-box flex-between flex-column">
										<text class="title line-two">{{ item.title }}</text>
										<view class="flex-between">
											<text class="auth">{{ item.author }}</text>
											<text class="time">{{ item.add_time }}</text>
										</view>
									</view>
								</view>
							</navigator>
						</view>
					</view>
				</mescroll-uni> -->
			</swiper-item>
		</swiper>
	</view>
</template>

<script lang="ts">
	import { onLoad } from '@dcloudio/uni-app';
	//TODO:重构
	// import MescrollUni from "@/components/mescroll-uni/mescroll-uni.vue";
	import vTabs from '@/components/v-tabs/v-tabs.vue'
	import { getArcticleList} from '@/api/circle'
	import config from '@/config'
	import { ref, defineComponent, onMounted } from 'vue'
	export default defineComponent({
		components:{
			vTabs,
			// MescrollUni
		},
		setup() {
			const currentTab = ref(0)
			const tabs = ref(['区块链安全', '技术文章'])
			const articlePageParams = ref({// 文章
				type: 0,
				page: 1,
				pageSize: 10,
				total: null
			})
			const articleList = ref([])
			const fastPageParams = ref<{ // 快讯
					type: number
					page: number
					pageSize: number
					total: null | number
				}>({ // 快讯
					type: 1,
					page: 1,
					pageSize: 10,
					total: null
				})
			const fastList = ref([])
			const scrollHeight = ref(0)
			const fastMescroll = ref({
					mescroll: null,
					downOption:{
						use: false,
						auto:false, // 不自动加载
					},
					upOption:{
						auto:false, // 不自动加载
						noMoreSize: 4, 
						empty:{
							tip: '~ 空空如也 ~'
						}
					},
				})
			const articleMescroll = ref({
					mescroll: null,
					downOption:{
						use: false,
						auto:false, // 不自动加载
					},
					upOption:{
						auto:false, // 不自动加载
						noMoreSize: 4, 
						empty:{
							tip: '~ 空空如也 ~'
						}
					},
				})

			
			onLoad(()=>{
				let { statusBarHeight=0, windowHeight } = uni.getSystemInfoSync()
				scrollHeight.value = windowHeight - statusBarHeight - uni.upx2px(100)
			})
			onMounted(()=>{
				Promise.all([getArcticleListFunc(), getFastListFunc()])
			})
			
			const listChange = (e: any) => {
				currentTab.value = e.detail.current
			}
			const fastMescrollInit = (m: any)  =>{
				fastMescroll.value.mescroll = m
			}
			const articleMescrollInit = (m: any)  =>{
				articleMescroll.value.mescroll = m
			}
			const fastUpCallback = (mescroll: any)  =>{
				getListDataFromNet(mescroll.num, 'fastPageParams', (curPageData)=>{
					//联网成功的回调,隐藏下拉刷新和上拉加载的状态;
					mescroll.endSuccess(curPageData.length);
					//设置列表数据
					if(mescroll.num == 1) fastList.value = []; //如果是第一页需手动制空列表
					fastList.value = fastList.value.concat(curPageData); //追加新数据
				}, () => {
					//联网失败的回调,隐藏下拉刷新的状态
					mescroll.endErr();
				})
			}
			const articleUpCallback = (mescroll: any) => {
				getListDataFromNet(mescroll.num, 'articlePageParams', (curPageData)=>{
					//联网成功的回调,隐藏下拉刷新和上拉加载的状态;
					mescroll.endSuccess(curPageData.length);
					//设置列表数据
					if(mescroll.num == 1) articleList.value = []; //如果是第一页需手动制空列表
					articleList.value = articleList.value.concat(curPageData); //追加新数据
				}, () => {
					//联网失败的回调,隐藏下拉刷新的状态
					mescroll.endErr();
				})
			}
			const getListDataFromNet = (pageNum: number, paramsName: 'fastPageParams'| 'articlePageParams',successCallback: (curPageData: any)=>void, errorCallback?: ()=>void) => {
				let curParam  = paramsName === 'fastPageParams'? fastPageParams: articlePageParams
				curParam.value.page = pageNum
				getArcticleList (curParam.value).then(res => {
					successCallback && successCallback(res.data.gds_lst);
				}).catch(err => {
					errorCallback && errorCallback();
				})
			}
			const getArcticleListFunc = async () => {
				try {
					const res = await getArcticleList(articlePageParams.value)
					if (+res.code === 200) {
						articleList.value = res.result.gds_lst || []
						articlePageParams.value.total = res.result.total
					}
				} catch (e) {
					console.log(e)
				}
			}
			const getFastListFunc = async() => {
				try {
					const res = await getArcticleList(fastPageParams.value)
					if (+res.code === 200) {
						fastList.value = res.result.gds_lst || []
						fastPageParams.value.total = +res.result.total
					}
				} catch (e) {
					console.log(e)
				}
			}
			return {
				config,
				currentTab,
				tabs,
				articlePageParams,
				articleList,
				fastPageParams,
				fastList,
				scrollHeight,
				fastMescroll,
				articleMescroll,
				listChange,
				fastMescrollInit,
				articleMescrollInit,
				fastUpCallback,
				articleUpCallback,
				getListDataFromNet,
				getArcticleList,
			}
		},
	})
</script>
<!-- <script>
	export default {
		methods: {
			
		}
	}
</script> -->

<style lang="scss" scoped>
	$status_Height: var(--status-bar-height);
	.news-container{
		width: 100%;
		.status-bar{
			position: sticky;
			top: 0;
			z-index: 10;
			height: $status_Height;
			background-color: #ffffff;
		}
		.top-box{
			width: 100%;
			padding: 10rpx 0;
			box-sizing: border-box;
			border-bottom: 1px solid #F0F0F0;
		}
		.top-container{
			width: 300rpx;
			margin: 0 auto;
		}
		.content-box{
			.article-list-box{
				width: 100%;
				box-sizing: border-box;
				padding: 48rpx 40rpx;
				.article-list-item{
					width: 100%;
					margin-bottom: 50rpx;
					.img-box{
						width: 176rpx;
						height: 110rpx;
						.img{
							max-width: 176rpx;
							max-height: 110rpx;
						}
					}
					.article-info-box{
						width: 470rpx;
						&:last-child{
							margin-bottom: 0;
						}
						.title{
							font-size: 28rpx;
							line-height: 32rpx;
							font-weight: 600;
							color: #333;
						}
						.auth{
							font-size: 24rpx;
							line-height: 28rpx;
							color: #9397AF;
						}
						.time{
							font-size: 24rpx;
							line-height: 28rpx;
							color: #9397AF;
						}
					}
				}
			}
			.fast-article{
				width: 100%;
				.fast-article-list{
					width: 100%;
					.date{
						width: 100%;
						box-sizing: border-box;
						height: 64rpx;
						padding: 0 46rpx;
						font-size: 32rpx;
						font-family: PingFangSC-Medium, PingFang SC;
						font-weight: 500;
						color: #222222;
						line-height: 64rpx;
						background-color: #F7F8FC;
					}
					.fast-article-item{
						width: 100%;
						background-color: #fff;
						padding: 0 40rpx;
						box-sizing: border-box;
						.article-item{
							width: 100%;
							border-left: 1px solid #E6E8EA;
							padding-bottom: 10rpx;
							.title-box{
								width: 100%;
								margin-left: -9rpx;
								.circle-icon{
									display: block;
									width: 16rpx;
									height: 16rpx;
									background-color: #E6E8EA;
									border-radius: 4px;
								}
								.time{
									font-size: 24rpx;
									font-family: PingFangSC-Regular, PingFang SC;
									font-weight: 400;
									color: #9397AF;
									line-height: 34rpx;
									padding: 0;
									margin: 24rpx 14rpx 26rpx 22rpx;
								}
								.icon{
									padding: 4rpx 12rpx;
									font-size: 20rpx;
									font-family: PingFangSC-Regular, PingFang SC;
									font-weight: 400;
									color: #4C6EF5;
									line-height: 28rpx;
									background: #ECF1FD;
									border-radius: 5px;
								}
							}
							.article-item-box{
								padding-left: 28rpx;
								.title-text {
									font-size: 32rpx;
									font-family: PingFangSC-Medium, PingFang SC;
									font-weight: 500;
									color: #222222;
									line-height: 44rpx;
									margin-bottom: 20rpx;
								}
								.desc-text{
									font-size: 28rpx;
									font-family: PingFangSC-Regular, PingFang SC;
									font-weight: 400;
									color: #9397AF;
									line-height: 40rpx;
									margin-bottom: 10rpx;
								}
								.more-img{
									width: 24rpx;
									height: 24rpx;
									margin-bottom: 10rpx;
								}
								.all-btn{
									font-size: 28rpx;
									font-family: PingFangSC-Regular, PingFang SC;
									font-weight: 400;
									color: #4C6EF5;
									line-height: 40rpx;
									margin-bottom: 32rpx;
								}
								.auth-box{
									width: 100%;
									.auth{
										font-size: 24px;
										font-family: PingFangSC-Regular, PingFang SC;
										font-weight: 400;
										color: #9397AF;
									}
									.share-btn{
										width: 116rpx;
										height: 40rpx;
										border-radius: 10px;
										border: 1px solid #4C6EF5;
										font-size: 24rpx;
										font-family: PingFangSC-Regular, PingFang SC;
										font-weight: 400;
										color: #4C6EF5;
										.img{
											width: 24rpx;
											height: 24rpx;
											margin-right: 6rpx;
										}
									}
								}
							}
						}
					}
				}
			}
		}
	}
</style>
