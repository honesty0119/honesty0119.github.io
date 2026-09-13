# 吴廷颖的个人主页与技术博客

网站：https://honesty0119.github.io/

个人介绍、项目展示、实习经历、教育背景与技术笔记。基于 React、Next.js 页面结构和 Vinext 构建，静态部署到 GitHub Pages。

## 本地运行

需要 Node.js 24 与 npm。

```sh
npm ci
npm run dev
```

## 修改内容

- `app/site.config.ts`：个人资料、项目卡片、经历、教育背景和联系方式。
- `content/posts/*.md`：项目与技术笔记，支持 YAML frontmatter。
- `content/pages/about.md`：关于页。
- `app/globals.css`：配色与响应式布局。
- `app/BlogShell.tsx`：页面与交互。
- `public/`：网站静态资源；文章图片放在此目录，引用路径以 `/` 开头。

每次启动或构建都会重新生成 `app/content.generated.ts`，请勿直接修改。编辑 Markdown 后请重新运行 `npm run content:generate`，或重新启动开发服务器。

新增文章示例：

```markdown
---
title: 我的技术笔记
date: 2026-09-13
slug: my-note
description: 文章摘要
categories: [技术笔记]
tags: [Python]
draft: false
---

## 正文标题

正文。
```

`draft: true` 不会生成公开页面或搜索数据。文件名也可以作为默认 slug。完整简历和私人资料不应放入 `public/` 或提交到仓库。

## 检查与发布

```sh
npm run typecheck
npm run lint
npm test
```

`npm test` 构建网站并验证实际静态页面、标题、资源和文章目录。推送到 `main` 后，GitHub Actions 执行检查并将 `dist/client/` 部署到 Pages。Pages 的构建来源应设置为 GitHub Actions。

## 来源

项目从 [lizhengda0525-sudo/lizhengda0525-sudo.github.io](https://github.com/lizhengda0525-sudo/lizhengda0525-sudo.github.io) 的本地副本开始改造（来源提交 `e2fe9b33ef11b8d0ad433f4867aa5921a66d2af3`）。保留内容生成与静态站点基础结构，重新实现个人主页、视觉样式和个人内容。来源仓库没有附带明确许可证；本仓库不对来源代码另行授予许可证。
