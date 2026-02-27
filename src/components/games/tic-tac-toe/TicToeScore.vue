<script setup lang="ts">
import type { GameScores } from './types'

interface Props {
  scores: GameScores
}

defineProps<Props>()
</script>

<template>
  <div class="tic-tac-toe-score">
    <h3 class="score-title">比分统计</h3>
    <div class="score-board">
      <div class="score-item score-x">
        <span class="score-label">玩家 X</span>
        <span class="score-value">{{ scores.X }}</span>
      </div>
      <div class="score-item score-draw">
        <span class="score-label">平局</span>
        <span class="score-value">{{ scores.draws }}</span>
      </div>
      <div class="score-item score-o">
        <span class="score-label">玩家 O</span>
        <span class="score-value">{{ scores.O }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tic-tac-toe-score {
  margin-bottom: 24px;
}

.score-title {
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 12px 0;
  color: #1a1a1a;
  text-align: center;
}

.score-board {
  display: flex;
  justify-content: center;
  gap: 16px;
}

.score-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px 20px;
  border-radius: 8px;
  background: #f9fafb;
  min-width: 80px;
}

.score-label {
  font-size: 12px;
  color: #6b7280;
  margin-bottom: 4px;
}

.score-value {
  font-size: 24px;
  font-weight: 700;
}

.score-x .score-value {
  color: #3b82f6;
}

.score-o .score-value {
  color: #ef4444;
}

.score-draw .score-value {
  color: #6b7280;
}

@media (max-width: 768px) {
  .score-board {
    gap: 8px;
  }

  .score-item {
    padding: 10px 16px;
    min-width: 70px;
  }

  .score-value {
    font-size: 20px;
  }
}
</style>
