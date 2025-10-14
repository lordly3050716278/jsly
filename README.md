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
1. 防抖函数

```javascript
import { debounce } from 'jsly'

// 防抖函数示例
const handler = debounce(() => console.log('Debounced!'), 300)
window.addEventListener('resize', handler)

```

2. 节流函数

```javascript
import { throttle } from 'jsly'

const handler = throttle(() => console.log('Throttled!'), 300)
window.addEventListener('scroll', handler)

```

3. SHA-256 加密

```javascript
import { sha256 } from 'jsly'

const hash = sha256('hello world')
console.log(hash)

```

4. UUID SHA-256 哈希

```javascript
import { randomHash } from 'jsly'

// 默认 v1 UUID
console.log(randomHash())

// v4 UUID
console.log(randomHash('v4'))

```

5. 浏览器指纹 ID

```javascript
import { generateBrowserId } from 'jsly'

const browserId = generateBrowserId()
console.log(browserId) // 64 位 SHA-256 哈希

```

6. 对象构建 FormData

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

7. 剪贴板复制

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

8. 字符串与对象命名转换

```javascript
import { camelToSnake, snakeToCamel, toggleConvertCase, convertObjKeysToCamel } from 'jsly'

console.log(camelToSnake('myVariable')) // my_variable
console.log(snakeToCamel('my_variable')) // myVariable
console.log(toggleConvertCase('myVariable')) // my_variable
console.log(toggleConvertCase('my_variable')) // myVariable

const obj = { my_variable: 123, another_key: 'abc' }
console.log(convertObjKeysToCamel(obj)) // { myVariable: 123, anotherKey: 'abc' }

```

9. 对象差异对比

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

10. 事件总线

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