<script setup lang="ts">
import { useRouter } from 'vue-router'
import { gamesConfig } from '@/config/games/games.config'

const router = useRouter()

// 返回首页
function goBack() {
  router.push('/')
}
</script>

<template>
  <header class="games-header">
    <div class="header-content">
      <!-- 返回按钮 -->
      <button
        v-if="gamesConfig.showBackButton"
        @click="goBack"
        class="back-btn"
        title="返回首页"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
          <path fill-rule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"/>
        </svg>
      </button>

      <!-- 标题区域 -->
      <div class="header-titles">
        <h1 class="main-title">{{ gamesConfig.mainTitle }}</h1>
        <p class="sub-title">{{ gamesConfig.subTitle }}</p>
      </div>
    </div>
  </header>
</template>

<style scoped>
.games-header {
  margin-bottom: 24px;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 16px;
  text-align: center;
}

.back-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: #f5f5f5;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #555;
  flex-shrink: 0;
}

.back-btn:hover {
  background: #e8e8e8;
  color: #333;
  transform: translateX(-2px);
}

.back-btn:active {
  transform: translateX(-2px) scale(0.95);
}

.header-titles {
  flex: 1;
}

.main-title {
  font-size: 24px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 8px 0;
  line-height: 1.3;
}

.sub-title {
  font-size: 14px;
  color: #999;
  margin: 0;
  line-height: 1.4;
}

/* 响应式适配 */
@media (max-width: 768px) {
  .games-header {
    margin-bottom: 20px;
  }

  .header-content {
    gap: 12px;
  }

  .back-btn {
    width: 36px;
    height: 36px;
  }

  .main-title {
    font-size: 20px;
    margin-bottom: 6px;
  }

  .sub-title {
    font-size: 12px;
  }
}
</style>
