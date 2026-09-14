# 个人网站视觉设计

## 设计方向

参考 [达的学习笔记](https://lizhengda0525-sudo.github.io/) 的沉浸式山景首屏、交错图文卡片与个人侧栏。参考 [Apple](https://www.apple.com/) 的大标题、内容留白、圆角卡片、玻璃导航及克制的蓝色操作按钮。

本网站采用独立的个人品牌、内容、图标和背景图，不使用 Apple 标志或产品图片。

## 实现

- 固定的半透明导航与移动端折叠菜单。
- 山景全幅首屏与悬浮个人信息卡。
- 代码实现的项目示意图、博客封面与 SVG 图标。
- 文章阅读进度与当前目录高亮。
- 保留站内搜索、分类、标签和主题记忆。
- 支持减少动态效果偏好；正文无需动画即可阅读。

## 面向求职展示的首屏（2026-09-14）

姓名保留在导航和个人信息栏，主视觉改用“构建 AI 应用，求解复杂决策”，直接说明工程与研究方向。桌面首屏左侧介绍能力、教育背景和毕业年份，右侧展示两个真实项目及其关键实现；手机上按介绍、项目的顺序排列。

项目卡片直接进入对应的项目记录，主操作分别指向精选项目和实习经历，GitHub 作为代码入口。个人信息栏前置 AI Coding / FDE、RAG / Text2SQL 等经历。沿用现有山景素材，新增流程与路径示意图均由 HTML / CSS / SVG 实现，没有额外图片请求，也没有虚构业务指标或演示运行结果。

## 首屏素材

## 实习详情（2026-09-14）

首页实习卡片整体可点击，支持键盘聚焦与 Enter 进入。实习详情位于 `/experience/<slug>/`，内容在 `content/experiences/` 维护，经生成脚本输出独立静态页面并写入 sitemap。页面按 STAR 组织正文，桌面保留侧栏目录，手机将目录置于正文前；页首、页尾均可返回首页实习区。实习内容不混入技术博客列表。

## 首屏素材信息

- 工具：内置 imagegen，生成全新图片。
- 网站资源：`public/images/alpine-dawn.webp`，1672 × 941，约 62 KB。
- 分享图片：`public/og.png`，同一图片的 PNG 版本。
- 网站代码不依赖生成工具的本地保存目录。
- 原图保留，WebP 仅进行网页编码压缩。

### 最终生成提示词

```text
Use case: photorealistic-natural. Asset type: full-bleed desktop and mobile website hero background for Tingying Wu personal portfolio, inspired by refined landscape wallpapers. Create a cinematic wide 16:9 photograph of tranquil alpine mountains and a glassy lake just before sunrise. Layered blue-gray mountains with a few snowy summits on far left and right, soft pale mist over water, distant atmospheric depth. The center upper half is open, simple deep dusty blue sky with gentle dawn glow, calm enough for centered white headline typography to be overlaid later by website code. Mountains occupy lower half and sides, subtle reflection across bottom. Color palette slate blue, glacier blue, a whisper of warm ivory at horizon. Premium natural photograph, restrained saturation, realistic fine details, quiet inspiring mood. No buildings, people, animals, interface, text, logos, watermark, frames, or bright sun disc. Landscape background only, not a website mockup.
```
