import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Game, GameType, SortOption } from '@/types/games'
import { gamesData, getDefaultGameCover } from '@/config/games/games.data'
import { gamesConfig, gameTypeConfigs } from '@/config/games/games.config'
import { useGamesStorage } from '@/composables/useGamesStorage'

export const useGamesStore = defineStore('games', () => {
  // ========== State ==========
  const games = ref<Game[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const selectedType = ref<GameType | 'all'>('all')
  const currentSort = ref<SortOption>(gamesConfig.defaultSort)
  const isLoaded = ref(false)

  // localStorage 管理器
  const { getPlayCount, incrementPlayCount } = useGamesStorage()

  // ========== Getters ==========
  /**
   * 获取筛选和排序后的游戏列表
   */
  const filteredGames = computed<Game[]>(() => {
    let result = [...games.value]

    // 类型筛选
    if (selectedType.value !== 'all') {
      result = result.filter(game => game.type === selectedType.value)
    }

    // 排序
    if (currentSort.value === 'newest') {
      result.sort((a, b) => {
        return new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime()
      })
    } else if (currentSort.value === 'popular') {
      result.sort((a, b) => {
        const countA = getPlayCount(a.id)
        const countB = getPlayCount(b.id)
        return countB - countA
      })
    }

    return result
  })

  /**
   * 获取启用的游戏类型列表（用于筛选栏）
   */
  const availableTypes = computed(() => {
    return gameTypeConfigs.filter(config =>
      config.value === 'all' || gamesConfig.enabledTypes.includes(config.value)
    )
  })

  /**
   * 检查是否有游戏数据
   */
  const hasGames = computed(() => games.value.length > 0)

  /**
   * 获取当前筛选条件下的游戏数量
   */
  const filteredCount = computed(() => filteredGames.value.length)

  // ========== Actions ==========
  /**
   * 加载游戏数据
   */
  async function loadGames() {
    // 如果已经加载过且有数据，直接返回
    if (isLoaded.value && games.value.length > 0) {
      return
    }

    loading.value = true
    error.value = null

    try {
      // 模拟异步加载（实际项目中可能从API获取）
      await new Promise(resolve => setTimeout(resolve, 100))

      // 处理封面图（设置默认图）
      const processedGames = gamesData.map(game => ({
        ...game,
        cover: game.cover || getDefaultGameCover(game.type)
      }))

      games.value = processedGames
      isLoaded.value = true
    } catch (err) {
      error.value = err instanceof Error ? err.message : '加载游戏失败'
      console.error('游戏加载异常：', err)
    } finally {
      loading.value = false
    }
  }

  /**
   * 按类型筛选游戏
   */
  function filterByType(type: GameType | 'all') {
    selectedType.value = type
  }

  /**
   * 设置排序方式
   */
  function setSortOption(sort: SortOption) {
    currentSort.value = sort
  }

  /**
   * 获取游戏详情
   */
  function getGameById(id: string): Game | undefined {
    return games.value.find(game => game.id === id)
  }

  /**
   * 记录游戏点击（用于热门排序）
   */
  function recordGamePlay(gameId: string): void {
    incrementPlayCount(gameId)
  }

  /**
   * 重置筛选条件
   */
  function resetFilters() {
    selectedType.value = 'all'
    currentSort.value = gamesConfig.defaultSort
  }

  // ========== Return ==========
  return {
    // State
    games,
    loading,
    error,
    selectedType,
    currentSort,
    isLoaded,
    // Getters
    filteredGames,
    availableTypes,
    hasGames,
    filteredCount,
    // Actions
    loadGames,
    filterByType,
    setSortOption,
    getGameById,
    recordGamePlay,
    resetFilters
  }
}, {
  // 持久化配置：保存用户的筛选和排序偏好
  persist: {
    key: 'blog_games_store',
    storage: localStorage,
    pick: ['selectedType', 'currentSort']
  }
})
