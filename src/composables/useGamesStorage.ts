import { ref } from 'vue'
import type { GameStats } from '@/types/games'

const STORAGE_KEY = 'blog_games_stats'

/**
 * 游戏存储管理
 * 用于管理游戏统计数据（点击量、最高分等）的持久化
 */
export function useGamesStorage() {
  // 内存缓存，避免频繁读取localStorage
  const statsCache = ref<Map<string, GameStats>>(new Map())

  /**
   * 从 localStorage 加载所有游戏统计数据
   */
  function loadStats(): Map<string, GameStats> {
    if (statsCache.value.size > 0) {
      return statsCache.value
    }

    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed: GameStats[] = JSON.parse(stored)
        statsCache.value = new Map(parsed.map(stat => [stat.gameId, stat]))
      }
    } catch (error) {
      console.error('加载游戏统计数据失败:', error)
    }

    return statsCache.value
  }

  /**
   * 获取单个游戏的统计数据
   */
  function getGameStats(gameId: string): GameStats | undefined {
    loadStats()
    return statsCache.value.get(gameId)
  }

  /**
   * 获取游戏点击量
   */
  function getPlayCount(gameId: string): number {
    return getGameStats(gameId)?.playCount || 0
  }

  /**
   * 获取游戏最高分
   */
  function getHighScore(gameId: string): number | undefined {
    return getGameStats(gameId)?.highScore
  }

  /**
   * 增加游戏点击量
   */
  function incrementPlayCount(gameId: string): number {
    loadStats()
    const current = statsCache.value.get(gameId)
    const newCount = (current?.playCount || 0) + 1

    statsCache.value.set(gameId, {
      gameId,
      playCount: newCount,
      highScore: current?.highScore
    })

    saveStats()
    return newCount
  }

  /**
   * 更新游戏最高分
   */
  function updateHighScore(gameId: string, score: number): void {
    loadStats()
    const current = statsCache.value.get(gameId)
    const currentHigh = current?.highScore || 0

    if (score > currentHigh) {
      statsCache.value.set(gameId, {
        gameId,
        playCount: current?.playCount || 0,
        highScore: score
      })
      saveStats()
    }
  }

  /**
   * 保存统计数据到 localStorage
   */
  function saveStats(): void {
    try {
      const statsArray = Array.from(statsCache.value.values())
      localStorage.setItem(STORAGE_KEY, JSON.stringify(statsArray))
    } catch (error) {
      console.error('保存游戏统计数据失败:', error)
    }
  }

  /**
   * 清除所有统计数据
   */
  function clearStats(): void {
    statsCache.value.clear()
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch (error) {
      console.error('清除游戏统计数据失败:', error)
    }
  }

  return {
    loadStats,
    getGameStats,
    getPlayCount,
    getHighScore,
    incrementPlayCount,
    updateHighScore,
    clearStats
  }
}
