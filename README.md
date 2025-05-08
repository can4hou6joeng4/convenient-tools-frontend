# 便捷工具集

<div align="center">
  <img src="static/icons/avatar.svg" alt="便捷工具集Logo" width="120">
  <h3>多平台一站式便捷工具集</h3>
  <p>支持微信小程序、H5和App，让日常工具触手可及</p>
</div>

## ✨ 特性

- 🔗 **链接解析**：一键解析抖音、小红书、西瓜视频等平台的分享链接，提取视频、图片等资源
- 📱 **多平台兼容**：基于uni-app开发，同时支持微信小程序、H5和App
- 🛠️ **工具丰富**：持续集成更多实用工具，满足用户多样化需求
- 🎨 **精美界面**：简约直观的用户界面，专注于良好的用户体验

## 🚀 技术栈

- **前端框架**：Vue 3 + TypeScript
- **跨平台解决方案**：uni-app
- **UI组件**：自定义组件 + uni-ui
- **代码风格**：ESLint + Prettier
- **构建工具**：Vite
- **后端接口**：RESTful API

## 📊 项目预览

### 链接解析工具
- 支持平台：抖音、小红书、西瓜视频等
- 提取内容：视频、图片、作者信息、文本描述
- 功能特色：批量保存图片、视频直接下载


## 📁 项目结构

```
convenient-tools-frontend/
├── src/                  # 源代码
│   ├── pages/            # 页面组件
│   │   └── tools/        # 工具类页面
│   │       └── link-parser.vue  # 链接解析工具
│   ├── components/       # 通用组件
│   ├── composables/      # 组合式函数
│   ├── static/           # 静态资源
│   └── manifest.json     # 应用配置
├── server/               # 服务端代码
│   └── media-proxy.js    # 媒体代理服务
├── static/               # 全局静态资源
│   ├── icons/            # 图标资源
│   └── images/           # 图片资源
└── README.md             # 项目说明
```

## 🔧 安装与运行

### 环境要求

- Node.js 14.0 或更高版本
- npm 或 yarn 包管理器
- HBuilderX（推荐用于uni-app开发）

### 开发环境设置

1. 克隆仓库

```bash
git clone https://github.com/can4hou6joeng4/convenient-tools-frontend.git
cd convenient-tools-frontend
```

2. 安装依赖

```bash
npm install
# 或
yarn install
```

3. 运行开发服务器

```bash
# 微信小程序
npm run dev:mp-weixin

# H5
npm run dev:h5

# App
npm run dev:app
```

## 📱 微信小程序开发

### 配置说明

1. 在 `src/manifest.json` 中配置小程序 AppID
2. 确保配置了必要的权限：
   - 相册权限用于保存媒体文件

### 域名配置

在微信公众平台后台，需要将以下域名添加到安全域名列表：

- `https://tools.bobochang.cn`：接口请求域名
- 媒体文件来源域名（通过代理服务解决）

## 🖥️ 服务端配置

媒体代理服务用于解决微信小程序域名限制问题：

1. 将 `server/media-proxy.js` 部署到您的服务器
2. 确保代理服务路径为 `/api/tools/media-proxy`
3. 配置正确的 CORS 和缓存策略

## 🤝 参与贡献

欢迎您为便捷工具集做出贡献！

1. Fork 本仓库
2. 创建您的特性分支 `git checkout -b feature/amazing-feature`
3. 提交您的更改 `git commit -m 'Add some amazing feature'`
4. 推送到分支 `git push origin feature/amazing-feature`
5. 打开一个 Pull Request

## 📜 许可证

本项目基于 MIT 许可证 - 详情请参阅 [LICENSE](LICENSE) 文件

## 📧 联系我们

有任何问题或建议，请随时联系：

- 项目维护者：[BoboChang](mailto:can4hou6joeng4@163.com)
- 项目主页：[便捷工具集](https://github.com/can4hou6joeng4/convenient-tools-frontend)

---

<div align="center">
  <p>用❤️打造 | Copyright © 2023-present 便捷工具集团队</p>
</div>
