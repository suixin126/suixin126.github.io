<script setup lang="ts">
import { ref, watch } from 'vue'
import type { GameMode, GameStatus } from './types'
import { useModal } from '@/composables/useModal'

interface Props {
  gameMode: GameMode
  gameStatus: GameStatus
}

interface Emits {
  (e: 'changeMode', mode: GameMode): void
  (e: 'startGame'): void
  (e: 'resetGame'): void
  (e: 'resetScores'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()
const { confirm: confirmModal } = useModal()

// 本地状态用于绑定 radio input
const selectedMode = ref<GameMode>(props.gameMode)

// 监听外部 gameMode 变化，同步到本地状态
watch(() => props.gameMode, (newMode) => {
  selectedMode.value = newMode
})

const modes = [
  { value: 'pvp' as GameMode, label: '双人对战' },
  { value: 'pve-easy' as GameMode, label: '人机（简单）' },
  { value: 'pve-medium' as GameMode, label: '人机（中等）' },
  { value: 'pve-hard' as GameMode, label: '人机（困难）' }
]

function handleModeChange(mode: GameMode) {
  emit('changeMode', mode)
}

function handleStartGame() {
  emit('startGame')
}

function handleResetGame() {
  emit('resetGame')
}

function handleResetScores() {
  confirmModal(
    '确定要重置比分吗？此操作将清空所有对战记录。',
    () => {
      emit('resetScores')
    },
    '重置比分'
  )
}
</script>

<template>
  <div class="tic-tac-toe-controls">
    <!-- 模式选择 -->
    <div class="mode-selector">
      <h3 class="selector-title">游戏模式</h3>
      <div class="mode-options">
        <label
          v-for="mode in modes"
          :key="mode.value"
          class="mode-option"
        >
          <input
            type="radio"
            name="game-mode"
            :value="mode.value"
            v-model="selectedMode"
            @change="handleModeChange(mode.value)"
            :disabled="gameStatus === 'playing'"
          />
          <span class="mode-label">{{ mode.label }}</span>
        </label>
      </div>
    </div>

    <!-- 操作按钮 -->
    <div class="action-buttons">
      <button
        v-if="gameStatus === 'ready'"
        class="btn btn-primary"
        @click="handleStartGame"
      >
        开始游戏
      </button>
      <button
        v-if="gameStatus === 'playing'"
        class="btn btn-secondary"
        @click="handleResetGame"
      >
        重新开始
      </button>
      <button
        v-if="gameStatus === 'finished'"
        class="btn btn-primary"
        @click="handleResetGame"
      >
        再来一局
      </button>
      <button
        class="btn btn-ghost"
        @click="handleResetScores"
      >
        重置比分
      </button>
    </div>
  </div>
</template>

<style scoped>
.tic-tac-toe-controls {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.selector-title {
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 12px 0;
  color: #1a1a1a;
}

.mode-options {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.mode-option {
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
}

.mode-option input[type="radio"] {
  cursor: pointer;
}

.mode-option input[type="radio"]:disabled {
  cursor: not-allowed;
}

.mode-label {
  font-size: 14px;
  color: #333;
}

.action-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary {
  background: #667eea;
  color: #fff;
}

.btn-primary:hover {
  background: #5568d3;
  transform: translateY(-1px);
}

.btn-secondary {
  background: #6b7280;
  color: #fff;
}

.btn-secondary:hover {
  background: #4b5563;
  transform: translateY(-1px);
}

.btn-ghost {
  background: transparent;
  color: #6b7280;
  border: 1px solid #d1d5db;
}

.btn-ghost:hover {
  background: #f3f4f6;
  color: #374151;
}

@media (max-width: 768px) {
  .action-buttons {
    flex-direction: column;
  }

  .btn {
    width: 100%;
  }
}
</style>
