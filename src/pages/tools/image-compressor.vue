<script setup lang="ts">
import { ref, computed } from 'vue'

// 图片状态管理
const originalImage = ref<string>('')
const compressedImage = ref<string>('')
const isCompressing = ref(false)
const compressionComplete = ref(false)
const originalSize = ref(0)
const compressedSize = ref(0)
const previewMode = ref<'original' | 'compressed'>('original')

// 压缩设置
const quality = ref(80)
const maxWidth = ref(1920)
const keepExif = ref(false)
const format = ref<'auto' | 'jpg' | 'png' | 'webp' | 'heic' | 'bmp' | 'tiff'>('auto')

// 格式选项
const formatOptions = [
  { value: 'auto', label: '自动' },
  { value: 'jpg', label: 'JPG' },
  { value: 'png', label: 'PNG' },
  { value: 'webp', label: 'WebP' },
  { value: 'heic', label: 'HEIC' },
  { value: 'bmp', label: 'BMP' },
  { value: 'tiff', label: 'TIFF' }
]

// 处理滑块变化事件
const handleQualityChange = (e: any) => {
  quality.value = e.detail.value
}

const handleWidthChange = (e: any) => {
  maxWidth.value = e.detail.value
}

// 处理格式选择
const handleFormatChange = (e: any) => {
  format.value = e.detail.value
}

// 计算压缩率
const compressionRate = computed(() => {
  if (originalSize.value > 0 && compressedSize.value > 0) {
    const rate = ((originalSize.value - compressedSize.value) / originalSize.value) * 100
    return rate.toFixed(1)
  }
  return '0'
})

// 选择图片
const chooseImage = () => {
  uni.chooseImage({
    count: 1,
    sizeType: ['original'],
    sourceType: ['album', 'camera'],
    success: (res) => {
      // 重置状态
      compressionComplete.value = false
      compressedImage.value = ''
      compressedSize.value = 0
      
      // 获取原图信息
      const tempFilePath = res.tempFilePaths[0]
      originalImage.value = tempFilePath
      
      // 获取原图大小
      const fsManager = uni.getFileSystemManager()
      fsManager.getFileInfo({
        filePath: tempFilePath,
        success: (fileInfo) => {
          originalSize.value = fileInfo.size
        },
        fail: (err) => {
          console.error('获取文件信息失败:', err)
        }
      })
    }
  })
}

// 压缩图片
const compressImage = async () => {
  if (!originalImage.value) return
  
  isCompressing.value = true
  
  try {
    // 使用uni.compressImage进行压缩
    const result = await new Promise<UniApp.CompressImageSuccessResult>((resolve, reject) => {
      uni.compressImage({
        src: originalImage.value,
        quality: quality.value,
        success: resolve,
        fail: reject
      })
    })
    
    compressedImage.value = result.tempFilePath
    
    // 获取压缩后文件大小
    const fsManager = uni.getFileSystemManager()
    const fileInfo = await new Promise<{size: number}>((resolve, reject) => {
      fsManager.getFileInfo({
        filePath: result.tempFilePath,
        success: (res) => resolve(res),
        fail: (err) => {
          console.error('获取压缩后文件信息失败:', err)
          reject(err)
        }
      })
    })
    
    compressedSize.value = fileInfo.size
    compressionComplete.value = true
    previewMode.value = 'compressed'
    
    // 显示成功提示
    uni.showToast({
      title: '压缩成功',
      icon: 'success'
    })
  } catch (error) {
    console.error('压缩失败:', error)
    uni.showToast({
      title: '压缩失败',
      icon: 'none'
    })
  } finally {
    isCompressing.value = false
  }
}

// 保存图片到相册
const saveToAlbum = () => {
  if (!compressedImage.value) return
  
  uni.saveImageToPhotosAlbum({
    filePath: compressedImage.value,
    success: () => {
      uni.showToast({
        title: '保存成功',
        icon: 'success'
      })
    },
    fail: (err) => {
      console.error('保存失败:', err)
      uni.showToast({
        title: '保存失败',
        icon: 'none'
      })
    }
  })
}

// 格式化文件大小
const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 B'
  
  const units = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return (bytes / Math.pow(1024, i)).toFixed(2) + ' ' + units[i]
}
</script>

