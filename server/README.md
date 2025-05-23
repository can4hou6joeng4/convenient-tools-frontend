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

## 重要说明：视频格式限制

微信小程序的 `wx.saveVideoToPhotosAlbum` API 有严格的格式限制：
1. **只支持 MP4 格式视频**：其他格式如 WebM、MOV 等无法保存到相册
2. **临时文件必须以 .mp4 扩展名结尾**：否则微信小程序可能无法识别
3. **iOS 和 Android 存在差异**：在某些情况下，相同的视频可能在一个平台上能保存，在另一个平台上不能

为提高兼容性，本代理服务会：
1. 设置正确的 `Content-Type: video/mp4` 响应头
2. 添加 `Content-Disposition: attachment; filename="video.mp4"` 头
3. 检测视频格式并在不是 MP4 时发出警告

## iOS和Android平台差异

1. **iOS平台**：
   - 对文件扩展名更敏感，临时文件必须明确以`.mp4`结尾
   - 可能对视频编码格式有更严格的要求（H.264编码兼容性最好）
   - 系统权限管理更严格，用户需要明确授权

2. **Android平台**：
   - 对文件扩展名要求相对宽松
   - 支持更多的编码格式
   - 某些厂商定制系统可能有额外的权限限制

## 常见问题排查

如果视频保存失败，按以下步骤排查：

1. **格式检查**：
   - 使用工具确认原始视频是否为MP4格式
   - 尝试使用在线转码服务将视频转为标准MP4格式

2. **平台特定问题**：
   - iOS失败但Android成功：可能是编码格式问题，尝试使用H.264编码
   - 两个平台都失败：检查视频格式和代理服务配置

3. **权限问题**：
   - 确保用户已授予保存到相册的权限
   - 在iOS上，用户可能需要在设置中单独授权

4. **调试建议**：
   - 检查微信开发者工具的Console日志
   - 关注包含"fail"的错误信息，特别是"fail invalid file"
   - 测试保存更小尺寸的MP4视频验证权限和功能

## 调试提示

如果视频保存失败，请检查：
1. 原始视频是否为 MP4 格式
2. 下载的临时文件是否有正确的扩展名（.mp4）
3. 查看 console.log 日志中的错误信息
4. 确认手机相册权限已正确授权

## 安全注意事项

1. 建议添加请求验证机制，如API密钥或令牌
2. 设置请求频率限制，防止滥用
3. 考虑添加防盗链措施
4. 监控服务器资源使用情况

## 许可证

MIT 