/**
 * 各模块座右铭配置
 * 用于在不同功能区的侧边栏显示对应的座右铭
 */

export interface ModuleMotto {
  /** 模块标识 */
  id: string
  /** 模块名称 */
  name: string
  /** 座右铭/标语 */
  motto: string
  /** 英文座右铭（可选） */
  mottoEn?: string
  /** 图标类型（用于后续扩展） */
  icon?: string
}

/**
 * 模块座右铭映射表
 */
export const MODULE_MOTTOS: Record<string, ModuleMotto> = {
  blog: {
    id: 'blog',
    name: '博客',
    motto: '记录技术，分享生活',
    mottoEn: 'Record technology, share life',
    icon: '📝'
  },
  dairy: {
    id: 'dairy',
    name: '日记',
    motto: '记录点滴，珍藏时光',
    mottoEn: 'Capture moments, cherish memories',
    icon: '📔'
  },
  games: {
    id: 'games',
    name: '游戏',
    motto: '劳逸结合，快乐至上',
    mottoEn: 'Work hard, play hard',
    icon: '🎮'
  },
  music: {
    id: 'music',
    name: '音乐',
    motto: '音乐无界，治愈心灵',
    mottoEn: 'Music heals the soul',
    icon: '🎵'
  }
}

/**
 * 获取指定模块的座右铭
 * @param moduleId 模块ID
 * @returns 模块座右铭配置，如果不存在则返回默认值
 */
export function getModuleMotto(moduleId: string): ModuleMotto {
  return MODULE_MOTTOS[moduleId] || {
    id: 'default',
    name: '未知',
    motto: '探索未知，发现美好',
    mottoEn: 'Explore the unknown',
    icon: '✨'
  }
}

/**
 * 获取所有模块座右铭列表
 * @returns 所有模块座右铭数组
 */
export function getAllModuleMottos(): ModuleMotto[] {
  return Object.values(MODULE_MOTTOS)
}
