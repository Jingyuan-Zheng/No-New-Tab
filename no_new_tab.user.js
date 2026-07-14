// ==UserScript==
// @name         禁止新标签页打开链接
// @name:en      No New Tab for Some Websites
// @namespace    http://tampermonkey.net/
// @version      6.0.0
// @description  让内置及用户自定义网站的链接在当前标签页打开，自定义配置在脚本更新后仍会保留
// @description:en Force links on built-in and user-defined websites to open in the current tab while preserving custom settings across updates
// @author       Jingyuan Zheng
// @license      MIT
// @homepageURL  https://github.com/Jingyuan-Zheng/No-New-Tab
// @supportURL   https://github.com/Jingyuan-Zheng/No-New-Tab/issues
// @updateURL    https://raw.githubusercontent.com/Jingyuan-Zheng/No-New-Tab/main/no_new_tab.user.js
// @downloadURL  https://raw.githubusercontent.com/Jingyuan-Zheng/No-New-Tab/main/no_new_tab.user.js
// @match        http://*/*
// @match        https://*/*
// @noframes
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM.registerMenuCommand
// @grant        unsafeWindow
// @sandbox      JavaScript
// @run-at       document-start
// ==/UserScript==

(function () {
    'use strict';

    const CONFIG_KEY = 'noNewTab.config.v1';
    const CONFIG_VERSION = 1;
    const PAGE_WINDOW = typeof unsafeWindow === 'object' ? unsafeWindow : window;
    const DEFAULT_RULES = Object.freeze([
        Object.freeze({ host: 'bilibili.com', includeSubdomains: true }),
        Object.freeze({ host: 'weibo.com', includeSubdomains: true }),
        Object.freeze({ host: 'zhihu.com', includeSubdomains: true }),
        Object.freeze({ host: 'xiaohongshu.com', includeSubdomains: true }),
        Object.freeze({ host: 'smods.ru', includeSubdomains: true }),
        Object.freeze({ host: 'modsbase.com', includeSubdomains: true }),
        Object.freeze({ host: 'appstorrent.ru', includeSubdomains: true }),
        Object.freeze({ host: 'ithome.com', includeSubdomains: true }),
        Object.freeze({ host: 'gov.cn', includeSubdomains: true })
    ]);
    const LANGUAGE = detectLanguage();
    const TRANSLATIONS = {
        zh: {
            emptyRule: '请输入网站域名或网址。',
            unrecognizedRule: '无法识别该网站，请输入例如 example.com 或 https://example.com。',
            httpOnly: '目前只支持 HTTP 和 HTTPS 网站。',
            invalidDomain: '网站域名无效。',
            storageUnavailable: '当前脚本管理器没有提供持久化存储 API。',
            includesSubdomains: '{host}（含子域名）',
            menuDefaultEnabled: '✓ 当前网站已由内置规则启用：{host}',
            menuRemoveRule: '➖ 删除匹配规则：{rule}',
            confirmRemoveRule: '将删除自定义规则“{rule}”。确定继续吗？',
            deleteFailed: '删除失败：{error}',
            menuEnableCurrent: '➕ 在当前网站启用：{host}',
            addFailed: '添加失败：{error}',
            menuManage: '⚙️ 管理网站列表',
            panelTitle: 'No New Tab 网站管理',
            panelDescription: '自定义网站保存在脚本管理器中，普通脚本更新不会替换它们。',
            close: '关闭',
            builtInSites: '内置网站',
            mySites: '我的网站',
            domainPlaceholder: 'example.com 或 https://example.com',
            domainLabel: '网站域名',
            addSite: '添加网站',
            includeSubdomains: '同时应用于这个域名的所有子域名',
            panelHelp: '添加当前尚未启用的网站后，需要刷新该页面一次。站内和外部链接都会阻止网站强制新开；中键或组合键仍按你的操作新开。',
            exportConfig: '导出配置',
            importConfig: '导入配置',
            reloadPage: '刷新页面',
            done: '完成',
            delete: '删除',
            ruleDeleted: '规则已删除；当前页面上的变化将在刷新后完全生效。',
            noCustomSites: '还没有自定义网站',
            alreadyDefault: '这个网站已经包含在内置规则中。',
            alreadyCustom: '这个网站已经包含在你的规则中。',
            siteAddedReload: '网站已添加，请刷新当前页面使拦截生效。',
            siteAdded: '网站已添加。',
            exportPrompt: '复制下面的 No New Tab 配置：',
            importPrompt: '粘贴 No New Tab 配置；导入会替换现有自定义网站：',
            noUsableRules: '配置中没有可用的网站规则。',
            confirmImport: '将用 {incoming} 条导入规则替换当前 {current} 条规则。确定继续吗？',
            configImported: '配置已导入；请刷新需要使用的页面。',
            importFailed: '导入失败：{error}'
        },
        en: {
            emptyRule: 'Enter a website domain or URL.',
            unrecognizedRule: 'This website could not be recognized. Enter a value such as example.com or https://example.com.',
            httpOnly: 'Only HTTP and HTTPS websites are supported.',
            invalidDomain: 'The website domain is invalid.',
            storageUnavailable: 'This userscript manager does not provide a persistent storage API.',
            includesSubdomains: '{host} (including subdomains)',
            menuDefaultEnabled: '✓ Enabled by a built-in rule: {host}',
            menuRemoveRule: '➖ Remove matching rule: {rule}',
            confirmRemoveRule: 'This will remove the custom rule “{rule}”. Continue?',
            deleteFailed: 'Could not remove the rule: {error}',
            menuEnableCurrent: '➕ Enable on this website: {host}',
            addFailed: 'Could not add the website: {error}',
            menuManage: '⚙️ Manage website list',
            panelTitle: 'No New Tab Website Manager',
            panelDescription: 'Custom websites are stored by your userscript manager and are not replaced by normal script updates.',
            close: 'Close',
            builtInSites: 'Built-in websites',
            mySites: 'My websites',
            domainPlaceholder: 'example.com or https://example.com',
            domainLabel: 'Website domain',
            addSite: 'Add website',
            includeSubdomains: 'Also apply to all subdomains of this domain',
            panelHelp: 'After adding the website currently open in this tab, refresh the page once. Site-forced new tabs are blocked for both internal and external links; middle-clicks and modifier clicks still follow your intent.',
            exportConfig: 'Export configuration',
            importConfig: 'Import configuration',
            reloadPage: 'Reload page',
            done: 'Done',
            delete: 'Remove',
            ruleDeleted: 'The rule was removed. Reload this page for the change to take full effect.',
            noCustomSites: 'No custom websites yet',
            alreadyDefault: 'This website is already covered by a built-in rule.',
            alreadyCustom: 'This website is already covered by one of your rules.',
            siteAddedReload: 'Website added. Reload this page to enable interception.',
            siteAdded: 'Website added.',
            exportPrompt: 'Copy the No New Tab configuration below:',
            importPrompt: 'Paste a No New Tab configuration. Importing replaces your current custom websites:',
            noUsableRules: 'The configuration does not contain any usable website rules.',
            confirmImport: 'Replace the current {current} rules with {incoming} imported rules?',
            configImported: 'Configuration imported. Reload any pages where you want to use it.',
            importFailed: 'Could not import the configuration: {error}'
        }
    };
    const STRINGS = TRANSLATIONS[LANGUAGE];

    let userConfig = createEmptyConfig();
    let effectiveRules = [...DEFAULT_RULES];
    let interceptorStarted = false;
    let userRequestedNewContext = false;
    let userIntentSequence = 0;
    const observedRoots = new WeakSet();

    function detectLanguage() {
        const preferredLanguage = typeof navigator === 'object'
            ? ((Array.isArray(navigator.languages) && navigator.languages[0]) || navigator.language || '')
            : '';
        return /^zh(?:[-_]|$)/i.test(preferredLanguage) ? 'zh' : 'en';
    }

    function text(key, replacements = {}) {
        return STRINGS[key].replace(/\{(\w+)\}/g, (match, name) => (
            Object.prototype.hasOwnProperty.call(replacements, name) ? String(replacements[name]) : match
        ));
    }

    function createEmptyConfig() {
        return { schemaVersion: CONFIG_VERSION, customRules: [] };
    }

    function normalizeHostname(hostname) {
        return String(hostname || '').trim().toLowerCase().replace(/\.$/, '');
    }

    function isIpOrLocalHost(hostname) {
        return hostname === 'localhost' || hostname.startsWith('[') || /^\d{1,3}(?:\.\d{1,3}){3}$/.test(hostname);
    }

    function normalizeRuleInput(rawValue, includeSubdomains = false) {
        let value = String(rawValue || '').trim();
        if (!value) throw new Error(text('emptyRule'));

        let wildcard = false;
        if (value.startsWith('*.')) {
            wildcard = true;
            value = value.slice(2);
        }

        let url;
        try {
            url = new URL(/^[a-z][a-z\d+.-]*:\/\//i.test(value) ? value : `https://${value}`);
        } catch {
            throw new Error(text('unrecognizedRule'));
        }

        if (url.protocol !== 'http:' && url.protocol !== 'https:') {
            throw new Error(text('httpOnly'));
        }

        const host = normalizeHostname(url.hostname);
        if (!host || host.includes('*') || /\s/.test(host)) {
            throw new Error(text('invalidDomain'));
        }

        return {
            host,
            includeSubdomains: isIpOrLocalHost(host) ? false : Boolean(wildcard || includeSubdomains)
        };
    }

    function ruleKey(rule) {
        return `${rule.host}|${rule.includeSubdomains ? '1' : '0'}`;
    }

    function ruleCovers(coveringRule, candidateRule) {
        if (coveringRule.host === candidateRule.host) {
            return coveringRule.includeSubdomains || !candidateRule.includeSubdomains;
        }
        return coveringRule.includeSubdomains && candidateRule.host.endsWith(`.${coveringRule.host}`);
    }

    function ruleMatchesHostname(rule, hostname) {
        const normalized = normalizeHostname(hostname);
        return normalized === rule.host || (rule.includeSubdomains && normalized.endsWith(`.${rule.host}`));
    }

    function matchesAnyRule(hostname, rules = effectiveRules) {
        return rules.some(rule => ruleMatchesHostname(rule, hostname));
    }

    function sanitizeConfig(rawConfig) {
        const candidates = Array.isArray(rawConfig)
            ? rawConfig
            : (rawConfig && Array.isArray(rawConfig.customRules) ? rawConfig.customRules : []);
        const customRules = [];
        const seen = new Set();

        for (const candidate of candidates) {
            try {
                const rawHost = typeof candidate === 'string' ? candidate : candidate && candidate.host;
                const includeSubdomains = typeof candidate === 'object' && candidate !== null
                    ? Boolean(candidate.includeSubdomains)
                    : String(rawHost || '').startsWith('*.');
                const normalized = normalizeRuleInput(rawHost, includeSubdomains);
                const key = ruleKey(normalized);
                if (!seen.has(key)) {
                    customRules.push(normalized);
                    seen.add(key);
                }
            } catch {
                // Ignore malformed stored entries instead of preventing the script from starting.
            }
        }

        return { schemaVersion: CONFIG_VERSION, customRules };
    }

    async function gmGetValue(key, fallback) {
        if (typeof GM_getValue === 'function') return GM_getValue(key, fallback);
        if (typeof GM === 'object' && typeof GM.getValue === 'function') return GM.getValue(key, fallback);
        return fallback;
    }

    async function gmSetValue(key, value) {
        if (typeof GM_setValue === 'function') return GM_setValue(key, value);
        if (typeof GM === 'object' && typeof GM.setValue === 'function') return GM.setValue(key, value);
        throw new Error(text('storageUnavailable'));
    }

    function gmRegisterMenuCommand(name, callback) {
        try {
            if (typeof GM_registerMenuCommand === 'function') {
                GM_registerMenuCommand(name, callback);
                return;
            }
            if (typeof GM === 'object' && typeof GM.registerMenuCommand === 'function') {
                GM.registerMenuCommand(name, callback);
            }
        } catch (error) {
            console.warn('[No New Tab] Failed to register menu command:', error);
        }
    }

    async function loadConfig() {
        try {
            const storedValue = await gmGetValue(CONFIG_KEY, null);
            const parsedValue = typeof storedValue === 'string' ? JSON.parse(storedValue) : storedValue;
            return sanitizeConfig(parsedValue || createEmptyConfig());
        } catch (error) {
            console.warn('[No New Tab] Failed to load custom rules:', error);
            return createEmptyConfig();
        }
    }

    function refreshEffectiveRules() {
        effectiveRules = [...DEFAULT_RULES, ...userConfig.customRules];
    }

    async function saveConfig(nextConfig) {
        const sanitized = sanitizeConfig(nextConfig);
        // A JSON string also works in managers whose storage API only accepts primitive values.
        await gmSetValue(CONFIG_KEY, JSON.stringify(sanitized));
        userConfig = sanitized;
        refreshEffectiveRules();
    }

    async function addCustomRule(rule) {
        const normalized = normalizeRuleInput(rule.host, rule.includeSubdomains);
        if (DEFAULT_RULES.some(defaultRule => ruleCovers(defaultRule, normalized))) return 'default';
        if (userConfig.customRules.some(customRule => ruleCovers(customRule, normalized))) return 'existing';

        const remainingRules = userConfig.customRules.filter(customRule => !ruleCovers(normalized, customRule));
        await saveConfig({
            schemaVersion: CONFIG_VERSION,
            customRules: [...remainingRules, normalized]
        });
        return 'added';
    }

    async function removeCustomRule(rule) {
        await saveConfig({
            schemaVersion: CONFIG_VERSION,
            customRules: userConfig.customRules.filter(candidate => ruleKey(candidate) !== ruleKey(rule))
        });
    }

    function formatRule(rule) {
        return rule.includeSubdomains ? text('includesSubdomains', { host: rule.host }) : rule.host;
    }

    function showAlert(message) {
        try {
            PAGE_WINDOW.alert(`No New Tab\n\n${message}`);
        } catch {
            console.info('[No New Tab]', message);
        }
    }

    function confirmAction(message) {
        try {
            return PAGE_WINDOW.confirm(`No New Tab\n\n${message}`);
        } catch {
            return false;
        }
    }

    function registerMenuCommands() {
        const currentHost = normalizeHostname(location.hostname);
        const defaultRule = DEFAULT_RULES.find(rule => ruleMatchesHostname(rule, currentHost));
        const customRule = userConfig.customRules.find(rule => ruleMatchesHostname(rule, currentHost));

        if (defaultRule) {
            gmRegisterMenuCommand(text('menuDefaultEnabled', { host: currentHost }), openSettingsPanel);
        } else if (customRule) {
            gmRegisterMenuCommand(text('menuRemoveRule', { rule: formatRule(customRule) }), async () => {
                if (!confirmAction(text('confirmRemoveRule', { rule: formatRule(customRule) }))) return;
                try {
                    await removeCustomRule(customRule);
                    PAGE_WINDOW.location.reload();
                } catch (error) {
                    showAlert(text('deleteFailed', { error: error.message }));
                }
            });
        } else {
            gmRegisterMenuCommand(text('menuEnableCurrent', { host: currentHost }), async () => {
                try {
                    await addCustomRule({ host: currentHost, includeSubdomains: true });
                    PAGE_WINDOW.location.reload();
                } catch (error) {
                    showAlert(text('addFailed', { error: error.message }));
                }
            });
        }

        gmRegisterMenuCommand(text('menuManage'), openSettingsPanel);
    }

    async function waitForDocumentElement() {
        if (document.documentElement) return document.documentElement;
        await new Promise(resolve => document.addEventListener('DOMContentLoaded', resolve, { once: true }));
        return document.documentElement;
    }

    async function openSettingsPanel() {
        const existingHost = document.getElementById('no-new-tab-settings-host');
        if (existingHost) return;

        const mountPoint = await waitForDocumentElement();
        const host = document.createElement('div');
        host.id = 'no-new-tab-settings-host';
        const shadow = host.attachShadow({ mode: 'open' });
        shadow.innerHTML = `
            <style>
                :host { all: initial; }
                .backdrop {
                    position: fixed; inset: 0; z-index: 2147483647;
                    display: grid; place-items: center; padding: 24px;
                    background: rgba(15, 23, 42, .55); backdrop-filter: blur(6px);
                    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
                    color: #172033;
                }
                .panel {
                    width: min(720px, calc(100vw - 32px)); max-height: min(760px, calc(100vh - 32px));
                    overflow: auto; box-sizing: border-box; border-radius: 18px; padding: 22px;
                    background: #fff; box-shadow: 0 24px 80px rgba(15, 23, 42, .3);
                }
                header { display: flex; align-items: start; justify-content: space-between; gap: 16px; }
                h1 { margin: 0; font-size: 22px; line-height: 1.25; }
                h2 { margin: 0 0 10px; font-size: 15px; }
                p { margin: 7px 0 0; color: #64748b; font-size: 13px; line-height: 1.5; }
                button, input { font: inherit; }
                button {
                    border: 0; border-radius: 9px; padding: 8px 12px; cursor: pointer;
                    color: #1e293b; background: #e2e8f0;
                }
                button:hover { filter: brightness(.97); }
                button.primary { color: #fff; background: #2563eb; }
                button.danger { color: #b91c1c; background: #fee2e2; }
                button.icon { padding: 6px 10px; font-size: 18px; line-height: 1; background: transparent; }
                .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-top: 18px; }
                .card { border: 1px solid #e2e8f0; border-radius: 12px; padding: 14px; background: #f8fafc; }
                .list { display: grid; gap: 7px; max-height: 235px; overflow: auto; }
                .row {
                    display: flex; align-items: center; justify-content: space-between; gap: 10px;
                    min-height: 34px; box-sizing: border-box; padding: 7px 9px;
                    border-radius: 8px; background: #fff; font-size: 13px;
                }
                .empty { padding: 18px 8px; text-align: center; color: #94a3b8; font-size: 13px; }
                form { display: grid; grid-template-columns: 1fr auto; gap: 10px; margin-top: 14px; }
                input[type="text"] {
                    min-width: 0; border: 1px solid #cbd5e1; border-radius: 9px; padding: 9px 11px;
                    color: #0f172a; background: #fff; outline: none;
                }
                input[type="text"]:focus { border-color: #2563eb; box-shadow: 0 0 0 3px rgba(37, 99, 235, .12); }
                .option { grid-column: 1 / -1; display: flex; align-items: center; gap: 7px; font-size: 13px; color: #475569; }
                .status { min-height: 20px; margin-top: 8px; color: #2563eb; font-size: 13px; }
                .toolbar { display: flex; flex-wrap: wrap; justify-content: space-between; gap: 10px; margin-top: 18px; }
                .toolbar-group { display: flex; flex-wrap: wrap; gap: 8px; }
                @media (max-width: 620px) {
                    .backdrop { padding: 8px; }
                    .panel { padding: 17px; }
                    .grid { grid-template-columns: 1fr; }
                    form { grid-template-columns: 1fr; }
                    .option { grid-column: auto; }
                }
            </style>
            <div class="backdrop" role="presentation">
                <section class="panel" role="dialog" aria-modal="true" aria-labelledby="nnt-title" lang="${LANGUAGE === 'zh' ? 'zh-CN' : 'en'}">
                    <header>
                        <div>
                            <h1 id="nnt-title">${text('panelTitle')}</h1>
                            <p>${text('panelDescription')}</p>
                        </div>
                        <button class="icon" id="close" aria-label="${text('close')}">×</button>
                    </header>
                    <div class="grid">
                        <section class="card">
                            <h2>${text('builtInSites')}</h2>
                            <div class="list" id="default-list"></div>
                        </section>
                        <section class="card">
                            <h2>${text('mySites')}</h2>
                            <div class="list" id="custom-list"></div>
                        </section>
                    </div>
                    <form id="add-form">
                        <input type="text" id="domain" autocomplete="off" placeholder="${text('domainPlaceholder')}" aria-label="${text('domainLabel')}">
                        <button class="primary" type="submit">${text('addSite')}</button>
                        <label class="option"><input type="checkbox" id="subdomains" checked> ${text('includeSubdomains')}</label>
                    </form>
                    <div class="status" id="status" aria-live="polite"></div>
                    <p>${text('panelHelp')}</p>
                    <div class="toolbar">
                        <div class="toolbar-group">
                            <button type="button" id="export">${text('exportConfig')}</button>
                            <button type="button" id="import">${text('importConfig')}</button>
                        </div>
                        <div class="toolbar-group">
                            <button type="button" id="reload">${text('reloadPage')}</button>
                            <button class="primary" type="button" id="done">${text('done')}</button>
                        </div>
                    </div>
                </section>
            </div>`;

        mountPoint.appendChild(host);

        const defaultList = shadow.getElementById('default-list');
        const customList = shadow.getElementById('custom-list');
        const status = shadow.getElementById('status');
        const domainInput = shadow.getElementById('domain');
        const subdomainsInput = shadow.getElementById('subdomains');

        function closePanel() {
            host.remove();
        }

        function setStatus(message, isError = false) {
            status.textContent = message;
            status.style.color = isError ? '#b91c1c' : '#2563eb';
        }

        function createRuleRow(rule, removable) {
            const row = document.createElement('div');
            row.className = 'row';
            const label = document.createElement('span');
            label.textContent = formatRule(rule);
            row.appendChild(label);

            if (removable) {
                const removeButton = document.createElement('button');
                removeButton.type = 'button';
                removeButton.className = 'danger';
                removeButton.textContent = text('delete');
                removeButton.addEventListener('click', async () => {
                    if (!confirmAction(text('confirmRemoveRule', { rule: formatRule(rule) }))) return;
                    try {
                        await removeCustomRule(rule);
                        renderLists();
                        setStatus(text('ruleDeleted'));
                    } catch (error) {
                        setStatus(text('deleteFailed', { error: error.message }), true);
                    }
                });
                row.appendChild(removeButton);
            }
            return row;
        }

        function renderLists() {
            defaultList.replaceChildren(...DEFAULT_RULES.map(rule => createRuleRow(rule, false)));
            if (userConfig.customRules.length) {
                customList.replaceChildren(...userConfig.customRules.map(rule => createRuleRow(rule, true)));
            } else {
                const empty = document.createElement('div');
                empty.className = 'empty';
                empty.textContent = text('noCustomSites');
                customList.replaceChildren(empty);
            }
        }

        shadow.getElementById('add-form').addEventListener('submit', async event => {
            event.preventDefault();
            try {
                const rule = normalizeRuleInput(domainInput.value, subdomainsInput.checked);
                const result = await addCustomRule(rule);
                if (result === 'default') {
                    setStatus(text('alreadyDefault'));
                } else if (result === 'existing') {
                    setStatus(text('alreadyCustom'));
                } else {
                    domainInput.value = '';
                    renderLists();
                    const needsReload = !interceptorStarted && ruleMatchesHostname(rule, location.hostname);
                    setStatus(needsReload ? text('siteAddedReload') : text('siteAdded'));
                }
            } catch (error) {
                setStatus(error.message, true);
            }
        });

        shadow.getElementById('export').addEventListener('click', () => {
            const exported = JSON.stringify(userConfig, null, 2);
            PAGE_WINDOW.prompt(text('exportPrompt'), exported);
        });

        shadow.getElementById('import').addEventListener('click', async () => {
            const raw = PAGE_WINDOW.prompt(text('importPrompt'));
            if (raw === null || !raw.trim()) return;
            try {
                const parsed = JSON.parse(raw);
                const imported = sanitizeConfig(parsed);
                const sourceCount = Array.isArray(parsed) ? parsed.length : parsed && Array.isArray(parsed.customRules) ? parsed.customRules.length : 0;
                if (sourceCount > 0 && imported.customRules.length === 0) throw new Error(text('noUsableRules'));
                if (!confirmAction(text('confirmImport', {
                    incoming: imported.customRules.length,
                    current: userConfig.customRules.length
                }))) return;
                await saveConfig(imported);
                renderLists();
                setStatus(text('configImported'));
            } catch (error) {
                setStatus(text('importFailed', { error: error.message }), true);
            }
        });

        shadow.getElementById('reload').addEventListener('click', () => PAGE_WINDOW.location.reload());
        shadow.getElementById('close').addEventListener('click', closePanel);
        shadow.getElementById('done').addEventListener('click', closePanel);
        shadow.querySelector('.backdrop').addEventListener('click', event => {
            if (event.target === event.currentTarget) closePanel();
        });
        shadow.addEventListener('keydown', event => {
            if (event.key === 'Escape') closePanel();
        });

        renderLists();
        domainInput.focus();
    }

    function isHttpUrl(url) {
        try {
            if (!url) return false;
            const parsed = new URL(String(url), location.href);
            return parsed.protocol === 'http:' || parsed.protocol === 'https:';
        } catch {
            return false;
        }
    }

    function isHttpForm(form) {
        try {
            return isHttpUrl(form.action || location.href);
        } catch {
            return false;
        }
    }

    function hasBlankTarget(element) {
        if (!element || !element.getAttribute) return false;
        return String(element.getAttribute('target') || '').toLowerCase() === '_blank';
    }

    function rememberUserRequestedNewContext(event) {
        const requested = Boolean(event && (
            event.button === 1 ||
            event.metaKey ||
            event.ctrlKey ||
            event.shiftKey ||
            event.altKey
        ));
        if (!requested) return false;

        userRequestedNewContext = true;
        const sequence = ++userIntentSequence;
        Promise.resolve().then(() => {
            if (sequence === userIntentSequence) userRequestedNewContext = false;
        });
        return true;
    }

    function findAnchorInPath(path) {
        for (const element of path) {
            if (!element || element === PAGE_WINDOW || element === window || element === document) continue;
            if (element.tagName === 'A' && element.href) return element;
            if (element.getAttribute && (
                element.getAttribute('data-href') ||
                element.getAttribute('href') ||
                element.getAttribute('data-url') ||
                element.getAttribute('data-link')
            )) return element;
        }
        return null;
    }

    function extractHrefFromElement(element) {
        if (!element) return null;
        if (element.tagName === 'A' && element.href) return element.href;
        const rawHref = element.getAttribute && (
            element.getAttribute('data-href') ||
            element.getAttribute('href') ||
            element.getAttribute('data-url') ||
            element.getAttribute('data-link')
        );
        if (!rawHref) return null;
        try {
            return new URL(rawHref, location.href).href;
        } catch {
            return null;
        }
    }

    function navigateInPlace(url) {
        if (!url) return;
        try {
            PAGE_WINDOW.location.href = url;
        } catch (error) {
            console.error('[No New Tab] Navigation failed:', error);
        }
    }

    function exportForPage(fn) {
        try {
            if (typeof exportFunction === 'function') return exportFunction(fn, PAGE_WINDOW);
        } catch {
            // Direct assignment works in page/raw contexts and is the fallback elsewhere.
        }
        return fn;
    }

    function patchWindowOpen() {
        try {
            const originalOpen = PAGE_WINDOW.open;
            if (typeof originalOpen !== 'function') return;
            const replacement = function (...args) {
                try {
                    const rawUrl = args[0];
                    const candidate = typeof rawUrl === 'string' ? rawUrl : rawUrl && rawUrl.href;
                    const target = String(args[1] || '_blank').toLowerCase();
                    const alreadyUsesCurrentContext = target === '_self' || target === '_top' || target === '_parent';
                    if (candidate && isHttpUrl(candidate) && !alreadyUsesCurrentContext && !userRequestedNewContext) {
                        navigateInPlace(candidate);
                        return null;
                    }
                } catch {
                    // Fall through to the website's original implementation.
                }
                return Reflect.apply(originalOpen, this, args);
            };
            PAGE_WINDOW.open = exportForPage(replacement);
        } catch (error) {
            console.warn('[No New Tab] Failed to patch window.open:', error);
        }
    }

    function patchSetAttribute() {
        try {
            const prototype = PAGE_WINDOW.Element && PAGE_WINDOW.Element.prototype;
            const originalSetAttribute = prototype && prototype.setAttribute;
            if (typeof originalSetAttribute !== 'function') return;
            const replacement = function (name, value) {
                try {
                    if (String(name).toLowerCase() === 'target' && String(value).toLowerCase() === '_blank' && this.tagName === 'A') {
                        const href = this.href || this.getAttribute('href') || this.getAttribute('data-href');
                        if (href && isHttpUrl(href)) {
                            return Reflect.apply(originalSetAttribute, this, [name, '_self']);
                        }
                    }
                } catch {
                    // Fall through to the website's original implementation.
                }
                return Reflect.apply(originalSetAttribute, this, [name, value]);
            };
            prototype.setAttribute = exportForPage(replacement);
        } catch (error) {
            console.warn('[No New Tab] Failed to patch setAttribute:', error);
        }
    }

    function patchAttachShadow() {
        try {
            const prototype = PAGE_WINDOW.Element && PAGE_WINDOW.Element.prototype;
            const originalAttachShadow = prototype && prototype.attachShadow;
            if (typeof originalAttachShadow !== 'function') return;
            const replacement = function (...args) {
                const shadowRoot = Reflect.apply(originalAttachShadow, this, args);
                try {
                    observeRoot(shadowRoot);
                } catch {
                    // A closed/inaccessible shadow root still retains its normal behavior.
                }
                return shadowRoot;
            };
            prototype.attachShadow = exportForPage(replacement);
        } catch (error) {
            console.warn('[No New Tab] Failed to patch attachShadow:', error);
        }
    }

    function onClickCapture(event) {
        try {
            const preserveNewContext = rememberUserRequestedNewContext(event);
            if (event.defaultPrevented || preserveNewContext) return;
            const path = event.composedPath ? event.composedPath() : (event.path || [event.target]);
            const anchor = findAnchorInPath(path);
            const href = extractHrefFromElement(anchor);
            if (anchor && anchor.tagName === 'A' && hasBlankTarget(anchor) && href && isHttpUrl(href)) {
                anchor.removeAttribute('target');
            }
        } catch {
            // Keep the website functional if an unusual element cannot be inspected.
        }
    }

    function onUserNewContextIntentCapture(event) {
        rememberUserRequestedNewContext(event);
    }

    function onKeyDownCapture(event) {
        try {
            if (event.key !== 'Enter' && event.keyCode !== 13) return;
            if (rememberUserRequestedNewContext(event)) return;
            const target = event.target;
            const isTextInput = target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA');

            if (isTextInput && matchesAnyRule(location.hostname, [{ host: 'bilibili.com', includeSubdomains: true }])) {
                const placeholder = target.getAttribute('placeholder') || '';
                const ariaLabel = target.getAttribute('aria-label') || '';
                const isSearchInput = /搜索|查找|Search/i.test(placeholder + ariaLabel) || target.closest('form[role="search"], [role="search"]');
                if (isSearchInput && !target.classList.contains('search-bar-input')) {
                    const keyword = (target.value || target.textContent || '').trim();
                    if (keyword) {
                        event.preventDefault();
                        event.stopPropagation();
                        event.stopImmediatePropagation();
                        navigateInPlace(`https://search.bilibili.com/all?keyword=${encodeURIComponent(keyword)}`);
                        return;
                    }
                }
            }

            const focused = document.activeElement;
            const href = extractHrefFromElement(focused);
            if (focused && focused.tagName === 'A' && hasBlankTarget(focused) && href && isHttpUrl(href)) {
                focused.removeAttribute('target');
            }
        } catch {
            // Keep normal keyboard behavior on unexpected page structures.
        }
    }

    function onSubmitCapture(event) {
        try {
            const form = event.target;
            if (form && form.tagName === 'FORM' && hasBlankTarget(form) && isHttpForm(form)) {
                form.removeAttribute('target');
            }
        } catch {
            // Keep normal form submission on unexpected page structures.
        }
    }

    function attachRootListeners(root) {
        root.addEventListener('click', onClickCapture, true);
        root.addEventListener('auxclick', onUserNewContextIntentCapture, true);
        root.addEventListener('mousedown', onUserNewContextIntentCapture, true);
        root.addEventListener('keydown', onKeyDownCapture, true);
        root.addEventListener('submit', onSubmitCapture, true);
    }

    function cleanTargetElement(element) {
        if (!element || element.nodeType !== 1) return;
        if (element.tagName === 'A' && hasBlankTarget(element)) {
            const href = element.href || element.getAttribute('href') || element.getAttribute('data-href');
            if (href && isHttpUrl(href)) element.removeAttribute('target');
        } else if (element.tagName === 'FORM' && hasBlankTarget(element) && isHttpForm(element)) {
            element.removeAttribute('target');
        }
    }

    function cleanElementAndDescendants(element) {
        cleanTargetElement(element);
        if (!element || !element.querySelectorAll) return;
        element.querySelectorAll('a[target]').forEach(anchor => cleanTargetElement(anchor));
        element.querySelectorAll('form[target]').forEach(form => cleanTargetElement(form));
    }

    function observeRoot(root) {
        if (!root || observedRoots.has(root)) return;
        observedRoots.add(root);
        attachRootListeners(root);

        const observer = new MutationObserver(mutations => {
            try {
                for (const mutation of mutations) {
                    if (mutation.type === 'attributes' && mutation.attributeName === 'target') {
                        cleanTargetElement(mutation.target);
                    }
                    if (mutation.addedNodes && mutation.addedNodes.length) {
                        mutation.addedNodes.forEach(node => cleanElementAndDescendants(node));
                    }
                }
            } catch {
                // Ignore a single inaccessible node and continue observing future changes.
            }
        });

        const observationTarget = root === document ? document.documentElement : root;
        if (observationTarget) {
            observer.observe(observationTarget, {
                childList: true,
                subtree: true,
                attributes: true,
                attributeFilter: ['target']
            });
            cleanElementAndDescendants(observationTarget);
        }
    }

    function observeExistingShadowRoots() {
        try {
            document.querySelectorAll('*').forEach(element => {
                if (element.shadowRoot) observeRoot(element.shadowRoot);
            });
        } catch {
            // Some custom elements may deny access to their shadow roots.
        }
    }

    function attachBilibiliSearchButtonInterceptor() {
        if (!matchesAnyRule(location.hostname, [{ host: 'bilibili.com', includeSubdomains: true }])) return;
        document.addEventListener('click', event => {
            if (userRequestedNewContext) return;
            const eventTarget = event.target;
            if (!eventTarget || eventTarget.tagName === 'INPUT' || eventTarget.tagName === 'TEXTAREA') return;

            let target = eventTarget;
            while (target && target !== document) {
                if (target.tagName === 'BUTTON' || (target.className && typeof target.className === 'string')) {
                    const className = typeof target.className === 'string' ? target.className : '';
                    const isSearchButton =
                        className.includes('search-btn') ||
                        className.includes('nav-search-submit') ||
                        className.includes('nav-search-btn') ||
                        className.includes('search-submit') ||
                        (className.includes('submit') && !className.includes('submit-move')) ||
                        target.getAttribute('title') === '执行';
                    if (isSearchButton) {
                        const form = target.closest('form');
                        const input = form
                            ? form.querySelector('input')
                            : document.querySelector('input[placeholder*="搜索"], input[aria-label*="搜索"]');
                        const keyword = input && input.value ? input.value.trim() : '';
                        if (!keyword) return;
                        event.preventDefault();
                        event.stopPropagation();
                        event.stopImmediatePropagation();
                        navigateInPlace(`https://search.bilibili.com/all?keyword=${encodeURIComponent(keyword)}`);
                        return;
                    }
                }
                target = target.parentElement;
            }
        }, true);
    }

    function startInterceptor() {
        if (interceptorStarted) return;
        interceptorStarted = true;
        patchWindowOpen();
        patchSetAttribute();
        patchAttachShadow();
        observeRoot(document);
        attachBilibiliSearchButtonInterceptor();

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', observeExistingShadowRoots, { once: true });
        } else {
            observeExistingShadowRoots();
        }
    }

    async function bootstrap() {
        // Preserve document-start interception for built-in websites while async managers load storage.
        if (matchesAnyRule(location.hostname, DEFAULT_RULES)) startInterceptor();

        userConfig = await loadConfig();
        refreshEffectiveRules();
        registerMenuCommands();

        if (!interceptorStarted && matchesAnyRule(location.hostname)) startInterceptor();
    }

    bootstrap().catch(error => console.error('[No New Tab] Startup failed:', error));
})();
