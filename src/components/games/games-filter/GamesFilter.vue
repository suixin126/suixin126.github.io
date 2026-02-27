<script setup lang="ts">
import type { GameType, SortOption } from '@/types/games'
import { useGamesStore } from '@/stores/games'
import { storeToRefs } from 'pinia'

const gamesStore = useGamesStore()
const { selectedType, currentSort, availableTypes, filteredCount } = storeToRefs(gamesStore)

const emit = defineEmits<{
  typeChange: [type: GameType | 'all']
  sortChange: [sort: SortOption]
}>()

// 选择类型
function selectType(type: GameType | 'all') {
  gamesStore.filterByType(type)
  emit('typeChange', type)
}

// 选择排序
function selectSort(sort: SortOption) {
  gamesStore.setSortOption(sort)
  emit('sortChange', sort)
}
</script>

<template>
  <div class="games-filter">
    <!-- 类型筛选 -->
    <div class="filter-section">
      <div class="filter-buttons">
        <button
          v-for="type in availableTypes"
          :key="type.value"
          @click="selectType(type.value)"
          :class="['filter-btn', { active: selectedType === type.value }]"
        >
          {{ type.label }}
        </button>
      </div>
    </div>

    <!-- 排序选项 -->
    <div class="sort-section">
      <button
        @click="selectSort('newest')"
        :class="['sort-btn', { active: currentSort === 'newest' }]"
      >
        <svg class="sort-icon" xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
          <path d="M8 3.5a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-1 0V4a.5.5 0 0 1 .5-.5z"/>
          <path d="M7.5 10.5a.5.5 0 0 1 .707 0l3 3a.5.5 0 0 1-.707.707L8 11.707 5.5 14.207a.5.5 0 0 1-.707-.707l3-3z"/>
        </svg>
        最新
      </button>
      <button
        @click="selectSort('popular')"
        :class="['sort-btn', { active: currentSort === 'popular' }]"
      >
        <svg class="sort-icon" xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
          <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z"/>
        </svg>
        热门
      </button>
    </div>

    <!-- 结果计数 -->
    <div class="filter-count">
      共 {{ filteredCount }} 个游戏
    </div>
  </div>
</template>

<style scoped>
.games-filter {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 16px;
}

.filter-section {
  flex: 1;
  min-width: 0;
}

.filter-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.filter-btn {
  display: inline-flex;
  align-items: center;
  padding: 8px 16px;
  background: #f5f5f5;
  color: #555;
  border: 1px solid #e0e0e0;
  border-radius: 20px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.filter-btn:hover {
  background: #e8e8e8;
  border-color: #d0d0d0;
}

.filter-btn.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  border-color: transparent;
}

.sort-section {
  display: flex;
  gap: 8px;
}

.sort-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 8px 14px;
  background: #f5f5f5;
  color: #555;
  border: 1px solid #e0e0e0;
  border-radius: 20px;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.sort-btn:hover {
  background: #e8e8e8;
  border-color: #d0d0d0;
}

.sort-btn.active {
  background: #667eea;
  color: #fff;
  border-color: transparent;
}

.sort-icon {
  flex-shrink: 0;
}

.filter-count {
  font-size: 0.85rem;
  color: #999;
  padding: 8px 0;
}

/* 响应式适配 */
@media (max-width: 768px) {
  .games-filter {
    padding: 16px;
    gap: 12px;
  }

  .filter-section {
    width: 100%;
  }

  .sort-section {
    width: 100%;
    justify-content: center;
  }

  .filter-buttons,
  .sort-btn {
    gap: 6px;
  }

  .filter-btn {
    padding: 6px 12px;
    font-size: 0.85rem;
  }

  .sort-btn {
    padding: 6px 12px;
    font-size: 0.8rem;
  }

  .filter-count {
    width: 100%;
    text-align: center;
    font-size: 0.8rem;
  }
}
</style>
