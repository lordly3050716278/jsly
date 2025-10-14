/**
 * 尝试使用 Clipboard API 复制文本（现代浏览器推荐）
 *
 * @param {string} text - 需要复制的文本内容
 * @returns {Promise<void>} 若复制成功则 resolve，否则 reject
 *
 * @throws {Error} 若浏览器不支持 Clipboard API 或权限被拒绝
 */
export async function copyByClipboardAPI(text) {
    if (typeof navigator === 'undefined' || !navigator.clipboard) {
        throw new Error('Clipboard API is not supported in this environment.')
    }

    try {
        await navigator.clipboard.writeText(text)
    } catch (error) {
        if (error.name === 'NotAllowedError') {
            throw new Error('Permission denied: please allow clipboard access in browser settings.')
        }
        throw new Error(`Clipboard API failed: ${error.message}`)
    }
}

/**
 * 通过 textarea + execCommand 实现复制（兼容旧浏览器或不支持 Clipboard API 的环境）
 *
 * @param {string} text - 需要复制的文本内容
 * @returns {Promise<void>} 若复制成功则 resolve，否则 reject
 *
 * @note
 * - 此方法已被废弃，但在部分旧版浏览器中仍是唯一可行方式；
 * - 可能无法在部分 iOS Safari 环境下使用；
 * - 使用完毕后会清理临时 DOM 元素。
 */
export async function copyByExecCommand(text) {
    if (typeof document === 'undefined') {
        throw new Error('document.execCommand is not supported in this environment.')
    }

    return new Promise((resolve, reject) => {
        try {
            const textarea = document.createElement('textarea')
            textarea.value = text
            textarea.style.position = 'fixed' // 防止页面滚动
            textarea.style.opacity = '0'
            textarea.style.left = '-9999px'
            textarea.style.top = '-9999px'

            document.body.appendChild(textarea)

            // iOS 兼容：必须手动选中范围
            textarea.focus()
            textarea.select()

            const success = document.execCommand('copy')
            document.body.removeChild(textarea)

            if (success) {
                resolve()
            } else {
                reject(new Error('execCommand copy failed.'))
            }
        } catch (error) {
            reject(new Error(`execCommand exception: ${error.message}`))
        }
    })
}

/**
 * 将文本内容复制到剪贴板（自动选择最佳方案）
 *
 * @param {string} text - 需要复制的文本内容
 * @returns {Promise<void>} 若复制成功则 resolve，否则抛出错误
 *
 * @example
 * await copyToClipboard('Hello World')
 * console.log('复制成功')
 *
 * @note
 * - 优先使用 Clipboard API；
 * - 若不支持或被拒绝，则自动回退到 execCommand；
 * - 若两者均失败，将抛出 Error。
 */
export async function copyToClipboard(text) {
    if (typeof text !== 'string') {
        throw new TypeError('copyToClipboard requires a string argument.')
    }

    // 优先 Clipboard API
    try {
        await copyByClipboardAPI(text)
        return
    } catch {
        // 忽略，进入兼容方案
    }

    // 回退 execCommand
    try {
        await copyByExecCommand(text)
        return
    } catch {
        throw new Error('Copy failed: Clipboard API and execCommand are both unsupported.')
    }
}
