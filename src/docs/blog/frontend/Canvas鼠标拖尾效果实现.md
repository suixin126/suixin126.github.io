---
title: "Canvas 鼠标拖尾效果实现指南"
date: "2025-02-10"
category: "前端交互效果"
tags:
  - "Canvas"
  - "Vue 3"
  - "TypeScript"
  - "Composable"
  - "动画效果"
  - "粒子系统"
description: "详解使用 Canvas API 实现彩色粒子鼠标拖尾效果的完整流程，包括 Composable 设计、粒子系统原理、性能优化等实战技巧"
author: "Claude"
readTime: "10 min"
---

# Canvas 鼠标拖尾效果实现指南

本文详细介绍如何使用 Canvas API 实现一个跟随鼠标移动的彩色粒子拖尾效果，采用 Vue 3 Composition API 的 Composable 模式设计，实现代码复用和逻辑分离。

## 功能概述

**效果展示：**
- 彩色粒子跟随鼠标移动产生
- 粒子向四周扩散并逐渐消失
- 支持自定义颜色、大小、速度等参数
- 高性能渲染，不影响页面交互

**技术特点：**
- 纯前端实现，无需第三方库
- 使用 Canvas 2D API 进行粒子渲染
- 基于 requestAnimationFrame 的流畅动画
- 响应式设计，自适应窗口大小

## 实现步骤

### 第一步：设计数据结构

首先定义配置选项和粒子数据结构。

```typescript
/**
 * 鼠标拖尾效果配置选项
 */
export interface MouseTrailOptions {
  /** 每次鼠标移动时产生的粒子数量 */
  particleCount?: number
  /** 屏幕上允许的最大粒子数量 */
  maxParticles?: number
  /** 粒子颜色数组，随机选择 */
  colors?: string[]
  /** 粒子大小范围（像素） */
  particleSize?: { min: number; max: number }
  /** 粒子生命周期范围（帧数） */
  lifeSpan?: { min: number; max: number }
  /** 粒子速度范围 */
  speed?: { min: number; max: number }
  /** 阻力系数（0-1），越小阻力越大 */
  decay?: number
}

/**
 * 粒子数据结构
 */
interface Particle {
  /** 粒子 X 坐标 */
  x: number
  /** 粒子 Y 坐标 */
  y: number
  /** X 方向速度 */
  vx: number
  /** Y 方向速度 */
  vy: number
  /** 当前生命值（帧数） */
  life: number
  /** 最大生命值（帧数） */
  maxLife: number
  /** 粒子颜色 */
  color: string
  /** 粒子大小 */
  size: number
}
```

### 第二步：创建 Composable 函数

使用 Vue 3 的 Composition API 创建可复用的组合式函数。

```typescript
import { onMounted, onUnmounted, ref } from 'vue'

export function useMouseTrail(options: MouseTrailOptions = {}) {
  // Canvas 元素引用
  const canvasRef = ref<HTMLCanvasElement>()

  // Canvas 2D 渲染上下文
  let ctx: CanvasRenderingContext2D | null = null

  // 粒子数组
  let particles: Particle[] = []

  // 动画帧 ID
  let animationId: number | null = null

  // 解构配置选项，设置默认值
  const {
    particleCount = 3,
    maxParticles = 200,
    colors = ['#ff0000', '#ff7f00', '#ffff00', '#00ff00', '#0000ff', '#4b0082', '#9400d3'],
    particleSize = { min: 2, max: 6 },
    lifeSpan = { min: 60, max: 90 },
    speed = { min: 1, max: 3 },
    decay = 0.98
  } = options

  // ... 后续实现
}
```

### 第三步：实现粒子创建逻辑

创建单个粒子，随机生成其属性。

```typescript
function createParticle(x: number, y: number): Particle {
  // 随机角度（0-360度）
  const angle = Math.random() * Math.PI * 2

  // 随机速度
  const speedValue = Math.random() * (speed.max - speed.min) + speed.min

  // 随机选择颜色
  const colorIndex = Math.floor(Math.random() * colors.length)
  const color = colors[colorIndex] ?? '#ff0000'

  // 随机大小
  const size = Math.random() * (particleSize.max - particleSize.min) + particleSize.min

  // 随机生命周期
  const maxLife = Math.random() * (lifeSpan.max - lifeSpan.min) + lifeSpan.min

  // 计算速度分量
  return {
    x,
    y,
    vx: Math.cos(angle) * speedValue,  // X 方向速度
    vy: Math.sin(angle) * speedValue,  // Y 方向速度
    life: 0,
    maxLife,
    color,
    size
  }
}
```

