# 禁止新标签页打开链接
🎯 彻底禁止哔哩哔哩、微博、知乎、小红书等国内网站的所有新标签页打开行为！拒绝跳转，构建客户端般的浏览器上网环境！！

## 🚀 核心功能
* 阻止哔哩哔哩、微博、知乎、小红书在新标签页中打开链接
* 覆盖评论区的特殊链接，包括：
  * 用户头像
  * 用户昵称 / ID
  * 商品链接
  * 话题标签
  * 搜索跳转
* 即使网站尝试强制新开页面，本脚本也会拦截，让页面在**当前标签页中打开**
* 减少浏览器标签数量，让操作更加专注、干净、高效
* 特别优化了 B 站搜索行为：按下回车或点击搜索按钮时不会跳出新标签页


## 📌 安装方法
1. 安装脚本管理器 🔧
   - [Tampermonkey](https://www.tampermonkey.net/) (Chrome/Edge/Safari推荐)
   - [Greasemonkey](https://www.greasespot.net/) (Firefox推荐)

2. 一键安装脚本 📦  
   [![安装链接](https://img.shields.io/badge/安装脚本-GreasyFork-green.svg)](https://greasyfork.org/zh-CN/scripts/527007)

3. 访问任意B站、微博、知乎页面测试效果 ✅  
   例如：[B站主站](https://www.bilibili.com) | [B站直播](https://live.bilibili.com) | [知乎](https://www.zhihu.com)

## 📖 更新日志

### v5.1 (2025-12-17)
- 修复回车搜索问题

### v5.0 (2025-12-05)

- 已针对复杂网页结构与动态注入内容进行了进一步增强
- 全面修复哔哩哔哩评论区链接强制新标签页打开问题
- 改进对异步加载内容的监听与处理机制，长期稳定生效

**原已知问题：**

* ~~哔哩哔哩评论区搜索/跳转链接无法生效~~ ✅ 已解决

### v4.1 (2025-04-28)
- 支持了小红书网页版

### v4.0 (2025-02-16)
- 支持了知乎和微博网页版
- 修复部分页面失效

### v3.0 (2025-02-16)
- 完全重写事件拦截逻辑
- 修复赛事页面主站按钮新标签页问题
- 增强SPA路由识别白名单

### v2.0 (2025-02-16)
- 部分重写，优化部分页面无效
- 支持了非Safari浏览器

### v1.0 (2025-02-15)
- 初始发布：基础链接拦截功能，仅Safari支持

## 🤝 参与贡献
欢迎通过以下方式参与改进：
1. 提交BUG报告：[问题追踪](https://github.com/ChingyuanCheng/Bilibili.Weibo.Zhihu_No-New-Tab/issues)
2. 发起功能请求：[功能建议](https://github.com/ChingyuanCheng/Bilibili.Weibo.Zhihu_No-New-Tab/issues)
3. 直接贡献代码：🚀 [Fork仓库](https://github.com/ChingyuanCheng/Bilibili.Weibo.Zhihu_No-New-Tab/fork)

## 📜 许可证
MIT License © 2025 [ChingyuanCheng](https://github.com/ChingyuanCheng)
