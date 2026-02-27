const n=`---\r
title: "Canvas 鼠标拖尾效果实现指南"\r
date: "2025-02-10"\r
category: "前端交互效果"\r
tags:\r
  - "Canvas"\r
  - "Vue 3"\r
  - "TypeScript"\r
  - "Composable"\r
  - "动画效果"\r
  - "粒子系统"\r
description: "详解使用 Canvas API 实现彩色粒子鼠标拖尾效果的完整流程，包括 Composable 设计、粒子系统原理、性能优化等实战技巧"\r
author: "Claude"\r
readTime: "10 min"\r
---\r
\r
# Canvas 鼠标拖尾效果实现指南\r
\r
本文详细介绍如何使用 Canvas API 实现一个跟随鼠标移动的彩色粒子拖尾效果，采用 Vue 3 Composition API 的 Composable 模式设计，实现代码复用和逻辑分离。\r
\r
## 功能概述\r
\r
**效果展示：**\r
- 彩色粒子跟随鼠标移动产生\r
- 粒子向四周扩散并逐渐消失\r
- 支持自定义颜色、大小、速度等参数\r
- 高性能渲染，不影响页面交互\r
\r
**技术特点：**\r
- 纯前端实现，无需第三方库\r
- 使用 Canvas 2D API 进行粒子渲染\r
- 基于 requestAnimationFrame 的流畅动画\r
- 响应式设计，自适应窗口大小\r
\r
## 实现步骤\r
\r
### 第一步：设计数据结构\r
\r
首先定义配置选项和粒子数据结构。\r
\r
\`\`\`typescript\r
/**\r
 * 鼠标拖尾效果配置选项\r
 */\r
export interface MouseTrailOptions {\r
  /** 每次鼠标移动时产生的粒子数量 */\r
  particleCount?: number\r
  /** 屏幕上允许的最大粒子数量 */\r
  maxParticles?: number\r
  /** 粒子颜色数组，随机选择 */\r
  colors?: string[]\r
  /** 粒子大小范围（像素） */\r
  particleSize?: { min: number; max: number }\r
  /** 粒子生命周期范围（帧数） */\r
  lifeSpan?: { min: number; max: number }\r
  /** 粒子速度范围 */\r
  speed?: { min: number; max: number }\r
  /** 阻力系数（0-1），越小阻力越大 */\r
  decay?: number\r
}\r
\r
/**\r
 * 粒子数据结构\r
 */\r
interface Particle {\r
  /** 粒子 X 坐标 */\r
  x: number\r
  /** 粒子 Y 坐标 */\r
  y: number\r
  /** X 方向速度 */\r
  vx: number\r
  /** Y 方向速度 */\r
  vy: number\r
  /** 当前生命值（帧数） */\r
  life: number\r
  /** 最大生命值（帧数） */\r
  maxLife: number\r
  /** 粒子颜色 */\r
  color: string\r
  /** 粒子大小 */\r
  size: number\r
}\r
\`\`\`\r
\r
### 第二步：创建 Composable 函数\r
\r
使用 Vue 3 的 Composition API 创建可复用的组合式函数。\r
\r
\`\`\`typescript\r
import { onMounted, onUnmounted, ref } from 'vue'\r
\r
export function useMouseTrail(options: MouseTrailOptions = {}) {\r
  // Canvas 元素引用\r
  const canvasRef = ref<HTMLCanvasElement>()\r
\r
  // Canvas 2D 渲染上下文\r
  let ctx: CanvasRenderingContext2D | null = null\r
\r
  // 粒子数组\r
  let particles: Particle[] = []\r
\r
  // 动画帧 ID\r
  let animationId: number | null = null\r
\r
  // 解构配置选项，设置默认值\r
  const {\r
    particleCount = 3,\r
    maxParticles = 200,\r
    colors = ['#ff0000', '#ff7f00', '#ffff00', '#00ff00', '#0000ff', '#4b0082', '#9400d3'],\r
    particleSize = { min: 2, max: 6 },\r
    lifeSpan = { min: 60, max: 90 },\r
    speed = { min: 1, max: 3 },\r
    decay = 0.98\r
  } = options\r
\r
  // ... 后续实现\r
}\r
\`\`\`\r
\r
### 第三步：实现粒子创建逻辑\r
\r
创建单个粒子，随机生成其属性。\r
\r
\`\`\`typescript\r
function createParticle(x: number, y: number): Particle {\r
  // 随机角度（0-360度）\r
  const angle = Math.random() * Math.PI * 2\r
\r
  // 随机速度\r
  const speedValue = Math.random() * (speed.max - speed.min) + speed.min\r
\r
  // 随机选择颜色\r
  const colorIndex = Math.floor(Math.random() * colors.length)\r
  const color = colors[colorIndex] ?? '#ff0000'\r
\r
  // 随机大小\r
  const size = Math.random() * (particleSize.max - particleSize.min) + particleSize.min\r
\r
  // 随机生命周期\r
  const maxLife = Math.random() * (lifeSpan.max - lifeSpan.min) + lifeSpan.min\r
\r
  // 计算速度分量\r
  return {\r
    x,\r
    y,\r
    vx: Math.cos(angle) * speedValue,  // X 方向速度\r
    vy: Math.sin(angle) * speedValue,  // Y 方向速度\r
    life: 0,\r
    maxLife,\r
    color,\r
    size\r
  }\r
}\r
\`\`\`\r
\r
**关键点说明：**\r
- 使用 \`Math.cos()\` 和 \`Math.sin()\` 计算速度分量\r
- 随机角度使粒子向四周均匀扩散\r
- 速度分量控制粒子移动方向和距离\r
\r
### 第四步：实现粒子更新逻辑\r
\r
更新所有粒子的状态（位置、生命值、速度）。\r
\r
\`\`\`typescript\r
function updateParticles() {\r
  // 过滤掉已死亡的粒子\r
  particles = particles.filter(p => p.life < p.maxLife)\r
\r
  // 更新每个粒子的状态\r
  particles.forEach(p => {\r
    // 更新位置\r
    p.x += p.vx\r
    p.y += p.vy\r
\r
    // 增加生命值\r
    p.life++\r
\r
    // 应用阻力减速\r
    p.vx *= decay\r
    p.vy *= decay\r
  })\r
}\r
\`\`\`\r
\r
**关键点说明：**\r
- \`filter()\` 移除生命周期结束的粒子\r
- 速度累加实现粒子移动\r
- 阻力系数实现减速效果（模拟空气阻力）\r
\r
### 第五步：实现粒子渲染逻辑\r
\r
在 Canvas 上绘制所有粒子。\r
\r
\`\`\`typescript\r
function drawParticles() {\r
  if (!ctx || !canvasRef.value) return\r
\r
  // 清空画布\r
  ctx.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height)\r
\r
  // 绘制每个粒子\r
  particles.forEach(p => {\r
    // 计算透明度（生命值越多，透明度越高）\r
    const opacity = 1 - (p.life / p.maxLife)\r
\r
    // 计算半径（随透明度缩小，确保不为负数）\r
    const radius = Math.max(0, p.size * opacity)\r
\r
    // 设置透明度\r
    ctx.globalAlpha = opacity\r
\r
    // 设置颜色\r
    ctx.fillStyle = p.color\r
\r
    // 绘制圆形粒子\r
    ctx.beginPath()\r
    ctx.arc(p.x, p.y, radius, 0, Math.PI * 2)\r
    ctx.fill()\r
  })\r
\r
  // 重置透明度\r
  ctx.globalAlpha = 1\r
}\r
\`\`\`\r
\r
**关键点说明：**\r
- \`clearRect()\` 清空画布，避免重影\r
- 透明度随生命值降低，实现淡出效果\r
- 半径随透明度缩小，增强消失感\r
- \`Math.max(0, ...)\` 防止浮点数精度问题导致负半径\r
\r
### 第六步：实现动画循环\r
\r
使用 \`requestAnimationFrame\` 实现流畅动画。\r
\r
\`\`\`typescript\r
function animate() {\r
  updateParticles()  // 更新粒子状态\r
  drawParticles()    // 绘制粒子\r
  animationId = requestAnimationFrame(animate)  // 下一帧\r
}\r
\`\`\`\r
\r
**为什么使用 requestAnimationFrame？**\r
- 自动同步屏幕刷新率（通常 60fps）\r
- 页面不可见时自动暂停，节省性能\r
- 比 setInterval 更流畅、更高效\r
\r
### 第七步：添加事件监听\r
\r
监听鼠标移动和窗口大小调整事件。\r
\r
\`\`\`typescript\r
function handleMouseMove(e: MouseEvent) {\r
  // 限制最大粒子数量，避免性能问题\r
  if (particles.length < maxParticles) {\r
    // 每次移动创建多个粒子\r
    for (let i = 0; i < particleCount; i++) {\r
      particles.push(createParticle(e.clientX, e.clientY))\r
    }\r
  }\r
}\r
\r
function handleResize() {\r
  if (!canvasRef.value) return\r
  canvasRef.value.width = window.innerWidth\r
  canvasRef.value.height = window.innerHeight\r
}\r
\`\`\`\r
\r
**关键点说明：**\r
- \`e.clientX/Y\` 获取鼠标坐标\r
- 限制粒子数量防止内存溢出\r
- 窗口大小改变时重新设置 Canvas 尺寸\r
\r
### 第八步：实现启动和停止逻辑\r
\r
提供手动控制接口。\r
\r
\`\`\`typescript\r
function start() {\r
  if (!canvasRef.value) return\r
\r
  // 获取 2D 渲染上下文\r
  ctx = canvasRef.value.getContext('2d')\r
\r
  // 设置初始尺寸\r
  handleResize()\r
\r
  // 监听事件\r
  window.addEventListener('mousemove', handleMouseMove)\r
  window.addEventListener('resize', handleResize)\r
\r
  // 开始动画循环\r
  animate()\r
}\r
\r
function stop() {\r
  // 移除事件监听器\r
  window.removeEventListener('mousemove', handleMouseMove)\r
  window.removeEventListener('resize', handleResize)\r
\r
  // 取消动画循环\r
  if (animationId !== null) {\r
    cancelAnimationFrame(animationId)\r
  }\r
}\r
\`\`\`\r
\r
### 第九步：自动生命周期管理\r
\r
使用 Vue 生命周期钩子自动管理启动和停止。\r
\r
\`\`\`typescript\r
onMounted(() => {\r
  start()  // 组件挂载时自动启动\r
})\r
\r
onUnmounted(() => {\r
  stop()   // 组件卸载时自动停止\r
})\r
\`\`\`\r
\r
### 第十步：返回控制接口\r
\r
返回 Canvas 引用和控制方法。\r
\r
\`\`\`typescript\r
return {\r
  canvasRef,  // Canvas 元素引用\r
  start,      // 启动方法\r
  stop        // 停止方法\r
}\r
\`\`\`\r
\r
## 创建组件\r
\r
使用 Composable 创建 Vue 组件。\r
\r
\`\`\`vue\r
<!--\r
  鼠标拖尾效果组件\r
-->\r
<script setup lang="ts">\r
import { useMouseTrail } from '@/composables/useMouseTrail'\r
\r
// 初始化鼠标拖尾效果\r
// @ts-ignore - canvasRef is used in template\r
const { canvasRef } = useMouseTrail({\r
  particleCount: 3,\r
  maxParticles: 200,\r
  colors: ['#ff0000', '#ff7f00', '#ffff00', '#00ff00', '#0000ff', '#4b0082', '#9400d3'],\r
  particleSize: { min: 2, max: 6 },\r
  lifeSpan: { min: 60, max: 90 },\r
  speed: { min: 1, max: 3 },\r
  decay: 0.98\r
})\r
<\/script>\r
\r
<template>\r
  <canvas ref="canvasRef" class="mouse-trail-canvas" />\r
</template>\r
\r
<style scoped>\r
.mouse-trail-canvas {\r
  position: fixed;\r
  top: 0;\r
  left: 0;\r
  width: 100%;\r
  height: 100%;\r
  pointer-events: none;  /* 关键：不阻挡鼠标事件 */\r
  z-index: 9998;\r
}\r
</style>\r
\`\`\`\r
\r
## 全局注册组件\r
\r
在 \`App.vue\` 中全局使用。\r
\r
\`\`\`vue\r
<script setup lang="ts">\r
import MouseTrail from '@/components/common/MouseTrail.vue'\r
<\/script>\r
\r
<template>\r
  <MouseTrail />\r
  <router-view />\r
</template>\r
\`\`\`\r
\r
## 核心技术点解析\r
\r
### 1. 粒子系统原理\r
\r
**粒子生命周期：**\r
\`\`\`\r
创建 → 更新位置 → 检查生命值 → 绘制 → 重复\r
         ↓\r
    生命值耗尽 → 移除\r
\`\`\`\r
\r
**状态变化示意：**\r
\`\`\`\r
初始状态: life=0, maxLife=60, opacity=1.0\r
第30帧:  life=30, maxLife=60, opacity=0.5\r
第60帧:  life=60, maxLife=60, opacity=0.0 (移除)\r
\`\`\`\r
\r
### 2. 物理模拟\r
\r
**速度分解：**\r
\`\`\`\r
vx = speed × cos(angle)\r
vy = speed × sin(angle)\r
\`\`\`\r
\r
**阻力效果：**\r
\`\`\`\r
每帧速度乘以阻力系数（如 0.98）\r
vx *= 0.98\r
vy *= 0.98\r
\`\`\`\r
\r
### 3. 性能优化策略\r
\r
| 优化点 | 实现方式 | 效果 |\r
|--------|----------|------|\r
| 限制粒子数量 | \`particles.length < maxParticles\` | 防止内存溢出 |\r
| 过滤死亡粒子 | \`filter(p => p.life < p.maxLife)\` | 减少渲染负担 |\r
| 使用 requestAnimationFrame | 自动同步刷新率 | 流畅动画 + 页面不可见时暂停 |\r
| Canvas 清空 | \`clearRect()\` | 避免重影 |\r
| 阻力减速 | 速度逐渐降低 | 粒子自然消失 |\r
\r
### 4. 样式设计要点\r
\r
**关键 CSS 属性：**\r
\r
\`\`\`css\r
.mouse-trail-canvas {\r
  position: fixed;        /* 固定定位，不随页面滚动 */\r
  pointer-events: none;   /* 不阻挡鼠标事件，允许点击穿透 */\r
  z-index: 9998;          /* 高层级，显示在内容之上 */\r
}\r
\`\`\`\r
\r
**为什么使用 \`pointer-events: none\`？**\r
- Canvas 覆盖全屏，默认会阻挡鼠标事件\r
- 设置后鼠标事件"穿透"Canvas，传递给下层元素\r
- 不影响按钮点击、链接跳转等交互\r
\r
## 常见问题与解决方案\r
\r
### 问题 1：粒子半径为负数错误\r
\r
**错误信息：**\r
\`\`\`\r
Uncaught IndexSizeError: The radius provided (-0.01) is negative.\r
\`\`\`\r
\r
**原因：**\r
- 浮点数精度问题导致 \`p.size * opacity\` 可能产生极小的负数\r
\r
**解决：**\r
\`\`\`typescript\r
const radius = Math.max(0, p.size * opacity)  // 确保半径不为负数\r
\`\`\`\r
\r
### 问题 2：粒子只出现一次后消失\r
\r
**原因：**\r
- 只在页面加载时创建粒子，鼠标移动时不创建\r
\r
**解决：**\r
\`\`\`typescript\r
// 在鼠标移动事件中创建粒子\r
function handleMouseMove(e: MouseEvent) {\r
  if (particles.length < maxParticles) {\r
    particles.push(createParticle(e.clientX, e.clientY))\r
  }\r
}\r
\`\`\`\r
\r
### 问题 3：性能问题，页面卡顿\r
\r
**优化方案：**\r
\`\`\`typescript\r
// 1. 减少粒子数量\r
maxParticles: 100  // 从 200 减少到 100\r
\r
// 2. 减少每次创建的粒子数\r
particleCount: 1   // 从 3 减少到 1\r
\r
// 3. 缩短生命周期\r
lifeSpan: { min: 30, max: 50 }  // 更快消失\r
\r
// 4. 在移动设备上禁用\r
if (isMobile()) {\r
  return { canvasRef: ref(), start: () => {}, stop: () => {} }\r
}\r
\`\`\`\r
\r
### 问题 4：Canvas 尺寸不正确\r
\r
**原因：**\r
- Canvas 初始尺寸为 0×0\r
- 窗口大小改变后未更新尺寸\r
\r
**解决：**\r
\`\`\`typescript\r
function handleResize() {\r
  if (!canvasRef.value) return\r
  canvasRef.value.width = window.innerWidth\r
  canvasRef.value.height = window.innerHeight\r
}\r
\r
// 在 start() 中调用\r
function start() {\r
  // ...\r
  handleResize()  // 设置初始尺寸\r
  window.addEventListener('resize', handleResize)  // 监听尺寸变化\r
}\r
\`\`\`\r
\r
## 扩展功能建议\r
\r
### 1. 添加交互控制\r
\r
\`\`\`vue\r
<script setup>\r
const { canvasRef, start, stop } = useMouseTrail()\r
const isEnabled = ref(true)\r
\r
function toggle() {\r
  if (isEnabled.value) {\r
    stop()\r
  } else {\r
    start()\r
  }\r
  isEnabled.value = !isEnabled.value\r
}\r
<\/script>\r
\r
<template>\r
  <button @click="toggle">\r
    {{ isEnabled ? '关闭拖尾' : '开启拖尾' }}\r
  </button>\r
  <canvas ref="canvasRef" />\r
</template>\r
\`\`\`\r
\r
### 2. 根据页面路由启用/禁用\r
\r
\`\`\`typescript\r
const route = useRoute()\r
\r
watch(() => route.path, (newPath) => {\r
  if (newPath === '/home') {\r
    start()\r
  } else {\r
    stop()\r
  }\r
})\r
\`\`\`\r
\r
### 3. 添加更多视觉效果\r
\r
\`\`\`typescript\r
// 连接临近粒子\r
function drawConnections() {\r
  for (let i = 0; i < particles.length; i++) {\r
    for (let j = i + 1; j < particles.length; j++) {\r
      const dx = particles[i].x - particles[j].x\r
      const dy = particles[i].y - particles[j].y\r
      const distance = Math.sqrt(dx * dx + dy * dy)\r
\r
      if (distance < 100) {\r
        ctx.strokeStyle = \`rgba(255, 255, 255, \${1 - distance / 100})\`\r
        ctx.lineWidth = 1\r
        ctx.beginPath()\r
        ctx.moveTo(particles[i].x, particles[i].y)\r
        ctx.lineTo(particles[j].x, particles[j].y)\r
        ctx.stroke()\r
      }\r
    }\r
  }\r
}\r
\`\`\`\r
\r
### 4. 添加重力效果\r
\r
\`\`\`typescript\r
function updateParticles() {\r
  particles.forEach(p => {\r
    p.x += p.vx\r
    p.y += p.vy\r
\r
    // 添加重力\r
    p.vy += 0.1\r
\r
    p.life++\r
    p.vx *= decay\r
    p.vy *= decay\r
  })\r
}\r
\`\`\`\r
\r
## 文件结构\r
\r
\`\`\`\r
src/\r
├── composables/\r
│   └── useMouseTrail.ts          # Composable 核心逻辑\r
├── components/\r
│   └── common/\r
│       └── MouseTrail.vue        # Vue 组件\r
└── App.vue                        # 全局注册\r
\`\`\`\r
\r
## 配置参数调优建议\r
\r
| 参数 | 推荐值 | 效果 |\r
|------|--------|------|\r
| \`particleCount\` | 2-5 | 连续拖尾效果 |\r
| \`maxParticles\` | 100-300 | 性能与视觉效果平衡 |\r
| \`particleSize\` | { min: 2, max: 6 } | 细腻粒子 |\r
| \`lifeSpan\` | { min: 40, max: 80 } | 适中拖尾长度 |\r
| \`speed\` | { min: 1, max: 3 } | 自然扩散 |\r
| \`decay\` | 0.95-0.99 | 平滑减速 |\r
\r
## 浏览器兼容性\r
\r
| 浏览器 | 最低版本 | Canvas 2D 支持 |\r
|--------|----------|----------------|\r
| Chrome | 4+ | ✅ 完全支持 |\r
| Firefox | 2+ | ✅ 完全支持 |\r
| Safari | 3.1+ | ✅ 完全支持 |\r
| Edge | 12+ | ✅ 完全支持 |\r
| IE | 9+ | ⚠️ 部分（IE11 最佳） |\r
\r
## 总结\r
\r
本实现方案展示了如何使用 Canvas API 和 Vue 3 Composition API 创建高性能的交互效果。核心要点：\r
\r
1. **Composable 模式**：逻辑复用，代码清晰\r
2. **粒子系统**：创建→更新→渲染→移除\r
3. **性能优化**：限制数量、使用 requestAnimationFrame\r
4. **生命周期管理**：自动启动和清理\r
5. **灵活配置**：支持自定义所有关键参数\r
\r
通过这个案例，你可以举一反三实现更多 Canvas 动画效果，如烟花、雨滴、星空等。\r
`;export{n as default};
