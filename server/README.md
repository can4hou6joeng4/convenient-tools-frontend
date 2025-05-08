# 媒体文件代理服务

## 概述

为解决微信小程序域名限制问题而开发的媒体文件代理服务。微信小程序在正式环境下必须使用已配置的合法域名进行网络请求，包括下载媒体文件。

此代理服务允许您的小程序通过您自己的域名下载第三方媒体文件。

## 工作原理

1. 小程序发送请求到您自己的API服务器（已配置为合法域名）
2. 您的服务器获取第三方媒体文件
3. 将媒体文件通过您的服务器转发给小程序
4. 小程序接收到媒体文件并保存到本地相册

## 部署步骤

1. 在您的后端服务器上部署 `media-proxy.js` 文件
2. 配置路由，使其响应 `/api/tools/media-proxy` 路径的请求
3. 确保您的域名已在微信小程序后台配置为合法域名

### 1. Node.js 环境部署

如果您使用 Node.js + Express:

```javascript
const express = require('express');
const mediaProxy = require('./media-proxy');

const app = express();
const port = process.env.PORT || 3000;

// 媒体代理端点
app.get('/api/tools/media-proxy', (req, res) => {
  mediaProxy.handler(req, res);
});

app.listen(port, () => {
  console.log(`服务运行在 http://localhost:${port}`);
});
```

### 2. 其他环境

可以根据您的后端环境改写 `media-proxy.js` 文件。核心逻辑是:

1. 接收请求参数中的 `url` 和 `type`
2. 从原始URL获取媒体文件
3. 设置适当的Content-Type
4. 将媒体文件数据发送回客户端

## 微信小程序配置

在微信公众平台后台：

1. 前往 "开发" -> "开发设置" -> "服务器域名"
2. 在 "request合法域名" 中添加您的API域名
3. 在 "downloadFile合法域名" 中添加您的API域名

## 使用方法

### 获取图片

```
GET /api/tools/media-proxy?url=https://example.com/image.jpg&type=image
```

### 获取视频

```
GET /api/tools/media-proxy?url=https://example.com/video.mp4&type=video
```

## 安全注意事项

1. 建议添加请求验证机制，如API密钥或令牌
2. 设置请求频率限制，防止滥用
3. 考虑添加防盗链措施
4. 监控服务器资源使用情况

## 许可证

MIT 