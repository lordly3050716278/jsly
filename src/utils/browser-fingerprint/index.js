import { sha256 } from '../sha256'

/**
 * 获取浏览器指纹信息
 * 
 * 该函数收集多个浏览器特征，生成一个唯一的浏览器指纹。指纹信息包括用户代理字符串、屏幕信息、时区信息、字体信息、Canvas 指纹和 WebGL 信息。
 * 这些信息有助于唯一标识一个浏览器实例，广泛用于反欺诈、跟踪以及其他安全相关场景。
 * 
 * 具体收集的信息：
 * - **用户代理**（User Agent）：浏览器的用户代理字符串
 * - **屏幕信息**：屏幕的宽度、高度和颜色深度
 * - **时区信息**：用户的时区设置
 * - **字体信息**：检测浏览器中已安装的特定字体
 * - **Canvas 指纹**：通过在 Canvas 上绘制文本生成唯一的图像数据
 * - **WebGL 信息**：通过 WebGL 获取硬件渲染器和厂商信息
 *  
 * @returns { string } 返回一个 hash 字符串，包含所有收集的浏览器指纹信息。
 */
export function getBrowserFingerprint() {
    // 获取用户代理字符串
    const userAgent = navigator.userAgent

    // 获取屏幕信息
    const screenWidth = window.screen.width
    const screenHeight = window.screen.height
    const colorDepth = window.screen.colorDepth

    // 获取时区信息
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone

    // 检测字体
    function detectFonts() {
        const canvas = document.createElement('canvas')
        const context = canvas.getContext('2d')
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
    }

    // 获取 Canvas 指纹
    function getCanvasFingerprint() {
        const canvas = document.createElement('canvas')
        const context = canvas.getContext('2d')
        context.textBaseline = 'top'
        context.font = '14px Arial'
        context.fillText('Hello, world!', 2, 2)
        return canvas.toDataURL()
    }

    // 获取 WebGL 信息
    function getWebGLFingerprint() {
        const canvas = document.createElement('canvas')
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
        const debugInfo = gl.getExtension('WEBGL_debug_renderer_info')
        return {
            vendor: debugInfo ? gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) : null,
            renderer: debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : null
        }
    }

    // 合并所有指纹信息
    const json = JSON.stringify({
        userAgent,
        screenWidth,
        screenHeight,
        colorDepth,
        timezone,
        fonts: detectFonts(),
        canvas: getCanvasFingerprint(),
        webGL: getWebGLFingerprint()
    })
    return sha256(json)
}