# Code Wiki

本仓库是一套静态站点前端资源集合（HTML + CSS + ESModule JavaScript + 第三方前端库），页面中标识 `Hexo Theme Redefine`，推断为 Hexo 主题 Redefine 的生成产物或资源镜像。

## 你能在这里找到什么

- 站点页面：根目录与 `archives/`、`2026/` 下的静态 HTML
- 前端资源：
  - 样式：`/css`（包含 Tailwind 构建产物 `css/build/tailwind.css`）
  - 脚本：`/js`（源码形态）与 `/js/build`（压缩产物 + sourcemap）
  - 第三方库：`/js/build/libs`（Swup、anime、Typed、moment、odometer 等）
  - 字体/图标/图片：`/fonts`、`/fontawesome`、`/webfonts`、`/images`
- 页面运行时配置：HTML 内联注入 `window.config`、`window.theme` 等全局对象（由 Hexo/主题渲染生成）

## 快速运行（本地预览）

该项目需要通过“静态服务器”访问（避免 `file://` 下 ESModule/CORS 限制）。

```bash
python3 -m http.server 8000 --directory /workspace
```

然后访问：

- 首页：`http://localhost:8000/`

## 文档导航

- [01-architecture.md](./01-architecture.md)：整体架构与运行时生命周期（Swup/PJAX、初始化链路）
- [02-directory-layout.md](./02-directory-layout.md)：目录结构与资源分层
- [03-js-modules.md](./03-js-modules.md)：主要模块职责与关键类/函数说明
- [04-dependencies.md](./04-dependencies.md)：内部依赖关系与第三方依赖清单（含依赖图）
- [05-build-and-run.md](./05-build-and-run.md)：运行方式、构建/压缩脚本与注意事项

