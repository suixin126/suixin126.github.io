/**
 * 全局弹窗组件类型定义
 */

/** 弹窗类型 */
export type ModalType = 'info' | 'success' | 'warning' | 'error' | 'confirm'

/** 弹窗尺寸 */
export type ModalSize = 'small' | 'medium' | 'large'

/** 弹窗配置选项 */
export interface ModalOptions {
  /** 弹窗标题 */
  title?: string
  /** 弹窗内容（支持 HTML） */
  content: string
  /** 弹窗类型 */
  type?: ModalType
  /** 弹窗尺寸 */
  size?: ModalSize
  /** 是否显示关闭按钮 */
  showClose?: boolean
  /** 是否点击遮罩关闭 */
  closeOnClickModal?: boolean
  /** 是否按 ESC 关闭 */
  closeOnPressEscape?: boolean
  /** 确认按钮文本 */
  confirmText?: string
  /** 取消按钮文本 */
  cancelText?: string
  /** 是否显示取消按钮 */
  showCancelButton?: boolean
  /** 确认回调 */
  onConfirm?: () => void | Promise<void>
  /** 取消回调 */
  onCancel?: () => void
  /** 关闭回调 */
  onClose?: () => void
}

/** 弹窗实例 */
export interface ModalInstance {
  id: string
  options: ModalOptions
  visible: boolean
}
