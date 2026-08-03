import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';

const scriptUrl = new URL('../no_new_tab.user.js', import.meta.url);
const source = fs.readFileSync(scriptUrl, 'utf8');
const bootstrapCall = "    bootstrap().catch(error => console.error('[No New Tab] Startup failed:', error));";
const testExport = `    globalThis.__noNewTabTestApi = {
        DEFAULT_RULES,
        LANGUAGE,
        TRANSLATIONS,
        text,
        normalizeRuleInput,
        ruleCovers,
        ruleMatchesHostname,
        matchesAnyRule,
        sanitizeConfig,
        loadConfig,
        saveConfig
    };`;

assert.ok(source.includes(bootstrapCall), 'test harness could not find the userscript bootstrap call');

const context = {
    URL,
    WeakSet,
    console,
    navigator: {
        language: 'zh-CN',
        languages: ['zh-CN']
    },
    location: {
        hostname: 'disabled.example',
        href: 'https://disabled.example/'
    }
};
context.window = context;
vm.runInNewContext(source.replace(bootstrapCall, testExport), context, { filename: scriptUrl.pathname });

const api = context.__noNewTabTestApi;

test('Chinese and English translation tables contain the same keys', () => {
    assert.match(source, /\/\/ @version\s+6\.1\.0\s*$/m);
    assert.match(source, /@description\s+禁止 B站、知乎、微博、小红书等网站强制新标签页打开链接/);
    assert.match(source, /@description:en\s+Block Bilibili, Zhihu, Weibo, RedNote/);
    assert.match(source, /\/\/ @author\s+Jingyuan Zheng/);
    assert.deepEqual(
        Object.keys(api.TRANSLATIONS.zh).sort(),
        Object.keys(api.TRANSLATIONS.en).sort()
    );
    assert.equal(api.LANGUAGE, 'zh');
    assert.equal(api.text('panelTitle'), 'No New Tab 网站管理');
});

test('normalizes domains, URLs, wildcards, and IDNs', () => {
    assert.deepEqual(
        { ...api.normalizeRuleInput('https://News.Example.com/path', false) },
        { host: 'news.example.com', includeSubdomains: false }
    );
    assert.deepEqual(
        { ...api.normalizeRuleInput('*.example.com', false) },
        { host: 'example.com', includeSubdomains: true }
    );
    assert.deepEqual(
        { ...api.normalizeRuleInput('例子.测试', true) },
        { host: 'xn--fsqu00a.xn--0zwm56d', includeSubdomains: true }
    );
});

test('rejects unsupported protocols and malformed input', () => {
    assert.throws(() => api.normalizeRuleInput('ftp://example.com'), /HTTP/);
    assert.throws(() => api.normalizeRuleInput(''), /请输入/);
});

test('matches exact hosts and subdomains without suffix confusion', () => {
    const wildcardRule = api.normalizeRuleInput('example.com', true);
    const exactRule = api.normalizeRuleInput('news.example.com', false);

    assert.equal(api.ruleMatchesHostname(wildcardRule, 'example.com'), true);
    assert.equal(api.ruleMatchesHostname(wildcardRule, 'www.example.com'), true);
    assert.equal(api.ruleMatchesHostname(wildcardRule, 'badexample.com'), false);
    assert.equal(api.ruleMatchesHostname(exactRule, 'news.example.com'), true);
    assert.equal(api.ruleMatchesHostname(exactRule, 'sub.news.example.com'), false);
    assert.equal(api.matchesAnyRule('www.gov.cn', api.DEFAULT_RULES), true);
    assert.equal(api.matchesAnyRule('www.cppcc.gov.cn', api.DEFAULT_RULES), true);
});

test('detects when a broader rule covers a narrower rule', () => {
    const parent = api.normalizeRuleInput('example.com', true);
    const child = api.normalizeRuleInput('news.example.com', false);
    const exactParent = api.normalizeRuleInput('example.com', false);

    assert.equal(api.ruleCovers(parent, child), true);
    assert.equal(api.ruleCovers(exactParent, child), false);
});

test('sanitizes persisted user rules without deleting rules later covered by defaults', () => {
    const result = api.sanitizeConfig({
        schemaVersion: 99,
        customRules: [
            { host: 'example.com', includeSubdomains: true },
            { host: 'example.com', includeSubdomains: true },
            { host: 'www.bilibili.com', includeSubdomains: false },
            { host: '', includeSubdomains: false }
        ]
    });

    assert.equal(result.schemaVersion, 1);
    assert.deepEqual(
        Array.from(result.customRules, rule => ({ ...rule })),
        [
            { host: 'example.com', includeSubdomains: true },
            { host: 'www.bilibili.com', includeSubdomains: false }
        ]
    );
});

