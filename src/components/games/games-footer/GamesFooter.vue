<script setup lang="ts">
</script>

<template>
  <footer class="games-footer">
    <div class="footer-content">
      <p class="footer-tip">
        所有游戏均为前端轻量版本，无需安装，刷新页面可重置游戏进度
      </p>
      <div class="footer-links">
        <a href="#feedback" class="footer-link">游戏反馈</a>
        <span class="separator">·</span>
        <a href="#changelog" class="footer-link">更新日志</a>
      </div>
      <p class="footer-note">摸鱼放松专用，请勿沉迷哦 😄</p>
    </div>
  </footer>
</template>

<style scoped>
.games-footer {
  margin-top: 40px;
  padding: 24px 0;
  border-top: 1px solid #e8e8e8;
}

.footer-content {
  text-align: center;
}

.footer-tip {
  font-size: 12px;
  color: #999;
  margin: 0 0 12px 0;
  line-height: 1.6;
}

.footer-links {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-bottom: 12px;
}

.footer-link {
  font-size: 12px;
  color: #667eea;
  text-decoration: none;
  transition: color 0.3s ease;
}

.footer-link:hover {
  color: #5568d3;
  text-decoration: underline;
}

.separator {
  color: #ddd;
  font-size: 12px;
}

.footer-note {
  font-size: 12px;
  color: #bbb;
  margin: 0;
}

/* 响应式适配 */
@media (max-width: 768px) {
  .games-footer {
    margin-top: 30px;
    padding: 20px 15px;
  }

  .footer-links {
    flex-direction: column;
    gap: 6px;
  }

  .separator {
    display: none;
  }

  .footer-tip,
  .footer-link,
  .footer-note {
    font-size: 11px;
  }
}
</style>
