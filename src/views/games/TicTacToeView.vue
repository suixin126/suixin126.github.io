<script setup lang="ts">
import { useRouter } from 'vue-router'
import TicToeStatus from '@/components/games/tic-tac-toe/TicToeStatus.vue'
import TicTacToeBoard from '@/components/games/tic-tac-toe/TicTacToeBoard.vue'
import TicToeScore from '@/components/games/tic-tac-toe/TicToeScore.vue'
import TicTacToeControls from '@/components/games/tic-tac-toe/TicTacToeControls.vue'
import { useTicTacToe } from '@/composables/useTicTacToe'

const router = useRouter()
const {
  board,
  currentPlayer,
  winner,
  isDraw,
  gameStatus,
  gameMode,
  scores,
  winningLine,
  makeMove,
  resetGame,
  resetScores,
  changeMode,
  startGame
} = useTicTacToe()

function goBack() {
  router.push('/games')
}
</script>

<template>
  <div class="tic-tac-toe-view">
    <!-- 顶部导航 -->
    <header class="game-header">
      <button class="back-btn" @click="goBack">
        ← 返回游戏列表
      </button>
      <h1 class="game-title">井字棋</h1>
    </header>

    <!-- 状态提示 -->
    <TicToeStatus
      :status="gameStatus"
      :current-player="currentPlayer"
      :winner="winner"
      :is-draw="isDraw"
    />

    <!-- 棋盘 -->
    <TicTacToeBoard
      :board="board"
      :winning-line="winningLine"
      @make-move="makeMove"
    />

    <!-- 计分板 -->
    <TicToeScore :scores="scores" />

    <!-- 控制面板 -->
    <TicTacToeControls
      :game-mode="gameMode"
      :game-status="gameStatus"
      @change-mode="changeMode"
      @start-game="startGame"
      @reset-game="resetGame"
      @reset-scores="resetScores"
    />
  </div>
</template>

<style scoped>
.tic-tac-toe-view {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

.game-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
}

.back-btn {
  padding: 8px 16px;
  background: #667eea;
  color: #fff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;
}

.back-btn:hover {
  background: #5568d3;
  transform: translateX(-2px);
}

.game-title {
  font-size: 24px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0;
}

/* 响应式 */
@media (max-width: 768px) {
  .tic-tac-toe-view {
    padding: 15px;
  }

  .game-header {
    flex-direction: column;
    gap: 12px;
  }

  .game-title {
    font-size: 20px;
  }

  .back-btn {
    width: 100%;
  }
}
</style>
