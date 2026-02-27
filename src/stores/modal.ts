import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { ModalOptions, ModalInstance } from '@/types/modal'

export const useModalStore = defineStore('modal', () => {
  // 当前显示的弹窗
  const currentModal = ref<ModalInstance | null>(null)

  /**
   * 显示弹窗
   */
  function show(options: ModalOptions): void {
    const id = `modal-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

    currentModal.value = {
      id,
      options: {
        type: 'info',
        size: 'medium',
        showClose: true,
        closeOnClickModal: true,
        closeOnPressEscape: true,
        showCancelButton: false,
        confirmText: '确定',
        cancelText: '取消',
        ...options
      },
      visible: true
    }
  }

  /**
   * 隐藏弹窗
   */
  function hide(): void {
    if (currentModal.value) {
      currentModal.value.visible = false
      // 延迟清空，等待动画完成
      setTimeout(() => {
        currentModal.value = null
      }, 300)
    }
  }

  /**
   * 确认操作
   */
  async function confirm(): Promise<void> {
    if (currentModal.value?.options.onConfirm) {
      await currentModal.value.options.onConfirm()
    }
    hide()
  }

  /**
   * 取消操作
   */
  function cancel(): void {
    if (currentModal.value?.options.onCancel) {
      currentModal.value.options.onCancel()
    }
    hide()
  }

  /**
   * 关闭操作
   */
  function close(): void {
    if (currentModal.value?.options.onClose) {
      currentModal.value.options.onClose()
    }
    hide()
  }

  return {
    currentModal,
    show,
    hide,
    confirm,
    cancel,
    close
  }
})
