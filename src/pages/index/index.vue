<template>
  <view class="content">
    <image class="logo" src="/static/logo.png" />
    <view class="text-area">
      <text class="title">{{ title }}</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { onHide, onLoad, onShow } from '@dcloudio/uni-app';
import { ref } from 'vue'
const title = ref('Hello')
onLoad((options) => {
  console.log('onLoad', options)
})
// 页面切换到前台时
onShow(() => {
  console.log('onShow', 111)
})

// 页面切换到后台时
onHide(() => {
  console.log('onHide', 222)
})
</script>

<style>
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.logo {
  height: 200rpx;
  width: 200rpx;
  margin-top: 200rpx;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 50rpx;
}

.text-area {
  display: flex;
  justify-content: center;
}

.title {
  font-size: 36rpx;
  color: #8f8f94;
}
</style>
