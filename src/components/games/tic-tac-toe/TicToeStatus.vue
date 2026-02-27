<script setup lang="ts">
import type { GameStatus, Player } from './types'

interface Props {
  status: GameStatus
  currentPlayer: Player
  winner: Player | null
  isDraw: boolean
}

const props = defineProps<Props>()

function getStatusText(): string {
  if (props.status === 'ready') {
    return '点击"开始游戏"开始对局'
  }

  if (props.status === 'finished') {
    if (props.winner) {
      return `🎉 玩家 ${props.winner} 获胜！`
    }
    if (props.isDraw) {
      return '🤝 平局！'
    }
  }

  return `轮到玩家 ${props.currentPlayer} 下棋`
}

function getStatusClass(): string {
  if (props.status === 'finished') {
    return props.winner ? 'status-win' : 'status-draw'
  }
  return 'status-playing'
}
</script>

<template>
  <div class="tic-tac-toe-status">
    <div class="status-box" :class="getStatusClass()">
      <span class="status-text">{{ getStatusText() }}</span>
    </div>
  </div>
</template>

<style scoped>
.tic-tac-toe-status {
  margin-bottom: 24px;
}

.status-box {
  text-align: center;
  padding: 16px 24px;
  border-radius: 8px;
  font-size: 18px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.status-playing {
  background: #f3f4f6;
  color: #374151;
}

.status-win {
  background: #fef3c7;
  color: #92400e;
  animation: statusPop 0.5s ease-out;
}

.status-draw {
  background: #e5e7eb;
  color: #4b5563;
}

.status-text {
  display: block;
}

@keyframes statusPop {
  0% {
    transform: scale(0.8);
    opacity: 0;
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

@media (max-width: 768px) {
  .status-box {
    font-size: 16px;
    padding: 12px 20px;
  }
}
</style>
