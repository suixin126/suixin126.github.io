/**
 * 井字棋游戏类型定义
 */

/** 玩家类型 */
export type Player = 'X' | 'O'

/** 格子值 */
export type CellValue = Player | null

/** 游戏模式 */
export type GameMode = 'pvp' | 'pve-easy' | 'pve-medium' | 'pve-hard'

/** 游戏状态 */
export type GameStatus = 'ready' | 'playing' | 'finished'

/** 游戏分数 */
export interface GameScores {
  X: number
  O: number
  draws: number
}

/** 游戏记录 */
export interface GameRecord {
  gameMode: GameMode
  winner: Player | null
  isDraw: boolean
  moves: number
  timestamp: string
}
