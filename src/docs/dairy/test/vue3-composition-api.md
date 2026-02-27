---
title: Vue 3 组合式 API 完全指南
date: 2025-01-15
category: frontend
tags:
  - Vue
  - TypeScript
  - 前端框架
description: 深入理解 Vue 3 组合式 API 的设计理念与最佳实践
author: SuiXin
readTime: 15 min
---

# Vue 3 组合式 API 完全指南

## 简介

Vue 3 引入了组合式 API（Composition API），这是一个基于函数的 API，允许我们灵活地组合组件逻辑。

## 为什么需要组合式 API？

### 1. 更好的逻辑复用

在 Vue 2 中，我们通过 mixins 复用逻辑，但会导致命名冲突和来源不清晰的问题。

### 2. 更好的类型推断

TypeScript 支持更加完善，类型推断更加准确。

## 核心概念

### setup 函数

`setup` 函数是组合式 API 的入口点：

```typescript
import { ref, computed } from 'vue'

export default {
  setup() {
    const count = ref(0)
    const doubled = computed(() => count.value * 2)

    function increment() {
      count.value++
    }

    return {
      count,
      doubled,
      increment
    }
  }
}
```

### ref 和 reactive

- **ref**: 用于基本类型的响应式数据
- **reactive**: 用于对象类型的响应式数据

```typescript
const count = ref(0)
const state = reactive({
  name: 'Vue',
  version: 3
})
```

## 最佳实践

1. 使用 `<script setup>` 语法糖
2. 合理拆分组合式函数
3. 避免过度嵌套

## 总结

组合式 API 提供了更灵活的代码组织方式，让我们能够更好地复用逻辑和编写可维护的代码。
