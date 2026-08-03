# 禁止新标签页打开链接
🎯 彻底禁止哔哩哔哩、微博、知乎、小红书等国内网站以及 Appstorrent 和 Skymods 的所有新标签页打开行为！拒绝跳转，构建客户端般的浏览器上网环境！！

## 🚀 核心功能
* 阻止哔哩哔哩、微博、知乎、小红书、中国政府网等已启用网站擅自打开新标签页
* 覆盖哔哩哔哩评论区的特殊链接，包括：
  * 用户头像
  * 用户昵称 / ID
  * 商品链接
  * 话题标签
  * 搜索跳转
* 即使网站尝试强制新开页面，本脚本也会拦截，让页面在**当前标签页中打开**
* 减少浏览器标签数量，让操作更加专注、干净、高效
* 特别优化了 B 站搜索行为：按下回车或点击搜索按钮时不会跳出新标签页
* 可以从脚本菜单添加任意 HTTP/HTTPS 网站，并选择是否包含其子域名
* 自定义网站保存在脚本管理器的独立存储中，普通脚本更新不会覆盖
* 支持管理、删除、导入和导出自定义网站配置
* 在已启用网站中，站内和外部 HTTP/HTTPS 链接都会按当前标签页处理；目标网站不需要另外添加
* 保留用户主动使用中键、Command/Ctrl、Shift 或 Alt 点击来打开新标签页/窗口

## 🎬 效果演示

https://github.com/user-attachments/assets/1b11f4dd-e037-409a-9360-96c3b4c63fdd

![B 站同标签页打开演示](https://raw.githubusercontent.com/Jingyuan-Zheng/No-New-Tab/main/assets/bilibili-demo.png)

说明：视频中哔哩哔哩网站的视觉效果不来自本插件，而是由 [BewlyBewly](https://jingyuan-zheng.github.io/zh-cn/p/bewlybewly-safari-revival/) 和 [Bilibili-Evolved](https://github.com/the1812/Bilibili-Evolved) 提供。BewlyBewly 的 Safari 版本可在 [Jingyuan-Zheng/BewlyBewly_Safari](https://github.com/Jingyuan-Zheng/BewlyBewly_Safari) 下载。

## 📌 安装方法
1. 安装脚本管理器 🔧
   - [Tampermonkey](https://www.tampermonkey.net/) (Chrome/Edge/Safari推荐)
   - [Greasemonkey](https://www.greasespot.net/) (Firefox推荐)

2. 一键安装脚本 📦  
   [![从 GreasyFork 安装](https://img.shields.io/badge/安装-GreasyFork-green.svg)](https://greasyfork.org/zh-CN/scripts/527007)
   [![从 GitHub 安装](https://img.shields.io/badge/安装-GitHub-blue.svg)](https://github.com/Jingyuan-Zheng/No-New-Tab/raw/main/no_new_tab.user.js)

3. 访问任意 B 站、微博、知乎页面测试效果 ✅
   例如：[B站主站](https://www.bilibili.com) | [B站直播](https://live.bilibili.com) | [知乎](https://www.zhihu.com)

## ⚙️ 添加自定义网站

1. 打开需要启用 No New Tab 的网站。
2. 点击浏览器工具栏中的 Tampermonkey / Greasemonkey 图标。
3. 选择 **“➕ 在当前网站启用”**，页面会自动刷新并开始生效。
4. 选择 **“⚙️ 管理网站列表”** 可以手动输入其他域名、删除规则或导入/导出配置。

脚本菜单、管理面板、确认框和状态提示会根据浏览器首选语言自动显示中文或英文。

网站列表决定脚本**在哪些网站生效**，不会自动收集或添加链接指向的目标网站。例如启用新闻网站后，从新闻网站点击外部链接会留在当前标签页；到达外部网站后，脚本不会继续生效，除非该外部网站本身也在列表中。

脚本需要匹配所有 HTTP/HTTPS 页面，才能在用户后来添加的网站上运行。未启用的网站只会加载设置菜单并立即退出，不会安装点击拦截、DOM 观察器或网页原型补丁。自定义配置在普通自动更新后会保留；卸载脚本、更换脚本管理器或清除扩展数据前，建议先导出配置。

## 📖 更新日志

### v7.0.0 (2026-08-03)
- 在页面上下文拦截普通链接点击，覆盖 B 站动态渲染的 UP 主资料链接和评论用户资料链接
- 保留中键及 Command/Ctrl、Shift、Alt 点击等用户主动新开行为

### v6.0.0 (2026-07-14)
- 新增用户自定义网站与子域名规则
- 使用脚本管理器独立存储保存配置，脚本更新不会覆盖用户规则
- 新增网站管理面板、当前网站快捷启用、配置导入和导出
- 管理界面根据浏览器首选语言自动显示中文或英文
- 改为按来源网站启用：已启用网站中的外部链接不再要求目标域名也在列表中
- 保留中键及 Command/Ctrl、Shift、Alt 点击等用户主动新开行为
- 将 `gov.cn` 及其子域名加入内置规则
- 改为全站轻量启动，仅在内置或用户启用的网站加载完整拦截逻辑
- 适配启用存储权限后的 userscript 沙箱与页面上下文

### v5.5.1 (2026-05-27)
- 添加 GitHub 直接安装与自动更新元数据
- 更新 README 安装链接与仓库地址

### v5.5 (2026-04-26)
- 修复了在哔哩哔哩点击收藏按钮时会错误触发搜索页面跳转的问题
- 修复了在搜索框为空时点击搜索按钮会跳转到搜索页面的问题
- 修复了在哔哩哔哩历史页面搜索框按下回车键时会同时触发历史搜索和全站搜索的问题

### v5.4 (2026-03-09)
- 支持了IT之家

### v5.3 (2026-03-05)
- 将版本提升到5.3，并改进按钮匹配

### v5.2 (2025-01-08)
- 修复回车搜索问题
- 支持了 Appstorrent 和 Skymods

### v5.1 (2025-12-17)
- 修复回车搜索问题

### v5.0 (2025-12-05)
- 已针对复杂网页结构与动态注入内容进行了进一步增强
- 全面修复哔哩哔哩评论区链接强制新标签页打开问题
- 改进对异步加载内容的监听与处理机制，长期稳定生效

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
1. 提交BUG报告：[问题追踪](https://github.com/Jingyuan-Zheng/No-New-Tab/issues)
2. 发起功能请求：[功能建议](https://github.com/Jingyuan-Zheng/No-New-Tab/issues)
3. 直接贡献代码：🚀 [Fork仓库](https://github.com/Jingyuan-Zheng/No-New-Tab/fork)

## 📜 许可证
MIT License © 2025 [Jingyuan Zheng](https://github.com/Jingyuan-Zheng)
