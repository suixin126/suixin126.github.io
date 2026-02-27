<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue'
import { useModalStore } from '@/stores/modal'
import type { ModalType } from '@/types/modal'

const modalStore = useModalStore()

// 当前弹窗配置
const modal = computed(() => modalStore.currentModal)

// 是否可见
const visible = computed(() => modal.value?.visible ?? false)

// 图标映射
const icons: Record<ModalType, string> = {
  info: 'ℹ️',
  success: '✅',
  warning: '⚠️',
  error: '❌',
  confirm: '❓'
}

// 当前图标
const currentIcon = computed(() => {
  if (!modal.value) return ''
  return icons[modal.value.options.type || 'info']
})

// 确认按钮样式
const confirmButtonClass = computed(() => {
  if (!modal.value) return ''
  const type = modal.value.options.type
  return `btn-${type}`
})

// 处理 ESC 键
function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && modal.value?.options.closeOnPressEscape) {
    modalStore.close()
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})

// 点击遮罩
function handleMaskClick() {
  if (modal.value?.options.closeOnClickModal) {
    modalStore.close()
  }
}
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="visible" class="modal-container" @click.self="handleMaskClick">
        <!-- 遮罩层 -->
        <div class="modal-mask"></div>

        <!-- 弹窗主体 -->
        <div
          class="modal-wrapper"
          :class="[`modal-${modal?.options.size || 'medium'}`]"
          @click.stop
        >
          <div class="modal-content">
            <!-- 头部 -->
            <div class="modal-header">
              <div class="modal-title">
                <span v-if="currentIcon" class="modal-icon">{{ currentIcon }}</span>
                <span>{{ modal?.options.title }}</span>
              </div>
              <button
                v-if="modal?.options.showClose"
                class="modal-close"
                @click="modalStore.close()"
              >
                ✕
              </button>
            </div>

            <!-- 内容 -->
            <div class="modal-body">
              <div v-html="modal?.options.content"></div>
            </div>

            <!-- 底部 -->
            <div v-if="modal" class="modal-footer">
              <button
                v-if="modal.options.showCancelButton"
                class="btn btn-cancel"
                @click="modalStore.cancel()"
              >
                {{ modal.options.cancelText }}
              </button>
              <button
                :class="['btn', confirmButtonClass]"
                @click="modalStore.confirm()"
              >
                {{ modal.options.confirmText }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.modal-mask {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
}

.modal-wrapper {
  position: relative;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  max-width: 90vw;
  max-height: 90vh;
  overflow: auto;
}

.modal-small {
  width: 320px;
}

.modal-medium {
  width: 480px;
}

.modal-large {
  width: 640px;
}

.modal-content {
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #e5e7eb;
}

.modal-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 18px;
  font-weight: 600;
  color: #1a1a1a;
}

.modal-icon {
  font-size: 24px;
}

.modal-close {
  background: none;
  border: none;
  font-size: 20px;
  color: #6b7280;
  cursor: pointer;
  padding: 4px;
  line-height: 1;
  transition: color 0.3s;
}

.modal-close:hover {
  color: #1a1a1a;
}

.modal-body {
  padding: 24px;
  font-size: 15px;
  color: #374151;
  line-height: 1.6;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px 24px;
  border-top: 1px solid #e5e7eb;
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-cancel {
  background: #f3f4f6;
  color: #374151;
}

.btn-cancel:hover {
  background: #e5e7eb;
}

.btn-info {
  background: #3b82f6;
  color: #fff;
}

.btn-info:hover {
  background: #2563eb;
}

.btn-success {
  background: #10b981;
  color: #fff;
}

.btn-success:hover {
  background: #059669;
}

.btn-warning {
  background: #f59e0b;
  color: #fff;
}

.btn-warning:hover {
  background: #d97706;
}

.btn-error {
  background: #ef4444;
  color: #fff;
}

.btn-error:hover {
  background: #dc2626;
}

.btn-confirm {
  background: #667eea;
  color: #fff;
}

.btn-confirm:hover {
  background: #5568d3;
}

/* 动画 */
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-active .modal-wrapper,
.modal-leave-active .modal-wrapper {
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-wrapper,
.modal-leave-to .modal-wrapper {
  transform: scale(0.9) translateY(-20px);
}

.modal-enter-to,
.modal-leave-from {
  opacity: 1;
}

.modal-enter-to .modal-wrapper,
.modal-leave-from .modal-wrapper {
  transform: scale(1) translateY(0);
}

/* 响应式 */
@media (max-width: 768px) {
  .modal-container {
    padding: 15px;
  }

  .modal-small,
  .modal-medium,
  .modal-large {
    width: 100%;
    max-width: 400px;
  }

  .modal-header,
  .modal-body,
  .modal-footer {
    padding: 16px;
  }
}
</style>
