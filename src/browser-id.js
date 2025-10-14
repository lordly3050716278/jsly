import { sha256 } from './crypto'

/**
 * 生成一个基于浏览器指纹的唯一 ID（经过 SHA-256 加密）。
 *
 * 该函数通过收集多种浏览器特征信息（如 UA、屏幕、时区、Canvas、WebGL 等），
 * 生成一个高概率唯一的浏览器标识符。  
 * 适用于防刷、反欺诈、用户识别等场景。
 *
 * ⚠️ 若当前运行环境（如 Node.js）中不支持某些浏览器 API，
 * 函数会自动跳过相应特征，确保不会抛出错误。
 *
 * @returns {string} 返回一个基于 SHA-256 的浏览器指纹哈希值（64 位十六进制字符串）。
 *
 * @example
 * const browserId = generateBrowserId()
 * console.log(browserId)
 * // 输出：a3e52b1c3c6b9f27c5d15c3a2a5b18b8a4d6f9e9d6a9f3a1b7a4b1c2d3e4f5a6
 */
export function generateBrowserId() {
    /** @type {Record<string, any>} */
    const fingerprint = {}

    // 用户代理
    if (typeof navigator !== 'undefined' && navigator.userAgent) {
        fingerprint.userAgent = navigator.userAgent
    }

    // 屏幕信息
    if (typeof window !== 'undefined' && window.screen) {
        fingerprint.screenWidth = window.screen.width
        fingerprint.screenHeight = window.screen.height
        fingerprint.colorDepth = window.screen.colorDepth
    }

    // 时区信息
    if (typeof Intl !== 'undefined' && Intl.DateTimeFormat) {
        try {
            fingerprint.timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
        } catch {
            fingerprint.timezone = null
        }
    }

    // 字体检测
    function detectFonts() {
        try {
            if (typeof document === 'undefined') return []
            const canvas = document.createElement('canvas')
            const context = canvas.getContext('2d')
            if (!context) return []
            context.font = '72px monospace'
            const baseline = context.measureText('abcdefghijklmnopqrstuvwxyz')
            const fonts = ['Arial', 'Verdana', 'Times New Roman']
            return fonts.map(font => {
                context.font = `72px ${font}`
                return {
                    font,
                    width: context.measureText('abcdefghijklmnopqrstuvwxyz').width,
                    baselineWidth: baseline.width
                }
            })
        } catch {
            return []
        }
    }

    // Canvas 指纹
    function getCanvasFingerprint() {
        try {
            if (typeof document === 'undefined') return null
            const canvas = document.createElement('canvas')
            const context = canvas.getContext('2d')
            if (!context) return null
            context.textBaseline = 'top'
            context.font = '14px Arial'
            context.fillText('Hello, world!', 2, 2)
            return canvas.toDataURL()
        } catch {
            return null
        }
    }

    // WebGL 信息
    function getWebGLFingerprint() {
        try {
            if (typeof document === 'undefined') return null
            const canvas = document.createElement('canvas')
            const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
            if (!gl) return null
            const debugInfo = gl.getExtension('WEBGL_debug_renderer_info')
            return {
                vendor: debugInfo ? gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) : null,
                renderer: debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : null
            }
        } catch {
            return null
        }
    }

    fingerprint.fonts = detectFonts()
    fingerprint.canvas = getCanvasFingerprint()
    fingerprint.webGL = getWebGLFingerprint()

    return sha256(JSON.stringify(fingerprint))
}