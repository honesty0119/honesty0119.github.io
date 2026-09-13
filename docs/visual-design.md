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

## 首屏素材

- 工具：内置 imagegen，生成全新图片。
- 网站资源：`public/images/alpine-dawn.webp`，1672 × 941，约 62 KB。
- 分享图片：`public/og.png`，同一图片的 PNG 版本。
- 网站代码不依赖生成工具的本地保存目录。
- 原图保留，WebP 仅进行网页编码压缩。

### 最终生成提示词

```text
Use case: photorealistic-natural. Asset type: full-bleed desktop and mobile website hero background for Tingying Wu personal portfolio, inspired by refined landscape wallpapers. Create a cinematic wide 16:9 photograph of tranquil alpine mountains and a glassy lake just before sunrise. Layered blue-gray mountains with a few snowy summits on far left and right, soft pale mist over water, distant atmospheric depth. The center upper half is open, simple deep dusty blue sky with gentle dawn glow, calm enough for centered white headline typography to be overlaid later by website code. Mountains occupy lower half and sides, subtle reflection across bottom. Color palette slate blue, glacier blue, a whisper of warm ivory at horizon. Premium natural photograph, restrained saturation, realistic fine details, quiet inspiring mood. No buildings, people, animals, interface, text, logos, watermark, frames, or bright sun disc. Landscape background only, not a website mockup.
```
