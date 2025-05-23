<template>
  <view class="container">
    <view class="tools-grid">
      <view class="tool-card" hover-class="tool-card-hover" @tap="handleToolClick('imageCompressor')">
        <view class="tool-icon-wrapper image-compressor-icon">
          <image class="tool-icon-img" src="/static/icons/compress.png" mode="aspectFit"></image>
        </view>
        <view class="tool-info">
          <view class="tool-name">图片压缩</view>
          <view class="tool-desc">高质量压缩图片</view>
        </view>
      </view>

      <view class="tool-card" hover-class="tool-card-hover" @tap="handleToolClick('linkParser')">
        <view class="tool-icon-wrapper link-parser-icon">
          <image class="tool-icon-img" src="/static/icons/link.png" mode="aspectFit"></image>
        </view>
        <view class="tool-info">
          <view class="tool-name">解析工具</view>
          <view class="tool-desc">提取图文内容</view>
        </view>
      </view>
      
      <view class="tool-card" hover-class="tool-card-hover" @tap="handleToolClick('scoreCalculator')">
        <view class="tool-icon-wrapper score-calculator-icon">
          <image class="tool-icon-img" src="/static/icons/calculate.png" mode="aspectFit"></image>
        </view>
        <view class="tool-info">
          <view class="tool-name">积分计算</view>
          <view class="tool-desc">多人游戏积分</view>
        </view>
      </view>
    </view>
    
    <!-- 解析工具指南弹窗 -->
    <view class="parser-guide" v-if="showParserGuide">
      <view class="guide-content">
        <view class="guide-header">
          <text class="guide-title">解析工具使用指南</text>
          <view class="guide-close" @tap="closeParserGuide">
            <view class="close-icon"></view>
          </view>
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
    
    <!-- 图片压缩工具指南弹窗 -->
    <view class="parser-guide" v-if="showImageCompressorGuide">
      <view class="guide-content">
        <view class="guide-header">
          <text class="guide-title">图片压缩工具使用指南</text>
          <view class="guide-close" @tap="closeImageCompressorGuide">
            <view class="close-icon"></view>
          </view>
        </view>
        
        <view class="guide-steps">
          <view class="guide-step">
            <view class="step-number step-number-compressor">1</view>
            <view class="step-content">
              <view class="step-title">选择图片</view>
              <view class="step-desc">从相册选择需要压缩的图片</view>
            </view>
          </view>
          
          <view class="guide-step">
            <view class="step-number step-number-compressor">2</view>
            <view class="step-content">
              <view class="step-title">调整参数</view>
              <view class="step-desc">选择压缩质量和尺寸调整选项</view>
            </view>
          </view>
          
          <view class="guide-step">
            <view class="step-number step-number-compressor">3</view>
            <view class="step-content">
              <view class="step-title">保存结果</view>
              <view class="step-desc">将压缩后的图片保存到相册</view>
            </view>
          </view>
        </view>
        
        <button class="start-button compressor-button" @tap="startUsingImageCompressor">开始使用</button>
      </view>
    </view>
    
    <!-- 积分计算工具指南弹窗 -->
    <view class="parser-guide" v-if="showScoreCalculatorGuide">
      <view class="guide-content">
        <view class="guide-header">
          <text class="guide-title">积分计算工具使用指南</text>
          <view class="guide-close" @tap="closeAllGuides">
            <view class="close-icon"></view>
          </view>
        </view>
        
        <view class="guide-steps">
          <view class="guide-step">
            <view class="step-number step-number-calculator">1</view>
            <view class="step-content">
              <view class="step-title">添加玩家</view>
              <view class="step-desc">自定义玩家Emoji和名称</view>
            </view>
          </view>
          
          <view class="guide-step">
            <view class="step-number step-number-calculator">2</view>
            <view class="step-content">
              <view class="step-title">记录积分</view>
              <view class="step-desc">输入每轮玩家获得的积分</view>
            </view>
          </view>
          
          <view class="guide-step">
            <view class="step-number step-number-calculator">3</view>
            <view class="step-content">
              <view class="step-title">查看统计</view>
              <view class="step-desc">自动计算总分和占比</view>
            </view>
          </view>
        </view>
        
        <button class="start-button calculator-button" @tap="startUsingScoreCalculator">开始使用</button>
      </view>
    </view>
    
    <!-- 遮罩层 -->
    <view class="mask" v-if="showParserGuide || showImageCompressorGuide || showScoreCalculatorGuide" @tap="closeAllGuides"></view>
  </view>
