import type { GamesConfig, GameTypeConfig, SortOptionConfig } from '@/types/games'

/**
 * 游戏模块全局配置
 * 用于控制模块显示、功能开关等
 */
export const gamesConfig: GamesConfig = {
  mainTitle: '摸鱼小站 | 我的博客小游戏',
  subTitle: '轻量休闲 · 无需安装 · 随时摸鱼',
  showBackButton: true,
  showSort: true,
  showFilter: true,
  defaultSort: 'newest',
  enabledTypes: ['casual', 'puzzle', 'action', 'strategy']
}

/**
 * 游戏类型配置
 * 用于筛选栏的显示和翻译
 */
export const gameTypeConfigs: GameTypeConfig[] = [
  { value: 'all', label: '全部' },
  { value: 'casual', label: '休闲类' },
  { value: 'puzzle', label: '益智类' },
  { value: 'action', label: '动作类' },
  { value: 'strategy', label: '策略类' }
]

/**
 * 排序选项配置
 */
export const sortOptionConfigs: SortOptionConfig[] = [
  { value: 'newest', label: '最新添加', description: '按游戏添加时间排序' },
  { value: 'popular', label: '热门优先', description: '按游戏点击量排序' }
]
