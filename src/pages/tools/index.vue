<template>
  <view class="container">
    <view class="tools-grid">
      <view class="tool-card" hover-class="tool-card-hover" @tap="handleToolClick('linkParser')">
        <view class="tool-icon-wrapper">
          <text class="icon-text">链</text>
        </view>
        <view class="tool-info">
          <view class="tool-name">解析工具</view>
          <view class="tool-desc">提取图文内容</view>
        </view>
      </view>
    </view>
    
    <!-- 解析工具指南弹窗 -->
    <view class="parser-guide" v-if="showParserGuide">
      <view class="guide-content">
        <view class="guide-header">
          <text class="guide-title">解析工具使用指南</text>
          <view class="guide-close" @tap="closeParserGuide">×</view>
        </view>
        
        <view class="guide-steps">
          <view class="guide-step">
            <view class="step-number">1</view>
            <view class="step-content">
              <view class="step-title">粘贴链接</view>
              <view class="step-desc">将链接粘贴到输入框</view>
            </view>
          </view>
          
          <view class="guide-step">
            <view class="step-number">2</view>
            <view class="step-content">
              <view class="step-title">点击解析</view>
              <view class="step-desc">点击解析按钮获取内容和图片</view>
            </view>
          </view>
          
          <view class="guide-step">
            <view class="step-number">3</view>
            <view class="step-content">
              <view class="step-title">保存资源</view>
              <view class="step-desc">解析成功后可保存图片和文字内容</view>
            </view>
          </view>
        </view>
        
        <button class="start-button" @tap="startUsingParser">开始使用</button>
      </view>
    </view>
    
    <!-- 遮罩层 -->
    <view class="mask" v-if="showParserGuide" @tap="closeParserGuide"></view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      showParserGuide: false
    };
  },
  methods: {
    handleToolClick(tool) {
      uni.vibrateShort();
      
      switch (tool) {
        case 'linkParser':
          this.showParserGuide = true;
          break;
        default:
          break;
      }
    },
    closeParserGuide() {
      this.showParserGuide = false;
    },
    startUsingParser() {
      this.showParserGuide = false;
      uni.navigateTo({
        url: '/pages/tools/link-parser'
      });
    }
  }
};
</script>

<style>
page {
  background-color: #ebf5fc;
}

.container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  padding: 30rpx 20rpx;
  box-sizing: border-box;
}

.tools-grid {
  display: flex;
  justify-content: center;
  margin-top: 20rpx;
}

.tool-card {
  width: 80%;
  background-color: #ffffff;
  border-radius: 16rpx;
  padding: 40rpx 0;
  margin-bottom: 20rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
  transition: transform 0.2s ease;
}

.tool-card-hover {
  background-color: #f8f8f8;
  transform: scale(0.98);
}

.tool-icon-wrapper {
  width: 120rpx;
  height: 120rpx;
  border-radius: 30rpx;
  background-color: #e9f1fb;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 24rpx;
}

.icon-text {
  font-size: 60rpx;
  color: #909399;
  font-weight: bold;
}

.tool-info {
  width: 100%;
  text-align: center;
}

.tool-name {
  font-size: 34rpx;
  font-weight: 500;
  color: #333333;
  margin-bottom: 8rpx;
}

.tool-desc {
  font-size: 26rpx;
  color: #999999;
}

/* 弹窗样式 */
.mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 100;
}

.parser-guide {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80%;
  max-width: 600rpx;
  background-color: #ffffff;
  border-radius: 20rpx;
  z-index: 101;
  overflow: hidden;
}

.guide-content {
  padding: 40rpx 30rpx;
}

.guide-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40rpx;
}

.guide-title {
  font-size: 36rpx;
  font-weight: 600;
  color: #333333;
}

.guide-close {
  font-size: 48rpx;
  color: #999999;
  line-height: 1;
}

.guide-steps {
  margin-bottom: 40rpx;
}

.guide-step {
  display: flex;
  align-items: center;
  margin-bottom: 30rpx;
}

.step-number {
  width: 60rpx;
  height: 60rpx;
  border-radius: 50%;
  background-color: #5b7bd5;
  color: #ffffff;
  font-size: 32rpx;
  font-weight: bold;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 24rpx;
}

.step-content {
  flex: 1;
}

.step-title {
  font-size: 30rpx;
  font-weight: 500;
  color: #333333;
  margin-bottom: 6rpx;
}

.step-desc {
  font-size: 26rpx;
  color: #666666;
}

.start-button {
  background-color: #5b7bd5;
  color: #ffffff;
  font-size: 32rpx;
  font-weight: 500;
  padding: 20rpx 0;
  border-radius: 40rpx;
  text-align: center;
  width: 100%;
  border: none;
}
</style> 