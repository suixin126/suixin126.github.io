<script setup lang="ts">
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useGamesStore } from '@/stores/games'
import { gamesConfig } from '@/config/games/games.config'
import GamesHeader from './games-header/GamesHeader.vue'
import GamesFilter from './games-filter/GamesFilter.vue'
import GamesList from './games-list/GamesList.vue'
import GamesFooter from './games-footer/GamesFooter.vue'
import GamesEmpty from './games-empty/GamesEmpty.vue'

const gamesStore = useGamesStore()
const { filteredGames, loading, error, hasGames } = storeToRefs(gamesStore)

// 加载游戏数据
onMounted(() => {
  gamesStore.loadGames()
})
</script>

<template>
  <div class="games-main">
    <!-- 顶部标题区 -->
    <GamesHeader />

    <!-- 筛选和排序 -->
    <GamesFilter
      v-if="gamesConfig.showFilter || gamesConfig.showSort"
    />

    <!-- 加载状态 -->
    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>加载中...</p>
    </div>

    <!-- 错误提示 -->
    <div v-else-if="error" class="error-state">
      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" viewBox="0 0 16 16">
        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
        <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z" />
      </svg>
      <p>{{ error }}</p>
    </div>

    <!-- 游戏列表 -->
    <template v-else-if="hasGames">
      <GamesList v-if="filteredGames.length > 0" :games="filteredGames" />
      <GamesEmpty v-else message="没有符合条件的游戏" subMessage="试试切换其他筛选条件吧" />
    </template>

    <!-- 空状态（无游戏数据） -->
    <GamesEmpty v-else />

    <!-- 底部辅助区 -->
    <GamesFooter v-if="hasGames" />
  </div>
</template>

<style scoped>
.games-main {
  max-width: 1200px;
  margin: 0 auto;
}

/* 加载状态 */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  color: #666;
}

.spinner {
  width: 40px;
  height: 40px;
  margin-bottom: 16px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* 错误状态 */
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  color: #dc3545;
}

.error-state svg {
  color: #f8d7da;
  margin-bottom: 16px;
}

.error-state p {
  font-size: 1.1rem;
  margin: 0;
}

/* 响应式适配 */
@media (max-width: 768px) {
  .games-main {
    padding: 0;
  }
}
</style>
