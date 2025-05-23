<template>
  <view class="container">
    <!-- 输入部分 -->
    <view class="input-platform-section">
      <view class="section-title">输入链接</view>
      <view class="input-box">
        <input 
          class="link-input" 
          type="text" 
          v-model="linkUrl" 
          placeholder="请粘贴小红书、抖音等平台的分享链接" 
          placeholder-class="input-placeholder"
          :disabled="isLoading"
        />
        <view v-if="linkUrl" class="clear-icon" @tap="clearInput">×</view>
      </view>
    </view>
    
    <!-- 解析按钮，在有结果时隐藏 -->
    <button 
      v-if="!parseResult"
      class="parse-button" 
      :class="{'parse-button-active': linkUrl && !isLoading}" 
      :disabled="isLoading || !linkUrl"
      @tap="parseLink"
    >
      <text v-if="isLoading">解析中...</text>
      <text v-else>开始解析</text>
    </button>
    
    <!-- 加载中状态 - 使用内联样式确保其隐藏 -->
    <view class="loading-container" v-if="isLoading" :style="{ display: isLoading ? 'flex' : 'none' }">
      <view class="loading-spinner"></view>
      <text class="loading-text">正在解析链接，请稍候...</text>
    </view>
    
    <!-- 解析结果 - 确保在loading状态下不显示 -->
    <view class="result-section" v-if="parseResult && !isLoading">
      <!-- 文本内容 -->
      <view class="content-card">
        <view class="content-header">
          <view class="avatar-wrapper">
            <image 
              class="avatar" 
              :src="getProxyUrl(parseResult.authorAvatar || '/static/icons/avatar.svg', 'image')" 
              mode="aspectFill"
              @tap="previewImage(parseResult.authorAvatar || '/static/icons/avatar.svg', parseResult.images.map(img => img.url))"
              @longpress="saveImageToAlbum(parseResult.authorAvatar || '/static/icons/avatar.svg')"
            ></image>
          </view>
          <view class="author-content-wrapper">
            <view class="author-name-wrapper">
              <view class="content-title">{{ parseResult.authorName }}</view>
              <view class="copy-btn" @tap="copyText(parseResult.authorName)" title="复制作者名">
                <image src="/static/images/copy.svg" class="copy-icon-img" mode="aspectFit"></image>
              </view>
            </view>
            
            <view class="content-body" v-if="parseResult.title && parseResult.title.trim()">
              <text>{{ parseResult.title }}</text>
              <view class="copy-btn" @tap="copyText(parseResult.title)" title="复制内容">
                <image src="/static/images/copy.svg" class="copy-icon-img" mode="aspectFit"></image>
              </view>
            </view>
          </view>
        </view>
      </view>
      
      <!-- 图片结果 -->
      <view class="image-result" v-if="parseResult.images && parseResult.images.length > 0">
        <view class="image-header">
          <text>共找到 {{ parseResult.images.length }} 张图片</text>
          <text class="select-all" @tap="selectAllImages">{{ allImagesSelected ? '全不选' : '全选' }}</text>
        </view>
        
        <view class="image-grid">
          <view 
            class="image-item" 
            v-for="(image, index) in parseResult.images" 
            :key="index"
          >
            <image 
              class="result-image" 
              :src="getProxyUrl(image.url, 'image')" 
              mode="aspectFill"
              @tap="previewImage(image.url, parseResult.images.map(img => img.url))"
              @longpress="saveImageToAlbum(image.url)"
            ></image>
            <view class="image-select" @tap="toggleImageSelect(index)">
              <view class="select-circle" :class="{'selected': image.selected}"></view>
            </view>
          </view>
        </view>
        
        <!-- 批量保存按钮 -->
        <view class="batch-save" v-if="hasSelectedImages" @tap="saveSelectedImages">
          <text>保存选中图片</text>
        </view>
      </view>
      
      <!-- 视频结果 -->
      <view class="video-result" v-if="parseResult.videos && parseResult.videos.length > 0">
        <view class="video-header">
          <text>共找到 {{ parseResult.videos.length }} 个视频</text>
        </view>
        
        <view class="video-list">
          <view 
            class="video-item" 
            v-for="(video, index) in parseResult.videos" 
            :key="index"
          >
            <video 
              class="result-video" 
              :src="getProxyUrl(video.url, 'video')" 
              controls
              object-fit="cover"
              :poster="getProxyUrl(video.cover, 'image')"
            ></video>
            <view class="video-info">
              <text class="video-title">{{ video.title || `视频${index + 1}` }}</text>
              <view class="save-video-btn" @tap="saveVideoToAlbum(video.url)">保存视频</view>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      linkUrl: '',
      parseResult: null,
      isLoading: false,
      platform: '',
      baseProxyUrl: 'https://tools.bobochang.cn/api/tools/media-proxy'
    };
  },
  onLoad() {
    // 检测当前运行环境
    // #ifdef MP-WEIXIN
    this.platform = 'mp-weixin';
    console.log('当前运行在微信小程序环境');
    // #endif
    
    // #ifdef H5
    this.platform = 'h5';
    console.log('当前运行在H5环境');
    // #endif
    
    // #ifdef APP-PLUS
    this.platform = 'app';
    console.log('当前运行在App环境');
    // #endif
  },
  computed: {
    hasSelectedImages() {
      return this.parseResult && 
             this.parseResult.images && 
             this.parseResult.images.some(img => img.selected);
    },
    allImagesSelected() {
      return this.parseResult && 
             this.parseResult.images && 
             this.parseResult.images.length > 0 &&
             this.parseResult.images.every(img => img.selected);
    }
  },
  methods: {
    clearInput() {
      this.linkUrl = '';
      this.parseResult = null;
      
      // 添加清空成功的提示
      uni.showToast({
        title: '已清空',
        icon: 'none',
        duration: 1500
      });
    },
    async parseLink() {
      if (!this.linkUrl) {
        uni.showToast({
          title: '请输入链接',
          icon: 'none'
        });
        return;
      }
      
      this.isLoading = true;
      
      // 显示加载提示
      try {
        uni.showLoading({
          title: '解析中...',
          mask: true // 添加遮罩，防止用户重复点击
        });
        
        // 使用uni.request替代fetch
        let result = null;
        await new Promise((resolve, reject) => {
          // 始终使用完整URL，解决小程序环境的问题
          const baseUrl = 'https://tools.bobochang.cn';
          const apiUrl = baseUrl + '/api/tools/parse';
          
          console.log('发起请求到:', apiUrl);
          
          uni.request({
            url: apiUrl,
            method: 'POST',
            data: { url: this.linkUrl },
            header: {
              'content-type': 'application/json'
            },
            // 添加超时设置
            timeout: 10000, // 10秒超时
            // 允许小程序请求参数
            withCredentials: false,
            success: (res) => {
              console.log('请求成功，返回数据:', res);
              
              if (res.statusCode !== 200) {
                reject(new Error('服务器响应异常: ' + res.statusCode));
                return;
              }
              
              const data = res.data;
              
              if (data.status === 'fail') {
                reject(new Error(data.message || '解析失败'));
                return;
              }
              
              // 处理API返回的数据
              result = this.formatApiResult(data.data);
              if (!result) {
                reject(new Error('解析结果为空'));
                return;
              }
              
              resolve();
            },
            fail: (err) => {
              console.error('网络请求失败详情:', err);
              reject(new Error('网络请求失败'));
            }
          });
        });
        
        if (result) {
          this.parseResult = result;
          console.log('成功设置解析结果:', this.parseResult);
        }
      } catch (error) {
        console.error('解析链接失败:', error);
        
        // 显示更友好的错误提示
        let errorMessage = '解析失败，请检查链接是否正确';
        
        if (error.message && error.message.includes('服务器响应异常')) {
          errorMessage = '服务器暂时无法响应，请稍后再试';
        } else if (error.message && error.message.includes('网络请求失败')) {
          errorMessage = '网络连接失败，请检查网络设置';
        }
        
        uni.showToast({
          title: errorMessage,
          icon: 'none',
          duration: 3000
        });
      } finally {
        // 无论成功或失败，确保loading状态被清除
        this.isLoading = false;
        
        // 确保一定会隐藏loading，使用setTimeout确保UI更新
        setTimeout(() => {
          uni.hideLoading();
        }, 100);
        
        console.log('解析过程结束，loading状态:', this.isLoading);
      }
    },
    
    // 添加获取代理URL的方法
    getProxyUrl(originalUrl, type = 'video') {
      if (!originalUrl) return '';
      
      // 如果已经是代理URL，直接返回
      if (originalUrl.includes('/api/tools/media-proxy')) {
        return originalUrl;
      }
      
      return `${this.baseProxyUrl}?url=${encodeURIComponent(originalUrl)}&type=${type}`;
    },
    
    // 格式化API返回的结果
    formatApiResult(apiResult) {
      console.log('原始API返回数据:', apiResult);
      
      // 确保apiResult不为空
      if (!apiResult) {
        console.error('API返回结果为空');
        return null;
      }
      
      // 构建页面需要的数据结构
      const pageResult = {
        title: apiResult.title || '',
        content: [apiResult.title || ''],
        authorAvatar: apiResult.author?.avatar || '',
        authorName: apiResult.author?.name || '',
        authorUid: apiResult.author?.uid || '',
        images: [],
        videos: []
      };
      
      // 处理图片
      if (apiResult.images && apiResult.images.length > 0) {
        pageResult.images = apiResult.images.map(url => ({
          url,
          selected: false
        }));
      }
      
      // 处理视频
      if (apiResult.video_url) {
        pageResult.videos.push({
          url: apiResult.video_url,
          title: apiResult.title || '',
          cover: apiResult.cover_url || ''
        });
        console.log('添加视频数据:', pageResult.videos);
      }
      
      console.log('格式化后的结果:', pageResult);
      return pageResult;
    },
    
    copyText(text) {
      uni.setClipboardData({
        data: text,
        success: () => {
          uni.showToast({
            title: '复制成功',
            icon: 'success'
          });
        }
      });
    },
    
    // 预览图片
    previewImage(currentImage, urls) {
      if (!currentImage) return;
      
      // 确保所有图片URL都是有效的
      let imageUrls = [];
      
      if (urls && Array.isArray(urls)) {
        // 过滤掉可能的空值，并添加代理URL
        imageUrls = urls.filter(url => !!url).map(url => this.getProxyUrl(url, 'image'));
      } else {
        // 单张图片情况
        imageUrls = [this.getProxyUrl(currentImage, 'image')];
      }
      
      // 确保至少有一张图片
      if (imageUrls.length === 0) {
        imageUrls = [this.getProxyUrl(currentImage, 'image')];
      }
      
      // 获取当前图片的代理URL
      const currentImageProxy = this.getProxyUrl(currentImage, 'image');
      
      // 简化预览配置，减少可能的问题
      uni.previewImage({
        current: currentImageProxy,
        urls: imageUrls
      });
    },
    
    toggleImageSelect(index) {
      if (this.parseResult && this.parseResult.images) {
        this.parseResult.images[index].selected = !this.parseResult.images[index].selected;
      }
    },
    selectAllImages() {
      if (this.parseResult && this.parseResult.images) {
        const shouldSelect = !this.allImagesSelected;
        this.parseResult.images.forEach(img => {
          img.selected = shouldSelect;
        });
      }
    },
    // 检查相册权限
    checkPhotoAlbumAuth() {
      return new Promise((resolve, reject) => {
        // 在小程序环境下
        // #ifdef MP-WEIXIN
        uni.getSetting({
          success: (res) => {
            console.log('获取设置结果:', res.authSetting);
            
            if (res.authSetting['scope.writePhotosAlbum']) {
              // 已授权
              resolve(true);
            } else {
              // 没有授权，直接请求
              uni.authorize({
                scope: 'scope.writePhotosAlbum',
                success: () => {
                  resolve(true);
                },
                fail: (err) => {
                  console.error('授权失败:', err);
                  
                  // 用户拒绝授权，引导打开设置页
                  if (err.errMsg && err.errMsg.includes('auth deny')) {
                    uni.showModal({
                      title: '提示',
                      content: '保存到相册需要您授权，是否去设置？',
                      confirmText: '去设置',
                      cancelText: '取消',
                      success: (modal) => {
                        if (modal.confirm) {
                          uni.openSetting({
                            success: (setting) => {
                              if (setting.authSetting['scope.writePhotosAlbum']) {
                                resolve(true);
                              } else {
                                reject('用户未授权');
                              }
                            },
                            fail: () => {
                              reject('打开设置页失败');
                            }
                          });
                        } else {
                          reject('用户取消授权');
                        }
                      }
                    });
                  } else {
                    reject('授权失败');
                  }
                }
              });
            }
          },
          fail: () => {
            reject('获取设置失败');
          }
        });
        // #endif
        
        // 非小程序环境下直接返回true
        // #ifndef MP-WEIXIN
        resolve(true);
        // #endif
      });
    },
    
    // 通过代理下载媒体文件
    downloadMediaViaProxy(originalUrl, mediaType = 'video') {
      // 检查URL是否有效
      if (!originalUrl || !originalUrl.startsWith('http')) {
        return Promise.reject(new Error('无效的媒体文件链接'));
      }
      
      // 构建代理URL - 使用已有的后端接口
      const baseUrl = 'https://tools.bobochang.cn';
      // 添加时间戳避免缓存问题
      const timestamp = new Date().getTime();
      const proxyUrl = `${baseUrl}/api/tools/media-proxy?url=${encodeURIComponent(originalUrl)}&type=${mediaType}&t=${timestamp}`;
      
      console.log(`使用代理下载${mediaType}:`, proxyUrl);
      
      return new Promise((resolve, reject) => {
        // 下载前增加请求头控制
        const downloadTask = uni.downloadFile({
          url: proxyUrl,
          // 增加超时时间
          timeout: 60000,
          // 增加请求头
          header: {
            'Accept': mediaType === 'video' ? 'video/mp4' : 'image/*',
            'Cache-Control': 'no-cache'
          },
          success: (res) => {
            // 根据接口文档，成功时的状态码应为200
            if (res.statusCode === 200) {
              console.log(`通过代理下载${mediaType}成功:`, res.tempFilePath);
              
              // 特别处理视频文件
              if (mediaType === 'video') {
                // 检查文件扩展名
                if (!res.tempFilePath.toLowerCase().endsWith('.mp4')) {
                  console.warn('视频文件扩展名不是.mp4，这可能导致在小程序中保存失败');
                  
                  // #ifdef MP-WEIXIN
                  // 尽管我们不能修改文件名，但可以添加警告日志
                  console.warn('警告：微信小程序需要MP4格式的视频文件才能保存到相册');
                  // #endif
                }
              }
              
              resolve(res.tempFilePath);
            } else {
              // 非200状态码表示错误
              console.error(`通过代理下载${mediaType}失败，状态码:`, res.statusCode);
              
              let errorMsg = '下载失败';
              // 尝试解析错误信息
              try {
                if (res.data) {
                  const errorData = JSON.parse(res.data);
                  if (errorData.error) {
                    errorMsg = errorData.error;
                  }
                }
              } catch (e) {
                console.error('解析错误信息失败:', e);
              }
              
              reject(new Error(`下载失败: ${errorMsg}`));
            }
          },
          fail: (err) => {
            console.error(`通过代理下载${mediaType}失败:`, err);
            
            // 添加针对微信小程序不同错误类型的处理
            let errorMsg = '下载失败，请稍后再试';
            
            if (err.errMsg) {
              if (err.errMsg.includes('abort')) {
                errorMsg = '下载已取消';
              } else if (err.errMsg.includes('timeout')) {
                errorMsg = '下载超时，请检查网络连接';
              } else if (err.errMsg.includes('domain') || err.errMsg.includes('域名')) {
                errorMsg = '域名校验失败，请确保域名已正确配置';
              }
            }
            
            reject(new Error(errorMsg));
          }
        });
        
        // 监听下载进度
        downloadTask.onProgressUpdate((res) => {
          console.log(`下载进度: ${res.progress}%`);
          // 下载超过一半时更新loading提示
          if (res.progress > 50) {
            uni.showLoading({
              title: `下载中 ${res.progress}%`,
              mask: true
            });
          }
        });
      });
    },
    
    // 保存单张图片到相册 - 使用媒体代理服务
    saveImageToAlbum(imageUrl) {
      uni.showLoading({
        title: '保存中...',
        mask: true
      });
      
      // 添加调试日志
      console.log('开始保存图片，原始URL:', imageUrl);
      
      // 检查图片URL格式
      if (imageUrl && !(/\.(jpg|jpeg|png|gif|webp)$/i.test(imageUrl))) {
        console.warn('图片URL不是常见图片格式，保存可能失败');
        // 仍然继续尝试，因为代理可能会处理格式
      }
      
      this.checkPhotoAlbumAuth()
        .then(() => {
          console.log('相册权限已获取，开始下载图片');
          // 使用代理下载替代直接下载
          return this.downloadMediaViaProxy(imageUrl, 'image');
        })
        .then((tempFilePath) => {
          console.log('图片下载成功，临时路径:', tempFilePath);
          
          // 检查文件是否存在
          return new Promise((resolve, reject) => {
            // #ifdef MP-WEIXIN
            uni.getFileInfo({
              filePath: tempFilePath,
              success: (fileInfo) => {
                console.log('文件信息:', fileInfo);
                if (fileInfo.size <= 0) {
                  reject(new Error('下载的图片文件大小为0'));
                  return;
                }
                resolve(tempFilePath);
              },
              fail: (err) => {
                console.error('获取文件信息失败:', err);
                reject(new Error('无法获取图片文件信息'));
              }
            });
            // #endif
            
            // #ifndef MP-WEIXIN
            resolve(tempFilePath);
            // #endif
          });
        })
        .then((tempFilePath) => {
          // 获取系统信息
          return new Promise((resolve, reject) => {
            // 获取系统信息用于调试
            uni.getSystemInfo({
              success: (sysInfo) => {
                console.log('系统信息:', JSON.stringify(sysInfo));
                resolve({tempFilePath, sysInfo});
              },
              fail: () => {
                // 获取系统信息失败仍然继续
                resolve({tempFilePath, sysInfo: null});
              }
            });
          });
        })
        .then(({tempFilePath, sysInfo}) => {
          // 保存到相册
          console.log('开始将图片保存到相册');
          return new Promise((resolve, reject) => {
            uni.saveImageToPhotosAlbum({
              filePath: tempFilePath,
              success: (res) => {
                console.log('保存图片到相册成功:', res);
                resolve(res);
              },
              fail: (err) => {
                console.error('保存图片到相册失败:', err);
                console.error('错误详情:', JSON.stringify(err));
                
                // 尝试分析更详细的错误原因
                let errorDetail = '';
                let platformInfo = sysInfo ? `${sysInfo.platform} ${sysInfo.system}` : '未知平台';
                
                if (err.errMsg) {
                  errorDetail = err.errMsg;
                  console.error(`在 ${platformInfo} 上保存失败: ${errorDetail}`);
                  
                  // 检查特定错误类型
                  if (err.errMsg.includes('file not exist')) {
                    errorDetail = '文件不存在';
                  } else if (err.errMsg.includes('fail permission denied')) {
                    errorDetail = '权限被拒绝';
                  } else if (err.errMsg.includes('fail invalid file')) {
                    errorDetail = '无效的文件格式';
                  } else if (err.errMsg.includes('fail system denied')) {
                    errorDetail = '系统拒绝访问';
                  } else if (err.errMsg.includes('fail network')) {
                    errorDetail = '网络错误';
                  }
                }
                
                reject(new Error(`保存图片失败: ${errorDetail}`));
              }
            });
          });
        })
        .then(() => {
          uni.hideLoading();
          uni.showToast({
            title: '保存成功',
            icon: 'success'
          });
        })
        .catch((err) => {
          console.error('图片保存流程错误:', err);
          uni.hideLoading();
          
          // 根据错误类型显示不同提示
          let errorMessage = '保存失败，请重试';
          
          if (err && err.message) {
            if (err.message.includes('域名校验失败')) {
              // 域名校验错误
              uni.showModal({
                title: '提示',
                content: '图片保存功能需要在小程序后台配置合法域名，请联系管理员。',
                showCancel: false
              });
              return;
            } else if (err.message.includes('下载超时')) {
              errorMessage = '下载超时，请检查网络连接';
            } else if (err.message.includes('无效的媒体文件链接')) {
              errorMessage = '无效的图片链接';
            } else if (err.message.includes('无效的文件格式')) {
              errorMessage = '图片格式不支持';
              // 显示更详细的提示
              uni.showModal({
                title: '格式不支持',
                content: '该图片格式不受支持，请尝试其他图片或长按图片保存。',
                showCancel: false
              });
              return;
            } else if (err.message.includes('文件不存在')) {
              errorMessage = '图片文件不存在或已过期';
            } else if (err.message.includes('权限被拒绝')) {
              errorMessage = '保存权限被拒绝';
              // 引导用户重新授权
              uni.showModal({
                title: '权限提示',
                content: '保存图片需要相册权限，是否前往设置开启权限？',
                confirmText: '去设置',
                success: (res) => {
                  if (res.confirm) {
                    uni.openSetting();
                  }
                }
              });
              return;
            } else if (err.message.includes('系统拒绝访问')) {
              errorMessage = '系统拒绝访问相册';
              uni.showModal({
                title: '系统限制',
                content: '系统拒绝保存图片，请检查手机存储空间或隐私设置。',
                showCancel: false
              });
              return;
            } else {
              // 使用原始错误消息
              errorMessage = err.message;
            }
          } else if (err && err.errMsg) {
            if (err.errMsg.includes('cancel')) {
              errorMessage = '用户取消了保存';
            } else if (err.errMsg.includes('fail auth')) {
              errorMessage = '未获得保存到相册的授权';
            } else {
              errorMessage = err.errMsg;
            }
          }
          
          uni.showToast({
            title: errorMessage,
            icon: 'none',
            duration: 2500
          });
        });
    },
    
    // 批量保存图片 - 修改为顺序使用代理下载
    saveSelectedImages() {
      if (!this.hasSelectedImages) return;
      
      const selectedImages = this.parseResult.images
        .filter(img => img.selected)
        .map(img => img.url);
      
      if (selectedImages.length === 0) return;
      
      uni.showLoading({
        title: '准备保存...'
      });
      
      this.checkPhotoAlbumAuth()
        .then(() => {
          uni.hideLoading();
          
          // 使用Promise队列逐个下载并保存
          this.saveImagesWithProxy(selectedImages);
        })
        .catch((err) => {
          uni.hideLoading();
          uni.showToast({
            title: typeof err === 'string' ? err : '无法保存图片',
            icon: 'none',
            duration: 2000
          });
        });
    },
    
    // 使用代理逐个保存图片
    saveImagesWithProxy(imageUrls, currentIndex = 0, successCount = 0, failCount = 0) {
      if (currentIndex >= imageUrls.length) {
        // 全部处理完成
        uni.showToast({
          title: `共保存成功${successCount}/${imageUrls.length}张图片`,
          icon: successCount > 0 ? 'success' : 'none',
          duration: 2500
        });
        
        // 如果全部失败，显示提示
        if (successCount === 0 && failCount === imageUrls.length) {
          setTimeout(() => {
            uni.showModal({
              title: '保存失败',
              content: '所有图片均保存失败，可能是格式问题或权限问题。请尝试长按图片保存。',
              showCancel: false
            });
          }, 1500);
        }
        return;
      }
      
      const currentUrl = imageUrls[currentIndex];
      
      uni.showLoading({
        title: `保存第${currentIndex + 1}/${imageUrls.length}张`,
        mask: true
      });
      
      console.log(`开始保存第${currentIndex + 1}张图片, URL:`, currentUrl);
      
      // 使用代理下载图片
      this.downloadMediaViaProxy(currentUrl, 'image')
        .then((tempFilePath) => {
          console.log(`第${currentIndex + 1}张图片下载成功，临时路径:`, tempFilePath);
          
          // 检查文件
          return new Promise((resolve, reject) => {
            // #ifdef MP-WEIXIN
            uni.getFileInfo({
              filePath: tempFilePath,
              success: (fileInfo) => {
                if (fileInfo.size <= 0) {
                  reject(new Error('文件大小为0'));
                  return;
                }
                resolve(tempFilePath);
              },
              fail: (err) => {
                console.error(`第${currentIndex + 1}张图片文件检查失败:`, err);
                // 继续尝试保存
                resolve(tempFilePath);
              }
            });
            // #endif
            
            // #ifndef MP-WEIXIN
            resolve(tempFilePath);
            // #endif
          });
        })
        .then((tempFilePath) => {
          // 保存到相册
          return new Promise((resolve, reject) => {
            uni.saveImageToPhotosAlbum({
              filePath: tempFilePath,
              success: () => {
                resolve(true); // 保存成功
              },
              fail: (err) => {
                console.error(`第${currentIndex + 1}张图片保存失败:`, err);
                
                // 详细记录错误信息
                if (err.errMsg) {
                  console.error(`错误信息: ${err.errMsg}`);
                }
                
                if (err.errMsg && err.errMsg.includes('auth deny')) {
                  // 如果是授权问题，直接退出批量保存
                  uni.hideLoading();
                  uni.showModal({
                    title: '授权提示',
                    content: '保存图片需要您授权访问相册',
                    confirmText: '去授权',
                    success: (res) => {
                      if (res.confirm) {
                        uni.openSetting();
                      }
                    }
                  });
                  throw new Error('auth_denied');
                }
                
                // 不阻断流程，继续保存下一张
                resolve(false); // 保存失败
              }
            });
          });
        })
        .then((success) => {
          uni.hideLoading();
          
          // 短暂提示当前状态
          if (success) {
            uni.showToast({
              title: `第${currentIndex + 1}张保存成功`,
              icon: 'success',
              duration: 500
            });
          }
          
          // 继续处理下一张图片
          setTimeout(() => {
            this.saveImagesWithProxy(
              imageUrls, 
              currentIndex + 1, 
              success ? successCount + 1 : successCount,
              success ? failCount : failCount + 1
            );
          }, 200); // 短暂延迟，避免UI堵塞
        })
        .catch((err) => {
          console.error(`第${currentIndex + 1}张图片处理失败:`, err);
          
          // 如果是授权被拒，已经显示了提示，这里不再继续
          if (err && err.message === 'auth_denied') {
            return;
          }
          
          uni.hideLoading();
          
          // 显示一次错误后继续处理下一张
          let errorMsg = `第${currentIndex + 1}张处理失败`;
          
          // 根据错误类型优化提示
          if (err && err.message) {
            if (err.message.includes('域名校验失败')) {
              uni.showModal({
                title: '提示',
                content: '图片保存功能需要在小程序后台配置合法域名，请联系管理员。',
                showCancel: false,
                success: () => {
                  // 域名校验失败，不再继续批量保存
                  return;
                }
              });
              return;
            } else if (err.message.includes('下载超时')) {
              errorMsg = `第${currentIndex + 1}张下载超时`;
            }
          }
          
          uni.showToast({
            title: errorMsg,
            icon: 'none',
            duration: 1000
          });
          
          // 继续处理下一张
          setTimeout(() => {
            this.saveImagesWithProxy(
              imageUrls, 
              currentIndex + 1, 
              successCount, 
              failCount + 1
            );
          }, 1000);
        });
    },
    
    // 保存视频到相册 - 使用媒体代理服务
    saveVideoToAlbum(videoUrl) {
      uni.showLoading({
        title: '准备保存视频...',
        mask: true
      });
      
      this.checkPhotoAlbumAuth()
        .then(() => {
          // 使用代理下载视频
          return this.downloadMediaViaProxy(videoUrl, 'video');
        })
        .then((tempFilePath) => {
          // 检查文件是否存在和有效
          return new Promise((resolve, reject) => {
            // #ifdef MP-WEIXIN
            uni.getFileInfo({
              filePath: tempFilePath,
              success: (fileInfo) => {
                if (fileInfo.size <= 0) {
                  reject(new Error('下载的视频文件大小为0'));
                  return;
                }
                resolve(tempFilePath);
              },
              fail: (err) => {
                reject(new Error('无法获取视频文件信息'));
              }
            });
            // #endif
            
            // #ifndef MP-WEIXIN
            resolve(tempFilePath);
            // #endif
          });
        })
        .then((tempFilePath) => {
          // 保存到相册
          return new Promise((resolve, reject) => {
            uni.saveVideoToPhotosAlbum({
              filePath: tempFilePath,
              success: (res) => {
                resolve(res);
              },
              fail: (err) => {
                let errorDetail = '';
                
                if (err.errMsg) {
                  if (err.errMsg.includes('file not exist')) {
                    errorDetail = '文件不存在';
                  } else if (err.errMsg.includes('fail permission denied')) {
                    errorDetail = '权限被拒绝';
                  } else if (err.errMsg.includes('fail invalid file')) {
                    errorDetail = '无效的文件格式';
                  } else if (err.errMsg.includes('fail system denied')) {
                    errorDetail = '系统拒绝访问';
                  } else if (err.errMsg.includes('fail network')) {
                    errorDetail = '网络错误';
                  } else {
                    errorDetail = err.errMsg;
                  }
                }
                
                reject(new Error(errorDetail || '保存失败'));
              }
            });
          });
        })
        .then(() => {
          uni.hideLoading();
          uni.showToast({
            title: '视频保存成功',
            icon: 'success'
          });
        })
        .catch((err) => {
          uni.hideLoading();
          
          let errorMessage = '保存失败，请重试';
          
          if (err && err.message) {
            if (err.message.includes('域名校验失败')) {
              uni.showModal({
                title: '提示',
                content: '视频保存功能需要在小程序后台配置合法域名，请联系管理员。',
                showCancel: false
              });
              return;
            } else if (err.message.includes('下载超时')) {
              errorMessage = '下载超时，请检查网络连接';
            } else if (err.message.includes('无效的文件格式')) {
              errorMessage = '视频格式不支持，仅支持MP4格式';
              uni.showModal({
                title: '格式不支持',
                content: '微信小程序仅支持保存MP4格式的视频到相册。',
                showCancel: false
              });
              return;
            } else if (err.message.includes('文件不存在')) {
              errorMessage = '视频文件不存在或已过期';
            } else if (err.message.includes('权限被拒绝')) {
              uni.showModal({
                title: '权限提示',
                content: '保存视频需要相册权限，是否前往设置开启权限？',
                confirmText: '去设置',
                success: (res) => {
                  if (res.confirm) {
                    uni.openSetting();
                  }
                }
              });
              return;
            } else if (err.message.includes('系统拒绝访问')) {
              errorMessage = '系统拒绝访问相册';
              uni.showModal({
                title: '系统限制',
                content: '系统拒绝保存视频，请检查手机存储空间或隐私设置。',
                showCancel: false
              });
              return;
            } else {
              errorMessage = err.message;
            }
          }
          
          uni.showToast({
            title: errorMessage,
            icon: 'none',
            duration: 2500
          });
        });
    },
  }
};
</script>

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

