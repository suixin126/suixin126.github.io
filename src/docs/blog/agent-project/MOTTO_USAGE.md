---
title: "Vue3 + TypeScript 博客系统 模块座右铭配置使用指南"
date: "2025-01-15"
category: "前端工程化"
tags:
  - "Vue3"
  - "TypeScript"
  - "Pinia"
  - "组件化开发"
  - "配置管理"
  - "博客系统"
  - "组合式API"
description: "详细讲解Vue3 + TypeScript博客系统中模块座右铭配置文件设计、使用方法、组件封装及样式定制，包含博客/说说/游戏/音乐模块的座右铭配置与实战示例"
author: "SuiXin"
readTime: "8 min"
---

# 模块座右铭配置使用指南

## 📝 配置文件位置

`src/config/mottos.ts` - 模块座右铭配置中心

## 🎯 各模块座右铭

| 模块 | ID | 中文座右铭 | 英文座右铭 | 图标 |
|------|----|----------|----------|------|
| 博客 | `blog` | 记录技术，分享生活 | Record technology, share life | 📝 |
| 说说 | `talk` | 言简意赅，随心而语 | Speak your mind | 💬 |
| 游戏 | `games` | 劳逸结合，快乐至上 | Work hard, play hard | 🎮 |
| 音乐 | `music` | 音乐无界，治愈心灵 | Music heals the soul | 🎵 |

## 💡 使用方法

### 方法一：在 Sidebar 组件中使用

```vue
<script setup lang="ts">
import { getModuleMotto } from '@/config/mottos'

// 获取当前模块的座右铭
const motto = getModuleMotto('blog')
// 或者通过路由获取
const route = useRoute()
const motto = getModuleMotto(route.meta.sidebar as string)
</script>

<template>
  <aside class="sidebar">
    <!-- 座右铭卡片 -->
    <div class="motto-card">
      <div class="motto-icon">{{ motto.icon }}</div>
      <h3 class="motto-title">{{ motto.name }}</h3>
      <p class="motto-text">{{ motto.motto }}</p>
      <p class="motto-text-en">{{ motto.mottoEn }}</p>
    </div>
  </aside>
</template>
```

### 方法二：在个人信息卡片中显示（博客侧边栏示例）

```vue
<script setup lang="ts">
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useBlogStore } from '@/stores/blog'
import { getModuleMotto } from '@/config/mottos'

const blogStore = useBlogStore()
const { categories, tags } = storeToRefs(blogStore)
const motto = getModuleMotto('blog')

onMounted(() => {
  blogStore.loadBlogPosts()
})
</script>

<template>
  <aside class="blog-sidebar">
    <!-- 个人信息卡片 -->
    <div class="sidebar-widget profile-card">
      <div class="avatar">
        <img src="..." alt="avatar" />
      </div>
      <h3 class="nickname">SuiXin</h3>
      <p class="bio">{{ motto.motto }}</p> <!-- 使用座右铭 -->
      <p class="bio-en" v-if="motto.mottoEn">{{ motto.mottoEn }}</p>
    </div>
  </aside>
</template>
```

### 方法三：创建独立的座右铭卡片组件

```vue
<!-- src/components/common/MottoCard.vue -->
<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { getModuleMotto } from '@/config/mottos'

const route = useRoute()
const motto = computed(() => {
  const sidebarType = route.meta.sidebar as string
  return getModuleMotto(sidebarType || 'blog')
})
</script>

<template>
  <div class="motto-card">
    <div class="motto-header">
      <span class="motto-icon">{{ motto.icon }}</span>
      <h3 class="motto-module">{{ motto.name }}</h3>
    </div>
    <p class="motto-text">{{ motto.motto }}</p>
    <p class="motto-text-en" v-if="motto.mottoEn">{{ motto.mottoEn }}</p>
  </div>
</template>

<style scoped>
.motto-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  border-radius: 12px;
  padding: 24px;
  text-align: center;
}

.motto-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-bottom: 12px;
}

.motto-icon {
  font-size: 1.5rem;
}

.motto-module {
  font-size: 1.2rem;
  font-weight: 700;
  margin: 0;
}

.motto-text {
  font-size: 1rem;
  margin: 0 0 8px 0;
  font-weight: 500;
}

.motto-text-en {
  font-size: 0.85rem;
  margin: 0;
  opacity: 0.9;
  font-style: italic;
}
</style>
```

然后在各个 Sidebar 中使用：

```vue
<template>
  <aside class="sidebar">
    <MottoCard />
    <!-- 其他侧边栏内容 -->
  </aside>
</template>
```

## 🎨 样式建议

### 渐变背景卡片（推荐）
```css
.motto-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}
```

### 极简风格
```css
.motto-card {
  background: #fff;
  border-left: 4px solid #667eea;
  padding: 20px;
  color: #333;
}
```

### 深色主题
```css
.motto-card {
  background: #2d3748;
  color: #e2e8f0;
  border-radius: 8px;
  padding: 20px;
}
```

## 🔄 自定义座右铭

如需修改座右铭，编辑 `src/config/mottos.ts` 文件：

```typescript
export const MODULE_MOTTOS: Record<string, ModuleMotto> = {
  blog: {
    id: 'blog',
    name: '博客',
    motto: '你的自定义座右铭',  // 修改这里
    mottoEn: 'Your custom motto',
    icon: '📝'
  },
  // ... 其他模块
}
```

## 📦 类型定义

所有类型已在 `src/env.d.ts` 中声明，享受完整的 TypeScript 类型提示：

```typescript
interface ModuleMotto {
  id: string          // 模块ID
  name: string        // 模块名称
  motto: string       // 中文座右铭
  mottoEn?: string    // 英文座右铭（可选）
  icon?: string       // 图标（可选）
}
```

## 🚀 快速开始

1. **在组件中导入**：
   ```ts
   import { getModuleMotto } from '@/config/mottos'
   ```

2. **获取座右铭**：
   ```ts
   const motto = getModuleMotto('blog')
   console.log(motto.motto) // 输出: 记录技术，分享生活
   ```

3. **在模板中使用**：
   ```vue
   <p>{{ motto.motto }}</p>
   ```

---
💡 **提示**：所有座右铭都是响应式的，可以根据路由自动切换显示对应模块的座右铭！
