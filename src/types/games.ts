/**
 * 游戏模块类型定义
 * 用于游戏主界面的数据结构、筛选排序等功能
 */

/** 游戏难度等级 */
export type GameDifficulty = 'easy' | 'medium' | 'hard'

/** 游戏类型 */
export type GameType = 'casual' | 'puzzle' | 'action' | 'strategy'

/** 排序方式 */
export type SortOption = 'newest' | 'popular'

/** 游戏基础信息 */
export interface Game {
  /** 唯一标识 */
  id: string
  /** 游戏名称 */
  name: string
  /** 游戏简介（最多2行） */
  description: string
  /** 封面图URL */
  cover: string
  /** 游戏类型 */
  type: GameType
  /** 难度 */
  difficulty: GameDifficulty
  /** 路由路径（如 /games/snake） */
  route: string
  /** 添加时间（用于排序，ISO 8601格式） */
  addedAt: string
}

/** 游戏统计数据（localStorage存储） */
export interface GameStats {
  /** 游戏ID */
  gameId: string
  /** 点击量（热门排序依据） */
  playCount: number
  /** 最高分（可选） */
  highScore?: number
}

/** 游戏类型显示配置 */
export interface GameTypeConfig {
  /** 类型值 */
  value: GameType | 'all'
  /** 显示名称 */
  label: string
  /** 图标（可选） */
  icon?: string
}

/** 排序选项配置 */
export interface SortOptionConfig {
  /** 选项值 */
  value: SortOption
  /** 显示名称 */
  label: string
  /** 描述 */
  description: string
}

/** 游戏模块配置 */
export interface GamesConfig {
  /** 主标题 */
  mainTitle: string
  /** 副标题 */
  subTitle: string
  /** 是否显示返回按钮 */
  showBackButton: boolean
  /** 是否显示排序功能 */
  showSort: boolean
  /** 是否显示筛选功能 */
  showFilter: boolean
  /** 默认排序方式 */
  defaultSort: SortOption
  /** 启用的游戏类型 */
  enabledTypes: GameType[]
}