**关键点说明：**
- 使用 `Math.cos()` 和 `Math.sin()` 计算速度分量
- 随机角度使粒子向四周均匀扩散
- 速度分量控制粒子移动方向和距离

### 第四步：实现粒子更新逻辑

更新所有粒子的状态（位置、生命值、速度）。

```typescript
function updateParticles() {
  // 过滤掉已死亡的粒子
  particles = particles.filter(p => p.life < p.maxLife)

  // 更新每个粒子的状态
  particles.forEach(p => {
    // 更新位置
    p.x += p.vx
    p.y += p.vy

    // 增加生命值
    p.life++

    // 应用阻力减速
    p.vx *= decay
    p.vy *= decay
  })
}
```

**关键点说明：**
- `filter()` 移除生命周期结束的粒子
- 速度累加实现粒子移动
- 阻力系数实现减速效果（模拟空气阻力）

### 第五步：实现粒子渲染逻辑

在 Canvas 上绘制所有粒子。

```typescript
function drawParticles() {
  if (!ctx || !canvasRef.value) return

  // 清空画布
  ctx.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height)

  // 绘制每个粒子
  particles.forEach(p => {
    // 计算透明度（生命值越多，透明度越高）
    const opacity = 1 - (p.life / p.maxLife)

    // 计算半径（随透明度缩小，确保不为负数）
    const radius = Math.max(0, p.size * opacity)

    // 设置透明度
    ctx.globalAlpha = opacity

    // 设置颜色
    ctx.fillStyle = p.color

    // 绘制圆形粒子
    ctx.beginPath()
    ctx.arc(p.x, p.y, radius, 0, Math.PI * 2)
    ctx.fill()
  })

  // 重置透明度
  ctx.globalAlpha = 1
}
```

**关键点说明：**
- `clearRect()` 清空画布，避免重影
- 透明度随生命值降低，实现淡出效果
- 半径随透明度缩小，增强消失感
- `Math.max(0, ...)` 防止浮点数精度问题导致负半径

### 第六步：实现动画循环

使用 `requestAnimationFrame` 实现流畅动画。

```typescript
function animate() {
  updateParticles()  // 更新粒子状态
  drawParticles()    // 绘制粒子
  animationId = requestAnimationFrame(animate)  // 下一帧
}
```

**为什么使用 requestAnimationFrame？**
- 自动同步屏幕刷新率（通常 60fps）
- 页面不可见时自动暂停，节省性能
- 比 setInterval 更流畅、更高效

### 第七步：添加事件监听

监听鼠标移动和窗口大小调整事件。

```typescript
function handleMouseMove(e: MouseEvent) {
  // 限制最大粒子数量，避免性能问题
  if (particles.length < maxParticles) {
    // 每次移动创建多个粒子
    for (let i = 0; i < particleCount; i++) {
      particles.push(createParticle(e.clientX, e.clientY))
    }
  }
}

function handleResize() {
  if (!canvasRef.value) return
  canvasRef.value.width = window.innerWidth
  canvasRef.value.height = window.innerHeight
}
```

**关键点说明：**
- `e.clientX/Y` 获取鼠标坐标
- 限制粒子数量防止内存溢出
- 窗口大小改变时重新设置 Canvas 尺寸

### 第八步：实现启动和停止逻辑

提供手动控制接口。

```typescript
function start() {
  if (!canvasRef.value) return

  // 获取 2D 渲染上下文
  ctx = canvasRef.value.getContext('2d')

  // 设置初始尺寸
  handleResize()

  // 监听事件
  window.addEventListener('mousemove', handleMouseMove)
  window.addEventListener('resize', handleResize)

  // 开始动画循环
  animate()
}

function stop() {
  // 移除事件监听器
  window.removeEventListener('mousemove', handleMouseMove)
  window.removeEventListener('resize', handleResize)

  // 取消动画循环
  if (animationId !== null) {
    cancelAnimationFrame(animationId)
  }
}
```

### 第九步：自动生命周期管理

