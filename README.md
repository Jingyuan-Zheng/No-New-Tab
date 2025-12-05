# No New Tab for Chinese Top Websites
🎯 Completely disable all new tab opening behavior on Bilibili, Weibo，Zhihu and RedNote! Say no to redirects and enjoy a seamless browsing experience like a native app!

## 🚀 Core Features
* Prevents new tab opening on Bilibili, Weibo, Zhihu, and RedNote (Xiaohongshu)
* Covers special links in comment sections, such as:
  * User avatars
  * Usernames / IDs
  * Product cards
  * Hashtags
  * Search links
* Even if the website tries to force a new tab, the script will intercept it and open the page **in the same tab**
* Keeps your browser clean and organized by minimizing unnecessary tabs
* Specially optimized for Bilibili search — pressing Enter or clicking the search button will stay in the current tab

## 📌 Installation
1. Install a script manager 🔧
   - [Tampermonkey](https://www.tampermonkey.net/) (Recommended for Chrome/Edge/Safari)
   - [Greasemonkey](https://www.greasespot.net/) (Recommended for Firefox)

2. Install the script with one click 📦  
   [![Install Link](https://img.shields.io/badge/Install_Script-GreasyFork-green.svg)](https://greasyfork.org/zh-CN/scripts/527007)

3. Visit any Bilibili, Weibo, or Zhihu page to test the effect ✅  
   Examples: [Bilibili Main Site](https://www.bilibili.com) | [Bilibili Live](https://live.bilibili.com) | [Zhihu](https://www.zhihu.com)

# 📖 Changelog

### v5.0 (2025-12-05)

- Enhanced compatibility with complex page structures and dynamically injected content
- Completely fixed the issue of links in Bilibili comment sections being forced to open in new tabs
- Improved monitoring and handling of asynchronously loaded elements to ensure long-term stability

**Previously Known Issue:**

* ~~Links in Bilibili comment sections do not work properly~~ ✅ Fixed

### v.4.1 (2025-04-28)
- Added support for RedNote

### v4.0 (2025-02-16)
- Added support for Zhihu and Weibo web versions
- Fixed issues on certain pages

### v3.0 (2025-02-16)
- Completely rewrote the event interception logic
- Fixed the new tab issue with the home button on Bilibili's match pages
- Enhanced SPA routing whitelist

### v2.0 (2025-02-16)
- Partially rewritten to optimize behavior on certain pages
- Added support for non-Safari browsers

### v1.0 (2025-02-15)
- Initial release: Basic link interception, Safari-only support

## 🤝 Contributing
Welcome to contribute in the following ways:
1. Submit bug reports: [Issue Tracker](https://github.com/ChingyuanCheng/Bilibili.Weibo.Zhihu_No-New-Tab/issues)
2. Request new features: [Feature Suggestions](https://github.com/ChingyuanCheng/Bilibili.Weibo.Zhihu_No-New-Tab/issues)
3. Contribute code directly: 🚀 [Fork Repository](https://github.com/ChingyuanCheng/Bilibili.Weibo.Zhihu_No-New-Tab/fork)

## 📜 License
MIT License © 2025 [ChingyuanCheng](https://github.com/ChingyuanCheng)
