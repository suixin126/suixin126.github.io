const r=`---\r
title: "Vue3 + TypeScript 博客系统整体解决方案"\r
date: "2025-01-15"\r
category: "前端工程化"\r
tags:\r
  - "Vue3"\r
  - "TypeScript"\r
  - "Vite"\r
  - "markdown-it"\r
  - "gray-matter"\r
  - "highlight.js"\r
  - "组合式API"\r
description: "基于Vue3 + TypeScript + Vite实现Markdown博客系统，包含文章分类、标签、渲染、筛选等核心功能，附完整代码与实现指南"\r
author: "SuiXin"\r
readTime: "15 min"\r
---\r
\r
# 🎯 博客系统整体解决方案\r
\r
基于 **Vue 3 + TypeScript + Vite** 技术栈，实现 Markdown 博客文章的**分类、标签、渲染**功能。\r
\r
## 📋 方案架构\r
\r
### 1. 技术选型\r
\r
| 功能 | 技术方案 | 说明 |\r
|------|---------|------|\r
| MD 解析 | **markdown-it** | 功能强大、可扩展 |\r
| 代码高亮 | **highlight.js** | 支持多种语言 |\r
| 前置元数据 | **gray-matter** | 解析 YAML frontmatter |\r
| MD 文件导入 | **Vite import.meta.glob** | 静态分析、按需加载 |\r
\r
### 2. 项目结构\r
\r
\`\`\`\r
src/\r
├── docs/                      # Markdown 文档目录\r
│   ├── frontend/             # 前端分类\r
│   │   ├── vue-guide.md\r
│   │   └── typescript-tips.md\r
│   ├── backend/              # 后端分类\r
│   │   └── nodejs-best-practices.md\r
│   └── lifestyle/            # 生活随笔分类\r
│       └── daily-notes.md\r
├── composables/              # 组合式函数\r
│   ├── useBlog.ts           # 博客数据处理\r
│   └── useMarkdown.ts       # Markdown 解析\r
├── types/                    # TypeScript 类型定义\r
│   └── blog.ts              # 博客相关类型\r
├── utils/                    # 工具函数\r
│   └── markdown.ts          # Markdown 工具\r
└── components/\r
    └── blog/\r
        ├── BlogMain.vue     # 博客列表页\r
        ├── BlogCard.vue     # 博客卡片\r
        └── BlogContent.vue  # 文章详情页\r
\`\`\`\r
\r
## 📝 Markdown 文件格式规范\r
\r
### 文件示例（src/docs/frontend/vue-guide.md）\r
\r
\`\`\`markdown\r
---\r
title: Vue 3 组合式 API 完全指南\r
date: 2025-01-15\r
category: frontend\r
tags:\r
  - Vue\r
  - TypeScript\r
  - 前端框架\r
description: 深入理解 Vue 3 组合式 API 的设计理念与最佳实践\r
author: SuiXin\r
readTime: 15 min\r
---\r
\r
# Vue 3 组合式 API 完全指南\r
\r
## 简介\r
Vue 3 引入了组合式 API（Composition API）...\r
\`\`\`\r
\r
## 🔧 核心实现代码\r
\r
### 1. 类型定义（src/types/blog.ts）\r
\r
\`\`\`typescript\r
export interface BlogMeta {\r
  title: string\r
  date: string\r
  category: string\r
  tags: string[]\r
  description: string\r
  author: string\r
  readTime: string\r
}\r
\r
export interface BlogPost {\r
  id: string\r
  path: string\r
  meta: BlogMeta\r
  content: string\r
}\r
\r
export interface Category {\r
  name: string\r
  count: number\r
  slug: string\r
}\r
\r
export interface Tag {\r
  name: string\r
  count: number\r
}\r
\`\`\`\r
\r
### 2. Markdown 工具函数（src/utils/markdown.ts）\r
\r
\`\`\`typescript\r
import MarkdownIt from 'markdown-it'\r
import hljs from 'highlight.js'\r
import matter from 'gray-matter'\r
\r
// 配置 markdown-it\r
const md = new MarkdownIt({\r
  html: true,\r
  linkify: true,\r
  typographer: true,\r
  highlight: (str, lang) => {\r
    if (lang && hljs.getLanguage(lang)) {\r
      try {\r
        return hljs.highlight(str, { language: lang }).value\r
      } catch (__) {}\r
    }\r
    return ''\r
  }\r
})\r
\r
/**\r
 * 解析 Markdown 文件\r
 */\r
export function parseMarkdown(content: string) {\r
  const { data, content } = matter(content)\r
  const html = md.render(content)\r
\r
  return {\r
    meta: data,\r
    content: html,\r
    raw: content\r
  }\r
}\r
\r
/**\r
 * 从文件路径生成文章 ID\r
 */\r
export function generateIdFromPath(path: string): string {\r
  return path\r
    .replace(/^.*\\/docs\\//, '')\r
    .replace(/\\.md$/, '')\r
    .replace(/\\//g, '-')\r
}\r
\`\`\`\r
\r
### 3. 博客数据处理（src/composables/useBlog.ts）\r
\r
\`\`\`typescript\r
import { ref, computed } from 'vue'\r
import type { BlogPost, BlogMeta, Category, Tag } from '@/types/blog'\r
\r
// 导入所有 Markdown 文件\r
const blogModules = import.meta.glob('@/docs/**/*.md', {\r
  query: '?raw',\r
  import: 'default'\r
})\r
\r
export function useBlog() {\r
  const posts = ref<BlogPost[]>([])\r
  const loading = ref(false)\r
  const error = ref<string | null>(null)\r
\r
  /**\r
   * 加载所有博客文章\r
   */\r
  async function loadAllPosts() {\r
    loading.value = true\r
    error.value = null\r
\r
    try {\r
      const loadedPosts: BlogPost[] = []\r
\r
      for (const path in blogModules) {\r
        const content = await blogModules[path]() as string\r
        const { parseMarkdown, generateIdFromPath } = await import('@/utils/markdown')\r
\r
        const { meta, content: html } = parseMarkdown(content)\r
        const id = generateIdFromPath(path)\r
\r
        loadedPosts.push({\r
          id,\r
          path,\r
          meta: meta as BlogMeta,\r
          content: html\r
        })\r
      }\r
\r
      // 按日期排序（最新的在前）\r
      posts.value = loadedPosts.sort((a, b) =>\r
        new Date(b.meta.date).getTime() - new Date(a.meta.date).getTime()\r
      )\r
    } catch (e) {\r
      error.value = e instanceof Error ? e.message : '加载失败'\r
    } finally {\r
      loading.value = false\r
    }\r
  }\r
\r
  /**\r
   * 获取所有分类\r
   */\r
  const categories = computed<Category[]>(() => {\r
    const categoryMap = new Map<string, number>()\r
\r
    posts.value.forEach(post => {\r
      const cat = post.meta.category\r
      categoryMap.set(cat, (categoryMap.get(cat) || 0) + 1)\r
    })\r
\r
    return Array.from(categoryMap.entries()).map(([name, count]) => ({\r
      name,\r
      count,\r
      slug: name.toLowerCase().replace(/\\s+/g, '-')\r
    }))\r
  })\r
\r
  /**\r
   * 获取所有标签\r
   */\r
  const tags = computed<Tag[]>(() => {\r
    const tagMap = new Map<string, number>()\r
\r
    posts.value.forEach(post => {\r
      post.meta.tags.forEach(tag => {\r
        tagMap.set(tag, (tagMap.get(tag) || 0) + 1)\r
      })\r
    })\r
\r
    return Array.from(tagMap.entries()).map(([name, count]) => ({\r
      name,\r
      count\r
    }))\r
  })\r
\r
  /**\r
   * 根据分类筛选文章\r
   */\r
  function filterByCategory(category: string) {\r
    return posts.value.filter(post =>\r
      post.meta.category.toLowerCase() === category.toLowerCase()\r
    )\r
  }\r
\r
  /**\r
   * 根据标签筛选文章\r
   */\r
  function filterByTag(tag: string) {\r
    return posts.value.filter(post =>\r
      post.meta.tags.some(t => t.toLowerCase() === tag.toLowerCase())\r
    )\r
  }\r
\r
  /**\r
   * 根据 ID 获取文章\r
   */\r
  function getPostById(id: string) {\r
    return posts.value.find(post => post.id === id)\r
  }\r
\r
  return {\r
    posts,\r
    loading,\r
    error,\r
    categories,\r
    tags,\r
    loadAllPosts,\r
    filterByCategory,\r
    filterByTag,\r
    getPostById\r
  }\r
}\r
\`\`\`\r
\r
### 4. BlogMain.vue 组件实现\r
\r
\`\`\`vue\r
<script setup lang="ts">\r
import { ref, onMounted, computed } from 'vue'\r
import { useBlog } from '@/composables/useBlog'\r
import BlogCard from './BlogCard.vue'\r
import type { BlogPost } from '@/types/blog'\r
\r
const {\r
  posts,\r
  loading,\r
  error,\r
  categories,\r
  tags,\r
  loadAllPosts,\r
  filterByCategory,\r
  filterByTag\r
} = useBlog()\r
\r
// 筛选状态\r
const selectedCategory = ref<string>('all')\r
const selectedTag = ref<string>('')\r
\r
// 显示的文章列表\r
const displayedPosts = computed<BlogPost[]>(() => {\r
  let result = posts.value\r
\r
  if (selectedCategory.value !== 'all') {\r
    result = filterByCategory(selectedCategory.value)\r
  }\r
\r
  if (selectedTag.value) {\r
    result = result.filter(post =>\r
      post.meta.tags.some(t => t === selectedTag.value)\r
    )\r
  }\r
\r
  return result\r
})\r
\r
// 选择分类\r
function selectCategory(category: string) {\r
  selectedCategory.value = category\r
  selectedTag.value = '' // 重置标签\r
}\r
\r
// 选择标签\r
function selectTag(tag: string) {\r
  selectedTag.value = tag\r
}\r
\r
onMounted(() => {\r
  loadAllPosts()\r
})\r
<\/script>\r
\r
<template>\r
  <div class="max-w-4xl mx-auto p-6">\r
    <!-- 筛选栏 -->\r
    <div class="mb-8 flex flex-wrap gap-4 items-center">\r
      <!-- 分类筛选 -->\r
      <div class="flex gap-2 items-center">\r
        <span class="text-gray-600 font-medium">分类:</span>\r
        <button\r
          @click="selectCategory('all')"\r
          :class="[\r
            'px-3 py-1 rounded-full text-sm transition',\r
            selectedCategory === 'all'\r
              ? 'bg-blue-500 text-white'\r
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'\r
          ]"\r
        >\r
          全部 ({{ posts.length }})\r
        </button>\r
        <button\r
          v-for="cat in categories"\r
          :key="cat.slug"\r
          @click="selectCategory(cat.slug)"\r
          :class="[\r
            'px-3 py-1 rounded-full text-sm transition',\r
            selectedCategory === cat.slug\r
              ? 'bg-blue-500 text-white'\r
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'\r
          ]"\r
        >\r
          {{ cat.name }} ({{ cat.count }})\r
        </button>\r
      </div>\r
    </div>\r
\r
    <!-- 标签云 -->\r
    <div v-if="tags.length > 0" class="mb-8">\r
      <h3 class="text-gray-600 font-medium mb-3">标签:</h3>\r
      <div class="flex flex-wrap gap-2">\r
        <button\r
          @click="selectTag('')"\r
          :class="[\r
            'px-3 py-1 rounded-full text-sm transition',\r
            !selectedTag\r
              ? 'bg-purple-500 text-white'\r
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'\r
          ]"\r
        >\r
          全部\r
        </button>\r
        <button\r
          v-for="tag in tags"\r
          :key="tag.name"\r
          @click="selectTag(tag.name)"\r
          :class="[\r
            'px-3 py-1 rounded-full text-sm transition',\r
            selectedTag === tag.name\r
              ? 'bg-purple-500 text-white'\r
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'\r
          ]"\r
        >\r
          {{ tag.name }} ({{ tag.count }})\r
        </button>\r
      </div>\r
    </div>\r
\r
    <!-- 加载状态 -->\r
    <div v-if="loading" class="text-center py-12 text-gray-500">\r
      加载中...\r
    </div>\r
\r
    <!-- 错误提示 -->\r
    <div v-else-if="error" class="text-center py-12 text-red-500">\r
      {{ error }}\r
    </div>\r
\r
    <!-- 文章列表 -->\r
    <div v-else-if="displayedPosts.length > 0">\r
      <BlogCard\r
        v-for="post in displayedPosts"\r
        :key="post.id"\r
        :post="post"\r
      />\r
    </div>\r
\r
    <!-- 空状态 -->\r
    <div v-else class="text-center py-12 text-gray-500">\r
      没有找到相关文章\r
    </div>\r
  </div>\r
</template>\r
\`\`\`\r
\r
### 5. BlogCard.vue 组件\r
\r
\`\`\`vue\r
<script setup lang="ts">\r
import type { BlogPost } from '@/types/blog'\r
\r
defineProps<{\r
  post: BlogPost\r
}>()\r
<\/script>\r
\r
<template>\r
  <article class="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden mb-6 hover:shadow-md transition">\r
    <div class="p-6">\r
      <!-- 标题 -->\r
      <h2 class="text-xl font-bold text-gray-800 mb-2 hover:text-blue-600 cursor-pointer">\r
        {{ post.meta.title }}\r
      </h2>\r
\r
      <!-- 元信息 -->\r
      <div class="flex flex-wrap items-center text-sm text-gray-500 mb-3 gap-3">\r
        <span>{{ post.meta.author }}</span>\r
        <span>{{ post.meta.date }}</span>\r
        <span>阅读时长: {{ post.meta.readTime }}</span>\r
      </div>\r
\r
      <!-- 分类和标签 -->\r
      <div class="flex flex-wrap gap-2 mb-3">\r
        <span class="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">\r
          {{ post.meta.category }}\r
        </span>\r
        <span\r
          v-for="tag in post.meta.tags"\r
          :key="tag"\r
          class="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"\r
        >\r
          #{{ tag }}\r
        </span>\r
      </div>\r
\r
      <!-- 摘要 -->\r
      <p class="text-gray-600 text-sm leading-relaxed">\r
        {{ post.meta.description }}\r
      </p>\r
    </div>\r
\r
    <!-- 底部 -->\r
    <div class="px-6 pb-4 text-right">\r
      <router-link\r
        :to="\`/blog/\${post.id}\`"\r
        class="text-blue-600 hover:text-blue-800 text-sm font-medium"\r
      >\r
        阅读全文 →\r
      </router-link>\r
    </div>\r
  </article>\r
</template>\r
\`\`\`\r
\r
## 📦 需要安装的依赖\r
\r
\`\`\`bash\r
npm install markdown-it highlight.js gray-matter\r
npm install -D @types/markdown-it\r
\`\`\`\r
\r
## 🎯 核心功能说明\r
\r
### 1. **自动导入 MD 文件**\r
使用 Vite 的 \`import.meta.glob\` 功能，自动扫描 \`src/docs\` 目录下的所有 \`.md\` 文件。\r
\r
### 2. **Frontmatter 解析**\r
通过 \`gray-matter\` 解析 MD 文件顶部的 YAML 元数据（标题、日期、分类、标签等）。\r
\r
### 3. **分类筛选**\r
- 根据 \`category\` 字段自动统计文章数量\r
- 支持按分类筛选文章列表\r
\r
### 4. **标签云**\r
- 根据 \`tags\` 数组自动聚合所有标签\r
- 支持按标签筛选文章\r
- 显示每个标签的文章数量\r
\r
### 5. **Markdown 渲染**\r
- 使用 \`markdown-it\` 将 MD 转换为 HTML\r
- 集成 \`highlight.js\` 实现代码高亮\r
\r
## 🚀 使用步骤\r
\r
1. **安装依赖**\r
   \`\`\`bash\r
   npm install markdown-it highlight.js gray-matter\r
   \`\`\`\r
\r
2. **创建文件**\r
   - 按照上述代码创建对应的类型、工具函数、组件文件\r
\r
3. **编写 MD 文章**\r
   - 在 \`src/docs\` 目录下创建分类文件夹\r
   - 每个 MD 文件包含 frontmatter 元数据\r
\r
4. **启动项目**\r
   \`\`\`bash\r
   npm run dev\r
   \`\`\`\r
\r
## ✨ 方案优势\r
\r
✅ **类型安全**：完整的 TypeScript 类型定义\r
✅ **按需加载**：Vite 自动进行代码分割\r
✅ **易于扩展**：清晰的文件结构和模块化设计\r
✅ **SEO 友好**：可扩展 meta 标签管理\r
✅ **响应式设计**：支持移动端和桌面端\r
\r
## 📚 扩展功能建议\r
\r
1. **搜索功能**：集成全文搜索\r
2. **评论系统**：集成 Gitalk 或 Valine\r
3. **RSS 订阅**：生成 RSS Feed\r
4. **夜间模式**：切换主题颜色\r
5. **阅读进度**：显示文章阅读进度条\r
`;export{r as default};
