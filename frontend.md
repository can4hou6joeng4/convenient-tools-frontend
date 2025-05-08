# 视频解析接口文档

## 接口信息

- **接口地址**：`/api/tools/parse`
- **请求方式**：POST
- **接口描述**：解析各平台（抖音、小红书、西瓜视频等）的分享链接，提取视频、图片等媒体资源信息

## 请求参数

### 请求体（JSON格式）

| 参数名 | 类型   | 必填 | 描述                         |
| ------ | ------ | ---- | ---------------------------- |
| url    | string | 是   | 平台分享链接或含有链接的文本 |

### 请求示例

```json
{
  "url": "https://v.douyin.com/xxxxx/"
}
```

或者包含分享文案的文本：

```json
{
  "url": "8.87 pDA:/ 04/24 长按复制此消息，打开抖音搜索，查看TA的更多作品。 https://v.douyin.com/xxxxxx/"
}
```

## 响应参数

### 响应体（JSON格式）

| 参数名  | 类型   | 描述                 |
| ------- | ------ | -------------------- |
| status  | string | 请求状态：success/fail |
| message | string | 状态描述信息         |
| data    | object | 解析结果数据         |

### data字段结构

| 参数名    | 类型   | 描述             |
| --------- | ------ | ---------------- |
| author    | object | 作者信息         |
| title     | string | 视频/图文标题描述 |
| video_url | string | 视频播放地址     |
| music_url | string | 音乐播放地址     |
| cover_url | string | 视频/图文封面地址 |
| images    | array  | 图集图片地址列表 |

### author字段结构

| 参数名 | 类型   | 描述       |
| ------ | ------ | ---------- |
| uid    | string | 作者ID     |
| name   | string | 作者名称   |
| avatar | string | 作者头像地址 |

### 响应示例

```json
{
  "status": "success",
  "message": "Parse URL success",
  "data": {
    "author": {
      "uid": "51022222222",
      "name": "示例用户",
      "avatar": "https://p3.douyinpic.com/aweme/100x100/xxx.jpeg"
    },
    "title": "这是一个视频描述",
    "video_url": "https://aweme.snssdk.com/aweme/v1/play/?video_id=xxx",
    "music_url": "",
    "cover_url": "https://p3.douyinpic.com/aweme/300x400/xxx.jpeg",
    "images": []
  }
}
```

## 支持的平台

目前支持以下平台的链接解析：

- 抖音（域名：v.douyin.com、www.iesdouyin.com、www.douyin.com）
- 西瓜视频（域名：v.ixigua.com）
- 小红书（域名：www.xiaohongshu.com、xhslink.com）

## 使用说明

1. 接口支持直接传入平台分享链接，也支持从分享文案中自动提取链接
2. 对于图集类内容，`images` 数组会包含多张图片地址，`video_url` 将为空
3. 对于视频类内容，`video_url` 会包含视频播放地址，`images` 数组将为空
4. 部分平台可能不返回 `music_url`

## 错误码说明

| 状态码 | 错误描述           | 可能原因                     |
| ------ | ------------------ | ---------------------------- |
| 400    | Invalid request format | 请求体格式错误               |
| 400    | URL is required    | URL参数为空                  |
| 500    | Parse URL fail     | 解析失败，可能是不支持的链接格式或服务器错误 |

# 媒体代理接口文档

## 接口信息

- **接口地址**：`/api/tools/media-proxy`
- **请求方式**：GET
- **接口描述**：代理媒体文件（视频、图片等），解决微信小程序域名限制问题

## 请求参数

### 查询参数

| 参数名 | 类型   | 必填 | 描述                         |
| ------ | ------ | ---- | ---------------------------- |
| url    | string | 是   | 媒体文件URL                 |
| type   | string | 否   | 媒体类型：video/image，默认为video |

### 请求示例

```
GET /api/tools/media-proxy?url=https://example.com/video.mp4&type=video
```

## 响应

### 成功响应

成功时直接返回媒体文件的二进制数据，通过设置的Content-Type响应头指示媒体文件类型。

### 响应头

| 响应头名称       | 描述                            |
| --------------- | ------------------------------- |
| Content-Type    | 媒体文件类型，如video/mp4、image/jpeg等 |
| Content-Length  | 文件大小（字节数）                    |
| Cache-Control   | 缓存策略，默认public, max-age=86400（24小时） |
| Access-Control-Allow-Origin | 跨域访问控制，默认为* |

### 错误响应

错误时返回JSON格式的错误信息：

```json
{
  "error": "错误信息"
}
```

## 错误码说明

| 状态码 | 错误描述           | 可能原因                     |
| ------ | ------------------ | ---------------------------- |
| 400    | Missing url parameter | URL参数为空                  |
| 400    | Invalid URL protocol | URL协议不是http或https        |
| 405    | Method Not Allowed | 使用了GET以外的HTTP方法       |
| 500    | Failed to fetch media: ... | 获取媒体文件失败             |
| 500    | Remote server returned status code ... | 远程服务器返回了非200状态码   |

## 使用说明

1. 此接口主要用于前端（特别是微信小程序）获取不在域名白名单中的媒体资源
2. 对于视频解析接口返回的媒体URL，可通过此接口代理访问
3. 对于大型媒体文件，接口会使用流式传输，不会占用过多的服务器内存
4. 建议在前端应用中为此接口的调用添加适当的错误处理逻辑 