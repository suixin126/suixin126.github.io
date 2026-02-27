import type { Game } from '@/types/games'

/**
 * 游戏数据配置
 * 新增游戏时在此添加对应配置
 *
 * 封面图建议：
 * - 尺寸：PC端 280x160px，移动端 320x180px
 * - 格式：WebP > JPG > PNG
 * - 大小：< 100KB
 * 
  casual: '休闲',
  puzzle: '益智',
  action: '动作',
  strategy: '策略'
 */
export const gamesData: Game[] = [
  {
    id: 'tic-tac-toe',  // 改为井字棋的英文标识，更符合语义
    name: '井字棋',
    description: '经典井字棋，双人对战或人机对战，率先在3x3格子中连成一线（横、竖、斜）的一方获胜！',
    cover: '/images/games/tic-tac-toe-cover.png',  // 适配井字棋的封面图路径
    type: 'puzzle',  // 井字棋仍属于益智类，保留
    difficulty: 'easy',  // 井字棋难度为简单，保留
    route: '/games/tic-tac-toe',  // 改为井字棋的路由路径
    addedAt: '2026-02-10T00:00:00.000Z'  // 日期格式保持不变，仅保留原格式
  },
  {
    id: 'snake',
    name: '贪吃蛇',
    description: '经典贪吃蛇，键盘控制方向，吃到食物变长加分。小心不要撞到墙壁或自己的身体！',
    cover: '/images/games/snake-cover.jpg',
    type: 'casual',
    difficulty: 'easy',
    route: '/games/snake',
    addedAt: '2024-01-15T00:00:00.000Z'
  },
  {
    id: 'tetris',
    name: '俄罗斯方块',
    description: '消除方块的经典游戏，通过旋转和移动方块填满一行即可消除。挑战无限模式！',
    cover: '/images/games/tetris-cover.jpg',
    type: 'puzzle',
    difficulty: 'medium',
    route: '/games/tetris',
    addedAt: '2024-01-20T00:00:00.000Z'
  },
  {
    id: '2048',
    name: '2048',
    description: '滑动合并数字方块，目标是合成2048。每一步都需要策略，小心别让格子填满！',
    cover: '/images/games/2048-cover.jpg',
    type: 'puzzle',
    difficulty: 'medium',
    route: '/games/2048',
    addedAt: '2024-02-01T00:00:00.000Z'
  },
  {
    id: 'minesweeper',
    name: '扫雷',
    description: '经典扫雷游戏，通过数字判断周围地雷数量，标记所有地雷即可获胜。',
    cover: '/images/games/minesweeper-cover.jpg',
    type: 'puzzle',
    difficulty: 'medium',
    route: '/games/minesweeper',
    addedAt: '2024-02-10T00:00:00.000Z'
  },
  {
    id: 'breakout',
    name: '打砖块',
    description: '控制挡板反弹小球，消除所有砖块。收集道具可以获得特殊能力！',
    cover: '/images/games/breakout-cover.jpg',
    type: 'action',
    difficulty: 'easy',
    route: '/games/breakout',
    addedAt: '2024-02-15T00:00:00.000Z'
  },
  {
    id: 'pacman',
    name: '吃豆人',
    description: '控制吃豆人吃掉所有豆子，躲避幽灵的追击。吃到能量豆可以反击幽灵！',
    cover: '/images/games/pacman-cover.jpg',
    type: 'action',
    difficulty: 'medium',
    route: '/games/pacman',
    addedAt: '2024-02-20T00:00:00.000Z'
  }
]

/**
 * 获取默认游戏封面（当封面加载失败时使用）
 */
export function getDefaultGameCover(type: Game['type']): string {
  const defaultCovers: Record<Game['type'], string> = {
    casual: '/images/games/default-casual.svg',
    puzzle: '/images/games/default-puzzle.svg',
    action: '/images/games/default-action.svg',
    strategy: '/images/games/default-strategy.svg'
  }
  return defaultCovers[type] || '/images/games/default-game.svg'
}
