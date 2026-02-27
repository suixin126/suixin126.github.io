# 随心的博客 - 前端项目

一个基于 Vue 3 + TypeScript 的现代化个人博客前端项目，集成了博客、日记、游戏和音乐等多个功能模块。

## 项目概览

### 技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| Vue | 3.5.24 | 前端框架 |
| TypeScript | 5.9.3 | 类型安全 |
| Vite | 7.2.4 | 构建工具 |
| Vue Router | 5.0.2 | 路由管理 |
| Pinia | 3.0.4 | 状态管理 |
| Tailwind CSS | 4.1.18 | 样式框架 |
| markdown-it | 14.1.0 | Markdown 解析 |
| highlight.js | 11.11.1 | 代码高亮 |
| NProgress | 0.2.0 | 页面进度条 |

### 项目结构

```
client/
├── src/
│   ├── components/          # 组件目录
│   │   ├── layout/         # 布局组件
│   │   │   ├── MainLayout.vue    # 主布局
│   │   │   ├── AppHeader.vue     # 应用头部
│   │   │   └── AppSidebar.vue    # 应用侧边栏
│   │   ├── blog/           # 博客模块组件
│   │   │   ├── BlogMain.vue      # 博客主界面
│   │   │   ├── BlogCard.vue      # 博客卡片
│   │   │   ├── BlogContent.vue   # 博客内容
│   │   │   └── BlogSidebar.vue   # 博客侧边栏
│   │   ├── dairy/          # 日记模块组件
│   │   │   ├── DairyMain.vue     # 日记主界面
│   │   │   └── DairySidebar.vue  # 日记侧边栏
│   │   ├── games/          # 游戏模块组件
│   │   │   ├── GamesMain.vue     # 游戏主界面
│   │   │   ├── GamesSidebar.vue  # 游戏侧边栏
│   │   │   ├── games-card/       # 游戏卡片
│   │   │   ├── games-filter/     # 游戏筛选
│   │   │   ├── games-list/       # 游戏列表
│   │   │   ├── games-header/     # 游戏头部
│   │   │   ├── games-footer/     # 游戏底部
│   │   │   ├── games-empty/      # 空状态
│   │   │   └── tic-tac-toe/      # 井字棋游戏
│   │   ├── music/          # 音乐模块组件
│   │   │   ├── MusicMain.vue     # 音乐主界面
│   │   │   └── MusicSidebar.vue  # 音乐侧边栏
│   │   └── common/         # 公共组件
│   │       ├── Modal.vue         # 全局模态框
│   │       └── MouseTrail.vue    # 鼠标拖尾效果
│   ├── composables/        # 组合式函数
│   │   ├── useGamesStorage.ts    # 游戏存储
│   │   ├── useModal.ts           # 模态框
│   │   ├── useMouseTrail.ts      # 鼠标拖尾
│   │   └── useTicTacToe.ts       # 井字棋逻辑
│   ├── config/             # 配置文件
│   │   ├── games/          # 游戏配置
│   │   │   ├── games.config.ts   # 游戏配置项
│   │   │   └── games.data.ts     # 游戏数据
│   │   └── mottos.ts       # 名言配置
│   ├── stores/             # Pinia 状态管理
│   │   ├── blog.ts         # 博客状态
│   │   ├── dairy.ts        # 日记状态
│   │   ├── games.ts        # 游戏状态
│   │   ├── modal.ts        # 模态框状态
│   │   └── index.ts        # Store 入口
│   ├── types/              # TypeScript 类型定义
│   │   ├── blog.ts         # 博客类型
│   │   ├── dairy.ts        # 日记类型
│   │   ├── games.ts        # 游戏类型
│   │   └── modal.ts        # 模态框类型
│   ├── utils/              # 工具函数
│   │   └── markdown.ts     # Markdown 处理
│   ├── views/              # 页面视图
│   │   ├── IndexView.vue   # 首页
│   │   ├── BlogView.vue    # 博客列表
│   │   ├── DairyView.vue   # 日记页面
│   │   ├── GamesView.vue   # 游戏列表
│   │   ├── MusicView.vue   # 音乐页面
│   │   └── games/
│   │       └── TicTacToeView.vue  # 井字棋页面
│   ├── router/             # 路由配置
│   │   └── index.ts
│   ├── styles/             # 样式文件
│   │   ├── nprogress.css   # 进度条样式
│   │   └── transitions.css # 过渡动画
│   ├── docs/               # 文档
│   ├── assets/             # 静态资源
│   ├── App.vue             # 根组件
│   ├── main.ts             # 入口文件
│   └── style.css           # 全局样式
├── index.html              # HTML 模板
├── vite.config.ts          # Vite 配置
├── tsconfig.json           # TypeScript 配置
├── package.json            # 项目依赖
└── README.md               # 本文档
```

