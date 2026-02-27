<script setup lang="ts">
interface Props {
  message?: string
  subMessage?: string
}

withDefaults(defineProps<Props>(), {
  message: '暂无小游戏，敬请期待',
  subMessage: '游戏正在开发中，稍后再来看看吧'
})
</script>

<template>
  <div class="games-empty">
    <svg class="empty-icon" xmlns="http://www.w3.org/2000/svg" width="80" height="80" fill="currentColor" viewBox="0 0 16 16">
      <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
      <path d="M11 7.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm-3 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5H8.5a.5.5 0 0 1-.5-.5v-1zm-3.5.5a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1zM3.5 11a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm3.5.5a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1zm4 0a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1z"/>
    </svg>
    <h3 class="empty-title">{{ message }}</h3>
    <p class="empty-desc">{{ subMessage }}</p>
  </div>
</template>

<style scoped>
.games-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  text-align: center;
  min-height: 400px;
}

.empty-icon {
  color: #ddd;
  margin-bottom: 20px;
  opacity: 0.6;
}

.empty-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #666;
  margin: 0 0 12px 0;
}

.empty-desc {
  font-size: 1rem;
  color: #999;
  margin: 0;
  max-width: 400px;
  line-height: 1.6;
}

/* 响应式适配 */
@media (max-width: 768px) {
  .games-empty {
    padding: 60px 15px;
    min-height: 300px;
  }

  .empty-icon {
    width: 64px;
    height: 64px;
  }

  .empty-title {
    font-size: 1.25rem;
  }

  .empty-desc {
    font-size: 0.9rem;
  }
}
</style>