使用 Vue 生命周期钩子自动管理启动和停止。

```typescript
onMounted(() => {
  start()  // 组件挂载时自动启动
})

onUnmounted(() => {
  stop()   // 组件卸载时自动停止
})
```

### 第十步：返回控制接口

返回 Canvas 引用和控制方法。

```typescript
return {
  canvasRef,  // Canvas 元素引用
  start,      // 启动方法
  stop        // 停止方法
}
```

## 创建组件

使用 Composable 创建 Vue 组件。

```vue
<!--
  鼠标拖尾效果组件
-->
<script setup lang="ts">
import { useMouseTrail } from '@/composables/useMouseTrail'

// 初始化鼠标拖尾效果
// @ts-ignore - canvasRef is used in template
const { canvasRef } = useMouseTrail({
  particleCount: 3,
  maxParticles: 200,
  colors: ['#ff0000', '#ff7f00', '#ffff00', '#00ff00', '#0000ff', '#4b0082', '#9400d3'],
  particleSize: { min: 2, max: 6 },
  lifeSpan: { min: 60, max: 90 },
  speed: { min: 1, max: 3 },
  decay: 0.98
})
</script>

<template>
  <canvas ref="canvasRef" class="mouse-trail-canvas" />
</template>

<style scoped>
.mouse-trail-canvas {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;  /* 关键：不阻挡鼠标事件 */
  z-index: 9998;
}
</style>
```

## 全局注册组件

在 `App.vue` 中全局使用。

```vue
<script setup lang="ts">
import MouseTrail from '@/components/common/MouseTrail.vue'
</script>

<template>
  <MouseTrail />
  <router-view />
</template>
```

## 核心技术点解析

### 1. 粒子系统原理

**粒子生命周期：**
```
创建 → 更新位置 → 检查生命值 → 绘制 → 重复
         ↓
    生命值耗尽 → 移除
```

**状态变化示意：**
```
初始状态: life=0, maxLife=60, opacity=1.0
第30帧:  life=30, maxLife=60, opacity=0.5
第60帧:  life=60, maxLife=60, opacity=0.0 (移除)
```

### 2. 物理模拟

**速度分解：**
```
vx = speed × cos(angle)
vy = speed × sin(angle)
```

**阻力效果：**
```
每帧速度乘以阻力系数（如 0.98）
vx *= 0.98
vy *= 0.98
```

### 3. 性能优化策略

| 优化点 | 实现方式 | 效果 |
|--------|----------|------|
| 限制粒子数量 | `particles.length < maxParticles` | 防止内存溢出 |
| 过滤死亡粒子 | `filter(p => p.life < p.maxLife)` | 减少渲染负担 |
| 使用 requestAnimationFrame | 自动同步刷新率 | 流畅动画 + 页面不可见时暂停 |
| Canvas 清空 | `clearRect()` | 避免重影 |
| 阻力减速 | 速度逐渐降低 | 粒子自然消失 |

### 4. 样式设计要点

**关键 CSS 属性：**

```css
.mouse-trail-canvas {
  position: fixed;        /* 固定定位，不随页面滚动 */
  pointer-events: none;   /* 不阻挡鼠标事件，允许点击穿透 */
  z-index: 9998;          /* 高层级，显示在内容之上 */
}
```

**为什么使用 `pointer-events: none`？**
- Canvas 覆盖全屏，默认会阻挡鼠标事件
- 设置后鼠标事件"穿透"Canvas，传递给下层元素
- 不影响按钮点击、链接跳转等交互

## 常见问题与解决方案

### 问题 1：粒子半径为负数错误

**错误信息：**
```
Uncaught IndexSizeError: The radius provided (-0.01) is negative.
```

**原因：**
- 浮点数精度问题导致 `p.size * opacity` 可能产生极小的负数

**解决：**
```typescript
const radius = Math.max(0, p.size * opacity)  // 确保半径不为负数
```

### 问题 2：粒子只出现一次后消失

**原因：**
- 只在页面加载时创建粒子，鼠标移动时不创建

**解决：**
```typescript
// 在鼠标移动事件中创建粒子
function handleMouseMove(e: MouseEvent) {
  if (particles.length < maxParticles) {
    particles.push(createParticle(e.clientX, e.clientY))
  }
}
```

