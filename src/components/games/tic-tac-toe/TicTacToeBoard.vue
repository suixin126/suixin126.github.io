<script setup lang="ts">
import type { CellValue } from './types'

interface Props {
  board: CellValue[]
  winningLine: number[] | null
}

interface Emits {
  (e: 'makeMove', index: number): void
}

defineProps<Props>()
const emit = defineEmits<Emits>()

function handleCellClick(index: number) {
  emit('makeMove', index)
}
</script>

<template>
  <div class="tic-tac-toe-board">
    <div
      v-for="(cell, index) in board"
      :key="index"
      class="board-cell"
      :class="{
        'winning': winningLine?.includes(index),
        'cell-x': cell === 'X',
        'cell-o': cell === 'O',
        'occupied': cell !== null
      }"
      @click="handleCellClick(index)"
    >
      <span v-if="cell" class="cell-mark">{{ cell }}</span>
    </div>
  </div>
</template>

<style scoped>
.tic-tac-toe-board {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  width: 360px;
  height: 360px;
  margin: 0 auto 24px;
  padding: 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.board-cell {
  background: #ffffff;
  border: 2px solid #e0e7ff;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 48px;
  font-weight: 700;
  user-select: none;
  position: relative;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.board-cell:hover:not(.occupied) {
  background: #f8fafc;
  border-color: #667eea;
  transform: scale(1.02);
  box-shadow: 0 4px 8px rgba(102, 126, 234, 0.2);
}

.board-cell.cell-x {
  color: #3b82f6;
  text-shadow: 0 2px 4px rgba(59, 130, 246, 0.3);
}

.board-cell.cell-o {
  color: #ef4444;
  text-shadow: 0 2px 4px rgba(239, 68, 68, 0.3);
}

.board-cell.winning {
  background: #fef3c7;
  border-color: #f59e0b;
  box-shadow: 0 0 0 3px #f59e0b, 0 4px 8px rgba(245, 158, 11, 0.4);
  animation: winningPulse 1s ease-in-out infinite;
}

.cell-mark {
  animation: placeMark 0.3s ease-out;
}

@keyframes placeMark {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes winningPulse {
  0%, 100% {
    box-shadow: 0 0 0 3px #f59e0b, 0 4px 8px rgba(245, 158, 11, 0.4);
  }
  50% {
    box-shadow: 0 0 0 6px #f59e0b, 0 6px 12px rgba(245, 158, 11, 0.5);
  }
}

/* 响应式 */
@media (max-width: 768px) {
  .tic-tac-toe-board {
    width: 280px;
    height: 280px;
    gap: 6px;
    padding: 12px;
  }

  .board-cell {
    font-size: 36px;
    border-width: 1.5px;
  }
}

@media (min-width: 1024px) {
  .tic-tac-toe-board {
    width: 400px;
    height: 400px;
    gap: 10px;
    padding: 20px;
  }

  .board-cell {
    font-size: 56px;
    border-width: 2.5px;
  }
}
</style>