<template>
  <view class="container">
    <!-- 图片压缩工具面板 -->
    <view class="tool-panel">
      <!-- 图片选择区域 -->
      <view class="select-area">
        <view class="section-title">图片压缩工具</view>
        <button 
          @tap="chooseImage" 
          class="upload-btn"
          :disabled="isCompressing"
        >
          <image src="/static/images/upload.svg" class="btn-icon" />
          <text>{{ originalImage ? '重新选择图片' : '选择图片' }}</text>
        </button>
        
        <text v-if="!originalImage" class="tip-text">支持JPG、PNG、WebP等格式，最大支持10MB</text>
      </view>
      
      <!-- 原图预览 -->
      <view v-if="originalImage" class="preview-section">
        <view class="preview-header">
          <text class="section-title">图片预览</text>
          <view class="tab-buttons">
            <view 
              @tap="previewMode = 'original'" 
              :class="['tab-btn', previewMode === 'original' ? 'tab-btn-active' : '']"
            >
              <text>原图</text>
            </view>
            <view 
              @tap="previewMode = 'compressed'" 
              :class="['tab-btn', previewMode === 'compressed' ? 'tab-btn-active' : '', !compressedImage ? 'tab-btn-disabled' : '']"
              :disabled="!compressedImage"
            >
              <text>压缩后</text>
            </view>
          </view>
        </view>
        
        <view class="image-container">
          <image 
            :src="previewMode === 'original' ? originalImage : (compressedImage || originalImage)" 
            mode="aspectFit"
            class="preview-image" 
          />
        </view>
        
        <!-- 图片信息 -->
        <view class="info-cards">
          <view class="info-card">
            <text class="info-label">原图大小</text>
            <text class="info-value">{{ formatFileSize(originalSize) }}</text>
          </view>
          <view class="info-card">
            <text class="info-label">压缩后大小</text>
            <text class="info-value">{{ compressedSize ? formatFileSize(compressedSize) : '-' }}</text>
          </view>
          <view class="info-card">
            <text class="info-label">压缩率</text>
            <text class="info-value success-text">{{ compressionComplete ? compressionRate + '%' : '-' }}</text>
          </view>
        </view>
        
        <!-- 压缩设置 -->
        <view class="settings-section">
          <text class="section-title section-subtitle">压缩设置</text>
          
          <view class="setting-item">
            <view class="setting-header">
              <text class="setting-label">图片质量: {{ quality }}%</text>
            </view>
            <slider 
              :value="quality" 
              @change="handleQualityChange" 
              min="30" 
              max="100" 
              step="5"
              class="slider"
              activeColor="#4a90e2"
              backgroundColor="#E0E0E0"
              block-size="20"
            />
            <view class="slider-labels">
              <text class="slider-label-min">低质量</text>
              <text class="slider-label-max">高质量</text>
            </view>
          </view>
          
          <view class="setting-item">
            <view class="setting-header">
              <text class="setting-label">最大宽度: {{ maxWidth }}px</text>
            </view>
            <slider 
              :value="maxWidth" 
              @change="handleWidthChange" 
              min="800" 
              max="3840" 
              step="160"
              class="slider"
              activeColor="#4a90e2"
              backgroundColor="#E0E0E0"
              block-size="20"
            />
            <view class="slider-labels">
              <text class="slider-label-min">800px</text>
              <text class="slider-label-max">3840px</text>
            </view>
          </view>
          
          <view class="setting-item format-section">
            <text class="setting-label block">输出格式</text>
            <picker 
              mode="selector" 
              :range="formatOptions" 
              range-key="label"
              :value="formatOptions.findIndex(item => item.value === format)"
              @change="handleFormatChange"
              class="format-picker"
            >
              <view class="picker-view">
                <text>{{ formatOptions.find(item => item.value === format)?.label }}</text>
                <text class="picker-arrow">▼</text>
              </view>
            </picker>
          </view>
          
          <view class="checkbox-item">
            <checkbox 
              :checked="keepExif"
              @tap="keepExif = !keepExif"
              color="#4a90e2"
            />
            <text class="checkbox-label" @tap="keepExif = !keepExif">保留EXIF信息(GPS、相机参数等)</text>
          </view>
        </view>
      </view>
      
      <!-- 加载中状态 -->
      <view class="loading-container" v-if="isCompressing" :style="{ display: isCompressing ? 'flex' : 'none' }">
        <view class="loading-spinner"></view>
        <text class="loading-text">正在压缩图片，请稍候...</text>
      </view>
      
      <!-- 操作按钮区域 -->
      <view v-if="originalImage && !isCompressing" class="action-buttons">
        <button 
          @tap="compressImage" 
          class="compress-button"
          :class="{'compress-button-active': !isCompressing}"
          :disabled="isCompressing"
        >
          <image src="/static/images/compress.svg" class="btn-icon" />
          <text>压缩图片</text>
        </button>
        
        <button 
          v-if="compressedImage"
          @tap="saveToAlbum" 
          class="save-button"
        >
          <image src="/static/images/download.svg" class="btn-icon" />
          <text>保存到相册</text>
        </button>
      </view>
    </view>
    
    <!-- 使用说明 -->
    <view class="help-section">
      <text class="section-title">使用说明</text>
      <view class="help-list">
        <view class="help-item">
          <text class="help-text">• 支持JPG、PNG、WebP等常见图片格式</text>
        </view>
        <view class="help-item">
          <text class="help-text">• 压缩过程在本地完成，不会上传您的图片</text>
        </view>
        <view class="help-item">
          <text class="help-text">• 照片类图片推荐使用JPG格式，质量设置70%-85%</text>
        </view>
        <view class="help-item">
          <text class="help-text">• 带有透明背景的图片请选择PNG格式</text>
        </view>
        <view class="help-item">
          <text class="help-text">• WebP格式在保持相同画质的情况下通常有更小的文件体积</text>
        </view>
      </view>
    </view>
  </view>
