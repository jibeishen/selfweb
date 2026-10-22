# 个人主页

一个零构建的静态个人站点：手写 HTML / CSS，没有 npm、没有打包、没有依赖。
包含首页、作品集、简历（可打印成 PDF）、博客列表与三篇文章。

## 本地预览

```bash
cd default-workspace
python3 -m http.server 8000
# 打开 http://localhost:8000
```

改完文件刷新浏览器即可，不需要重新构建。

## 文件结构

```
.
├── index.html              首页：简介、精选作品、最新文章、联系方式
├── projects.html           作品集，带类型筛选
├── resume.html             简历，打印时自动排版为 A4
├── 404.html                自定义错误页（自带样式，不依赖外部文件）
├── blog/
│   ├── index.html          文章列表
│   ├── why-static.html     文章：为什么这个站点没有构建步骤
│   ├── hello-world.html    文章：从一张白纸开始
│   └── reading-workflow.html 文章：我的阅读清单工作流
├── assets/
│   ├── css/style.css       全部样式与配色变量
│   ├── js/main.js          主题切换、移动端菜单、作品筛选、复制邮箱
│   └── img/                头像与站点图标
├── robots.txt
└── .nojekyll               告诉 GitHub Pages 不要跑 Jekyll
```

## 发布到 GitHub Pages

先决定仓库名：

- **`<用户名>.github.io`**：地址是 `https://<用户名>.github.io/`，最省事，推荐。
- **任意仓库名**：地址是 `https://<用户名>.github.io/<仓库名>/`。
  站内链接全是相对路径，放在子路径下也能正常工作。

然后在本目录执行：

```bash
git init -b main
git add .
git commit -m "初始化个人主页"
git remote add origin git@github.com:<用户名>/<仓库名>.git
git push -u origin main
```

如果没配置 SSH，把远程地址换成 HTTPS：
`https://github.com/<用户名>/<仓库名>.git`，推送时用 Personal Access Token 当密码。

推送后在仓库页面：**Settings → Pages → Build and deployment**
- Source 选 **Deploy from a branch**
- Branch 选 **main**，目录选 **/ (root)**
- 保存，等待 1–2 分钟

之后每次 `git push` 都会自动更新，一般几十秒生效。

## 上线前要替换的内容

站内目前是占位文案，用下面的命令可以一次找出全部占位：

```bash
grep -rn "你的名字\|your-username\|hi@example.com\|某某" --include="*.html" .
```

| 位置 | 替换成 |
| --- | --- |
| 所有页面的 `你的名字` | 你的名字（导航、标题、页脚、简历） |
| `index.html` 的 hero-role / hero-lede / hero-meta | 你的身份、一句话介绍、城市与邮箱 |
| `index.html` 的「关于我」与右侧 facts | 你的真实介绍 |
| `index.html` 三张精选作品卡片 | 你的项目 |
| `assets/img/avatar.svg` | 换成 `avatar.jpg`，再把 `index.html` 里的 `img src` 改掉 |
| `index.html`、`resume.html` 里的 `hi@example.com` | 你的邮箱（`data-copy` 属性也要改） |
| 社交链接里的 `your-username` | GitHub / X 的真实用户名 |
| `projects.html` 六张卡片 | 项目名、年份、描述、标签、链接 |
| `resume.html` 的工作经历、教育、技能 | 你的经历 |
| `blog/` 三篇文章 | 改成你自己的文字 |

改完记得同步 `<title>`、`<meta name="description">` 和 Open Graph 标签。

> 社交平台抓取分享卡片时需要一个**完整网址**的图片。部署后把
> `index.html` 里的 `og:image` 改成 `https://你的域名/assets/img/avatar.svg`
> （或一张 1200×630 的 JPG）效果最好。

## 新增一篇文章

1. 复制 `blog/hello-world.html` 为 `blog/新文件名.html`。
2. 修改 `<title>`、`<h1>`、`<time datetime="...">`、正文，以及上下篇链接。
3. 在 `blog/index.html` 的 `<ul class="post-list">` 顶部加一条。
4. 如果想出现在首页，更新 `index.html` 里「最近写下的」两条。
5. 推送。

文章正文写在 `<div class="prose">` 里，支持标题、列表、引用、代码块和图片。

## 绑定自己的域名

1. 在仓库根目录新建 `CNAME` 文件，内容只有一行：`www.example.com`。
2. 域名 DNS 添加 CNAME 记录，指向 `<用户名>.github.io`。
3. 仓库 Settings → Pages → Custom domain 填入域名，勾选 **Enforce HTTPS**。
4. 如果访客主要在国内，域名需要备案，否则访问可能不稳定。

## 设计说明

- 配色集中在 `assets/css/style.css` 顶部的 `:root` 与 `[data-theme="dark"]` 两组变量里，改两个色值就能换整体气质。
- 字体只用系统字体栈，不加载外部字体：国内访问快，也没有字体闪烁。
- 深色模式跟随系统，用户手动切换后会记住选择（`localStorage`）。
- 简历页点「打印 / 存为 PDF」，浏览器直接输出 A4 版式，导航和按钮会自动隐藏。
- 没有 JavaScript 也能正常阅读，主题切换和筛选是渐进增强。
