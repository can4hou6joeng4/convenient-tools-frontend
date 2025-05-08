<script setup lang="ts">
import { ref, watch } from 'vue'
import { useParseUrl, type ParseResult } from '~/composables/useParseUrl'
import { useToast } from '~/composables/useToast'

const { isLoading, error, result, parseUrl } = useParseUrl()
const url = ref('')
const showResult = ref(false)
const toast = useToast()

const handleSubmit = async () => {
  if (!url.value) return
  
  showResult.value = false
  await parseUrl(url.value)
  
  if (error.value) {
    // 根据不同错误类型显示友好提示
    if (error.value.includes('解析失败')) {
      toast.error('无法解析该链接，请确认链接来源是否正确')
    } else if (error.value.includes('请求失败')) {
      toast.error('网络请求失败，请稍后再试')
    } else {
      toast.error(error.value)
    }
    return
  }
  
  if (result.value) {
    showResult.value = true
  }
}

const copyToClipboard = async (text: string) => {
  try {
    uni.setClipboardData({
      data: text,
      success: () => {
        toast.success('复制成功')
      },
      fail: () => {
        toast.error('复制失败')
      }
    })
  } catch (err) {
    console.error('复制失败:', err)
    toast.error('复制失败')
  }
}

const clearUrl = () => {
  url.value = ''
  showResult.value = false
  toast.info('已清空输入')
}

// 自动检测粘贴内容并解析
const handlePaste = async (e: ClipboardEvent) => {
  const clipboardText = e.clipboardData?.getData('text')
  if (clipboardText && (
    clipboardText.includes('v.douyin.com') || 
    clipboardText.includes('xhslink.com') || 
    clipboardText.includes('xiaohongshu.com') ||
    clipboardText.includes('ixigua.com')
  )) {
    // 如果是直接粘贴链接，自动开始解析
    url.value = clipboardText
    setTimeout(() => handleSubmit(), 100)
  }
}

// 监听url值变化，自动解析复制进来的链接
watch(url, (newVal) => {
  if (newVal && (
    newVal.includes('v.douyin.com') || 
    newVal.includes('xhslink.com') || 
    newVal.includes('xiaohongshu.com') ||
    newVal.includes('ixigua.com')
  )) {
    // 自动开始解析
    handleSubmit()
  }
}, { immediate: false })
</script>

<template>
  <div class="w-full max-w-3xl mx-auto">
    <div class="mb-6">
      <h2 class="text-2xl font-bold mb-4">内容解析工具</h2>
      <p class="text-gray-500 mb-4">支持解析抖音、小红书、西瓜视频等平台的分享链接，提取视频、图片等媒体资源</p>
      
      <form @submit.prevent="handleSubmit" class="flex gap-2">
        <div class="relative flex-1">
          <input
            v-model="url"
            type="text"
            placeholder="请输入或粘贴分享链接"
            class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            :disabled="isLoading"
            @paste="handlePaste"
          />
          <button
            v-if="url"
            type="button"
            @click="clearUrl"
            class="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            aria-label="清空"
          >
            <!-- 使用图片替代图标，确保小程序兼容性 -->
            <image src="/static/images/x-circle.svg" class="w-5 h-5" />
          </button>
        </div>
        <button
          v-if="!showResult || !url"
          type="submit"
          class="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50 flex items-center gap-2"
          :disabled="isLoading || !url"
        >
          <image v-if="isLoading" src="/static/images/spinner.svg" class="w-5 h-5 animate-spin" />
          <span v-if="isLoading">解析中...</span>
          <span v-else>解析</span>
        </button>
      </form>
    </div>
    
    <div v-if="isLoading" class="flex justify-center items-center py-12">
      <image src="/static/images/spinner.svg" class="w-8 h-8 animate-spin" />
      <span class="ml-3 text-gray-500">正在解析，请稍候...</span>
    </div>
    
    <div v-else-if="showResult && result" class="bg-gray-50 rounded-lg p-6">
      <div class="flex items-start gap-4 mb-6">
        <image 
          :src="result.author.avatar" 
          :alt="result.author.name"
          class="w-12 h-12 rounded-full"
          mode="aspectFill"
        />
        <div>
          <div class="font-bold">{{ result.author.name }}</div>
          <div class="text-sm text-gray-500">ID: {{ result.author.uid }}</div>
        </div>
      </div>
      
      <div class="mb-4">
        <div class="font-semibold mb-2">内容描述</div>
        <p class="text-gray-700">{{ result.title }}</p>
      </div>
      
      <!-- 视频内容 -->
      <div v-if="result.video_url" class="mb-4">
        <div class="font-semibold mb-2">视频</div>
        <div class="aspect-video mb-2 bg-black/5 rounded-lg overflow-hidden">
          <!-- 在小程序中使用video组件 -->
          <video 
            :src="result.video_url" 
            :poster="result.cover_url" 
            controls 
            class="w-full h-full"
            object-fit="contain"
          ></video>
        </div>
        <div class="flex justify-between">
          <button 
            @click="copyToClipboard(result.video_url)"
            class="text-sm text-primary flex items-center"
          >
            <image src="/static/images/copy.svg" class="w-4 h-4 mr-1" />
            复制视频链接
          </button>
          <button 
            @click="() => {
              uni.navigateTo({
                url: `/pages/webview?url=${encodeURIComponent(result.video_url)}`
              })
            }"
            class="text-sm text-primary flex items-center"
          >
            <image src="/static/images/external-link.svg" class="w-4 h-4 mr-1" />
            在新窗口打开
          </button>
        </div>
      </div>
      
      <!-- 图集内容 -->
      <div v-if="result.images && result.images.length > 0" class="mb-4">
        <div class="font-semibold mb-2">图片集 ({{ result.images.length }}张)</div>
        <div class="grid grid-cols-2 md:grid-cols-3 gap-2">
          <div 
            v-for="(image, index) in result.images" 
            :key="index"
            class="aspect-square rounded-lg overflow-hidden relative group"
          >
            <image 
              :src="image" 
              :alt="`图片 ${index + 1}`"
              class="w-full h-full"
              mode="aspectFill"
            />
            <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <button 
                @click="copyToClipboard(image)"
                class="text-white text-sm bg-primary/80 px-2 py-1 rounded"
              >
                复制链接
              </button>
              <button 
                @click="() => {
                  uni.previewImage({
                    urls: result.images,
                    current: image
                  })
                }"
                class="text-white text-sm bg-primary/80 px-2 py-1 rounded"
              >
                查看原图
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 音乐内容 -->
      <div v-if="result.music_url" class="mb-4">
        <div class="font-semibold mb-2">背景音乐</div>
        <!-- 小程序环境下使用自定义组件或内置组件 -->
        <audio 
          :src="result.music_url" 
          controls 
          class="w-full"
          name="背景音乐"
        ></audio>
        <button 
          @click="copyToClipboard(result.music_url)"
          class="text-sm text-primary mt-1 flex items-center"
        >
          <image src="/static/images/copy.svg" class="w-4 h-4 mr-1" />
          复制音乐链接
        </button>
      </div>
    </div>
  </div>
</template> 