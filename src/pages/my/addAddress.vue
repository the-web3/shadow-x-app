<template>
	<view class="add-address-contianer">
		<view class="form-item">
			<view class="ft32 mb20">名字</view>
			<input class="h60 ft26" type="text" v-model="name" placeholder="请输入名称" placeholder-style="font-size: 26rpx;color: #9397AF;" />
		</view>
		<view class="form-item">
			<view class="ft32 mb20">资产名称</view>
			<input class="h60 ft26" type="text" v-model="assetName" placeholder="请输入资产名称" placeholder-style="font-size: 26rpx;color: #9397AF;" />
		</view>
		<view class="form-item">
			<view class="ft32 mb20">备注</view>
			<input class="h60 ft26" type="text" v-model="remark" placeholder="请输入备注信息" placeholder-style="font-size: 26rpx;color: #9397AF;" />
		</view>
		<view class="form-item">
			<view class="ft32 mb20">添加地址</view>
			<input class="h60 ft26" type="text" v-model="address" placeholder="请输入钱包地址" placeholder-style="font-size: 26rpx;color: #9397AF;" />
		</view>
		<button type="default" :loading="loading" class="save-btn flex-center" @tap="handleSave">保存</button>
	</view>
</template>

<script lang="ts">
	import { onPullDownRefresh, onShow } from '@dcloudio/uni-app'
	import { ComponentInternalInstance, computed, defineComponent, getCurrentInstance, ref } from 'vue'
	export default defineComponent({
		setup() {
			const { proxy } = getCurrentInstance() as ComponentInternalInstance;
			const deviceId = ref('c3c0268fa44293f2')
			const name = ref('')
			const assetName = ref('')
			const remark = ref('')
			const address = ref('')
			const loading = ref(false)
			const canSubmit = computed(() => {
				return name.value !== '' && assetName.value !== '' && address.value !== ''
			})
			onShow(()=>{
			// #ifdef APP-PLUS
			plus.device.getInfo({
				success: (e) =>{
					deviceId.value = e.uuid
				},
				fail: (e) =>{
					console.log('getDeviceInfo failed: '+JSON.stringify(e));
				}
			});
			// #endif
		})
		const handleSave = () => {
			// #ifdef APP-PLUS
			plus.device.getInfo({
				success: (e) =>{
					deviceId.value = e.uuid
					handleSubmit()
				},
				fail: (e) =>{
					console.log('getDeviceInfo failed: '+JSON.stringify(e));
				}
			});
			// #endif
			handleSubmit()
		}
		const handleSubmit = () =>{
			if(!canSubmit.value) return 
			loading.value = true
			proxy?.$api.add_note_book({
				device_id: deviceId.value,
				name: name.value,
				address: address.value,
				asset_name: assetName.value,
				memo: remark.value
			}).then(() => {
				loading.value = false
				uni.navigateBack()
			}).catch(() => {
				loading.value = false
			})
		}
		return {
			deviceId,
			name,
			assetName,
			remark,
			address,
			loading,
			canSubmit,
			handleSave,
			handleSubmit
		}
		},
	})
</script>

<style lang="scss">
	.add-address-contianer{
		padding-bottom: 130rpx;
		.form-item{
			padding: 34rpx 24rpx 0 38rpx;
			input{
				// border-bottom: 1rpx solid #EBEBED;
			}
		}
		.save-btn{
			position: fixed;
			bottom: 40rpx;
			right: 194rpx;
			left:194rpx;
			height: 80rpx;
			line-height: 80rpx;
			font-size: 32rpx;
			color: #ffffff;
			background: #4C6EF5;
			border-radius: 38rpx;
		}
	}
</style>
