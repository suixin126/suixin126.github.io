<!--
  鼠标拖尾效果组件

  使用 Canvas 实现的全局彩色粒子拖尾效果，粒子会跟随鼠标移动并逐渐消失。

  @author Claude
  @since 2025-02-10
-->
<script setup lang="ts">
import { useMouseTrail } from '@/composables/useMouseTrail'

/**
 * 初始化鼠标拖尾效果
 *
 * 配置说明：
 * - particleCount: 每次鼠标移动产生的粒子数量，3 个可以形成连续的拖尾
 * - maxParticles: 屏幕上最大粒子数，200 个平衡性能和视觉效果
 * - colors: 彩虹色数组，随机选择营造炫彩效果
 * - particleSize: 粒子大小 2-6 像素，小粒子更细腻
 * - lifeSpan: 粒子存活 60-90 帧（约 1-1.5 秒），适中的拖尾长度
 * - speed: 粒子扩散速度 1-3，中等速度营造自然扩散效果
 * - decay: 阻力系数 0.98，粒子逐渐减速
 */
// @ts-ignore - canvasRef is used in template
const { canvasRef } = useMouseTrail({
  /** 每次移动产生的粒子数 */
  particleCount: 3,

  /** 最大粒子数量 */
  maxParticles: 200,

  /** 彩虹色配置（红橙黄绿蓝靛紫） */
  colors: ['#ff0000', '#ff7f00', '#ffff00', '#00ff00', '#0000ff', '#4b0082', '#9400d3'],

  /** 粒子大小范围（像素） */
  particleSize: { min: 2, max: 6 },

  /** 粒子生命周期范围（帧数，60帧约等于1秒） */
  lifeSpan: { min: 60, max: 90 },

  /** 粒子速度范围 */
  speed: { min: 1, max: 3 },

  /** 阻力系数（值越小阻力越大） */
  decay: 0.98
})
</script>

<template>
  <!--
    Canvas 画布元素
    - ref: 绑定到 composable 返回的 canvasRef，用于获取 2D 渲染上下文
    - class: 应用样式使其覆盖全屏且不阻挡鼠标事件
  -->
  <canvas ref="canvasRef" class="mouse-trail-canvas" />
</template>

<style scoped>
/**
 * 鼠标拖尾画布样式
 *
 * 设计要点：
 * - position: fixed - 固定定位，相对于视口，不随页面滚动
 * - top/left: 0 - 从左上角开始
 * - width/height: 100% - 覆盖整个视口
 * - pointer-events: none - 不阻挡鼠标事件，允许点击穿透到下层元素
 * - z-index: 9998 - 层级很高，确保显示在大多数内容之上，但低于模态框（通常为 9999）
 */
.mouse-trail-canvas {
  /* 固定定位，相对于视口 */
  position: fixed;

  /* 从左上角开始 */
  top: 0;
  left: 0;

  /* 覆盖整个视口 */
  width: 100%;
  height: 100%;

  /* 关键：不阻挡鼠标事件，允许点击穿透 */
  pointer-events: none;

  /* 高层级，显示在内容之上 */
  z-index: 9998;
}
</style>
