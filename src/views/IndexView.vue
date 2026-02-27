<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter();
// 配置项
const config = {
  nickname: 'SuiXin', // 昵称，可自定义替换
  typingSpeed: 150, // 打字速度（毫秒/字）
  cursorBlinkSpeed: 500, // 光标闪烁速度（毫秒）
  enterButtonDelay: 500, // 按钮淡入延迟（打字完成后）
}

// 显示的文本
const displayText = ref('')
const showCursor = ref(true)
const showButton = ref(false)
const isTypingComplete = ref(false)

// 完整的欢迎文本
const fullText = `欢迎来到${config.nickname}的博客`

// 打字动画函数
const typeWriter = () => {
  let index = 0
  const text = fullText

  const typeChar = () => {
    if (index < text.length) {
      displayText.value += text.charAt(index)
      index++
      setTimeout(typeChar, config.typingSpeed)
    } else {
      isTypingComplete.value = true
      // 打字完成后停止光标闪烁，并隐藏光标
      stopCursorBlink()
      showCursor.value = false

      // 打字完成后延迟显示按钮
      setTimeout(() => {
        showButton.value = true
      }, config.enterButtonDelay)
    }
  }

  typeChar()
}

// 光标闪烁效果
const blinkInterval = ref<number | null>(null)
const startCursorBlink = () => {
  blinkInterval.value = setInterval(() => {
    showCursor.value = !showCursor.value
  }, config.cursorBlinkSpeed)
}

// 停止光标闪烁
const stopCursorBlink = () => {
  if (blinkInterval.value) {
    clearInterval(blinkInterval.value)
    blinkInterval.value = null
  }
}

// 按钮点击处理
const handleEnter = () => {
  // TODO: 这里可以配置跳转到博客内容页
  router.push('/blog')
  console.log('进入博客')
}

// 组件挂载后启动动画
onMounted(() => {
  // 启动打字动画
  setTimeout(() => {
    typeWriter()
  }, 300) // 页面加载后稍微延迟启动

  // 启动光标闪烁
  startCursorBlink()
})
</script>

<template>
  <div class="index-container">
    <!-- 背景层 -->
    <div class="background-layer"></div>

    <!-- 核心内容层 -->
    <div class="content-layer">
      <!-- 欢迎文案 -->
      <h1 class="welcome-text">
        {{ displayText }}<span class="cursor" :class="{ visible: showCursor }">|</span>
      </h1>

      <!-- 立即进入按钮 -->
      <button v-if="showButton" class="enter-button" @click="handleEnter">
        立即进入
      </button>
    </div>
  </div>
</template>

<style scoped>
/* 容器样式 */
.index-container {
  position: relative;
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  font-family: 'Inter', '思源黑体', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* 背景层样式 */
.background-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;

  /* 使用一张简约清新的风景图作为壁纸 */
  background-image: url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80');
  background-size: cover;
  background-position: center center;
  background-attachment: fixed;
  background-repeat: no-repeat;

  /* 添加半透明遮罩，提升文案可读性 */
  background-color: #1a1a2e;
}

.background-layer::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.3);
  z-index: 1;
}

/* 核心内容层 */
.content-layer {
  position: relative;
  z-index: 2;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 30px;
}

/* 欢迎文案样式 */
.welcome-text {
  font-size: 3rem;
  font-weight: 600;
  color: #ffffff;
  margin: 0;
  padding: 0 20px;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.4), 0 4px 16px rgba(0, 0, 0, 0.2);
  letter-spacing: 0.05em;
  line-height: 1.4;
  max-width: 100%;
}

/* 光标样式 */
.cursor {
  display: inline-block;
  width: 3px;
  height: 1em;
  background-color: #ffffff;
  margin-left: 4px;
  vertical-align: middle;
  opacity: 0;
  transition: opacity 0.2s ease-in-out;
  box-shadow: 0 0 8px rgba(255, 255, 255, 0.5);
}

.cursor.visible {
  opacity: 1;
}

/* 立即进入按钮样式 */
.enter-button {
  padding: 14px 40px;
  font-size: 1.1rem;
  font-weight: 600;
  color: #ffffff;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 50px;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
  transition: all 0.3s ease-in-out;
  animation: fadeInUp 0.8s ease-out;
  letter-spacing: 0.5px;
}

.enter-button:hover {
  transform: translateY(-2px) scale(1.05);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
  background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
}

.enter-button:active {
  transform: translateY(0) scale(0.95);
  box-shadow: 0 2px 10px rgba(102, 126, 234, 0.3);
}

/* 按钮淡入动画 */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 响应式适配 - 平板 */
@media (max-width: 1024px) {
  .welcome-text {
    font-size: 2.5rem;
  }

  .enter-button {
    padding: 12px 32px;
    font-size: 1rem;
  }
}

/* 响应式适配 - 手机 */
@media (max-width: 768px) {
  .welcome-text {
    font-size: 1.8rem;
    padding: 0 15px;
  }

  .enter-button {
    padding: 10px 28px;
    font-size: 0.95rem;
  }

  .content-layer {
    gap: 24px;
  }
}

/* 响应式适配 - 小屏手机 */
@media (max-width: 480px) {
  .welcome-text {
    font-size: 1.5rem;
  }

  .enter-button {
    padding: 10px 24px;
    font-size: 0.9rem;
  }
}
</style>
