const r=`---\r
title: "井字棋游戏实现方案（Vue3 + TypeScript）"\r
date: "2026-02-10"\r
category: "前端开发"\r
tags:\r
  - "Vue3"\r
  - "TypeScript"\r
  - "游戏开发"\r
  - "AI算法"\r
  - "Minimax"\r
  - "响应式开发"\r
description: "基于 Vue3 + TypeScript 开发完整井字棋游戏，包含双人对战、三种难度AI（Minimax算法）、计分系统等核心功能实现方案"\r
author: "SuiXin"\r
readTime: "20 min"\r
---\r
\r
# 井字棋游戏实现方案文档\r
\r
## 一、设计概述\r
\r
### 1.1 设计目标\r
\r
开发一款完整、精致、有趣的井字棋游戏，满足「双人对战」「人机对战（三种难度）」两大核心需求，同时兼顾视觉美观、交互流畅、AI智能，打造可玩性强、体验优秀的轻量级网页游戏。\r
\r
### 1.2 适用场景\r
\r
个人博客游戏模块，适配PC端与移动端，支持访客快速开始游戏、挑战不同难度AI，无需安装，主打「休闲摸鱼」「脑力锻炼」场景，可作为博客游戏模块的首个示范游戏。\r
\r
### 1.3 核心原则\r
\r
- **完整性**：覆盖游戏全流程（开始→对战→结算→重开），无功能缺失；\r
- **智能性**：AI算法分层设计（随机→策略→Minimax），满足不同水平玩家；\r
- **美观性**：视觉设计精致，动画流畅，与博客整体风格统一；\r
- **易用性**：操作路径短（点击即下棋），状态反馈清晰，新手无门槛；\r
- **可扩展**：代码结构清晰，预留扩展接口（历史记录、音效、主题）。\r
\r
## 二、功能模块设计\r
\r
### 2.1 游戏模式\r
\r
| 模式 | 说明 | 实现要点 |\r
|------|------|----------|\r
| **双人对战** | 本地两人轮流下棋 | 简单的玩家切换逻辑，无需AI |\r
| **人机-简单** | AI随机下棋 | 随机选择空位，适合新手 |\r
| **人机-中等** | AI有基本策略 | 优先占领中心+阻断玩家+简单进攻 |\r
| **人机-困难** | AI使用Minimax算法 | 无法战胜，最优策略，适合挑战 |\r
\r
### 2.2 核心功能清单\r
\r
#### 必须实现（MVP）\r
- [x] 3x3 棋盘渲染与交互\r
- [x] 双人对战模式（本地）\r
- [x] 胜负判断逻辑（8种获胜组合）\r
- [x] 平局检测\r
- [x] 游戏重置\r
- [x] 计分板（记录X胜/O胜/平局）\r
\r
#### 应该实现\r
- [x] 三种难度AI（简单/中等/困难）\r
- [x] Minimax算法实现\r
- [x] 模式切换（单选按钮组）\r
- [x] 落子动画（缩放+淡入）\r
- [x] 获胜连线展示（高亮显示）\r
- [x] 当前玩家提示\r
\r
#### 可以实现（扩展功能）\r
- [ ] 游戏历史记录（存储最近10局）\r
- [ ] 撤销/重做功能\r
- [ ] 音效反馈（落子、获胜、失败）\r
- [ ] 深色模式切换\r
- [ ] 自定义棋子样式（图标替换X/O）\r
\r
## 三、技术架构设计\r
\r
### 3.1 文件结构\r
\r
\`\`\`\r
src/\r
├── views/games/\r
│   └── TicTacToeView.vue              # 井字棋游戏页面（主视图）\r
├── components/games/tic-tac-toe/      # 井字棋组件目录\r
│   ├── TicTacToeBoard.vue             # 棋盘组件（核心）\r
│   ├── TicTacToeCell.vue              # 格子组件\r
│   ├── TicTacToeControls.vue          # 控制面板（模式选择、重置）\r
│   ├── TicTacToeScore.vue             # 计分板\r
│   ├── TicTacToeStatus.vue            # 状态提示（当前玩家/胜负）\r
│   └── types.ts                       # 井字棋类型定义\r
├── composables/\r
│   └── useTicTacToe.ts                # 井字棋游戏逻辑（可复用）\r
├── utils/games/\r
│   └── minimax.ts                     # Minimax算法工具\r
└── router/index.ts                    # 添加路由配置\r
\`\`\`\r
\r
### 3.2 技术栈\r
\r
- **框架**: Vue 3 Composition API（\`<script setup>\`）\r
- **语言**: TypeScript（严格类型定义）\r
- **构建**: Vite（快速开发、热更新）\r
- **路由**: Vue Router（页面跳转）\r
- **状态管理**: Pinia（可选，用于全局游戏统计）\r
- **样式**: Scoped CSS（与博客统一风格）\r
\r
### 3.3 核心数据结构\r
\r
#### 游戏状态（GameState）\r
\`\`\`typescript\r
interface TicTacToeState {\r
  board: CellValue[]              // 9个格子的状态 ['X','O',null,...]\r
  currentPlayer: Player           // 当前玩家 'X' | 'O'\r
  winner: Player | null           // 获胜者\r
  isDraw: boolean                 // 是否平局\r
  gameStatus: GameStatus          // 游戏状态 'ready' | 'playing' | 'finished'\r
  gameMode: GameMode              // 游戏模式\r
  scores: GameScores              // 计分\r
  winningLine: number[] | null    // 获胜连线 [0,1,2]\r
  moveCount: number               // 步数（用于判断平局）\r
}\r
\r
type Player = 'X' | 'O'\r
type CellValue = Player | null\r
type GameMode = 'pvp' | 'pve-easy' | 'pve-medium' | 'pve-hard'\r
type GameStatus = 'ready' | 'playing' | 'finished'\r
\r
interface GameScores {\r
  X: number     // X玩家获胜次数\r
  O: number     // O玩家获胜次数\r
  draws: number // 平局次数\r
}\r
\`\`\`\r
\r
## 四、核心逻辑实现\r
\r
### 4.1 游戏主逻辑（useTicTacToe.ts）\r
\r
#### 核心函数设计\r
\r
| 函数名 | 功能 | 参数 | 返回值 |\r
|--------|------|------|--------|\r
| \`makeMove(index)\` | 玩家下棋 | 格子索引(0-8) | void |\r
| \`checkWinner()\` | 检查胜负 | 无 | Player \\| null |\r
| \`checkDraw()\` | 检查平局 | 无 | boolean |\r
| \`resetGame()\` | 重置游戏 | 无 | void |\r
| \`aiMove()\` | AI下棋 | 无 | Promise\\<number\\> |\r
| \`resetScores()\` | 重置比分 | 无 | void |\r
| \`changeMode(mode)\` | 切换模式 | GameMode | void |\r
\r
#### 状态管理\r
\`\`\`typescript\r
import { ref, computed } from 'vue'\r
\r
export function useTicTacToe() {\r
  // 状态定义\r
  const board = ref<CellValue[]>(Array(9).fill(null))\r
  const currentPlayer = ref<Player>('X')\r
  const winner = ref<Player | null>(null)\r
  const isDraw = ref<boolean>(false)\r
  const gameStatus = ref<GameStatus>('ready')\r
  const gameMode = ref<GameMode>('pvp')\r
  const scores = ref<GameScores>({ X: 0, O: 0, draws: 0 })\r
  const winningLine = ref<number[] | null>(null)\r
  const moveCount = ref<number>(0)\r
\r
  // 获胜组合（8种）\r
  const WINNING_COMBINATIONS = [\r
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // 横向\r
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // 纵向\r
    [0, 4, 8], [2, 4, 6]             // 斜向\r
  ]\r
\r
  // 检查获胜\r
  function checkWinner(): Player | null {\r
    for (const combination of WINNING_COMBINATIONS) {\r
      const [a, b, c] = combination\r
      if (\r
        board.value[a] &&\r
        board.value[a] === board.value[b] &&\r
        board.value[a] === board.value[c]\r
      ) {\r
        winningLine.value = combination\r
        return board.value[a]\r
      }\r
    }\r
    return null\r
  }\r
\r
  // 检查平局\r
  function checkDraw(): boolean {\r
    return board.value.every(cell => cell !== null) && !winner.value\r
  }\r
\r
  // 下棋\r
  function makeMove(index: number): void {\r
    // 验证合法性\r
    if (\r
      board.value[index] !== null ||\r
      winner.value ||\r
      gameStatus.value !== 'playing'\r
    ) {\r
      return\r
    }\r
\r
    // 更新棋盘\r
    board.value[index] = currentPlayer.value\r
    moveCount.value++\r
\r
    // 检查胜负\r
    const win = checkWinner()\r
    if (win) {\r
      winner.value = win\r
      gameStatus.value = 'finished'\r
      scores.value[win]++\r
      return\r
    }\r
\r
    // 检查平局\r
    if (checkDraw()) {\r
      isDraw.value = true\r
      gameStatus.value = 'finished'\r
      scores.value.draws++\r
      return\r
    }\r
\r
    // 切换玩家\r
    currentPlayer.value = currentPlayer.value === 'X' ? 'O' : 'X'\r
\r
    // AI回合（PVE模式）\r
    if (gameMode.value.startsWith('pve') && currentPlayer.value === 'O') {\r
      aiMove()\r
    }\r
  }\r
\r
  // AI下棋\r
  async function aiMove(): Promise<void> {\r
    // 简单AI：随机\r
    if (gameMode.value === 'pve-easy') {\r
      const emptyIndices = board.value\r
        .map((cell, idx) => cell === null ? idx : null)\r
        .filter(idx => idx !== null) as number[]\r
\r
      const randomIndex = emptyIndices[\r
        Math.floor(Math.random() * emptyIndices.length)\r
      ]\r
      makeMove(randomIndex)\r
    }\r
\r
    // 中等AI：策略\r
    else if (gameMode.value === 'pve-medium') {\r
      const move = getBestMove('medium')\r
      if (move !== null) makeMove(move)\r
    }\r
\r
    // 困难AI：Minimax\r
    else if (gameMode.value === 'pve-hard') {\r
      const move = getBestMove('hard')\r
      if (move !== null) makeMove(move)\r
    }\r
  }\r
\r
  // 重置游戏\r
  function resetGame(): void {\r
    board.value = Array(9).fill(null)\r
    currentPlayer.value = 'X'\r
    winner.value = null\r
    isDraw.value = false\r
    gameStatus.value = 'ready'\r
    winningLine.value = null\r
    moveCount.value = 0\r
  }\r
\r
  // 重置比分\r
  function resetScores(): void {\r
    scores.value = { X: 0, O: 0, draws: 0 }\r
  }\r
\r
  // 切换模式\r
  function changeMode(mode: GameMode): void {\r
    gameMode.value = mode\r
    resetGame()\r
    resetScores()\r
  }\r
\r
  // 开始游戏\r
  function startGame(): void {\r
    resetGame()\r
    gameStatus.value = 'playing'\r
  }\r
\r
  return {\r
    // 状态\r
    board,\r
    currentPlayer,\r
    winner,\r
    isDraw,\r
    gameStatus,\r
    gameMode,\r
    scores,\r
    winningLine,\r
    moveCount,\r
\r
    // 方法\r
    makeMove,\r
    resetGame,\r
    resetScores,\r
    changeMode,\r
    startGame\r
  }\r
}\r
\`\`\`\r
\r
### 4.2 Minimax算法实现\r
\r
#### 算法原理\r
Minimax是一种递归算法，用于在零和博弈中寻找最优策略。核心思想：\r
- **最大化玩家（AI）**：选择得分最高的步骤\r
- **最小化玩家（人类）**：选择得分最低的步骤（对AI最不利）\r
- **评分规则**：AI胜 +10分，人类胜 -10分，平局 0分\r
\r
#### 代码实现\r
\`\`\`typescript\r
// utils/games/minimax.ts\r
\r
type Player = 'X' | 'O'\r
type CellValue = Player | null\r
type Board = CellValue[]\r
\r
const WINNING_COMBINATIONS = [\r
  [0, 1, 2], [3, 4, 5], [6, 7, 8],\r
  [0, 3, 6], [1, 4, 7], [2, 5, 8],\r
  [0, 4, 8], [2, 4, 6]\r
]\r
\r
/**\r
 * Minimax算法\r
 * @param board 当前棋盘状态\r
 * @param depth 搜索深度\r
 * @param isMaximizing 是否为最大化玩家（AI，O）\r
 * @returns 当前局面的评分\r
 */\r
export function minimax(\r
  board: Board,\r
  depth: number,\r
  isMaximizing: boolean\r
): number {\r
  // 检查游戏结束\r
  const winner = checkWinner(board)\r
  if (winner === 'O') return 10 - depth  // AI胜，优先快速获胜\r
  if (winner === 'X') return depth - 10  // 人类胜，优先延迟失败\r
  if (isBoardFull(board)) return 0       // 平局\r
\r
  if (isMaximizing) {\r
    // AI回合：最大化得分\r
    let bestScore = -Infinity\r
    for (let i = 0; i < 9; i++) {\r
      if (board[i] === null) {\r
        board[i] = 'O'\r
        const score = minimax(board, depth + 1, false)\r
        board[i] = null\r
        bestScore = Math.max(score, bestScore)\r
      }\r
    }\r
    return bestScore\r
  } else {\r
    // 人类回合：最小化得分\r
    let bestScore = Infinity\r
    for (let i = 0; i < 9; i++) {\r
      if (board[i] === null) {\r
        board[i] = 'X'\r
        const score = minimax(board, depth + 1, true)\r
        board[i] = null\r
        bestScore = Math.min(score, bestScore)\r
      }\r
    }\r
    return bestScore\r
  }\r
}\r
\r
/**\r
 * 获取最佳下棋位置（困难模式）\r
 */\r
export function getBestMoveHard(board: Board): number {\r
  let bestScore = -Infinity\r
  let bestMove = -1\r
\r
  for (let i = 0; i < 9; i++) {\r
    if (board[i] === null) {\r
      board[i] = 'O'\r
      const score = minimax(board.slice(), 0, false)\r
      board[i] = null\r
\r
      if (score > bestScore) {\r
        bestScore = score\r
        bestMove = i\r
      }\r
    }\r
  }\r
\r
  return bestMove\r
}\r
\r
/**\r
 * 获取最佳下棋位置（中等模式）\r
 * 策略：优先中心→阻断玩家→随机\r
 */\r
export function getBestMoveMedium(board: Board): number {\r
  // 优先占领中心\r
  if (board[4] === null) return 4\r
\r
  // 阻断玩家获胜\r
  for (const combination of WINNING_COMBINATIONS) {\r
    const [a, b, c] = combination\r
    const values = [board[a], board[b], board[c]]\r
    const xCount = values.filter(v => v === 'X').length\r
    const nullCount = values.filter(v => v === null).length\r
\r
    if (xCount === 2 && nullCount === 1) {\r
      // 找到空位\r
      if (board[a] === null) return a\r
      if (board[b] === null) return b\r
      if (board[c] === null) return c\r
    }\r
  }\r
\r
  // 随机选择空位\r
  const emptyIndices = board\r
    .map((cell, idx) => cell === null ? idx : null)\r
    .filter(idx => idx !== null) as number[]\r
\r
  return emptyIndices[Math.floor(Math.random() * emptyIndices.length)]\r
}\r
\r
// 辅助函数\r
function checkWinner(board: Board): Player | null {\r
  for (const combination of WINNING_COMBINATIONS) {\r
    const [a, b, c] = combination\r
    if (\r
      board[a] &&\r
      board[a] === board[b] &&\r
      board[a] === board[c]\r
    ) {\r
      return board[a]\r
    }\r
  }\r
  return null\r
}\r
\r
function isBoardFull(board: Board): boolean {\r
  return board.every(cell => cell !== null)\r
}\r
\`\`\`\r
\r
## 五、组件设计\r
\r
### 5.1 TicTacToeView.vue（游戏页面）\r
\r
**功能**：整合所有子组件，管理页面布局\r
\r
**布局结构**：\r
\`\`\`\r
┌─────────────────────────────────────┐\r
│  返回按钮    标题：井字棋             │\r
├─────────────────────────────────────┤\r
│                                     │\r
│  ┌─────────────────────────────┐   │\r
│  │   TicTacToeStatus           │   │\r
│  │   (状态提示)                 │   │\r
│  └─────────────────────────────┘   │\r
│                                     │\r
│  ┌─────────────────────────────┐   │\r
│  │                             │   │\r
│  │      TicTacToeBoard         │   │\r
│  │      (棋盘)                 │   │\r
│  │                             │   │\r
│  └─────────────────────────────┘   │\r
│                                     │\r
│  ┌─────────────────────────────┐   │\r
│  │   TicTacToeScore            │   │\r
│  │   (比分板)                  │   │\r
│  └─────────────────────────────┘   │\r
│                                     │\r
│  ┌─────────────────────────────┐   │\r
│  │   TicTacToeControls         │   │\r
│  │   (模式选择 + 重置)         │   │\r
│  └─────────────────────────────┘   │\r
└─────────────────────────────────────┘\r
\`\`\`\r
\r
**核心代码**：\r
\`\`\`vue\r
<template>\r
  <div class="tic-tac-toe-view">\r
    <!-- 顶部导航 -->\r
    <header class="game-header">\r
      <button class="back-btn" @click="goBack">\r
        ← 返回游戏列表\r
      </button>\r
      <h1 class="game-title">井字棋</h1>\r
    </header>\r
\r
    <!-- 状态提示 -->\r
    <TicTacToeStatus\r
      :status="gameStatus"\r
      :current-player="currentPlayer"\r
      :winner="winner"\r
      :is-draw="isDraw"\r
    />\r
\r
    <!-- 棋盘 -->\r
    <TicTacToeBoard\r
      :board="board"\r
      :winning-line="winningLine"\r
      @make-move="makeMove"\r
    />\r
\r
    <!-- 计分板 -->\r
    <TicTacToeScore :scores="scores" />\r
\r
    <!-- 控制面板 -->\r
    <TicTacToeControls\r
      :game-mode="gameMode"\r
      :game-status="gameStatus"\r
      @change-mode="changeMode"\r
      @start-game="startGame"\r
      @reset-game="resetGame"\r
      @reset-scores="resetScores"\r
    />\r
  </div>\r
</template>\r
\r
<script setup lang="ts">\r
import { useRouter } from 'vue-router'\r
import TicTacToeStatus from '@/components/games/tic-tac-toe/TicTacToeStatus.vue'\r
import TicTacToeBoard from '@/components/games/tic-tac-toe/TicTacToeBoard.vue'\r
import TicTacToeScore from '@/components/games/tic-tac-toe/TicTacToeScore.vue'\r
import TicTacToeControls from '@/components/games/tic-tac-toe/TicTacToeControls.vue'\r
import { useTicTacToe } from '@/composables/useTicTacToe'\r
\r
const router = useRouter()\r
const {\r
  board,\r
  currentPlayer,\r
  winner,\r
  isDraw,\r
  gameStatus,\r
  gameMode,\r
  scores,\r
  winningLine,\r
  makeMove,\r
  resetGame,\r
  resetScores,\r
  changeMode,\r
  startGame\r
} = useTicTacToe()\r
\r
function goBack() {\r
  router.push('/games')\r
}\r
<\/script>\r
\r
<style scoped>\r
.tic-tac-toe-view {\r
  max-width: 600px;\r
  margin: 0 auto;\r
  padding: 20px;\r
}\r
\r
.game-header {\r
  display: flex;\r
  align-items: center;\r
  gap: 16px;\r
  margin-bottom: 24px;\r
}\r
\r
.back-btn {\r
  padding: 8px 16px;\r
  background: #667eea;\r
  color: #fff;\r
  border: none;\r
  border-radius: 6px;\r
  cursor: pointer;\r
  font-size: 14px;\r
}\r
\r
.game-title {\r
  font-size: 24px;\r
  font-weight: 700;\r
  color: #1a1a1a;\r
  margin: 0;\r
}\r
\r
/* 响应式 */\r
@media (max-width: 768px) {\r
  .tic-tac-toe-view {\r
    padding: 15px;\r
  }\r
\r
  .game-title {\r
    font-size: 20px;\r
  }\r
}\r
</style>\r
\`\`\`\r
\r
### 5.2 TicTacToeBoard.vue（棋盘组件）\r
\r
**功能**：渲染3x3棋盘，处理点击事件，显示获胜连线\r
\r
**核心代码**：\r
\`\`\`vue\r
<template>\r
  <div class="tic-tac-toe-board">\r
    <div\r
      v-for="(cell, index) in board"\r
      :key="index"\r
      class="board-cell"\r
      :class="{\r
        'winning': winningLine?.includes(index),\r
        'cell-x': cell === 'X',\r
        'cell-o': cell === 'O'\r
      }"\r
      @click="handleCellClick(index)"\r
    >\r
      <span v-if="cell" class="cell-mark">{{ cell }}</span>\r
    </div>\r
  </div>\r
</template>\r
\r
<script setup lang="ts">\r
import type { CellValue } from '../types'\r
\r
interface Props {\r
  board: CellValue[]\r
  winningLine: number[] | null\r
}\r
\r
interface Emits {\r
  (e: 'makeMove', index: number): void\r
}\r
\r
defineProps<Props>()\r
const emit = defineEmits<Emits>()\r
\r
function handleCellClick(index: number) {\r
  emit('makeMove', index)\r
}\r
<\/script>\r
\r
<style scoped>\r
.tic-tac-toe-board {\r
  display: grid;\r
  grid-template-columns: repeat(3, 1fr);\r
  gap: 8px;\r
  width: 360px;\r
  height: 360px;\r
  margin: 0 auto 24px;\r
}\r
\r
.board-cell {\r
  background: #f3f4f6;\r
  border-radius: 8px;\r
  display: flex;\r
  align-items: center;\r
  justify-content: center;\r
  cursor: pointer;\r
  transition: all 0.3s ease;\r
  font-size: 48px;\r
  font-weight: 700;\r
  user-select: none;\r
}\r
\r
.board-cell:hover {\r
  background: #e5e7eb;\r
}\r
\r
.board-cell.cell-x {\r
  color: #3b82f6;\r
}\r
\r
.board-cell.cell-o {\r
  color: #ef4444;\r
}\r
\r
.board-cell.winning {\r
  background: #fef3c7;\r
  box-shadow: 0 0 0 3px #f59e0b;\r
}\r
\r
.cell-mark {\r
  animation: placeMark 0.3s ease-out;\r
}\r
\r
@keyframes placeMark {\r
  0% {\r
    transform: scale(0);\r
    opacity: 0;\r
  }\r
  50% {\r
    transform: scale(1.2);\r
  }\r
  100% {\r
    transform: scale(1);\r
    opacity: 1;\r
  }\r
}\r
\r
/* 响应式 */\r
@media (max-width: 768px) {\r
  .tic-tac-toe-board {\r
    width: 280px;\r
    height: 280px;\r
    gap: 6px;\r
  }\r
\r
  .board-cell {\r
    font-size: 36px;\r
  }\r
}\r
</style>\r
\`\`\`\r
\r
### 5.3 TicTacToeControls.vue（控制面板）\r
\r
**功能**：模式选择、游戏控制\r
\r
**核心代码**：\r
\`\`\`vue\r
<template>\r
  <div class="tic-tac-toe-controls">\r
    <!-- 模式选择 -->\r
    <div class="mode-selector">\r
      <h3 class="selector-title">游戏模式</h3>\r
      <div class="mode-options">\r
        <label\r
          v-for="mode in modes"\r
          :key="mode.value"\r
          class="mode-option"\r
        >\r
          <input\r
            type="radio"\r
            :value="mode.value"\r
            v-model="selectedMode"\r
            @change="handleModeChange(mode.value)"\r
            :disabled="gameStatus === 'playing'"\r
          />\r
          <span class="mode-label">{{ mode.label }}</span>\r
        </label>\r
      </div>\r
    </div>\r
\r
    <!-- 操作按钮 -->\r
    <div class="action-buttons">\r
      <button\r
        v-if="gameStatus === 'ready'"\r
        class="btn btn-primary"\r
        @click="handleStartGame"\r
      >\r
        开始游戏\r
      </button>\r
      <button\r
        v-if="gameStatus === 'playing'"\r
        class="btn btn-secondary"\r
        @click="handleResetGame"\r
      >\r
        重新开始\r
      </button>\r
      <button\r
        v-if="gameStatus === 'finished'"\r
        class="btn btn-primary"\r
        @click="handleResetGame"\r
      >\r
        再来一局\r
      </button>\r
      <button\r
        class="btn btn-ghost"\r
        @click="handleResetScores"\r
      >\r
        重置比分\r
      </button>\r
    </div>\r
  </div>\r
</template>\r
\r
<script setup lang="ts">\r
import { ref } from 'vue'\r
import type { GameMode, GameStatus } from '../types'\r
\r
interface Props {\r
  gameMode: GameMode\r
  gameStatus: GameStatus\r
}\r
\r
interface Emits {\r
  (e: 'changeMode', mode: GameMode): void\r
  (e: 'startGame'): void\r
  (e: 'resetGame'): void\r
  (e: 'resetScores'): void\r
}\r
\r
const props = defineProps<Props>()\r
const emit = defineEmits<Emits>()\r
\r
const selectedMode = ref<GameMode>(props.gameMode)\r
\r
const modes = [\r
  { value: 'pvp' as GameMode, label: '双人对战' },\r
  { value: 'pve-easy' as GameMode, label: '人机（简单）' },\r
  { value: 'pve-medium' as GameMode, label: '人机（中等）' },\r
  { value: 'pve-hard' as GameMode, label: '人机（困难）' }\r
]\r
\r
function handleModeChange(mode: GameMode) {\r
  emit('changeMode', mode)\r
}\r
\r
function handleStartGame() {\r
  emit('startGame')\r
}\r
\r
function handleResetGame() {\r
  emit('resetGame')\r
}\r
\r
function handleResetScores() {\r
  emit('resetScores')\r
}\r
<\/script>\r
\r
<style scoped>\r
.tic-tac-toe-controls {\r
  display: flex;\r
  flex-direction: column;\r
  gap: 20px;\r
}\r
\r
.selector-title {\r
  font-size: 16px;\r
  font-weight: 600;\r
  margin: 0 0 12px 0;\r
  color: #1a1a1a;\r
}\r
\r
.mode-options {\r
  display: flex;\r
  flex-direction: column;\r
  gap: 8px;\r
}\r
\r
.mode-option {\r
  display: flex;\r
  align-items: center;\r
  gap: 8px;\r
  cursor: pointer;\r
}\r
\r
.mode-option input[type="radio"]:disabled {\r
  cursor: not-allowed;\r
}\r
\r
.mode-label {\r
  font-size: 14px;\r
  color: #333;\r
}\r
\r
.action-buttons {\r
  display: flex;\r
  flex-wrap: wrap;\r
  gap: 12px;\r
}\r
\r
.btn {\r
  padding: 10px 20px;\r
  border: none;\r
  border-radius: 6px;\r
  font-size: 14px;\r
  font-weight: 500;\r
  cursor: pointer;\r
  transition: all 0.3s ease;\r
}\r
\r
.btn-primary {\r
  background: #667eea;\r
  color: #fff;\r
}\r
\r
.btn-primary:hover {\r
  background: #5568d3;\r
}\r
\r
.btn-secondary {\r
  background: #6b7280;\r
  color: #fff;\r
}\r
\r
.btn-secondary:hover {\r
  background: #4b5563;\r
}\r
\r
.btn-ghost {\r
  background: transparent;\r
  color: #6b7280;\r
  border: 1px solid #d1d5db;\r
}\r
\r
.btn-ghost:hover {\r
  background: #f3f4f6;\r
}\r
\r
@media (max-width: 768px) {\r
  .action-buttons {\r
    flex-direction: column;\r
  }\r
\r
  .btn {\r
    width: 100%;\r
  }\r
}\r
</style>\r
\`\`\`\r
\r
## 六、路由配置\r
\r
### 6.1 添加路由\r
\r
**位置**：\`src/router/index.ts\`\r
\r
\`\`\`typescript\r
// 导入井字棋视图\r
import TicTacToeView from '@/views/games/TicTacToeView.vue'\r
\r
const routes: RouteRecordRaw[] = [\r
  // ... 现有路由\r
\r
  {\r
    path: '/',\r
    component: MainLayout,\r
    children: [\r
      // ... 现有子路由\r
\r
      {\r
        path: 'games/tic-tac-toe',\r
        name: 'TicTacToe',\r
        component: TicTacToeView,\r
        meta: {\r
          sidebar: 'games',    // 保持游戏侧边栏\r
          transition: 'fade'   // 淡入淡出效果\r
        }\r
      }\r
    ]\r
  }\r
]\r
\`\`\`\r
\r
### 6.2 游戏数据配置更新\r
\r
**位置**：\`src/config/games/games.data.ts\`\r
\r
确保井字棋配置正确：\r
\`\`\`typescript\r
{\r
  id: 'tic-tac-toe',\r
  name: '井字棋',\r
  description: '经典井字棋，双人对战或人机对战，率先在3x3格子中连成一线（横、竖、斜）的一方获胜！',\r
  cover: '/images/games/tic-tac-toe-cover.png',  // 注意前导斜杠\r
  type: 'puzzle',\r
  difficulty: 'easy',\r
  route: '/games/tic-tac-toe',\r
  addedAt: '2026-02-10T00:00:00.000Z'\r
}\r
\`\`\`\r
\r
## 七、样式设计规范\r
\r
### 7.1 配色方案\r
\r
\`\`\`css\r
:root {\r
  /* 主题色 */\r
  --primary-color: #667eea;\r
  --primary-hover: #5568d3;\r
\r
  /* 玩家颜色 */\r
  --player-x-color: #3b82f6;    /* X玩家（蓝色）*/\r
  --player-o-color: #ef4444;    /* O玩家（红色）*/\r
\r
  /* 棋盘颜色 */\r
  --board-bg: #f3f4f6;\r
  --cell-bg: #ffffff;\r
  --border-color: #d1d5db;\r
  --hover-bg: #e5e7eb;\r
\r
  /* 获胜高亮 */\r
  --winning-bg: #fef3c7;\r
  --winning-border: #f59e0b;\r
\r
  /* 文本颜色 */\r
  --text-primary: #1a1a1a;\r
  --text-secondary: #6b7280;\r
  --text-tertiary: #9ca3af;\r
}\r
\`\`\`\r
\r
### 7.2 响应式断点\r
\r
\`\`\`css\r
/* 棋盘尺寸 */\r
.board {\r
  width: 360px;\r
  height: 360px;\r
}\r
\r
@media (max-width: 768px) {\r
  .board {\r
    width: 280px;\r
    height: 280px;\r
  }\r
}\r
\r
@media (min-width: 1024px) {\r
  .board {\r
    width: 400px;\r
    height: 400px;\r
  }\r
}\r
\r
/* 字体大小 */\r
.cell-mark {\r
  font-size: 48px;\r
}\r
\r
@media (max-width: 768px) {\r
  .cell-mark {\r
    font-size: 36px;\r
  }\r
}\r
\`\`\`\r
\r
### 7.3 动画效果\r
\r
\`\`\`css\r
/* 落子动画 */\r
@keyframes placeMark {\r
  0% {\r
    transform: scale(0);\r
    opacity: 0;\r
  }\r
  50% {\r
    transform: scale(1.2);\r
  }\r
  100% {\r
    transform: scale(1);\r
    opacity: 1;\r
  }\r
}\r
\r
/* 获胜连线闪烁 */\r
@keyframes winningPulse {\r
  0%, 100% {\r
    box-shadow: 0 0 0 3px #f59e0b;\r
  }\r
  50% {\r
    box-shadow: 0 0 0 6px #f59e0b;\r
  }\r
}\r
\r
/* 按钮hover效果 */\r
@keyframes buttonHover {\r
  0% {\r
    transform: translateY(0);\r
  }\r
  100% {\r
    transform: translateY(-2px);\r
  }\r
}\r
\`\`\`\r
\r
## 八、性能优化\r
\r
### 8.1 AI性能优化\r
\r
**问题**：Minimax算法在深度较大时性能下降\r
\r
**解决方案**：\r
1. **限制搜索深度**：井字棋最多9步，深度限制在4层足够\r
2. **Alpha-Beta剪枝**：减少不必要的计算分支\r
3. **使用Web Worker**：将AI计算移至后台线程，避免阻塞UI\r
\r
\`\`\`typescript\r
// 优化后的Minimax（带Alpha-Beta剪枝）\r
export function minimaxWithAlphaBeta(\r
  board: Board,\r
  depth: number,\r
  alpha: number,\r
  beta: number,\r
  isMaximizing: boolean\r
): number {\r
  const winner = checkWinner(board)\r
  if (winner === 'O') return 10 - depth\r
  if (winner === 'X') return depth - 10\r
  if (isBoardFull(board)) return 0\r
\r
  if (isMaximizing) {\r
    let maxScore = -Infinity\r
    for (let i = 0; i < 9; i++) {\r
      if (board[i] === null) {\r
        board[i] = 'O'\r
        const score = minimaxWithAlphaBeta(board, depth + 1, alpha, beta, false)\r
        board[i] = null\r
        maxScore = Math.max(score, maxScore)\r
        alpha = Math.max(alpha, score)\r
        if (beta <= alpha) break  // 剪枝\r
      }\r
    }\r
    return maxScore\r
  } else {\r
    let minScore = Infinity\r
    for (let i = 0; i < 9; i++) {\r
      if (board[i] === null) {\r
        board[i] = 'X'\r
        const score = minimaxWithAlphaBeta(board, depth + 1, alpha, beta, true)\r
        board[i] = null\r
        minScore = Math.min(score, minScore)\r
        beta = Math.min(beta, score)\r
        if (beta <= alpha) break  // 剪枝\r
      }\r
    }\r
    return minScore\r
  }\r
}\r
\`\`\`\r
\r
### 8.2 渲染优化\r
\r
- **使用\`v-once\`**：静态内容只渲染一次\r
- **避免不必要的响应式**：纯计算数据用\`Object.freeze()\`\r
- **懒加载**：游戏页面按需加载（路由懒加载已实现）\r
\r
\`\`\`typescript\r
// 路由懒加载\r
{\r
  path: 'games/tic-tac-toe',\r
  name: 'TicTacToe',\r
  component: () => import('@/views/games/TicTacToeView.vue'),\r
  meta: { sidebar: 'games' }\r
}\r
\`\`\`\r
\r
## 九、测试要点\r
\r
### 9.1 功能测试清单\r
\r
- [ ] 双人对战正常切换\r
- [ ] 胜负判断准确（8种组合全部测试）\r
- [ ] 平局检测正确（棋盘满且无获胜者）\r
- [ ] AI三种难度符合预期\r
  - [ ] 简单：随机下棋\r
  - [ ] 中等：有基本策略\r
  - [ ] 困难：难以战胜\r
- [ ] 游戏重置正常\r
- [ ] 比分记录准确\r
- [ ] 模式切换无异常\r
- [ ] 路由跳转无误\r
\r
### 9.2 边界测试\r
\r
- [ ] 棋盘满后不能下棋\r
- [ ] 已占位置不能重复下\r
- [ ] 游戏结束后不能下棋\r
- [ ] AI响应时间合理（< 500ms）\r
- [ ] 快速连续点击无异常\r
\r
### 9.3 性能测试\r
\r
- [ ] Minimax算法耗时 < 100ms\r
- [ ] 页面渲染流畅（60fps）\r
- [ ] 移动端触摸响应及时\r
- [ ] 内存占用正常（无泄漏）\r
\r
### 9.4 兼容性测试\r
\r
- [ ] Chrome最新版\r
- [ ] Edge最新版\r
- [ ] Firefox最新版\r
- [ ] Safari（iOS）\r
- [ ] Chrome（Android）\r
- [ ] 移动端横屏适配\r
\r
## 十、开发步骤建议\r
\r
### 阶段一：基础功能（4-5小时）\r
1. 创建文件结构\r
2. 实现\`useTicTacToe.ts\`核心逻辑（不含AI）\r
3. 开发\`TicTacToeBoard.vue\`棋盘组件\r
4. 实现双人对战模式\r
5. 添加胜负判断逻辑\r
6. 开发\`TicTacToeControls.vue\`控制面板\r
7. 路由集成测试\r
\r
### 阶段二：AI功能（3-4小时）\r
1. 实现简单AI（随机）\r
2. 实现中等AI（策略）\r
3. 实现困难AI（Minimax算法）\r
4. 性能优化（Alpha-Beta剪枝）\r
5. AI响应速度测试\r
\r
### 阶段三：完善体验（2-3小时）\r
1. 添加计分板组件\r
2. 实现状态提示组件\r
3. 优化动画效果\r
4. 响应式适配（移动端）\r
5. 异常处理优化\r
\r
### 阶段四：测试优化（1-2小时）\r
1. 功能测试\r
2. 边界测试\r
3. 性能测试\r
4. 兼容性测试\r
5. Bug修复\r
\r
**总计预估**：10-14小时\r
\r
## 十一、扩展功能建议\r
\r
### 11.1 游戏历史记录\r
- 存储最近10局游戏数据（模式、获胜者、步数、时长）\r
- 展示历史记录列表\r
- 可复盘查看\r
\r
### 11.2 撤销/重做功能\r
- 允许玩家撤销上一步\r
- 使用栈结构存储历史状态\r
- 按钮控制（可配置最大撤销步数）\r
\r
### 11.3 音效系统\r
- 落子音效\r
- 获胜音效\r
- 失败音效\r
- 平局音效\r
- 可开关配置\r
\r
### 11.4 深色模式\r
- 自动适配系统主题\r
- 手动切换开关\r
- 深色配色方案优化\r
\r
### 11.5 自定义样式\r
- 自定义棋子图标（替换X/O）\r
- 自定义棋盘颜色\r
- 自定义背景图\r
\r
## 十二、常见问题解决\r
\r
### 12.1 封面图片无法渲染\r
\r
**问题**：井字棋封面图路径配置错误\r
\r
**解决方案**：\r
1. 确认图片实际位置：\`src/assets/images/games/tic-tac-toe-cover.png\`\r
2. 移动图片到public目录：\`public/images/games/tic-tac-toe-cover.png\`\r
3. 修改配置为绝对路径：\`cover: '/images/games/tic-tac-toe-cover.png'\`（注意前导斜杠）\r
\r
### 12.2 AI响应慢\r
\r
**问题**：Minimax算法计算时间长\r
\r
**解决方案**：\r
1. 使用Alpha-Beta剪枝优化\r
2. 限制搜索深度\r
3. 使用Web Worker异步计算\r
\r
### 12.3 移动端触摸误触\r
\r
**问题**：移动端点击格子响应不灵敏\r
\r
**解决方案**：\r
1. 增加点击区域padding\r
2. 使用\`@touchstart\`替代\`@click\`\r
3. 添加防抖处理\r
\r
## 十三、总结\r
\r
### 方案优势\r
1. **完整性**：覆盖全流程，无功能缺失\r
2. **智能性**：Minimax算法实现真正有挑战的AI\r
3. **可扩展**：代码结构清晰，预留扩展接口\r
4. **用户体验**：动画流畅，响应式设计\r
5. **可维护性**：TypeScript类型安全，组件化开发\r
\r
### 技术亮点\r
- **Minimax算法**：经典博弈论算法实现\r
- **Composition API**：Vue3最佳实践\r
- **TypeScript**：类型安全，减少运行时错误\r
- **响应式设计**：PC端+移动端完美适配\r
- **性能优化**：Alpha-Beta剪枝，Web Worker\r
\r
### 适用场景\r
- 个人博客游戏模块\r
- 前端学习项目\r
- 算法演示\r
- 面试展示项目\r
\r
---\r
\r
**文档版本**：v1.0\r
**最后更新**：2026-02-10\r
**作者**：SuiXin\r
**状态**：待实现\r
`;export{r as default};
