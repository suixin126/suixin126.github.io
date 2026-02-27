<script setup lang="ts">
import type { Game } from '@/types/games'
import GameCard from '../games-card/GameCard.vue'

interface Props {
  games: Game[]
}

defineProps<Props>()
</script>

<template>
  <div class="games-list">
    <GameCard
      v-for="game in games"
      :key="game.id"
      :game="game"
    />
  </div>
</template>

<style scoped>
.games-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
}

/* 响应式适配 */
@media (max-width: 1200px) {
  .games-list {
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 16px;
  }
}

@media (max-width: 768px) {
  .games-list {
    grid-template-columns: 1fr;
    gap: 15px;
  }
}
</style>