</template>

<style>
page {
  background-color: #f5f5f5;
}

.container {
  padding: 20rpx 20rpx;
  box-sizing: border-box;
  max-width: 98%;
  margin: 0 auto;
}

.tool-panel {
  background-color: #ffffff;
  padding: 30rpx;
  margin-bottom: 30rpx;
  border-radius: 16rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
}

.section-title {
  font-size: 32rpx;
  font-weight: 500;
  color: #333;
  margin-bottom: 24rpx;
}

.section-subtitle {
  margin-top: 30rpx;
  margin-bottom: 20rpx;
  font-size: 30rpx;
}

.select-area {
  margin-bottom: 30rpx;
}

.upload-btn {
  background-color: #f5f5f5;
  border-radius: 12rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20rpx;
  width: 100%;
  border: 1rpx dashed #ccc;
  margin-bottom: 20rpx;
}

.btn-icon {
  width: 40rpx;
  height: 40rpx;
  margin-right: 10rpx;
}

.tip-text {
  font-size: 26rpx;
  color: #999;
  text-align: center;
  display: block;
}

.preview-section {
  margin-bottom: 30rpx;
}

.preview-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20rpx;
}

.tab-buttons {
  display: flex;
}

.tab-btn {
  padding: 10rpx 20rpx;
  border-radius: 8rpx;
  font-size: 26rpx;
  margin-left: 10rpx;
  background-color: #f0f0f0;
  color: #666;
}

.tab-btn-active {
  background-color: #4a90e2;
  color: #FFFFFF;
}

.tab-btn-disabled {
  opacity: 0.5;
}

.image-container {
  background-color: #f7f7f7;
  border-radius: 10rpx;
  overflow: hidden;
  display: flex;
  justify-content: center;
  margin-bottom: 20rpx;
}

.preview-image {
  width: 100%;
  height: 400rpx;
  object-fit: contain;
}

.info-cards {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20rpx;
}

.info-card {
  flex: 1;
  background-color: #f5f5f5;
  padding: 16rpx;
  border-radius: 8rpx;
  margin: 0 6rpx;
  text-align: center;
}

.info-label {
  font-size: 24rpx;
  color: #999;
  display: block;
  margin-bottom: 6rpx;
}

.info-value {
  font-size: 28rpx;
  color: #333;
  font-weight: 500;
}

.success-text {
  color: #28a745;
}

.settings-section {
  background-color: #f9f9f9;
  border-radius: 12rpx;
  padding: 20rpx;
  margin-bottom: 30rpx;
}

.setting-item {
  margin-bottom: 20rpx;
}

.setting-header {
  margin-bottom: 10rpx;
}

.setting-label {
  font-size: 28rpx;
  color: #555;
}

.block {
  display: block;
  margin-bottom: 10rpx;
}

.slider {
  margin: 15rpx 0;
}

.slider-labels {
  display: flex;
  justify-content: space-between;
  font-size: 22rpx;
  color: #999;
}

.checkbox-item {
  display: flex;
  align-items: center;
  margin-top: 20rpx;
}

.checkbox-label {
  font-size: 28rpx;
  color: #555;
  margin-left: 10rpx;
}

.format-section {
  margin-bottom: 10rpx;
}

.format-picker {
  background-color: #f0f0f0;
  border-radius: 8rpx;
  padding: 0 20rpx;
}

.picker-view {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 80rpx;
}

.picker-arrow {
  font-size: 24rpx;
  color: #999;
}

/* 压缩按钮样式 */
.compress-button {
  width: 85%;
  height: 88rpx;
  line-height: 88rpx;
  background-color: #cccccc;
  color: #ffffff;
  font-size: 32rpx;
  font-weight: 500;
  border-radius: 44rpx;
  margin: 20rpx auto;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4rpx 10rpx rgba(0, 0, 0, 0.05);
}

.compress-button-active {
  background-color: #4a90e2;
}

/* 保存按钮样式 */
.save-button {
  width: 85%;
  height: 88rpx;
  line-height: 88rpx;
  background-color: #28a745;
  color: #ffffff;
  font-size: 32rpx;
  font-weight: 500;
  border-radius: 44rpx;
  margin: 20rpx auto;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4rpx 10rpx rgba(0, 0, 0, 0.05);
}

.action-buttons {
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* 加载中状态样式 */
.loading-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.loading-spinner {
  width: 80rpx;
  height: 80rpx;
  border: 4rpx solid #fff;
  border-top: 4rpx solid #4a90e2;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.loading-text {
  color: #fff;
  font-size: 28rpx;
  margin-top: 20rpx;
}

.help-section {
  background-color: #ffffff;
  border-radius: 16rpx;
  padding: 30rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
  margin-bottom: 30rpx;
}

.help-list {
  margin-bottom: 20rpx;
}

.help-item {
  margin-bottom: 16rpx;
}

.help-text {
  font-size: 26rpx;
  color: #666;
  line-height: 1.8;
}
</style> 