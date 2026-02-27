<script setup lang="ts">
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useGamesStore } from '@/stores/games'
import { getModuleMotto } from '@/config/mottos'
import type { GameType } from '@/types/games'
import { computed } from 'vue'
// 获取游戏数据
const gamesStore = useGamesStore()
const { games } = storeToRefs(gamesStore)

// 获取游戏模块座右铭
const motto = getModuleMotto('games')

// 游戏类型配置
const typeLabels: Record<GameType, string> = {
  casual: '休闲类',
  puzzle: '益智类',
  action: '动作类',
  strategy: '策略类'
}

// 计算各类型游戏数量
const typeCounts = computed(() => {
  const counts: Record<GameType, number> = {
    casual: 0,
    puzzle: 0,
    action: 0,
    strategy: 0
  }

  games.value.forEach(game => {
    counts[game.type]++
  })

  return counts
})

// 加载数据
onMounted(() => {
  gamesStore.loadGames()
})
</script>

<template>
  <aside class="games-sidebar">
    <!-- 个人信息卡片 -->
    <div class="sidebar-widget profile-card">
      <div class="avatar">
        <img src="https://api.dicebear.com/7.x/lorelei/svg?seed=SuiXin&backgroundColor=ffdf00" alt="avatar" />
      </div>
      <h3 class="nickname">SuiXin</h3>
      <p class="bio">{{ motto.motto }}</p>
      <p class="bio-en" v-if="motto.mottoEn">{{ motto.mottoEn }}</p>
    </div>

    <!-- 游戏类型小部件 -->
    <div class="sidebar-widget type-widget">
      <h3 class="widget-title">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
          <path
            d="M8 0a.5.5 0 0 1 .5.5v1.5h1a.5.5 0 0 1 0 1h-1v1.5a.5.5 0 0 1-1 0V3h-1a.5.5 0 0 1 0-1h1V.5A.5.5 0 0 1 8 0z" />
          <path
            d="M4 2a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V2zm2-1a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H6z" />
        </svg>
        游戏类型
      </h3>
      <ul class="type-list">
        <li v-for="(label, type) in typeLabels" :key="type">
          <a href="#" class="type-link">
            <span class="type-name">{{ label }}</span>
            <span class="type-count">{{ typeCounts[type as GameType] }}</span>
          </a>
        </li>
      </ul>
    </div>

    <!-- 游戏说明小部件 -->
    <div class="sidebar-widget info-widget">
      <h3 class="widget-title">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
          <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
          <path
            d="M5.255 5.786a.237.237 0 0 0 .241.247h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286zm1.557 5.763c0 .533.425.927 1.01.927.609 0 1.028-.394 1.028-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94z" />
        </svg>
        玩法说明
      </h3>
      <div class="info-content">
        <p>点击游戏卡片上的「开始游戏」按钮即可进入游戏。</p>
        <p>所有游戏均为前端轻量版本，无需安装，刷新页面可重置游戏进度。</p>
        <p class="tip">💡 电脑端推荐使用键盘操作，移动端支持触屏操作。</p>
      </div>
    </div>
  </aside>
</template>

<style scoped>
.games-sidebar {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.sidebar-widget {
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: box-shadow 0.3s ease;
}

.sidebar-widget:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
}

.widget-title {
  font-size: 1.1rem;
  font-weight: 700;
  margin: 0 0 16px 0;
  padding-bottom: 12px;
  border-bottom: 2px solid #f0f0f0;
  display: flex;
  align-items: center;
  gap: 8px;
  color: #1a1a1a;
}

.widget-title svg {
  flex-shrink: 0;
  color: #667eea;
}

/* 个人信息卡片 */
.profile-card {
  text-align: center;
  padding: 32px 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
}

.avatar {
  width: 100px;
  height: 100px;
  margin: 0 auto 20px;
  border-radius: 50%;
  overflow: hidden;
  border: 4px solid rgba(255, 255, 255, 0.3);
  background: #fff;
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.nickname {
  font-size: 1.4rem;
  font-weight: 700;
  margin: 0 0 8px 0;
  color: #fff;
}

.bio {
  font-size: 0.95rem;
  margin: 0;
  color: rgba(255, 255, 255, 0.9);
}

.bio-en {
  font-size: 0.85rem;
  margin: 4px 0 0 0;
  color: rgba(255, 255, 255, 0.8);
  font-style: italic;
  font-weight: 300;
}

/* 游戏类型列表 */
.type-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.type-list li {
  border-bottom: 1px solid #f0f0f0;
}

.type-list li:last-child {
  border-bottom: none;
}

.type-link {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  color: #333;
  text-decoration: none;
  transition: all 0.3s ease;
}

.type-link:hover {
  color: #667eea;
  transform: translateX(4px);
}

.type-name {
  font-size: 0.95rem;
  font-weight: 500;
}

.type-count {
  background: #f0f0f0;
  color: #666;
  font-size: 0.85rem;
  padding: 2px 8px;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.type-link:hover .type-count {
  background: #667eea;
  color: #fff;
}

/* 游戏说明 */
.info-content {
  font-size: 0.9rem;
  line-height: 1.6;
  color: #555;
}

.info-content p {
  margin: 0 0 12px 0;
}

.info-content p:last-child {
  margin-bottom: 0;
}

.tip {
  background: #f0f7ff;
  border-left: 3px solid #667eea;
  padding: 10px 12px;
  border-radius: 4px;
  font-size: 0.85rem;
  color: #667eea;
  margin: 12px 0 0 0 !important;
}

/* 响应式适配 */
@media (max-width: 768px) {
  .games-sidebar {
    width: 100%;
  }

  .sidebar-widget {
    padding: 20px;
  }

  .profile-card {
    padding: 24px 20px;
  }
}
</style>
