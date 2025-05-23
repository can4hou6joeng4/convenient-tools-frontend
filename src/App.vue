<template>
  <view>
    <view class="container">
      <slot></slot>
    </view>
  </view>
</template>

<script setup lang="ts">
import { onLaunch, onShow, onHide } from "@dcloudio/uni-app";

onLaunch(() => {
  console.log("App Launch");
});

onShow(() => {
  console.log("App Show");
});

onHide(() => {
  console.log("App Hide");
});
</script>

<style>
/*每个页面公共css */
page {
  background-color: #f5f5f5;
}
</style>
