const r=`---\r
title: "Vue3 + TypeScript 博客系统 模块座右铭配置使用指南"\r
date: "2025-01-15"\r
category: "前端工程化"\r
tags:\r
  - "Vue3"\r
  - "TypeScript"\r
  - "Pinia"\r
  - "组件化开发"\r
  - "配置管理"\r
  - "博客系统"\r
  - "组合式API"\r
description: "详细讲解Vue3 + TypeScript博客系统中模块座右铭配置文件设计、使用方法、组件封装及样式定制，包含博客/说说/游戏/音乐模块的座右铭配置与实战示例"\r
author: "SuiXin"\r
readTime: "8 min"\r
---\r
\r
# 模块座右铭配置使用指南\r
\r
## 📝 配置文件位置\r
\r
\`src/config/mottos.ts\` - 模块座右铭配置中心\r
\r
## 🎯 各模块座右铭\r
\r
| 模块 | ID | 中文座右铭 | 英文座右铭 | 图标 |\r
|------|----|----------|----------|------|\r
| 博客 | \`blog\` | 记录技术，分享生活 | Record technology, share life | 📝 |\r
| 说说 | \`talk\` | 言简意赅，随心而语 | Speak your mind | 💬 |\r
| 游戏 | \`games\` | 劳逸结合，快乐至上 | Work hard, play hard | 🎮 |\r
| 音乐 | \`music\` | 音乐无界，治愈心灵 | Music heals the soul | 🎵 |\r
\r
## 💡 使用方法\r
\r
### 方法一：在 Sidebar 组件中使用\r
\r
\`\`\`vue\r
<script setup lang="ts">\r
import { getModuleMotto } from '@/config/mottos'\r
\r
// 获取当前模块的座右铭\r
const motto = getModuleMotto('blog')\r
// 或者通过路由获取\r
const route = useRoute()\r
const motto = getModuleMotto(route.meta.sidebar as string)\r
<\/script>\r
\r
<template>\r
  <aside class="sidebar">\r
    <!-- 座右铭卡片 -->\r
    <div class="motto-card">\r
      <div class="motto-icon">{{ motto.icon }}</div>\r
      <h3 class="motto-title">{{ motto.name }}</h3>\r
      <p class="motto-text">{{ motto.motto }}</p>\r
      <p class="motto-text-en">{{ motto.mottoEn }}</p>\r
    </div>\r
  </aside>\r
</template>\r
\`\`\`\r
\r
### 方法二：在个人信息卡片中显示（博客侧边栏示例）\r
\r
\`\`\`vue\r
<script setup lang="ts">\r
import { onMounted } from 'vue'\r
import { storeToRefs } from 'pinia'\r
import { useBlogStore } from '@/stores/blog'\r
import { getModuleMotto } from '@/config/mottos'\r
\r
const blogStore = useBlogStore()\r
const { categories, tags } = storeToRefs(blogStore)\r
const motto = getModuleMotto('blog')\r
\r
onMounted(() => {\r
  blogStore.loadBlogPosts()\r
})\r
<\/script>\r
\r
<template>\r
  <aside class="blog-sidebar">\r
    <!-- 个人信息卡片 -->\r
    <div class="sidebar-widget profile-card">\r
      <div class="avatar">\r
        <img src="..." alt="avatar" />\r
      </div>\r
      <h3 class="nickname">SuiXin</h3>\r
      <p class="bio">{{ motto.motto }}</p> <!-- 使用座右铭 -->\r
      <p class="bio-en" v-if="motto.mottoEn">{{ motto.mottoEn }}</p>\r
    </div>\r
  </aside>\r
</template>\r
\`\`\`\r
\r
### 方法三：创建独立的座右铭卡片组件\r
\r
\`\`\`vue\r
<!-- src/components/common/MottoCard.vue -->\r
<script setup lang="ts">\r
import { computed } from 'vue'\r
import { useRoute } from 'vue-router'\r
import { getModuleMotto } from '@/config/mottos'\r
\r
const route = useRoute()\r
const motto = computed(() => {\r
  const sidebarType = route.meta.sidebar as string\r
  return getModuleMotto(sidebarType || 'blog')\r
})\r
<\/script>\r
\r
<template>\r
  <div class="motto-card">\r
    <div class="motto-header">\r
      <span class="motto-icon">{{ motto.icon }}</span>\r
      <h3 class="motto-module">{{ motto.name }}</h3>\r
    </div>\r
    <p class="motto-text">{{ motto.motto }}</p>\r
    <p class="motto-text-en" v-if="motto.mottoEn">{{ motto.mottoEn }}</p>\r
  </div>\r
</template>\r
\r
<style scoped>\r
.motto-card {\r
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);\r
  color: #fff;\r
  border-radius: 12px;\r
  padding: 24px;\r
  text-align: center;\r
}\r
\r
.motto-header {\r
  display: flex;\r
  align-items: center;\r
  justify-content: center;\r
  gap: 8px;\r
  margin-bottom: 12px;\r
}\r
\r
.motto-icon {\r
  font-size: 1.5rem;\r
}\r
\r
.motto-module {\r
  font-size: 1.2rem;\r
  font-weight: 700;\r
  margin: 0;\r
}\r
\r
.motto-text {\r
  font-size: 1rem;\r
  margin: 0 0 8px 0;\r
  font-weight: 500;\r
}\r
\r
.motto-text-en {\r
  font-size: 0.85rem;\r
  margin: 0;\r
  opacity: 0.9;\r
  font-style: italic;\r
}\r
</style>\r
\`\`\`\r
\r
然后在各个 Sidebar 中使用：\r
\r
\`\`\`vue\r
<template>\r
  <aside class="sidebar">\r
    <MottoCard />\r
    <!-- 其他侧边栏内容 -->\r
  </aside>\r
</template>\r
\`\`\`\r
\r
## 🎨 样式建议\r
\r
### 渐变背景卡片（推荐）\r
\`\`\`css\r
.motto-card {\r
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);\r
  color: #fff;\r
  border-radius: 12px;\r
  padding: 24px;\r
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);\r
}\r
\`\`\`\r
\r
### 极简风格\r
\`\`\`css\r
.motto-card {\r
  background: #fff;\r
  border-left: 4px solid #667eea;\r
  padding: 20px;\r
  color: #333;\r
}\r
\`\`\`\r
\r
### 深色主题\r
\`\`\`css\r
.motto-card {\r
  background: #2d3748;\r
  color: #e2e8f0;\r
  border-radius: 8px;\r
  padding: 20px;\r
}\r
\`\`\`\r
\r
## 🔄 自定义座右铭\r
\r
如需修改座右铭，编辑 \`src/config/mottos.ts\` 文件：\r
\r
\`\`\`typescript\r
export const MODULE_MOTTOS: Record<string, ModuleMotto> = {\r
  blog: {\r
    id: 'blog',\r
    name: '博客',\r
    motto: '你的自定义座右铭',  // 修改这里\r
    mottoEn: 'Your custom motto',\r
    icon: '📝'\r
  },\r
  // ... 其他模块\r
}\r
\`\`\`\r
\r
## 📦 类型定义\r
\r
所有类型已在 \`src/env.d.ts\` 中声明，享受完整的 TypeScript 类型提示：\r
\r
\`\`\`typescript\r
interface ModuleMotto {\r
  id: string          // 模块ID\r
  name: string        // 模块名称\r
  motto: string       // 中文座右铭\r
  mottoEn?: string    // 英文座右铭（可选）\r
  icon?: string       // 图标（可选）\r
}\r
\`\`\`\r
\r
## 🚀 快速开始\r
\r
1. **在组件中导入**：\r
   \`\`\`ts\r
   import { getModuleMotto } from '@/config/mottos'\r
   \`\`\`\r
\r
2. **获取座右铭**：\r
   \`\`\`ts\r
   const motto = getModuleMotto('blog')\r
   console.log(motto.motto) // 输出: 记录技术，分享生活\r
   \`\`\`\r
\r
3. **在模板中使用**：\r
   \`\`\`vue\r
   <p>{{ motto.motto }}</p>\r
   \`\`\`\r
\r
---\r
💡 **提示**：所有座右铭都是响应式的，可以根据路由自动切换显示对应模块的座右铭！\r
`;export{r as default};