/* 输入部分样式 */
.input-platform-section {
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

.input-box {
  position: relative;
  display: flex;
  align-items: center;
  background-color: #f5f5f5;
  border-radius: 12rpx;
  padding: 20rpx;
}

.link-input {
  flex: 1;
  height: 40rpx;
  font-size: 28rpx;
  color: #333;
}

.input-placeholder {
  color: #999;
}

.clear-icon {
  width: 40rpx;
  height: 40rpx;
  font-size: 36rpx;
  line-height: 36rpx;
  color: #999;
  text-align: center;
}

/* 解析按钮样式 */
.parse-button {
  width: 85%;
  height: 88rpx;
  line-height: 88rpx;
  background-color: #cccccc;
  color: #ffffff;
  font-size: 32rpx;
  font-weight: 500;
  border-radius: 44rpx;
  margin: 50rpx auto;
  text-align: center;
  box-shadow: 0 4rpx 10rpx rgba(0, 0, 0, 0.05);
  border: none; /* 移除默认边框 */
  position: relative; /* 添加相对定位 */
  overflow: visible; /* 确保边框可见 */
}

.parse-button::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 44rpx;
  border: none; /* 移除默认边框 */
  box-sizing: border-box;
}

.parse-button-active {
  background-color: #4a90e2;
}

