# browser-fingerprint 模块说明文档

`browser-fingerprint` 是 `jsly` 库中的一个功能模块，提供了基于浏览器特征生成浏览器指纹的功能。该模块通过收集多个浏览器特征信息，如用户代理、屏幕信息、时区信息、字体信息、Canvas 指纹和 WebGL 信息，生成一个唯一的浏览器指纹。此功能可广泛用于反欺诈、用户跟踪和其他安全相关场景。

## 安装

### 使用 npm 安装

```bash
npm install jsly
```

## 导入

```javascript
import { getBrowserFingerprint } from 'jsly'
```

## 函数介绍

### 1. `getBrowserFingerprint()`

该函数通过收集多个浏览器特征，生成一个唯一的浏览器指纹。指纹信息包括但不限于用户代理字符串、屏幕信息、时区信息、字体信息、Canvas 指纹和 WebGL 信息。

#### 返回值

返回一个哈希字符串，包含了生成的浏览器指纹。

#### 示例

```javascript
const fingerprint = getBrowserFingerprint()
console.log(fingerprint)  // 打印生成的浏览器指纹
```

## 详细说明

### 1. **用户代理（User Agent）**
用户代理字符串包含了浏览器的名称、版本号、操作系统、设备类型等信息。通过分析用户代理，可以确定用户的浏览器和操作系统版本。

示例：
```javascript
const userAgent = navigator.userAgent
```

### 2. **屏幕信息**
屏幕信息包括用户设备的屏幕宽度、高度和颜色深度。不同设备和显示器的这些属性通常是唯一的，能够帮助识别设备。

- **屏幕宽度（width）**：屏幕的显示宽度，以像素为单位。
- **屏幕高度（height）**：屏幕的显示高度，以像素为单位。
- **颜色深度（colorDepth）**：设备的颜色显示深度，通常为 24（表示 24 位色深）。

示例：
```javascript
const screenWidth = window.screen.width
const screenHeight = window.screen.height
const colorDepth = window.screen.colorDepth
```

### 3. **时区信息**
时区信息是通过浏览器的内建 `Intl.DateTimeFormat()` API 获取的，它能够返回当前用户的时区设置。不同地区和时区配置也能帮助识别用户。

示例：
```javascript
const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
```

### 4. **字体信息**
浏览器中的字体信息用于检测特定的字体，这对于生成指纹具有重要作用。通过检测几种常见字体的宽度，可以得到一个独特的字体组合。

检测特定字体的方式：
```javascript
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
```

### 5. **Canvas 指纹**
Canvas 指纹是通过在浏览器的 `<canvas>` 元素上绘制特定的文本或图形，得到一个唯一的图像数据。不同的浏览器和操作系统渲染图像的方式有所不同，这使得 Canvas 成为独特的指纹特征。

示例：
```javascript
function getCanvasFingerprint() {
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')
    context.textBaseline = 'top'
    context.font = '14px Arial'
    context.fillText('Hello, world!', 2, 2)
    return canvas.toDataURL()
}
```

### 6. **WebGL 信息**
WebGL 提供了硬件加速的图形渲染功能，能够获取浏览器的硬件渲染器和厂商信息。这些信息可以用于生成浏览器指纹。

获取 WebGL 信息：
```javascript
function getWebGLFingerprint() {
    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info')
    return {
        vendor: debugInfo ? gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) : null,
        renderer: debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : null
    }
}
```

## 合并所有指纹信息

最终，所有这些信息会被合并成一个对象，并经过哈希处理生成一个独特的指纹字符串。

```javascript
export function getBrowserFingerprint() {
    const userAgent = navigator.userAgent
    const screenWidth = window.screen.width
    const screenHeight = window.screen.height
    const colorDepth = window.screen.colorDepth
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
    const fonts = detectFonts()
    const canvas = getCanvasFingerprint()
    const webGL = getWebGLFingerprint()

    const json = JSON.stringify({
        userAgent,
        screenWidth,
        screenHeight,
        colorDepth,
        timezone,
        fonts,
        canvas,
        webGL
    })

    return sha256(json)
}
```

## 注意事项

- **唯一性**：此指纹生成方法并不是百分之百唯一的，但它提供了足够高的辨识度。不同设备、不同浏览器的指纹信息通常会有所不同，因此可以用来区分不同的用户。
- **隐私问题**：指纹信息涉及用户的硬件和软件特征，因此在使用该方法时，应当考虑到隐私和数据保护的法律要求，如 GDPR 等。

## 性能优化

`getBrowserFingerprint` 方法通过收集多个浏览器特征信息并生成哈希值，以减少对用户隐私的侵犯，同时确保高效性。由于函数内部使用了简单的 DOM 操作和浏览器内建 API，性能通常不会受到影响。