test('stores configuration as JSON text and reads it back for conservative managers', async () => {
    let storedValue;
    context.GM_setValue = (_key, value) => {
        storedValue = value;
    };

    await api.saveConfig({
        schemaVersion: 1,
        customRules: [{ host: 'persisted.example', includeSubdomains: true }]
    });
    assert.equal(typeof storedValue, 'string');
    assert.equal(JSON.parse(storedValue).customRules[0].host, 'persisted.example');

    context.GM_getValue = () => storedValue;
    const loaded = await api.loadConfig();
    assert.deepEqual(
        Array.from(loaded.customRules, rule => ({ ...rule })),
        [{ host: 'persisted.example', includeSubdomains: true }]
    );
});

test('an unconfigured website registers menus without starting invasive interception', async () => {
    const menuNames = [];
    const startupErrors = [];
    const smokeContext = {
        URL,
        WeakSet,
        navigator: {
            language: 'zh-CN',
            languages: ['zh-CN']
        },
        location: {
            hostname: 'disabled.example',
            href: 'https://disabled.example/'
        },
        GM_getValue: (_key, fallback) => fallback,
        GM_setValue: () => undefined,
        GM_registerMenuCommand: name => menuNames.push(name),
        console: {
            ...console,
            error: (...args) => startupErrors.push(args)
        }
    };
    smokeContext.window = smokeContext;

    vm.runInNewContext(source, smokeContext, { filename: scriptUrl.pathname });
    await new Promise(resolve => setImmediate(resolve));

    assert.equal(startupErrors.length, 0);
    assert.equal(menuNames.length, 2);
    assert.match(menuNames[0], /在当前网站启用/);
    assert.match(menuNames[1], /管理网站列表/);
});

test('an enabled website forces site-requested external links but preserves explicit user intent', async () => {
    const listeners = new Map();
    const menuNames = [];
    const originalOpenCalls = [];

    class MockElement {
        constructor(tagName = 'DIV') {
            this.tagName = tagName;
            this.nodeType = 1;
            this.attributes = new Map();
            this.href = '';
        }

        addEventListener() {}
        querySelectorAll() { return []; }
        matches(selector) {
            return selector === 'a[target="_blank"]'
                ? this.tagName === 'A' && this.getAttribute('target') === '_blank'
                : selector === 'form[target="_blank"]' && this.tagName === 'FORM' && this.getAttribute('target') === '_blank';
        }
        setAttribute(name, value) { this.attributes.set(name, value); }
        getAttribute(name) { return this.attributes.get(name) ?? null; }
        removeAttribute(name) { this.attributes.delete(name); }
        attachShadow() { return new MockElement('SHADOW-ROOT'); }
    }

    class MockMutationObserver {
        observe() {}
    }

    const documentElement = new MockElement('HTML');
    const document = {
        documentElement,
        readyState: 'loading',
        activeElement: null,
        addEventListener(type, callback) {
            const callbacks = listeners.get(type) || [];
            callbacks.push(callback);
            listeners.set(type, callbacks);
        }
    };
    const location = {
        hostname: 'www.bilibili.com',
        href: 'https://www.bilibili.com/'
    };
    const enabledContext = {
        URL,
        WeakSet,
        Element: MockElement,
        MutationObserver: MockMutationObserver,
        navigator: {
            language: 'zh-CN',
            languages: ['zh-CN']
        },
        document,
        location,
        GM_getValue: () => ({
            schemaVersion: 1,
            customRules: [{ host: 'custom.example', includeSubdomains: true }]
        }),
        GM_setValue: () => undefined,
        GM_registerMenuCommand: name => menuNames.push(name),
        console,
        open(...args) {
            originalOpenCalls.push(args);
            return 'original-open';
        }
    };
    enabledContext.window = enabledContext;

    vm.runInNewContext(source, enabledContext, { filename: scriptUrl.pathname });

    assert.equal((listeners.get('keydown') || []).length, 1, 'document keydown listener should not be duplicated');
    assert.ok(enabledContext.open('https://www.bilibili.com/video/BV1'));
    assert.equal(location.href, 'https://www.bilibili.com/video/BV1');
    assert.ok(enabledContext.open('https://example.com/'));
    assert.equal(location.href, 'https://example.com/');
    assert.equal(originalOpenCalls.length, 0);

    const anchor = new MockElement('A');
    anchor.href = 'https://external.example/article';
    anchor.setAttribute('target', '_blank');
    assert.equal(anchor.getAttribute('target'), '_self');

    const clickCapture = listeners.get('click')[0];
    const lateAnchor = new MockElement('A');
    lateAnchor.href = 'https://late.example/article';
    lateAnchor.attributes.set('target', '_blank');
    clickCapture({
        button: 0,
        defaultPrevented: false,
        target: lateAnchor,
        composedPath: () => [lateAnchor]
    });
    assert.equal(lateAnchor.getAttribute('target'), null);

    clickCapture({
        button: 0,
        ctrlKey: true,
        defaultPrevented: false,
        target: anchor,
        composedPath: () => [anchor]
    });
    assert.equal(enabledContext.open('https://ctrl-click.example/'), 'original-open');

    listeners.get('auxclick')[0]({ button: 1 });
    assert.equal(enabledContext.open('https://middle-click.example/'), 'original-open');
    assert.equal(originalOpenCalls.length, 2);

    await new Promise(resolve => setImmediate(resolve));
    assert.equal(menuNames.length, 2);
    assert.match(menuNames[0], /内置规则启用/);
    assert.ok(enabledContext.open('https://sub.custom.example/article'));
    assert.equal(location.href, 'https://sub.custom.example/article');
    assert.equal(originalOpenCalls.length, 2);
});

