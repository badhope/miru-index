# 漫藏 · MIRU INDEX — 前端站点

> 仓库的 GitHub Pages 前端站点，部署在 `docs/` 目录，纯 HTML / CSS / JS，**零构建**、**零依赖**。

## 设计方向
- **印泥 + 水墨 (Seal + Ink)**：印章红 `#d92020` + 墨黑 `#0a0a0a` + 金 `#c9a55c`
- 字体：Dela Gothic One（标题）+ Noto Serif SC（正文）+ Bricolage Grotesque（英文）+ Shippori Mincho（点缀）+ JetBrains Mono（标签）
- 装饰：印章 hanko、左右竖排文字、颗粒噪点、错落网格

## 部署
1. `git push` 后到 GitHub 仓库
2. **Settings → Pages**
3. **Source: Deploy from a branch**
4. **Branch: `main` / Folder: `/docs`**
5. 等 30 秒 → 访问 `https://<user>.github.io/<repo>/`

## 本地预览
```bash
cd docs
python3 -m http.server 8765
# 浏览器打开 http://localhost:8765/
```

## 文件说明
- `index.html`   — 单页入口
- `styles.css`   — 全部样式（含印章 / 噪点 / 卡片动画）
- `data.js`      — 资源数据（CATEGORIES / PROJECTS / SITES / STATS）
- `script.js`    — 交互逻辑（Tab 切换 / 搜索 / 分类筛选 / 数字动画）

## 添加 / 修改资源
直接编辑 `data.js`：
- 新增项目：往 `PROJECTS` 数组 push 一项 `{ name, cat, url, desc, tags, badge }`
- 新增站点：往 `SITES` 数组 push 一项 `{ name, cat, url, desc, proxy, tags }`
- 新增分类：往 `CATEGORIES` 数组 push 一项 `{ id, name, emoji, section: "projects" | "sites" }`

## 自定义
- **修改主题色**：编辑 `styles.css` 顶部 `:root` 的 `--accent` / `--gold`
- **修改站点标题**：编辑 `index.html` 的 `hanko` 印章文字 + `brand-en` / `brand-cn`
- **自定义域名**：在 `docs/` 下放一个 `CNAME` 文件，写入你的域名

## 性能 / 兼容性
- ✅ 纯静态，单页 < 50KB（含 HTML / CSS / JS / Data）
- ✅ Google Fonts CDN 加载，自带 `font-display: swap`
- ✅ 响应式：桌面 / 平板 / 手机均已适配
- ✅ 暗色主题（深墨黑背景 + 印章红点缀）
- ✅ 支持 `prefers-reduced-motion`