### 问题 3：性能问题，页面卡顿

**优化方案：**
```typescript
// 1. 减少粒子数量
maxParticles: 100  // 从 200 减少到 100

// 2. 减少每次创建的粒子数
particleCount: 1   // 从 3 减少到 1

// 3. 缩短生命周期
lifeSpan: { min: 30, max: 50 }  // 更快消失

// 4. 在移动设备上禁用
if (isMobile()) {
  return { canvasRef: ref(), start: () => {}, stop: () => {} }
}
```

### 问题 4：Canvas 尺寸不正确

**原因：**
- Canvas 初始尺寸为 0×0
- 窗口大小改变后未更新尺寸

**解决：**
```typescript
function handleResize() {
  if (!canvasRef.value) return
  canvasRef.value.width = window.innerWidth
  canvasRef.value.height = window.innerHeight
}

// 在 start() 中调用
function start() {
  // ...
  handleResize()  // 设置初始尺寸
  window.addEventListener('resize', handleResize)  // 监听尺寸变化
}
```

## 扩展功能建议

### 1. 添加交互控制

```vue
<script setup>
const { canvasRef, start, stop } = useMouseTrail()
const isEnabled = ref(true)

function toggle() {
  if (isEnabled.value) {
    stop()
  } else {
    start()
  }
  isEnabled.value = !isEnabled.value
}
</script>

<template>
  <button @click="toggle">
    {{ isEnabled ? '关闭拖尾' : '开启拖尾' }}
  </button>
  <canvas ref="canvasRef" />
</template>
```

### 2. 根据页面路由启用/禁用

```typescript
const route = useRoute()

watch(() => route.path, (newPath) => {
  if (newPath === '/home') {
    start()
  } else {
    stop()
  }
})
```

### 3. 添加更多视觉效果

```typescript
// 连接临近粒子
function drawConnections() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x
      const dy = particles[i].y - particles[j].y
      const distance = Math.sqrt(dx * dx + dy * dy)

      if (distance < 100) {
        ctx.strokeStyle = `rgba(255, 255, 255, ${1 - distance / 100})`
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.moveTo(particles[i].x, particles[i].y)
        ctx.lineTo(particles[j].x, particles[j].y)
        ctx.stroke()
      }
    }
  }
}
```

### 4. 添加重力效果

```typescript
function updateParticles() {
  particles.forEach(p => {
    p.x += p.vx
    p.y += p.vy

    // 添加重力
    p.vy += 0.1

    p.life++
    p.vx *= decay
    p.vy *= decay
  })
}
```

## 文件结构

```
src/
├── composables/
│   └── useMouseTrail.ts          # Composable 核心逻辑
├── components/
│   └── common/
│       └── MouseTrail.vue        # Vue 组件
└── App.vue                        # 全局注册
```

## 配置参数调优建议

| 参数 | 推荐值 | 效果 |
|------|--------|------|
| `particleCount` | 2-5 | 连续拖尾效果 |
| `maxParticles` | 100-300 | 性能与视觉效果平衡 |
| `particleSize` | { min: 2, max: 6 } | 细腻粒子 |
| `lifeSpan` | { min: 40, max: 80 } | 适中拖尾长度 |
| `speed` | { min: 1, max: 3 } | 自然扩散 |
| `decay` | 0.95-0.99 | 平滑减速 |

## 浏览器兼容性

| 浏览器 | 最低版本 | Canvas 2D 支持 |
|--------|----------|----------------|
| Chrome | 4+ | ✅ 完全支持 |
| Firefox | 2+ | ✅ 完全支持 |
| Safari | 3.1+ | ✅ 完全支持 |
| Edge | 12+ | ✅ 完全支持 |
| IE | 9+ | ⚠️ 部分（IE11 最佳） |

## 总结

本实现方案展示了如何使用 Canvas API 和 Vue 3 Composition API 创建高性能的交互效果。核心要点：

1. **Composable 模式**：逻辑复用，代码清晰
2. **粒子系统**：创建→更新→渲染→移除
3. **性能优化**：限制数量、使用 requestAnimationFrame
4. **生命周期管理**：自动启动和清理
5. **灵活配置**：支持自定义所有关键参数

通过这个案例，你可以举一反三实现更多 Canvas 动画效果，如烟花、雨滴、星空等。
