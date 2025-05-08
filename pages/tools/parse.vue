<script setup lang="ts">
useHead({
  title: '内容解析工具 - 便捷工具集',
  meta: [
    { name: 'description', content: '解析抖音、小红书、西瓜视频等平台的分享链接，提取视频、图片等媒体资源' }
  ]
})
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-6">内容解析工具</h1>
    <UrlParser />
    
    <div class="mt-12 bg-gray-50 rounded-lg p-6">
      <h2 class="text-xl font-bold mb-4">使用说明</h2>
      <ul class="list-disc pl-5 space-y-2">
        <li>支持解析抖音、小红书、西瓜视频等平台的分享链接</li>
        <li>可直接粘贴完整分享文案，工具会自动识别其中的链接</li>
        <li>支持解析视频、图集等多种媒体内容</li>
        <li>解析后可直接复制资源链接或在线预览</li>
      </ul>
      
      <h3 class="text-lg font-bold mt-6 mb-2">支持的平台</h3>
      <ul class="list-disc pl-5 space-y-1">
        <li>抖音（域名：v.douyin.com、www.iesdouyin.com、www.douyin.com）</li>
        <li>西瓜视频（域名：v.ixigua.com）</li>
        <li>小红书（域名：www.xiaohongshu.com、xhslink.com）</li>
      </ul>
    </div>
  </div>
</template> 