/* 解析结果样式 */
.result-section {
  background-color: #ffffff;
  padding: 30rpx;
  margin: 0 0 50rpx 0;
  border-radius: 16rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.03);
}

.content-card {
  background-color: #ffffff;
  border-radius: 12rpx;
  margin-bottom: 30rpx;
}

/* 修改头像和内容对齐方式 */
.content-header {
  display: flex;
  align-items: center; /* 确保垂直居中 */
  margin-bottom: 24rpx;
}

.avatar-wrapper {
  position: relative;
  margin-right: 20rpx;
}

.avatar {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  flex-shrink: 0; /* 防止头像缩小 */
}

/* 作者内容包装器样式 */
.author-content-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center; /* 内容垂直居中 */
  min-height: 80rpx; /* 确保至少和头像一样高 */
}

/* 作者名称和复制按钮样式 */
.author-name-wrapper {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10rpx;
  margin-bottom: 8rpx; /* 在作者名称和内容之间添加间距 */
}

.content-title {
  font-size: 30rpx;
  font-weight: 500;
  color: #333;
}

/* 复制按钮样式 */
.copy-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f5f5;
  width: 44rpx;
  height: 44rpx;
  border-radius: 50%;
  margin-left: 10rpx;
}

.copy-icon-img {
  width: 28rpx;
  height: 28rpx;
}

