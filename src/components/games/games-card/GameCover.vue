<script setup lang="ts">
import { ref, computed } from 'vue'
import type { GameType } from '@/types/games'
import { getDefaultGameCover } from '@/config/games/games.data'

interface Props {
  src: string
  type: GameType
  alt?: string
}

const props = withDefaults(defineProps<Props>(), {
  alt: '游戏封面'
})

const hasError = ref(false)
const isLoaded = ref(false)

const coverSrc = computed(() => {
  return hasError.value ? getDefaultGameCover(props.type) : props.src
})

function handleError() {
  hasError.value = true
}

function handleLoad() {
  isLoaded.value = true
}
</script>

<template>
  <div class="game-cover">
    <img
      :src="coverSrc"
      :alt="alt"
      loading="lazy"
      @error="handleError"
      @load="handleLoad"
      :class="{ 'loaded': isLoaded, 'error': hasError }"
    />
    <div v-if="!isLoaded" class="cover-skeleton"></div>
  </div>
</template>

<style scoped>
.game-cover {
  position: relative;
  width: 100%;
  padding-top: 56.25%; /* 16:9 宽高比 */
  background: #f5f5f5;
  border-radius: 8px;
  overflow: hidden;
}

.game-cover img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.game-cover img.loaded {
  opacity: 1;
}

.game-cover img.error {
  opacity: 1;
}

.cover-skeleton {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    #f5f5f5 25%,
    #e8e8e8 50%,
    #f5f5f5 75%
  );
  background-size: 200% 100%;
  animation: loading 1.5s ease-in-out infinite;
}

@keyframes loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
</style>
