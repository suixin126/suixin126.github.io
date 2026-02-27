import { ref, watch, onMounted } from 'vue'
import type { Player, CellValue, GameMode, GameStatus, GameScores } from '@/components/games/tic-tac-toe/types'

const STORAGE_KEY_SCORES = 'tictactoe_scores'
const STORAGE_KEY_MODE = 'tictactoe_mode'

/**
 * 井字棋游戏逻辑 Composable
 */
export function useTicTacToe() {
  // ========== 临时状态（不持久化） ==========
  const board = ref<CellValue[]>(Array(9).fill(null))
  const currentPlayer = ref<Player>('X')
  const winner = ref<Player | null>(null)
  const isDraw = ref<boolean>(false)
  const gameStatus = ref<GameStatus>('ready')
  const gameMode = ref<GameMode>('pvp')
  const winningLine = ref<number[] | null>(null)
  const moveCount = ref<number>(0)

  // ========== 持久化状态 ==========
  const scores = ref<GameScores>({ X: 0, O: 0, draws: 0 })

  // ========== 常量 ==========
  const WINNING_COMBINATIONS = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // 横向
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // 纵向
    [0, 4, 8], [2, 4, 6]             // 斜向
  ]

  // ========== 核心逻辑 ==========

  /**
   * 检查获胜方
   */
  function checkWinner(): Player | null {
    for (const combination of WINNING_COMBINATIONS) {
      const [a, b, c] = combination
      // 检查三个位置是否都有相同的棋子
      const cellA = board.value[a as number]!
      const cellB = board.value[b as number]!
      const cellC = board.value[c as number]!
      if (
        cellA &&
        cellA === cellB &&
        cellA === cellC
      ) {
        winningLine.value = combination
        return cellA
      }
    }
    return null
  }

  /**
   * 检查是否平局
   */
  function checkDraw(): boolean {
    return board.value.every(cell => cell !== null) && !winner.value
  }

  /**
   * 玩家下棋
   */
  function makeMove(index: number): void {
    // 验证索引合法性
    if (index < 0 || index >= 9) return

    // 验证格子是否为空
    if (board.value[index] !== null) return

    // 验证游戏状态
    if (winner.value || gameStatus.value !== 'playing') {
      return
    }

    // 更新棋盘
    board.value[index] = currentPlayer.value
    moveCount.value++

    // 检查胜负
    const win = checkWinner()
    if (win) {
      winner.value = win
      gameStatus.value = 'finished'
      scores.value[win]++
      return
    }

    // 检查平局
    if (checkDraw()) {
      isDraw.value = true
      gameStatus.value = 'finished'
      scores.value.draws++
      return
    }

    // 切换玩家
    currentPlayer.value = currentPlayer.value === 'X' ? 'O' : 'X'

    // AI回合（PVE模式）
    if (gameMode.value.startsWith('pve') && currentPlayer.value === 'O') {
      aiMove()
    }
  }

  /**
   * AI下棋（简单模式：随机选择空位）
   */
  function aiMove(): void {
    // 获取所有空位
    const emptyIndices: number[] = []
    board.value.forEach((cell, idx) => {
      if (cell === null) {
        emptyIndices.push(idx)
      }
    })

    if (emptyIndices.length === 0) return

    // 随机选择一个空位
    const randomIndex = emptyIndices[
      Math.floor(Math.random() * emptyIndices.length)
    ]!

    // 延迟执行，模拟思考时间
    setTimeout(() => {
      makeMove(randomIndex)
    }, 300)
  }

  /**
   * 重置游戏
   */
  function resetGame(): void {
    board.value = Array(9).fill(null)
    currentPlayer.value = 'X'
    winner.value = null
    isDraw.value = false
    gameStatus.value = 'ready'
    winningLine.value = null
    moveCount.value = 0
  }

  /**
   * 开始游戏
   */
  function startGame(): void {
    resetGame()
    gameStatus.value = 'playing'
  }

  /**
   * 重置比分
   */
  function resetScores(): void {
    scores.value = { X: 0, O: 0, draws: 0 }
  }

  /**
   * 切换游戏模式
   */
  function changeMode(mode: GameMode): void {
    gameMode.value = mode
    resetGame()
  }

  // ========== 持久化逻辑 ==========

  /**
   * 加载比分
   */
  function loadScores(): void {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SCORES)
      if (saved) {
        scores.value = JSON.parse(saved)
      }
    } catch (error) {
      console.error('加载井字棋比分失败:', error)
    }
  }

  /**
   * 保存比分
   */
  function saveScores(): void {
    try {
      localStorage.setItem(STORAGE_KEY_SCORES, JSON.stringify(scores.value))
    } catch (error) {
      console.error('保存井字棋比分失败:', error)
    }
  }

  /**
   * 加载游戏模式
   */
  function loadMode(): void {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_MODE)
      if (saved && isValidMode(saved)) {
        gameMode.value = saved as GameMode
      }
    } catch (error) {
      console.error('加载井字棋模式失败:', error)
    }
  }

  /**
   * 验证模式是否有效
   */
  function isValidMode(mode: string): mode is GameMode {
    return ['pvp', 'pve-easy', 'pve-medium', 'pve-hard'].includes(mode)
  }

  // ========== 生命周期 ==========

  // 组件挂载时加载数据
  onMounted(() => {
    loadScores()
    loadMode()
  })

  // 监听比分变化，自动保存
  watch(
    scores,
    () => {
      saveScores()
    },
    { deep: true }
  )

  // 监听模式变化，自动保存
  watch(
    gameMode,
    (newMode) => {
      localStorage.setItem(STORAGE_KEY_MODE, newMode)
    }
  )

  // ========== 返回 ==========
  return {
    // 状态
    board,
    currentPlayer,
    winner,
    isDraw,
    gameStatus,
    gameMode,
    scores,
    winningLine,
    moveCount,

    // 方法
    makeMove,
    resetGame,
    resetScores,
    changeMode,
    startGame
  }
}