/* 内容和复制按钮样式 */
.content-body {
  display: flex;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 10rpx;
}

.content-body text {
  font-size: 28rpx;
  color: #666;
  line-height: 40rpx;
}

/* 图片结果样式 */
.image-result {
  margin-top: 36rpx;
}

.image-header {
  display: flex;
  justify-content: space-between;
  font-size: 28rpx;
  color: #333;
  margin-bottom: 24rpx;
}

.select-all {
  color: #4a90e2;
}

.image-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

.image-item {
  position: relative;
  width: 48%;
  height: 300rpx;
  margin-bottom: 24rpx;
  border-radius: 12rpx;
  overflow: hidden;
  box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.1);
}

.result-image {
  width: 100%;
  height: 100%;
}

.image-select {
  position: absolute;
  top: 10rpx;
  right: 10rpx;
  width: 40rpx;
  height: 40rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2; /* 确保在提示层上方 */
}

.select-circle {
  width: 30rpx;
  height: 30rpx;
  border-radius: 50%;
  border: 2rpx solid #ffffff;
  background-color: rgba(255, 255, 255, 0.3);
}

.selected {
  background-color: #4a90e2;
  border-color: #4a90e2;
}

/* 视频结果样式 */
.video-result {
  margin-top: 36rpx;
}

.video-header {
  display: flex;
  justify-content: space-between;
  font-size: 28rpx;
  color: #333;
  margin-bottom: 24rpx;
}

.video-list {
  display: flex;
  flex-direction: column;
  gap: 30rpx;
}

.video-item {
  position: relative;
  width: 100%;
  background-color: #f9f9f9;
  border-radius: 12rpx;
  overflow: hidden;
  box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.1);
}

.result-video {
  width: 100%;
  height: 400rpx;
}

.video-info {
  padding: 20rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.video-title {
  font-size: 28rpx;
  color: #333;
  flex: 1;
}

.save-video-btn {
  padding: 10rpx 20rpx;
  background-color: #4a90e2;
  color: #ffffff;
  border-radius: 30rpx;
  font-size: 24rpx;
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

/* 移除头像提示和图片提示的样式 */
.avatar-tip {
  display: none;
}

.image-tip {
  display: none;
}

/* 批量保存按钮样式 */
.batch-save {
  margin-top: 30rpx;
  background-color: #4a90e2;
  color: #ffffff;
  height: 80rpx;
  line-height: 80rpx;
  border-radius: 40rpx;
  text-align: center;
  font-size: 28rpx;
}
</style> 