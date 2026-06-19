# 胶片模拟 Lab 📷

> 用数字的方式，感受银盐的温度。
> 5 个纯 GPU 胶片滤镜，无需网络，即开即用。

## 🚀 一键部署（获得一个公开链接）

### 方法一：Netlify Drop（最简单，推荐）

1. 打开 [app.netlify.com/drop](https://app.netlify.com/drop)
2. 把 `d:\cursor` 文件夹**拖进去**
3. 等待 3 秒 → 获得 `https://xxx-xxx-xxx.netlify.app` 链接
4. 📱 链接发给任何人，手机直接打开就能用

> 无需注册，无需命令行，无需 git。

### 方法二：Vercel

1. 打开 [vercel.com/new](https://vercel.com/new)
2. 导入项目 → 选择 `d:\cursor` 文件夹
3. 自动部署 → 获得 `https://film-lab.vercel.app` 链接

### 方法三：GitHub Pages

```bash
cd d:\cursor
git init
git add index.html film-lab.html README.md
git commit -m "胶片模拟 Lab"
# 推送到 GitHub，开启 Pages → 获得 https://xxx.github.io/film-lab 链接
```

## 📁 文件说明

| 文件 | 用途 |
|------|------|
| `index.html` | 🚀 部署版（和 film-lab.html 内容相同，服务器自动识别） |
| `film-lab.html` | 📱 离线版（直接传到手机用浏览器打开） |

## ✨ 功能

- 5 个内置胶片滤镜（Provia 100F / Velvia 50 / Portra 160 NC / Ektar 100 / HP5 Plus 400）
- 纯 GLSL GPU 渲染，选照片后即时生效
- 长按预览对比原图
- 保存：弹窗展示大图 → 长按存到相册
- 自定义 LUT 导入（+ 按钮）
- PWA 支持，可添加到主屏幕
