// Toast
import { showToast } from 'vant'
import { showConfirmDialog } from 'vant'

// 轻提示
export function Toast(options) {
  /**
   * @message 提示信息
   * @type 提示类型，可选值为 loading success fail html
   * @duration 显示时长
   * @forbidClick 背景穿透
   * @callback 倒计时结束回调函数
   */

  showToast({
    message: options.message ?? options,
    type: options.type ?? 'text',
    duration: options.duration ?? 1500,
    forbidClick: options.forbidClick ?? true,
    onClose: options.callback ?? null
  })
}

// 对话框
export function Dialog({
  title = '提示',
  message,
  showCancel,
  confirm,
  cancel,
  showCancelButton = true,
  showConfirmButton = true
}) {
  /**
   * @title 对话框标题
   * @message 对话框内容
   * @showCancel 取消按钮默认显示
   * @confirm 确定按钮回调函数
   * @showCancelButton 取消按钮是否显示
   * @showConfirmButton 确定按钮是否显示
   * @cancel 取消按钮回调函数
   */
  showConfirmDialog({
    title,
    message,
    showCancelButton,
    showConfirmButton,
    showCancel: showCancel ?? true
  })
    .then(() => {
      confirm && typeof confirm === 'function' && confirm()
    })
    .catch(() => {
      cancel && typeof cancel === 'function' && cancel()
    })
}

// 判断是否为NaN
export function isNaN(val) {
  if (val !== val) {
    return true
  }
  return false
}

// 移动端px=>vw
export const px2vw = (px) => {
  if (/%/gi.test(px)) {
    return px
  } else {
    return `${(parseFloat(px) / 375) * 100}vw`
  }
}
