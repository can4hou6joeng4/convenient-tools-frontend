const fs = require('fs');
const path = require('path');

// 图片压缩图标 - 框图标
const imageIcon = `
<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64">
  <rect x="13" y="13" width="38" height="38" rx="3" fill="#FFF" stroke="#3c8cff" stroke-width="3"/>
  <rect x="18" y="18" width="28" height="18" rx="2" fill="#3c8cff" fill-opacity="0.2"/>
  <rect x="22" y="40" width="20" height="4" rx="1" fill="#3c8cff" fill-opacity="0.2"/>
  <path d="M25,24 L28,29 L31,27 L35,33 L25,33 L25,24 Z" fill="#3c8cff"/>
</svg>
`;

// 链接解析图标 - 链接图标
const linkIcon = `
<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64">
  <path d="M25,20 C18.926,20 14,24.926 14,31 C14,37.074 18.926,42 25,42 L31,42 L31,38 L25,38 C21.134,38 18,34.866 18,31 C18,27.134 21.134,24 25,24 L31,24 L31,20 L25,20 Z" fill="#3c8cff"/>
  <path d="M33,20 L33,24 L39,24 C42.866,24 46,27.134 46,31 C46,34.866 42.866,38 39,38 L33,38 L33,42 L39,42 C45.074,42 50,37.074 50,31 C50,24.926 45.074,20 39,20 L33,20 Z" fill="#3c8cff"/>
  <rect x="22" y="29" width="20" height="4" rx="2" fill="#3c8cff"/>
</svg>
`;

// 将SVG转换为Base64数据
const imageIconBase64 = Buffer.from(imageIcon).toString('base64');
const linkIconBase64 = Buffer.from(linkIcon).toString('base64');

// 使用Node.js图像处理库如Sharp将SVG转换为PNG
// 这里我们简单地把Base64 SVG写入HTML文件
const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <title>Icons</title>
  <style>
    .icon {
      width: 64px;
      height: 64px;
      margin: 20px;
    }
  </style>
</head>
<body>
  <div>
    <h2>Image Icon</h2>
    <img class="icon" src="data:image/svg+xml;base64,${imageIconBase64}" />
    <pre>Save this as /static/icons/image.png</pre>
  </div>
  <div>
    <h2>Link Icon</h2>
    <img class="icon" src="data:image/svg+xml;base64,${linkIconBase64}" />
    <pre>Save this as /static/icons/link.png</pre>
  </div>
</body>
</html>
`;

// 写入临时HTML文件
fs.writeFileSync(path.join(__dirname, 'icons.html'), htmlContent);
console.log('Icons HTML generated. Open icons.html in a browser, take screenshots of each icon and save as PNG files.');

// 直接将SVG数据写入文件
fs.writeFileSync(path.join(__dirname, 'static/icons/image.svg'), imageIcon);
fs.writeFileSync(path.join(__dirname, 'static/icons/link.svg'), linkIcon);
console.log('SVG files created in static/icons/ directory.'); 