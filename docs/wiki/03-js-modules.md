# JS 模块说明

本项目的 JS 分为两套目录：

- 源码：`/js/**`
- 页面实际引用的构建产物：`/js/build/**`

以下以源码目录为主进行说明（构建目录与之对应）。

## 入口：main.js

文件：[main.js](file:///workspace/js/main.js#L1-L85)

- `main.themeInfo`：主题信息（version/author/repo）
- `main.styleStatus`：运行时 UI 状态（暗黑模式、字体级别、侧栏开关等），持久化到 localStorage
  - `setStyleStatus()` / `getStyleStatus()`：读写 localStorage（key: `REDEFINE-THEME-STATUS`）
- `main.refresh()`：统一初始化入口
  - 总是初始化：`initUtils()`、`initModeToggle()`、`initScrollTopBottom()`、`initBookmarkNav()`
  - 按配置启用：
    - 首页副标题打字机：`initTyped("subtitle")`
    - 搜索：`initLocalSearch()`
    - 代码块复制：`initCopyCode()`
    - 图片懒加载：`initLazyLoad()`
- `initMain()`：`DOMContentLoaded` 执行，并打印主题信息到控制台
- Swup：`swup.hooks.on("page:view")` 再次调用 `main.refresh()`，保证 PJAX 切换后组件可用

## 基础工具：utils.js

文件：[utils.js](file:///workspace/js/utils.js#L1-L383)

### 关键导出

- `navigationState`：用于 Swup 导航过程中的状态标识（避免滚动期间反复触发 shrink 等逻辑）
  - 见 [utils.js](file:///workspace/js/utils.js#L7-L9)
- `initUtils()`：对页面的基础交互进行集中初始化

### initUtils() 的核心能力（按职责分组）

- **滚动状态与 UI 联动**
  - `updateScrollStyle()`：计算滚动进度百分比，并驱动：
    - 进度条 `updateScrollProgressBar()`
    - 百分比回到顶部按钮 `updateScrollPercent()`
    - 顶部导航自动隐藏 `updatePageTopVisibility()`
  - `registerWindowScroll()`：注册 scroll 事件，触发 TOC/导航收缩/工具栏自动隐藏等
- **TOC 联动**
  - `updateTOCScroll()`：调用 `initTOC().updateActiveTOCLink()` 进行当前章节高亮
  - 依赖 [toc.js](file:///workspace/js/layouts/toc.js#L5-L106)
- **导航栏收缩**
  - `updateNavbarShrink()`：调用 `navbarShrink.init()`
  - 依赖 [navbarShrink.js](file:///workspace/js/layouts/navbarShrink.js#L3-L119)
- **首页 Banner 模糊效果**
  - `updateHomeBannerBlur()`：在首页且 `theme.home_banner.style === "fixed"` 时，根据滚动位置设置背景模糊
- **右侧工具栏自动隐藏**
  - `updateAutoHideTools()`：顶部/底部附近自动隐藏 `.right-side-tools-container` 与 `#aplayer`
- **工具栏折叠/展开**
  - `toggleToolsList()`：支持 `theme.global.side_tools.auto_expand`
- **全局字体大小调整**
  - `globalFontSizeAdjust()`：调整 `html` font-size，并写入 `main.styleStatus.fontSizeLevel`
- **评论锚点滚动**
  - `goComment()`：滚动到 `#comment-anchor`
- **页面高度兜底**
  - `initPageHeightHandle()`：当页面高度不足一屏时给 footer 增加 margin-top
- **首页文章相对时间**
  - `relativeTimeInHome()`：基于 `window.lang_ago` 与 `theme.home.article_date_format` 展示 “x days ago”
- **图片查看器**
  - `imageViewer()`：最后调用图片查看器工具模块（实现见 `tools/imageViewer.js`）

## Tools：通用工具模块

### 暗黑/浅色切换：lightDarkSwitch.js

文件：[lightDarkSwitch.js](file:///workspace/js/tools/lightDarkSwitch.js#L43-L165)

- `ModeToggle`：核心对象
  - `enableLightMode()` / `enableDarkMode()`：切换 `body/html` class，并更新 `main.styleStatus.isDark`
  - `initModeStatus()`：优先读取 `localStorage`，否则跟随系统主题偏好
  - `initModeToggleButton()`：绑定 `.tool-dark-light-toggle` 点击事件
  - `initModeAutoTrigger()`：监听 `prefers-color-scheme` 的变化
  - `mermaidInit(theme)`：若页面存在 Mermaid，则切换主题后重新渲染
  - `setGiscusTheme()`：若存在 giscus iframe，则 postMessage 同步主题

### 本地搜索：localSearch.js

文件：[localSearch.js](file:///workspace/js/tools/localSearch.js#L1-L327)

- 依赖 `config.path`（由 Hexo `hexo-generator-searchdb` 插件提供）
- `fetchData()`：加载 `search.xml` 或 `search.json`，解析为 `{ title, content, url }[]`
- `inputEventFunction()`：根据关键词在 title/content 中做命中切片与高亮，生成结果列表 HTML
- 弹窗控制：`.search-popup-trigger` 打开、overlay/close 点击关闭、Esc 关闭
- PJAX：在 `swup page:view` 时自动关闭弹窗，避免跨页残留

### 代码块：codeBlock.js

文件：[codeBlock.js](file:///workspace/js/tools/codeBlock.js#L1-L48)

- 在每个 `figure.highlight` 外包裹 `.highlight-container`
- 注入复制按钮与折叠按钮
- 复制：使用 `navigator.clipboard.writeText(code)`
- 折叠：切换 `.folded` class

### 滚动到顶/底：scrollTopBottom.js

文件：[scrollTopBottom.js](file:///workspace/js/tools/scrollTopBottom.js#L1-L34)

- 绑定 `.tool-scroll-to-top` / `.tool-scroll-to-bottom`
- `window.scrollTo({ behavior: "smooth" })`

## Layouts：布局增强模块

### 导航栏收缩与抽屉：navbarShrink.js

文件：[navbarShrink.js](file:///workspace/js/layouts/navbarShrink.js#L3-L135)

- `navbarShrink.init()`：
  - 计算 navbar 高度
  - 注册 `scroll` 触发 `shrink()`
  - 初始化抽屉显示 `togglenavbarDrawerShow()`
  - 初始化子菜单展开 `toggleSubmenu()`（依赖全局 `anime`）
- Swup：
  - `page:view`：重新 init，并将 `navigationState.isNavigating = false`
  - `visit:start`：置 `isNavigating = true` 并移除 `navbar-shrink`

### 文章目录：toc.js

文件：[toc.js](file:///workspace/js/layouts/toc.js#L5-L115)

- `initTOC()`：
  - `registerTOCScroll()`：将 toc 链接映射到正文标题 DOM
  - `updateActiveTOCLink()`：滚动时根据 heading 位置激活 toc 项
  - `activateTOCLink(index)`：切换 `.active/.active-current` 并让 toc 容器滚动到视口中心附近
  - `showTOCAside()`：使用 `main.getStyleStatus().isOpenPageAside` 与 `theme.articles.toc.init_open` 控制侧栏开关
- Swup：`page:view` 重新执行 `initTOC()`

### 图片懒加载：lazyload.js

文件：[lazyload.js](file:///workspace/js/layouts/lazyload.js#L1-L22)

- 监听带 `lazyload` 属性的 `<img>`
- 进入视口后，将 `data-src` 赋值到 `src` 并移除 `lazyload`

## Plugins：可选插件模块

### 打字机：typed.js

文件：[typed.js](file:///workspace/js/plugins/typed.js#L4-L62)

- 依赖第三方库 `Typed`（全局变量）
- `initTyped(id)`：
  - 可选从 `theme.home_banner.subtitle.hitokoto.api` 拉取一言 API 作为文案
  - 否则使用 `theme.home_banner.subtitle.text` 的句子列表

### Hexo Blog Encrypt：hbe.js

文件：[hbe.js](file:///workspace/js/plugins/hbe.js#L4-L335)

- 用途：前端解密被加密的文章内容（AES-CBC + PBKDF2 + HMAC 校验）
- 关键点：
  - localStorage 缓存派生 key/iv/hmac key（按 pathname 维度）
  - 解密成功后：
    - 将解密内容写回 `#hexo-blog-encrypt`
    - 调用 `main.refresh()` 与 `initTOC()`，让页面组件在“解密后的 DOM”上重新初始化
    - 触发 `hexo-blog-decrypt` 事件