</template>

<script setup>
import { ref } from 'vue';

// 弹窗状态管理
const showParserGuide = ref(false);
const showImageCompressorGuide = ref(false);
const showScoreCalculatorGuide = ref(false);

// 点击工具卡片
const handleToolClick = (tool) => {
  uni.vibrateShort();
  
  switch (tool) {
    case 'linkParser':
      showParserGuide.value = true;
      break;
    case 'imageCompressor':
      showImageCompressorGuide.value = true;
      break;
    case 'scoreCalculator':
      showScoreCalculatorGuide.value = true;
      break;
    default:
      break;
  }
};

// 关闭指南弹窗
const closeParserGuide = () => {
  showParserGuide.value = false;
};

const closeImageCompressorGuide = () => {
  showImageCompressorGuide.value = false;
};

const closeAllGuides = () => {
  showParserGuide.value = false;
  showImageCompressorGuide.value = false;
  showScoreCalculatorGuide.value = false;
};

// 开始使用工具
const startUsingParser = () => {
  showParserGuide.value = false;
  uni.navigateTo({
    url: '../tools/link-parser'
  });
};

const startUsingImageCompressor = () => {
  showImageCompressorGuide.value = false;
  uni.navigateTo({
    url: '../tools/image-compressor'
  });
};

const startUsingScoreCalculator = () => {
  showScoreCalculatorGuide.value = false;
  uni.navigateTo({
    url: '../tools/score-calculator'
  });
};
</script>

<style>
page {
  background-color: #f5f7fa;
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
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  padding: 0 20rpx;
  width: 100%;
  box-sizing: border-box;
  margin-top: 30rpx;
}

.tool-card {
  width: 46%;
  background-color: #ffffff;
  border-radius: 20rpx;
  padding: 40rpx 0;
  margin-bottom: 30rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-shadow: 0 10rpx 20rpx rgba(0, 0, 0, 0.03);
  transition: all 0.3s ease;
}

.tool-card-hover {
  background-color: #f9f9f9;
  transform: translateY(-6rpx);
  box-shadow: 0 14rpx 24rpx rgba(0, 0, 0, 0.06);
}

.tool-icon-wrapper {
  width: 120rpx;
  height: 120rpx;
  border-radius: 30rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 30rpx;
}

.tool-icon-img {
  width: 60rpx;
  height: 60rpx;
}

/* 图标背景色 */
.image-compressor-icon {
  background-color: rgba(156, 91, 213, 0.1);
}

.link-parser-icon {
  background-color: rgba(91, 123, 213, 0.1);
}

.score-calculator-icon {
  background-color: rgba(91, 123, 213, 0.1);
}

/* 关闭图标 */
.close-icon {
  width: 40rpx;
  height: 40rpx;
  position: relative;
}

.close-icon:before, .close-icon:after {
  content: '';
  position: absolute;
  width: 30rpx;
  height: 3rpx;
  background-color: #999;
  left: 50%;
  top: 50%;
}

.close-icon:before {
  transform: translate(-50%, -50%) rotate(45deg);
}

.close-icon:after {
  transform: translate(-50%, -50%) rotate(-45deg);
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
  border-radius: 24rpx;
  z-index: 101;
  overflow: hidden;
  box-shadow: 0 20rpx 40rpx rgba(0, 0, 0, 0.15);
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
  height: 60rpx;
  width: 60rpx;
  display: flex;
  align-items: center;
  justify-content: center;
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

.step-number-compressor {
  background-color: #9c5bd5;
}

.step-number-calculator {
  background-color: #5B7BD5;
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
  transition: transform 0.2s ease;
}

.start-button:active {
  transform: scale(0.98);
}

.compressor-button {
  background-color: #9c5bd5;
}

.calculator-button {
  background-color: #5B7BD5;
}
</style> 