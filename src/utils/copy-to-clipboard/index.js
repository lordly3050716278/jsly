/**
 * 通过 Clipboard API 复制文本
 * @param { string } text 需要复制的文本
 * @returns { Promise<void> }
 */
export function copyByClipboardAPI(text) {
    return new Promise(async (resolve, reject) => {
        try {
            if (!navigator.clipboard) {
                reject(new Error('Clipboard API 不支持此浏览器'))
                return
            }
            await navigator.clipboard.writeText(text)
            resolve()
        } catch (error) {
            if (error.name === 'NotAllowedError') {
                reject(new Error('权限被拒绝，无法访问剪贴板。请检查浏览器权限设置。'))
                return
            }
            reject(new Error(`复制失败: ${error.message}`))
        }
    })
}

/**
 * 通过 textarea + execCommand 复制文本（兼容性方案）
 * @param { string } text 需要复制的文本
 * @returns { Promise<void> }
 */
export function copyByExecCommand(text) {
    return new Promise((resolve, reject) => {
        const textarea = document.createElement('textarea')
        textarea.value = text
        textarea.style.position = 'absolute'
        textarea.style.opacity = '0'
        document.body.appendChild(textarea)
        textarea.select()

        try {
            const success = document.execCommand('copy')
            if (success) {
                resolve()
                return
            }
            reject(new Error('execCommand 复制失败'))
        } catch (error) {
            reject(error)
        } finally {
            document.body.removeChild(textarea)
        }
    })
}

/**
 * 将文本复制到剪贴板
 * @param {string} text 需要复制的文本
 * @returns {Promise<void>}
 */
export async function copyToClipboard(text) {
    try {
        // 尝试使用 Clipboard API 复制
        await copyByClipboardAPI(text)
        console.log('通过 Clipboard API 成功复制了内容!')
    } catch (error) {
        console.error('Clipboard API 复制失败:', error)

        // 如果 Clipboard API 失败，回退到 execCommand
        try {
            await copyByExecCommand(text)
            console.log('通过 textarea + execCommand 成功复制了内容!')
        } catch (fallbackError) {
            console.error('通过 execCommand 复制失败:', fallbackError)
            throw new Error('复制文本失败，请检查浏览器兼容性或权限设置。')
        }
    }
}