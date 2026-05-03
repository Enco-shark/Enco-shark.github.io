# 运行与构建

## 运行方式（本地/部署）

该仓库是纯静态站点资源，直接部署到任意静态托管即可（Nginx、GitHub Pages、对象存储、CDN 等）。

本地预览建议使用静态服务器：

```bash
python3 -m http.server 8000 --directory /workspace
```

访问：

- `http://localhost:8000/`（对应 `/index.html`）

不建议直接双击用 `file://` 打开页面：ESModule 脚本与部分 fetch（如本地搜索 `search.xml`）可能会因浏览器安全策略失败。

## 修改代码的基本路径

页面实际加载的是 `/js/build/**`，但该目录是压缩产物（可读性差）。如果要理解/修改逻辑，通常应优先改：

- `/js/**`（源码形态）

然后再将改动同步到 `/js/build/**`（压缩构建产物），否则 HTML 侧不会体现修改。

## 构建脚本 build.js（压缩与拷贝）

仓库存在 Node 构建脚本：[/js/build.js](file:///workspace/js/build.js#L1-L144)

它的意图是：

- 使用 `terser` 压缩 `source/js/**`（排除 libs、build 目录等）
- 将 `source/js/libs/**/*.js` 直接拷贝到 `source/js/build/libs/`
- 输出构建产物到 `source/js/build/` 并生成 sourcemap

注意：该脚本的目录约定是“主题仓库结构”（`THEME_ROOT/source/js`），而当前仓库的实际结构是 `/js` 与 `/js/build`。因此 **在当前仓库中直接执行 build.js 大概率无法生效**，除非你把它放回上游主题仓库的原始目录结构，或调整脚本路径。

## 关键运行时依赖（HTML 侧）

页面底部会按顺序加载：

1. Swup 及其插件，并创建全局 `swup` 实例：见 [index.html](file:///workspace/index.html#L662-L691)
2. 各功能模块（ESModule）：见 [index.html](file:///workspace/index.html#L697-L772)

这些脚本假设 HTML 中已注入：

- `window.config` / `window.theme` / `window.lang_ago`：见 [index.html](file:///workspace/index.html#L191-L196)

## 常见问题排查

- 页面切换后功能失效：优先检查是否启用了 Swup；并确认模块是否在 `swup.hooks.on("page:view")` 中做了重新初始化（例如 `main.refresh()`）。
- 搜索不可用：检查 `config.path` 是否存在；缺失通常意味着未启用 `hexo-generator-searchdb`，代码会直接 warn 并 return（见 [localSearch.js](file:///workspace/js/tools/localSearch.js#L1-L8)）。
- 复制按钮无效：浏览器/站点需允许 Clipboard API（HTTPS 环境更稳定）；本地 `http://localhost` 一般可用。

