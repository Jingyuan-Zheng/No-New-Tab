# No New Tab for Some Websites
# 禁止某些网站新标签页打开链接
The README of this project has documentation in both English and Chinese.

中文说明可点击下方：
- [简体中文](README.cn.md)

🎯 Completely disable all new tab opening behavior on Bilibili, Weibo，Zhihu, RedNote, Appstorrent, Skymods! Say no to redirects and enjoy a seamless browsing experience like a native app!

## 🚀 Core Features
* Prevents enabled websites such as Bilibili, Weibo, Zhihu, RedNote (Xiaohongshu), and the Chinese Government website from forcing new tabs
* Covers special links in comment sections in Bilibili, such as:
  * User avatars
  * Usernames / IDs
  * Product cards
  * Hashtags
  * Search links
* Even if the website tries to force a new tab, the script will intercept it and open the page **in the same tab**
* Keeps your browser clean and organized by minimizing unnecessary tabs
* Specially optimized for Bilibili search — pressing Enter or clicking the search button will stay in the current tab
* Lets users add any HTTP/HTTPS website from the userscript menu, with optional subdomain matching
* Stores custom websites separately in the userscript manager so normal script updates do not overwrite them
* Supports managing, removing, importing, and exporting custom website settings
* Handles both internal and external HTTP/HTTPS links on enabled websites without requiring the destination website to be added
* Preserves deliberate middle-click and Command/Ctrl, Shift, or Alt click behavior for opening a new tab or window

## 🎬 Demo

https://github.com/user-attachments/assets/1b11f4dd-e037-409a-9360-96c3b4c63fdd

![No New Tab demo on Bilibili](https://raw.githubusercontent.com/Jingyuan-Zheng/No-New-Tab/main/assets/bilibili-demo.png)

Note: The Bilibili visual style shown in the demo is not provided by this script. It comes from [BewlyBewly](https://jingyuan-zheng.github.io/zh-cn/p/bewlybewly-safari-revival/) and [Bilibili-Evolved](https://github.com/the1812/Bilibili-Evolved). The Safari version of BewlyBewly is available from [Jingyuan-Zheng/BewlyBewly_Safari](https://github.com/Jingyuan-Zheng/BewlyBewly_Safari).

## 📌 Installation
1. Install a script manager 🔧
   - [Tampermonkey](https://www.tampermonkey.net/) (Recommended for Chrome/Edge/Safari)
   - [Greasemonkey](https://www.greasespot.net/) (Recommended for Firefox)

2. Install the script with one click 📦  
   [![Install from GreasyFork](https://img.shields.io/badge/Install-GreasyFork-green.svg)](https://greasyfork.org/zh-CN/scripts/527007)
   [![Install from GitHub](https://img.shields.io/badge/Install-GitHub-blue.svg)](https://github.com/Jingyuan-Zheng/No-New-Tab/raw/main/no_new_tab.user.js)

3. Visit any Bilibili, Weibo, or Zhihu page to test the effect ✅  
   Examples: [Bilibili Main Site](https://www.bilibili.com) | [Bilibili Live](https://live.bilibili.com) | [Zhihu](https://www.zhihu.com)

## ⚙️ Adding Custom Websites

1. Open the website where you want to enable No New Tab.
2. Click the Tampermonkey or Greasemonkey icon in the browser toolbar.
3. Choose **“➕ Enable on this website”**. The page reloads and the rule takes effect.
4. Choose **“⚙️ Manage website list”** to enter another domain, remove rules, or import/export your configuration.

Menus, the management panel, confirmation dialogs, and status messages automatically use Chinese or English based on the browser's preferred language.

The website list determines **where the userscript is active**. It never collects or automatically adds destination websites. For example, after enabling a news website, external links clicked from that website stay in the current tab. Once the external website loads, the userscript stops acting unless that website is also in the list.

The userscript must match all HTTP/HTTPS pages so it can run on websites that users add later. On websites that are not enabled, it only registers the settings menu and exits immediately; it does not install click interception, DOM observers, or page prototype patches. Custom settings survive normal automatic updates. Export the configuration before uninstalling the script, changing userscript managers, or clearing extension data.

# 📖 Changelog

### v6.1.0 (2026-08-03)
- Fixed an issue where clicking the UP avatar on Bilibili video pages would open a new tab by patching `HTMLAnchorElement.prototype.target` property assignment and proxying blank `window.open` calls
- Improved target matching to handle non-standard target attributes like `blank`

### v6.0.1 (2026-07-15)
- Rewrote the Chinese and English userscript descriptions with direct search terms and examples of supported websites

### v6.0.0 (2026-07-14)
- Added user-defined websites and optional subdomain rules
- Stored user rules separately through the userscript manager so script updates do not overwrite them
- Added a website management panel, quick enable command, and configuration import/export
- Added automatic Chinese or English UI based on the browser's preferred language
- Switched to source-site activation, so external links on an enabled website no longer require the destination domain to be listed
- Preserved deliberate middle-click and Command/Ctrl, Shift, or Alt click behavior
- Added `gov.cn` and its subdomains to the built-in rules
- Switched to a lightweight all-site bootstrap that loads full interception only on enabled websites
- Adapted page-level interception for the sandbox introduced by persistent-storage permissions

### v5.5.1 (2026-05-27)
- Added GitHub direct install and update metadata
- Updated README installation links and repository references

### v5.5 (2026-04-26)
- Fixed an issue where clicking the favorites button on Bilibili would incorrectly trigger a search page redirect
- Fixed an issue where clicking the search button with an empty search box would redirect to the search page
- Fixed an issue where pressing Enter in the Bilibili history page search bar would simultaneously trigger both the history search and the global search

### v5.4 (2025-03-09)
- Added support for IThome

### v5.3 (2026-03-05)
- Bump version to 5.3 and improve button matching

### v5.2 (2026-01-08)
- Fix the bug of searching
- Added support for Skymods, Appstorrent

### v5.1 (2025-12-17)
- Fix the bug of searching

### v5.0 (2025-12-05)
- Enhanced compatibility with complex page structures and dynamically injected content
- Completely fixed the issue of links in Bilibili comment sections being forced to open in new tabs
- Improved monitoring and handling of asynchronously loaded elements to ensure long-term stability

### v4.1 (2025-04-28)
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
1. Submit bug reports: [Issue Tracker](https://github.com/Jingyuan-Zheng/No-New-Tab/issues)
2. Request new features: [Feature Suggestions](https://github.com/Jingyuan-Zheng/No-New-Tab/issues)
3. Contribute code directly: 🚀 [Fork Repository](https://github.com/Jingyuan-Zheng/No-New-Tab/fork)

## 📜 License
MIT License © 2025 [Jingyuan Zheng](https://github.com/Jingyuan-Zheng)
