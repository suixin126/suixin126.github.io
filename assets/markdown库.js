const r=`---\r
title: "gray-matter 与 markdown-it 实战指南"\r
date: "2025-01-15"\r
category: "前端工程化"\r
tags:\r
  - "gray-matter"\r
  - "markdown-it"\r
  - "highlight.js"\r
  - "Vite"\r
  - "TypeScript"\r
description: "详解 gray-matter 安装配置、markdown-it 核心作用，以及 highlight.js 语法高亮的集成方案，适配 Vue3 + Vite + TypeScript 项目"\r
author: "SuiXin"\r
readTime: "8 min"\r
---\r
\r
# gray-matter 与 markdown-it 实战指南\r
\r
在 Vue3 + Vite + TypeScript 博客/文档项目中，\`gray-matter\`、\`markdown-it\`、\`highlight.js\` 是核心工具组合，分别负责 Markdown 元数据提取、Markdown 转 HTML、代码块语法高亮，本文详解其核心作用与实战配置。\r
\r
## 核心库作用说明\r
| 库名称 | 核心作用 | 适用场景 |\r
|--------|----------|----------|\r
| \`markdown-it\` | 核心解析工具，将 Markdown 文本转换为可渲染的 HTML 结构 | 博客正文渲染、文档内容展示 |\r
| \`highlight.js\` | 辅助语法高亮工具，对 Markdown 中的代码块进行语法着色 | 代码示例展示（支持 JS/TS/Vue/CSS 等多种语言） |\r
| \`gray-matter\` | 元数据提取工具，提取 Markdown 文件开头 \`---\` 包裹的 YAML 元数据 | 博客标题、日期、分类、标签等信息的提取 |\r
| \`@types/markdown-it\` | TypeScript 类型声明文件，补充 \`markdown-it\` 的类型定义 | TypeScript 项目中避免类型报错，提升开发体验 |\r
\r
## gray-matter 实战配置（核心步骤）\r
### 1. 安装依赖\r
需安装 \`gray-matter\` 核心库，以及 \`vite-plugin-node-polyfills\` 插件（解决浏览器环境缺失 Node.js 全局变量的问题）。\r
\r
\`\`\`bash\r
# 安装核心库（提取 Markdown 元数据）\r
npm install gray-matter\r
\r
# 安装 Vite 兼容插件（适配浏览器环境，解决 Buffer/global 缺失报错）\r
npm install vite-plugin-node-polyfills --save-dev\r
\`\`\`\r
\r
### 2. 配置 vite.config.ts\r
在 Vite 配置文件中启用插件，补充 \`gray-matter\` 依赖的全局变量，确保其正常运行。\r
\r
\`\`\`typescript\r
import { defineConfig } from 'vite';\r
import vue from '@vitejs/plugin-vue';\r
import nodePolyfills from 'vite-plugin-node-polyfills';\r
\r
export default defineConfig({\r
  plugins: [\r
    vue(), // Vue 核心插件\r
    nodePolyfills({\r
      // 配置需要模拟的 Node.js 全局变量（gray-matter 依赖）\r
      globals: {\r
        Buffer: true,  // 启用 Buffer 全局变量（必配）\r
        global: true,  // 启用 global 全局变量（必配）\r
        process: true, // 启用 process 全局变量（必配）\r
      },\r
    })\r
  ],\r
  // 可选配置：路径别名，方便项目中导入文件（如 @/docs、@/composables）\r
  resolve: {\r
    alias: {\r
      '@': '/src'\r
    }\r
  }\r
});\r
\`\`\``;export{r as default};
