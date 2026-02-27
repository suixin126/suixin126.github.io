<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import type { Game, GameDifficulty } from '@/types/games'
import { useGamesStore } from '@/stores/games'
import GameCover from './GameCover.vue'

interface Props {
  game: Game
}

const props = defineProps<Props>()
const router = useRouter()
const gamesStore = useGamesStore()

const isHovered = ref(false)
const isLoading = ref(false)

// 难度显示配置
const difficultyConfig: Record<GameDifficulty, { label: string; color: string }> = {
  easy: { label: '简单', color: '#52c41a' },
  medium: { label: '中等', color: '#faad14' },
  hard: { label: '困难', color: '#ff4d4f' }
}

// 类型显示配置
const typeConfig: Record<Game['type'], string> = {
  casual: '休闲',
  puzzle: '益智',
  action: '动作',
  strategy: '策略'
}

const difficultyInfo = computed(() => difficultyConfig[props.game.difficulty])
const typeLabel = computed(() => typeConfig[props.game.type])

// 点击开始游戏
async function handleStartGame() {
  if (isLoading.value) return

  isLoading.value = true

  // 记录游戏点击（用于热门排序）
  gamesStore.recordGamePlay(props.game.id)

  // 模拟加载反馈（100ms）
  await new Promise(resolve => setTimeout(resolve, 100))

  // 跳转到游戏页面
  router.push(props.game.route)

  isLoading.value = false
}

// 鼠标悬停效果（移动端不需要）
function handleMouseEnter() {
  isHovered.value = true
}

function handleMouseLeave() {
  isHovered.value = false
}
</script>

<template>
  <article
    class="game-card"
    :class="{ 'hovered': isHovered }"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <!-- 游戏封面 -->
    <div class="card-cover">
      <GameCover :src="game.cover" :type="game.type" :alt="game.name" />
    </div> 

    <!-- 游戏信息 -->
    <div class="card-info">
      <h3 class="game-name">{{ game.name }}</h3>
      <p class="game-desc">{{ game.description }}</p>

      <!-- 标签 -->
      <div class="game-tags">
        <span class="tag type-tag">{{ typeLabel }}</span>
        <span class="tag difficulty-tag" :style="{ color: difficultyInfo.color }">
          {{ difficultyInfo.label }}
        </span>
      </div>
    </div>

    <!-- 操作按钮 -->
    <div class="card-actions">
      <button
        class="start-btn"
        :class="{ 'loading': isLoading }"
        @click="handleStartGame"
        :disabled="isLoading"
      >
        {{ isLoading ? '加载中...' : '开始游戏' }}
      </button>
    </div>
  </article>
</template>

<style scoped>
.game-card {
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.game-card.hovered {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
  transform: translateY(-2px);
}

.card-cover {
  width: 100%;
}

.card-info {
  padding: 16px;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.game-name {
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0;
  line-height: 1.4;
}

.game-desc {
  font-size: 12px;
  color: #999;
  margin: 0;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  min-height: 36px;
}

.game-tags {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.tag {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 10px;
  font-weight: 500;
  background: #f5f5f5;
}

.type-tag {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
}

.difficulty-tag {
  background: #f0f0f0;
}

.card-actions {
  padding: 0 16px 16px;
}

.start-btn {
  width: 100%;
  padding: 10px 16px;
  background: #667eea;
  color: #fff;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.start-btn:hover:not(:disabled) {
  background: #5568d3;
}

.start-btn:active:not(:disabled) {
  transform: scale(0.98);
}

.start-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/* 响应式适配 */
@media (max-width: 768px) {
  .card-info {
    padding: 12px;
    gap: 6px;
  }

  .game-name {
    font-size: 14px;
  }

  .game-desc {
    font-size: 11px;
    min-height: 30px;
  }

  .card-actions {
    padding: 0 12px 12px;
  }

  .start-btn {
    padding: 8px 12px;
    font-size: 12px;
  }

  /* 移动端点击效果 */
  .game-card:active {
    transform: scale(0.98);
  }
}
</style>
