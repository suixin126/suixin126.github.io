/**
 * 心情枚举类型
 */
export type MoodType =
  | 'happy'      // 开心 😊
  | 'sad'        // 难过 😢
  | 'excited'    // 兴奋 🤩
  | 'calm'       // 平静 😌
  | 'tired'      // 疲惫 😫
  | 'angry'      // 生气 😠
  | 'anxious'    // 焦虑 😰
  | 'grateful'   // 感恩 🙏

/**
 * 天气枚举类型
 */
export type WeatherType =
  | 'sunny'      // 晴天 ☀️
  | 'cloudy'     // 多云 ☁️
  | 'rainy'      // 下雨 🌧️
  | 'snowy'      // 下雪 ❄️
  | 'windy'      // 刮风 💨
  | 'foggy'      // 雾天 🌫️

/**
 * 日记元数据接口
 */
export interface DairyMeta {
  /** 日记标题 */
  title: string
  /** 日记日期（格式：YYYY-MM-DD） */
  date: string
  /** 心情标签 */
  mood: MoodType
  /** 天气标签 */
  weather?: WeatherType
  /** 日记关联的标签列表 */
  tags: string[]
  /** 日记摘要（可选） */
  summary?: string
}

/**
 * 完整日记条目接口
 */
export interface DairyEntry {
  /** 日记唯一标识ID */
  id: string
  /** 日记文件路径 */
  path: string
  /** 日记元数据 */
  meta: DairyMeta
  /** 日记正文内容（Markdown格式） */
  content: string
}


/**
 * 日期分组接口（用于时间轴展示）
 */
export interface DateGroup {
  /** 年份 */
  year: number
  /** 月份 */
  month: number
  /** 该月份的日记列表 */
  entries: DairyEntry[]
}

/**
 * 心情统计接口
 */
export interface MoodStat {
  /** 心情类型 */
  mood: MoodType
  /** 该心情的日记数量 */
  count: number
  /** 占比（0-100） */
  percentage: number
}