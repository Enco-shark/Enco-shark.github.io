# 目录结构

该仓库的核心是静态站点文件与资源分层，主要目录如下（只列关键项）：

```text
/
├── index.html
├── 404.html
├── archives/                # 归档页（静态 HTML）
├── 2026/                    # 年/月/日等页面示例（静态 HTML）
├── css/
│   ├── style.css            # 站点主样式入口（聚合/构建产物）
│   ├── build/tailwind.css   # Tailwind 构建产物
│   ├── common/              # 基础样式：变量、markdown、动画、代码高亮等
│   └── layout/              # 页面布局样式：首页/文章/归档/标签等
├── js/
│   ├── main.js              # ESModule 入口：refresh 初始化链路
│   ├── utils.js             # 通用工具：滚动/字体/工具栏/相对时间/图片查看器等
│   ├── layouts/             # 布局增强：navbarShrink/toc/lazyload/...
│   ├── tools/               # 通用工具：dark-light/localSearch/codeBlock/...
│   ├── plugins/             # 可选插件：typed/mermaid/pangu/tabs/hbe/...
│   ├── libs/                # 第三方库（源码/未压缩或 map）
│   └── build.js             # Node 构建脚本（terser 压缩 + copy libs）
├── js/build/                # 构建产物（minify 后）+ sourcemap
│   ├── main.js
│   ├── utils.js
│   ├── layouts/
│   ├── tools/
│   ├── plugins/
│   └── libs/
├── fonts/                   # 字体（Geist/Chillax/GeistMono 等）
├── fontawesome/             # FontAwesome CSS
├── webfonts/                # FontAwesome 字体文件
├── images/                  # 站点图片与图标
└── assets/                  # 其他静态资源（如 odometer 主题 CSS）
```

## 源码 vs 构建产物

在 JS 层面，仓库同时存在两套形态：

- **源码形态**：`/js/**`（可读性强，便于理解与修改）
- **构建形态**：`/js/build/**`（压缩产物，供 HTML 实际引用）

页面实际加载的是 `/js/build/**`：见 [index.html](file:///workspace/index.html#L697-L772)。

## 页面分布

- 主页入口：[/index.html](file:///workspace/index.html)
- 404 页面：[/404.html](file:///workspace/404.html)
- 归档页示例：[/archives/2026/index.html](file:///workspace/archives/2026/index.html)
- 日期页示例：[/2026/01/18/hello-world/index.html](file:///workspace/2026/01/18/hello-world/index.html)

