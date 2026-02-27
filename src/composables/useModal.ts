import { useModalStore } from '@/stores/modal'
import type { ModalOptions } from '@/types/modal'

/**
 * 全局弹窗调用方法
 */
export function useModal() {
  const modalStore = useModalStore()

  /**
   * 信息弹窗
   */
  function info(content: string, title?: string): void {
    modalStore.show({
      type: 'info',
      content,
      title: title || '提示'
    })
  }

  /**
   * 成功弹窗
   */
  function success(content: string, title?: string): void {
    modalStore.show({
      type: 'success',
      content,
      title: title || '成功'
    })
  }

  /**
   * 警告弹窗
   */
  function warning(content: string, title?: string): void {
    modalStore.show({
      type: 'warning',
      content,
      title: title || '警告'
    })
  }

  /**
   * 错误弹窗
   */
  function error(content: string, title?: string): void {
    modalStore.show({
      type: 'error',
      content,
      title: title || '错误'
    })
  }

  /**
   * 确认弹窗
   */
  function confirm(
    content: string,
    onConfirm?: () => void | Promise<void>,
    title?: string
  ): void {
    modalStore.show({
      type: 'confirm',
      content,
      title: title || '确认',
      showCancelButton: true,
      onConfirm
    })
  }

  /**
   * 自定义弹窗
   */
  function custom(options: ModalOptions): void {
    modalStore.show(options)
  }

  /**
   * 关闭弹窗
   */
  function close(): void {
    modalStore.hide()
  }

  return {
    info,
    success,
    warning,
    error,
    confirm,
    custom,
    close
  }
}
