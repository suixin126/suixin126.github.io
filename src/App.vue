<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import Modal from '@/components/common/Modal.vue'
import MouseTrail from '@/components/common/MouseTrail.vue'

const route = useRoute()

// 根据路由 meta 获取过渡名称，默认使用 slide-fade
const transitionName = computed(() => {
  return (route.meta.transition as string) || 'slide-fade'
})
// 根据meta信息判断显示
const showMouseTrail = computed(() => {
  return route.meta.mouseTrail === true
})
</script>

<template>
  <!-- 全局弹窗组件 -->
  <Modal />

  <!-- 鼠标拖尾效果 -->
  <MouseTrail v-if="showMouseTrail" />

  <router-view v-slot="{ Component }">
    <Transition :name="transitionName" mode="out-in">
      <component :is="Component" :key="route.path" />
    </Transition>
  </router-view>
</template>

<style>
@import './styles/transitions.css';
</style>
