# jsly

一些常用的js函数工具

## 安装

### npm 安装

```bash
npm install jsly
```

### cdn 引入
```html
<script src="https://cdn.jsdelivr.net/npm/jsly@<version>/dist/index.umd.js"></script>
```
引入后，全局对象 `Jsly` 将包含所有工具函数。

## 使用示例

### 防抖函数

```javascript
import { debounce } from 'jsly'

// 防抖函数示例
const handler = debounce(() => console.log('Debounced!'), 300)
window.addEventListener('resize', handler)

```

### 节流函数

```javascript
import { throttle } from 'jsly'

const handler = throttle(() => console.log('Throttled!'), 300)
window.addEventListener('scroll', handler)

```

### SHA-256 加密

```javascript
import { sha256 } from 'jsly'

const hash = sha256('hello world')
console.log(hash)

```

### UUID SHA-256 哈希

```javascript
import { randomHash } from 'jsly'

// 默认 v1 UUID
console.log(randomHash())

// v1 UUID
console.log(randomHash('v1'))

// v2 UUID
console.log(randomHash('v2'))

// v3 UUID
console.log(randomHash('v3'))

// v4 UUID
console.log(randomHash('v4'))

// v5 UUID
console.log(randomHash('v5'))

```

### 浏览器指纹 ID

```javascript
import { generateBrowserId } from 'jsly'

const browserId = generateBrowserId()
console.log(browserId) // 64 位 SHA-256 哈希

```

### 对象构建 FormData

```javascript
import { buildObjFormData } from 'jsly'

const formData = buildObjFormData({
  name: 'John',
  files: [file1, file2],
  date: new Date(),
  extra: null
})

console.log(formData)

```

### 剪贴板复制

```javascript
import { copyToClipboard, copyByClipboardAPI, copyByExecCommand } from 'jsly'

// 1️⃣ 自动选择最佳方案复制
await copyToClipboard('Hello World!')
console.log('Text copied to clipboard!')

// 2️⃣ 直接使用 Clipboard API（现代浏览器推荐）
try {
  await copyByClipboardAPI('Hello Clipboard API!')
  console.log('Copied via Clipboard API!')
} catch (err) {
  console.error('Clipboard API failed:', err)
}

// 3️⃣ 通过 textarea + execCommand（兼容旧浏览器）
try {
  await copyByExecCommand('Hello execCommand!')
  console.log('Copied via execCommand!')
} catch (err) {
  console.error('execCommand failed:', err)
}

```

### 字符串与对象命名转换

```javascript
import { camelToSnake, snakeToCamel, toggleConvertCase, convertKeys } from 'jsly'

// 字符串转换
console.log(camelToSnake('myVariable')) // my_variable
console.log(snakeToCamel('my_variable')) // myVariable
console.log(toggleConvertCase('myVariable')) // my_variable
console.log(toggleConvertCase('my_variable')) // myVariable

// 对象键名转换（默认只转换首层）
console.log(convertKeys({ user_name: 'Tom', user_info: { phone_number: '123' } }, 'camel'))
// => { userName: 'Tom', userInfo: { phone_number: '123' } }

// 递归转换所有层级
console.log(convertKeys({ user_name: 'Tom', user_info: { phone_number: '123' } }, 'camel', true))
// => { userName: 'Tom', userInfo: { phoneNumber: '123' } }

console.log(convertKeys({ userName: 'Tom', userInfo: { phoneNumber: '123' } }, 'snake'))
// => { user_name: 'Tom', user_info: { phoneNumber: '123' } }

console.log(convertKeys({ userName: 'Tom', userInfo: { phoneNumber: '123' } }, 'snake', true))
// => { user_name: 'Tom', user_info: { phone_number: '123' } }

```

### 对象差异对比

```javascript
import { shallowDiff, deepDiff } from 'jsly'

const oldObj = { a: 1, b: { x: 10, y: 20 } }
const newObj = { a: 2, b: { x: 10, y: 30 } }

// 第一层差异
console.log(shallowDiff(oldObj, newObj)) // { a: 2, b: { x: 10, y: 30 } }

// 深度差异
console.log(deepDiff(oldObj, newObj)) // { a: 2, b: { x: 10, y: 30 } }

// 深度差异最小化
console.log(deepDiff(oldObj, newObj, true)) // { a: 2, b: { y: 30 } }

```

### 事件总线

```javascript
import { $bus } from 'jsly'

// 订阅事件
$bus.on('test', data => console.log('Received:', data))

// 触发事件
$bus.emit('test', { a: 1 })

// 一次性事件
$bus.once('onceEvent', () => console.log('This runs only once'))

// 取消订阅
function listener() {}
$bus.off('test', listener)

// 移除所有监听器
$bus.removeAllListeners()

```