## 功能模块

### 1. 首页 (IndexView)
- 带有鼠标拖尾效果
- 精美的欢迎界面

### 2. 博客模块 (Blog)
- 博客列表展示
- 文章分类和标签
- 文章内容渲染 (Markdown)
- 代码语法高亮
- 侧边栏导航

### 3. 日记模块 (Dairy)
- 日记记录
- 时间线展示
- 侧边栏导航

### 4. 游戏模块 (Games)
- 游戏列表展示
- 游戏分类筛选
- 游戏难度筛选
- 按最新/热门排序
- 已实现游戏：井字棋
- 游戏数据本地持久化

### 5. 音乐模块 (Music)
- 音乐播放功能
- 侧边栏导航

## 特色功能

### 鼠标拖尾效果
基于 Canvas 的鼠标跟随效果，仅在首页启用，提供流畅的视觉体验。

### 页面过渡动画
支持多种页面切换效果：
- `slide-fade` - 滑动淡入淡出（默认）
- `fade` - 淡入淡出

### NProgress 进度条
路由切换时显示页面加载进度条，提升用户体验。

### 全局模态框
统一的模态框组件，支持全局调用。

### 动态侧边栏
根据当前路由自动切换侧边栏类型（博客/日记/游戏/音乐）。

## 快速开始

### 安装依赖

```bash
npm install
# 或
pnpm install
```

### 开发模式

```bash
npm run dev
```

启动后访问 `http://localhost:3000`

### 构建生产版本

```bash
npm run build
```

### 预览生产构建

```bash
npm run preview
```

## 配置说明

### Vite 配置 (vite.config.ts)
- 开发服务器端口：3000
- 自动打开浏览器
- 路径别名：`@` 指向 `./src`
- Node.js polyfills 支持

### 路由配置
- 基础模式：History 模式
- 滚动行为：平滑滚动到顶部
- 路由守卫：自动显示/隐藏 NProgress

### Tailwind CSS
使用 Tailwind CSS v4 作为样式解决方案。

## 开发指南

### 添加新游戏

1. 在 `src/config/games/games.data.ts` 中添加游戏数据
2. 创建游戏页面组件到 `src/views/games/`
3. 在 `src/router/index.ts` 中添加路由
4. 游戏数据使用 `useGamesStorage` composable 进行持久化

### 添加新页面

1. 在 `src/views/` 中创建页面组件
2. 在 `src/router/index.ts` 中注册路由
3. 如需侧边栏，在路由 meta 中指定 `sidebar` 类型

### 使用状态管理

```typescript
import { useBlogStore } from '@/stores/blog'

const blogStore = useBlogStore()
```

### 使用模态框

```typescript
import { useModal } from '@/composables/useModal'

const { showModal, hideModal } = useModal()
```

## 类型定义

项目使用 TypeScript 进行类型定义，主要类型位于 `src/types/` 目录：

- `blog.ts` - 博客相关类型
- `dairy.ts` - 日记相关类型
- `games.ts` - 游戏相关类型
- `modal.ts` - 模态框相关类型

## 样式规范

- 使用 Tailwind CSS 进行样式开发
- 自定义样式放在 `src/styles/` 目录
- 全局样式在 `src/style.css`

## 浏览器支持

现代浏览器支持：
- Chrome (推荐)
- Firefox
- Safari
- Edge

## 许可证

个人项目，仅供学习和参考。