test('intercepts Bilibili UP avatar clicks, anchor target properties, and blank window.open calls', async () => {
    const listeners = new Map();
    let currentLocation = 'https://www.bilibili.com/video/BV1xx411c7xx';

    class MockAnchor {
        constructor() {
            this.tagName = 'A';
            this.nodeType = 1;
            this._target = '_self';
            this.href = 'https://space.bilibili.com/3546975127472355/?spm_id_from=333.788.upinfo.head.click';
        }
        getAttribute(name) { return name === 'target' ? this._target : null; }
        setAttribute(name, val) { if (name === 'target') this._target = val; }
        removeAttribute(name) { if (name === 'target') this._target = null; }
    }

    Object.defineProperty(MockAnchor.prototype, 'target', {
        get() { return this._target; },
        set(val) { this._target = val; },
        configurable: true
    });

    const mockLocation = {
        hostname: 'www.bilibili.com',
        get href() { return currentLocation; },
        set href(val) { currentLocation = val; }
    };

    const mockDoc = {
        documentElement: new MockAnchor(),
        readyState: 'complete',
        addEventListener(type, cb) {
            const arr = listeners.get(type) || [];
            arr.push(cb);
            listeners.set(type, arr);
        }
    };

    const bContext = {
        URL,
        WeakSet,
        Proxy,
        Element: MockAnchor,
        HTMLAnchorElement: MockAnchor,
        MutationObserver: class { observe() {} },
        navigator: { language: 'zh-CN', languages: ['zh-CN'] },
        document: mockDoc,
        location: mockLocation,
        GM_getValue: () => null,
        GM_setValue: () => undefined,
        GM_registerMenuCommand: () => {},
        console,
        open: () => 'original'
    };
    bContext.window = bContext;

    vm.runInNewContext(source, bContext, { filename: scriptUrl.pathname });

    // 1. Property assignment anchor.target = '_blank'
    const avatarAnchor = new MockAnchor();
    avatarAnchor.target = '_blank';
    assert.equal(avatarAnchor.target, '_self');

    // 2. Blank window.open ('', '_blank') followed by location assignment
    const winProxy = bContext.open('', '_blank');
    assert.ok(winProxy && typeof winProxy === 'object');
    winProxy.location.href = 'https://space.bilibili.com/3546975127472355/';
    assert.equal(currentLocation, 'https://space.bilibili.com/3546975127472355/');

    // 3. Direct window.open(url, '_blank') call
    bContext.open('https://space.bilibili.com/123456/', '_blank');
    assert.equal(currentLocation, 'https://space.bilibili.com/123456/');
});

test('an English browser receives English menus and validation messages', async () => {
    const menuNames = [];
    const englishContext = {
        URL,
        WeakSet,
        navigator: {
            language: 'en-US',
            languages: ['en-US']
        },
        location: {
            hostname: 'disabled.example',
            href: 'https://disabled.example/'
        },
        GM_getValue: (_key, fallback) => fallback,
        GM_setValue: () => undefined,
        GM_registerMenuCommand: name => menuNames.push(name),
        console
    };
    englishContext.window = englishContext;

    const englishSource = source.replace(bootstrapCall, testExport);
    vm.runInNewContext(englishSource, englishContext, { filename: scriptUrl.pathname });
    const englishApi = englishContext.__noNewTabTestApi;
    assert.equal(englishApi.LANGUAGE, 'en');
    assert.equal(englishApi.text('panelTitle'), 'No New Tab Website Manager');
    assert.equal(englishApi.text('addSite'), 'Add website');
    assert.throws(() => englishApi.normalizeRuleInput(''), /Enter a website domain or URL/);

    vm.runInNewContext(source, englishContext, { filename: scriptUrl.pathname });
    await new Promise(resolve => setImmediate(resolve));
    assert.match(menuNames[0], /Enable on this website/);
    assert.match(menuNames[1], /Manage website list/);
});
