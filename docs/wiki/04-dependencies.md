# 依赖关系

## 内部模块依赖（ESModule）

入口模块 `main.js` 通过 import 组织内部能力，整体呈“入口 → 工具/布局/插件” 的依赖方向。

关键依赖点（非穷举）：

- [main.js](file:///workspace/js/main.js#L1-L10)
  - `./utils.js`
  - `./plugins/typed.js`
  - `./tools/lightDarkSwitch.js`
  - `./layouts/lazyload.js`
  - `./tools/scrollTopBottom.js`
  - `./tools/localSearch.js`
  - `./tools/codeBlock.js`
  - `./layouts/bookmarkNav.js`
- [utils.js](file:///workspace/js/utils.js#L1-L6)
  - `./layouts/navbarShrink.js`
  - `./layouts/toc.js`
  - `./main.js`
  - `./tools/imageViewer.js`
- [navbarShrink.js](file:///workspace/js/layouts/navbarShrink.js#L1-L2)
  - `../utils.js`（`navigationState`）
- [toc.js](file:///workspace/js/layouts/toc.js#L3-L4)
  - `../tools/tocToggle.js`
  - `../main.js`
- [lightDarkSwitch.js](file:///workspace/js/tools/lightDarkSwitch.js#L1)
  - `../main.js`
- [hbe.js](file:///workspace/js/plugins/hbe.js#L1-L2)
  - `../main.js`
  - `../layouts/toc.js`

## 内部依赖图（简化）

```mermaid
flowchart TD
  HTML[index.html 注入 config/theme/lang_ago] --> MAIN[main.js]
  HTML --> SWUP[swup 全局实例]

  MAIN --> UTILS[utils.js]
  MAIN --> MODE[tools/lightDarkSwitch.js]
  MAIN --> SEARCH[tools/localSearch.js]
  MAIN --> CODE[tools/codeBlock.js]
  MAIN --> SCROLL[tools/scrollTopBottom.js]
  MAIN --> LAZY[layouts/lazyload.js]
  MAIN --> TYPED[plugins/typed.js]
  MAIN --> BOOKMARK[layouts/bookmarkNav.js]

  UTILS --> NAV[layouts/navbarShrink.js]
  UTILS --> TOC[layouts/toc.js]
  UTILS --> IMGVIEW[tools/imageViewer.js]

  NAV --> NAVSTATE[navigationState(utils.js)]
  TOC --> TOGGLE[tools/tocToggle.js]

  HBE[plugins/hbe.js] --> MAIN
  HBE --> TOC

  SWUP -. page:view .-> MAIN
  SWUP -. page:view/visit:start .-> NAV
  SWUP -. page:view .-> TOC
  SWUP -. page:view .-> SEARCH
```

## 第三方依赖（前端库）

该仓库没有 `package.json` 等包管理清单；第三方库以静态文件方式被 vendored 到 `js/build/libs/` 并由 HTML 直接 `<script>` 引入。

目录：[/js/build/libs](file:///workspace/js/build/libs)

- Swup（PJAX）：`Swup.min.js` + `Swup*Plugin.min.js` + `SwupSlideTheme.min.js`
- 动画：`anime.min.js`
- 打字机：`Typed.min.js`
- Mermaid：`mermaid.min.js`
- 时间处理：`moment.min.js`、`moment-with-locales.min.js`
- 数字翻牌：`odometer.min.js`（对应样式在 [/assets/odometer-theme-minimal.css](file:///workspace/assets/odometer-theme-minimal.css)）
- 中英文空格：`pangu.min.js`
- 瀑布流：`minimasonry.min.js`
- 音乐播放器：`APlayer.min.js`
- 兼容性/遗留：`pjax.min.js`（项目运行主链路使用 Swup）

## 运行时全局变量（由 HTML/库提供）

内部模块默认以下变量存在（缺失会导致功能降级或异常）：

- `config`：必须（至少包含 `root`；搜索还依赖 `config.path`），见 [index.html](file:///workspace/index.html#L191-L196)
- `theme`：必须（大量功能开关来自 `theme.*`）
- `lang_ago`：首页相对时间显示依赖
- `swup`：存在则启用 `hooks` 进行 PJAX 事件监听（代码中以 try/catch 兼容缺失场景）
- `Typed` / `anime` / `mermaid` 等：对应功能启用时需要已在 HTML 中加载

