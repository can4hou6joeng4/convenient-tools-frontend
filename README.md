# 便捷工具集

[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/can4hou6joeng4/convenient-tools-frontend/blob/main/LICENSE)
[![Platform](https://img.shields.io/badge/platform-WeChat-green.svg)](https://developers.weixin.qq.com/miniprogram/dev/framework/)
[![Vue](https://img.shields.io/badge/Vue-3.x-brightgreen.svg)](https://vuejs.org/)
[![uni-app](https://img.shields.io/badge/uni--app-3.x-blue.svg)](https://uniapp.dcloud.net.cn/)

基于uni-app + Vue 3的跨平台便捷工具集，专为提升日常效率而设计。支持微信小程序、H5和App多端部署，提供链接解析、图片压缩、积分计算等实用工具。

> 🔥 **特别说明**：本项目是一个现代化的跨平台工具集应用，展示了如何使用uni-app + Vue 3 + TypeScript技术栈构建高质量的多端应用。从项目架构、组件设计到部署上线，提供完整的开发实践参考。无论你是uni-app新手还是有经验的开发者，都能从中学习到跨平台开发的最佳实践。

## 📋 功能特点

- 🔗 **链接解析工具** - 一键解析抖音、小红书、西瓜视频等平台分享链接
- 🖼️ **图片压缩工具** - 智能压缩图片，减少文件大小，保持画质
- 🧮 **积分计算器** - 快速计算各种积分、评分系统
- 📱 **多端兼容** - 支持微信小程序、H5、App多平台运行
- 🎨 **现代化UI** - 简约美观的界面设计，优秀的用户体验
- ⚡ **高性能** - 基于Vue 3 Composition API，性能优异

## 🏗️ 系统架构

- **前端**：uni-app + Vue 3 + TypeScript
- **UI框架**：自定义组件 + uni-ui
- **状态管理**：Pinia（可选）
- **构建工具**：Vite + uni-app CLI
- **代码规范**：ESLint + Prettier

## 🛠️ 技术栈

- **框架**: Vue 3.4+ (Composition API)
- **跨平台方案**: uni-app 3.x
- **开发语言**: TypeScript 4.9+
- **构建工具**: Vite 5.x
- **包管理器**: npm / yarn
- **代码规范**: ESLint + Prettier
- **样式预处理**: SCSS
- **图标方案**: 自定义图标 + PNG资源

## 🚀 快速开始

### 环境要求

确保你的开发环境满足以下要求：

```bash
# 检查Node.js版本 (需要 14.0+)
node --version

# 检查npm版本
npm --version
```

推荐开发工具：
- [HBuilderX](https://www.dcloud.io/hbuilderx.html) - uni-app官方IDE
- [Visual Studio Code](https://code.visualstudio.com/) + uni-app插件
- [微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)

### 项目安装

1. **克隆项目**

```bash
git clone https://github.com/can4hou6joeng4/convenient-tools-frontend.git
cd convenient-tools-frontend
```

2. **安装依赖**

```bash
# 使用npm
npm install

# 或使用yarn
yarn install

# 国内用户推荐使用淘宝镜像
npm install --registry=https://registry.npmmirror.com
```

3. **配置项目**

```bash
# 复制配置模板
cp src/manifest.json.template src/manifest.json

# 编辑manifest.json，配置你的小程序AppID
```

### 开发环境运行

```bash
# 微信小程序开发
npm run dev:mp-weixin

# H5开发
npm run dev:h5

# App开发
npm run dev:app

# 支付宝小程序
npm run dev:mp-alipay

# 字节跳动小程序
npm run dev:mp-toutiao
```

### 生产环境构建

```bash
# 构建微信小程序
npm run build:mp-weixin

# 构建H5
npm run build:h5

# 构建App
npm run build:app
```

## 🔐 微信小程序配置

### 1. 基础配置

在 `src/manifest.json` 中配置小程序基本信息：

```json
{
  "mp-weixin": {
    "appid": "你的小程序AppID",
    "setting": {
      "urlCheck": false,
      "es6": true,
      "postcss": true,
      "minified": true
    }
  }
}
```

### 2. 权限配置

在微信公众平台配置以下权限：

```json
{
  "permission": {
    "scope.writePhotosAlbum": {
      "desc": "用于保存解析的图片和视频到您的相册"
    }
  }
}
```

### 3. 域名配置

在微信公众平台后台添加以下域名到安全域名列表：

- **request合法域名**: `https://your-api-domain.com`
- **downloadFile合法域名**: `https://your-media-domain.com`

## 📝 API接口说明

### 链接解析接口

**请求**：
```http
POST /api/tools/parse-link
Content-Type: application/json

{
  "url": "https://v.douyin.com/xxxxxx",
  "platform": "douyin"
}
```

**响应**：
```json
{
  "code": 200,
  "message": "解析成功",
  "data": {
    "title": "视频标题",
    "author": "作者名称",
    "cover": "封面图片URL",
    "videoUrl": "视频下载地址",
    "images": ["图片URL1", "图片URL2"],
    "description": "内容描述"
  }
}
```

### 图片压缩接口

**请求**：
```http
POST /api/tools/compress-image
Content-Type: multipart/form-data

file: [图片文件]
quality: 80
maxWidth: 1920
```

**响应**：
```json
{
  "code": 200,
  "message": "压缩成功",
  "data": {
    "originalSize": 1024000,
    "compressedSize": 512000,
    "compressionRatio": "50%",
    "downloadUrl": "压缩后图片URL"
  }
}
```

## 🚢 部署指南

### 微信小程序部署

1. **准备工作**
   - 在[微信公众平台](https://mp.weixin.qq.com/)注册小程序账号
   - 获取小程序AppID和AppSecret

2. **构建项目**
   ```bash
   npm run build:mp-weixin
   ```

3. **上传代码**
   - 使用微信开发者工具打开 `dist/build/mp-weixin` 目录
   - 点击"上传"按钮，填写版本号和项目备注
   - 在微信公众平台提交审核

### H5部署

1. **构建项目**
   ```bash
   npm run build:h5
   ```

2. **部署到服务器**
   ```bash
   # 将dist/build/h5目录上传到你的Web服务器
   scp -r dist/build/h5/* user@your-server:/var/www/html/
   ```

3. **Nginx配置示例**
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       root /var/www/html;
       index index.html;
       
       location / {
           try_files $uri $uri/ /index.html;
       }
       
       # API代理
       location /api/ {
           proxy_pass http://your-backend-server/;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
       }
   }
   ```

### App部署

1. **构建项目**
   ```bash
   npm run build:app
   ```

2. **使用HBuilderX打包**
   - 在HBuilderX中打开项目
   - 选择"发行" -> "原生App-云打包"
   - 配置证书和打包参数
   - 提交云端打包

## 📦 项目结构

```
convenient-tools-frontend/
├── src/                          # 源代码目录
│   ├── pages/                    # 页面组件
│   │   └── tools/                # 工具页面
│   │       ├── index.vue         # 工具首页
│   │       ├── link-parser.vue   # 链接解析工具
│   │       ├── image-compressor.vue  # 图片压缩工具
│   │       └── score-calculator.vue  # 积分计算器
│   ├── components/               # 通用组件
│   ├── composables/              # 组合式函数
│   ├── static/                   # 静态资源
│   │   ├── icons/                # 图标文件
│   │   └── images/               # 图片资源
│   ├── App.vue                   # 应用根组件
│   ├── main.ts                   # 应用入口文件
│   ├── manifest.json             # 应用配置文件
│   ├── pages.json                # 页面路由配置
│   └── uni.scss                  # 全局样式
├── static/                       # 全局静态资源
├── server/                       # 服务端代码（可选）
│   └── media-proxy.js            # 媒体代理服务
├── dist/                         # 构建输出目录
├── node_modules/                 # 依赖包
├── package.json                  # 项目配置
├── tsconfig.json                 # TypeScript配置
├── vite.config.ts                # Vite配置
└── README.md                     # 项目说明
```

## 🔧 开发指南

### 代码规范

项目使用ESLint + Prettier进行代码规范管理：

```bash
# 检查代码规范
npm run lint

# 自动修复代码格式
npm run lint:fix

# 格式化代码
npm run format
```

### 组件开发

使用Vue 3 Composition API开发组件：

```vue
<template>
  <view class="tool-card">
    <image :src="icon" class="tool-icon" />
    <text class="tool-name">{{ name }}</text>
  </view>
</template>

<script setup lang="ts">
interface Props {
  icon: string
  name: string
}

defineProps<Props>()
</script>

<style lang="scss" scoped>
.tool-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20rpx;
}
</style>
```

### 类型定义

在 `src/types/` 目录下定义TypeScript类型：

```typescript
// src/types/api.ts
export interface ParseLinkRequest {
  url: string
  platform: 'douyin' | 'xiaohongshu' | 'xigua'
}

export interface ParseLinkResponse {
  title: string
  author: string
  cover: string
  videoUrl?: string
  images?: string[]
}
```

## 📋 配置文档

详细配置文档请参阅：

- [uni-app官方文档](https://uniapp.dcloud.net.cn/)
- [Vue 3官方文档](https://vuejs.org/)
- [微信小程序开发文档](https://developers.weixin.qq.com/miniprogram/dev/framework/)
- [TypeScript配置指南](https://www.typescriptlang.org/docs/)

## 🐛 常见问题

### Q: 微信小程序真机预览时图片无法显示？
A: 检查图片域名是否已添加到微信公众平台的安全域名列表中。

### Q: H5页面在某些浏览器中样式异常？
A: 确保使用了适当的CSS前缀，可以配置autoprefixer插件。

### Q: App打包时出现证书错误？
A: 检查证书是否过期，确保证书格式正确（p12格式）。

### Q: 开发时热重载不生效？
A: 尝试重启开发服务器，检查文件监听权限。

## 📄 许可证

本项目采用 MIT 许可证 - 详情见 [LICENSE](LICENSE) 文件。

## 🤝 贡献指南

欢迎提交 Issues 和 Pull Requests 帮助改进项目！

1. Fork 本仓库
2. 创建你的功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交你的改动 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建一个 Pull Request

### 贡献规范

- 遵循现有的代码风格和规范
- 为新功能添加相应的测试用例
- 更新相关文档
- 确保所有测试通过

## 🙏 致谢

- 感谢 [uni-app](https://uniapp.dcloud.net.cn/) 提供的优秀跨平台解决方案
- 感谢 [Vue.js](https://vuejs.org/) 团队的杰出工作
- 感谢所有开源项目和工具的贡献者
- 感谢微信小程序平台提供的技术支持

## 📧 联系我们

有任何问题或建议，请随时联系：

- 项目维护者：[BoboChang](mailto:can4hou6joeng4@163.com)
- 项目主页：[便捷工具集](https://github.com/can4hou6joeng4/convenient-tools-frontend)
- 问题反馈：[Issues](https://github.com/can4hou6joeng4/convenient-tools-frontend/issues)

---

<div align="center">
  <p>
    <a href="https://github.com/can4hou6joeng4/convenient-tools-frontend">⭐ 给个Star支持一下</a> |
    <a href="https://github.com/can4hou6joeng4/convenient-tools-frontend/issues">🐛 报告Bug</a> |
    <a href="https://github.com/can4hou6joeng4/convenient-tools-frontend/pulls">🚀 提交PR</a>
  </p>
</div>
