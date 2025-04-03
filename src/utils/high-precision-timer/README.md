# high-precision-timer 模块

`high-precision-timer` 是 `jsly` 库中的一个模块，提供了高精度的定时器功能，支持在浏览器和 Node.js 环境下工作。该模块通过精确的时间计算，解决了传统的 `setTimeout` 和 `setInterval` 在实际应用中存在的精度问题。它适用于需要精确定时的场景，如动画、游戏和高频率数据更新等。

## 安装

### 使用 npm 安装

```bash
npm install jsly
```

## 导入

```javascript
import { highPrecisionTimeout, highPrecisionInterval } from 'jsly'
```

## 函数概述

该模块提供了两个高精度定时器函数：

- **`highPrecisionTimeout`**：高精度的 `setTimeout` 实现。
- **`highPrecisionInterval`**：高精度的 `setInterval` 实现。

这两个函数解决了传统定时器在实际环境中的误差问题。它们通过计算时间差并调整实际延迟，确保了回调函数按照设定时间准确执行。

## `highPrecisionTimeout` 函数

### 功能

高精度的 `setTimeout` 实现，支持浏览器和 Node.js 环境。该函数通过递归调用 `setTimeout` 并动态调整延迟时间来确保回调函数的执行更加精确。

### 参数

- `cb` (Function)：要在定时器触发时执行的回调函数。
- `delay` (number)：延迟时间，以毫秒为单位。定时器将在此延迟之后执行回调函数。

### 返回值

返回一个包含 `clear` 方法的对象，用于取消定时器。调用 `clear` 方法可以立即停止定时器的执行。

### 示例

```javascript
// 创建定时器
const timer = highPrecisionTimeout(() => {
  console.log('高精度 setTimeout 执行')
}, 1000)

// 取消定时器
timer.clear()
```

### 工作原理

- 在浏览器环境中，使用 `performance.now()` 获取高精度的时间戳，它能提供毫秒级的精度。
- 在 Node.js 环境中，使用 `process.hrtime()`，这是一个高精度的时间API，能获取纳秒级的时间精度。
- 通过计算已过去的时间（时间差），该函数能够动态调整 `setTimeout` 的延迟，确保回调函数按期执行。

### 注意事项

- 由于 JavaScript 的运行环境和线程模型，常规的 `setTimeout` 和 `setInterval` 可能会因其他操作的干扰而出现执行时间不准的现象。此高精度实现可以减少这种误差，提供更加稳定的定时效果。

## `highPrecisionInterval` 函数

### 功能

高精度的 `setInterval` 实现，支持浏览器和 Node.js 环境。该函数确保回调函数的间隔时间与设定的间隔精度一致，即使在多个回调执行中也能保持精度。

### 参数

- `cb` (Function)：要在每次间隔时执行的回调函数。
- `interval` (number)：每次回调之间的时间间隔，以毫秒为单位。

### 返回值

返回一个包含 `clear` 方法的对象，用于取消定时器。调用 `clear` 方法可以立即停止定时器的执行。

### 示例

```javascript
// 创建定时器
const interval = highPrecisionInterval(() => {
  console.log('每 1000 毫秒执行一次')
}, 1000)

// 取消定时器
interval.clear()
```

### 工作原理

- 与 `highPrecisionTimeout` 类似，`highPrecisionInterval` 通过计算每次回调之间的时间差来调整下次调用的定时器。这样可以确保每个回调之间的间隔与设定的时间间隔精确匹配。
- 在浏览器环境中，使用 `performance.now()` 获取当前时间戳，而在 Node.js 中使用 `process.hrtime()`。
- 通过这种方法，我们可以保证即使在执行回调函数时发生了其他操作，定时器的间隔也能保持精确。

### 注意事项

- 与 `setInterval` 的传统实现不同，`highPrecisionInterval` 会根据实际的执行时间间隔动态调整定时器的延迟，从而避免了由于执行延迟积累而导致的定时器失准问题。

## 数据处理逻辑

### 1. **环境判断**

- **浏览器环境**：通过检测 `window` 和 `document` 对象来判断是否在浏览器中运行。如果环境是浏览器，将使用 `performance.now()` 获取高精度的时间。
- **Node.js 环境**：通过检查是否有 `process.hrtime()`，来判断是否在 Node.js 环境运行。在这种情况下，`process.hrtime()` 提供了纳秒级别的高精度时间。

### 2. **时间计算**

- 在每次调用定时器时，都会计算自上次执行以来已经过去的时间。
- 对于每次回调的调用，会动态调整下次执行的延迟时间，确保精确的定时。
- `highPrecisionTimeout` 和 `highPrecisionInterval` 都通过调整 `setTimeout` 的延迟来实现精度控制。

## 注意事项

- **高精度计时**：本模块依赖于浏览器和 Node.js 提供的高精度时间API来实现精确计时。由于 JavaScript 引擎的异步特性，传统的定时器可能存在延迟或误差，使用本模块可以减少这些误差，提供更加稳定的定时效果。
- **性能影响**：虽然该模块能够提高定时器的精度，但它通过递归调用 `setTimeout` 来不断调整延迟，这可能会引入一定的计算开销。在需要极高性能的场景中，用户可以根据实际需求进行优化和调整。

## 示例代码

### 高精度 setTimeout 示例

```javascript
// 设置一个高精度的定时器，延迟 1000 毫秒后执行
highPrecisionTimeout(() => {
  console.log('高精度 setTimeout 完成')
}, 1000)
```

### 高精度 setInterval 示例

```javascript
// 设置一个高精度的定时器，每 1000 毫秒执行一次
highPrecisionInterval(() => {
  console.log('每 1000 毫秒执行一次')
}, 1000)
```

## 浏览器与传统 setInterval 对比

在以下示例中，我们展示了如何在浏览器中同时使用高精度定时器和传统的 `setInterval` 进行对比。我们分别使用高精度计时器和常规的定时器来更新页面上的内容，并观察两者在精度上的差异。

### HTML 示例

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>高精度计时器</title>
</head>

<body>
    <div id="t0"></div>
    <div id="t1"></div>
    <button id="stop">停止定时器</button>
</body>

<script>
    let t0 = 0
    const timer = jsly.highPrecisionInterval(() => {
        document.querySelector('#t0').textContent = t0++
    }, 1000)
    
    let t1 = 0
    const intervalId = setInterval(() => {
        document.querySelector('#t1').textContent = t1++
    }, 1000)

    // 点击按钮停止两个定时器
    document.querySelector('#stop').addEventListener('click', () => {
        timer.clear() // 停止高精度定时器
        clearInterval(intervalId) // 停止传统定时器
    })
</script>

</html>
```

### 对比说明

- **`t0`**：展示使用高精度定时器（`highPrecisionInterval`）更新的内容。
- **`t1`**：展示使用传统 `setInterval` 更新的内容。

两者会同时在页面中更新，您将能够直观地看到高精度定时器与传统定时器之间的细微差距，尤其是在长时间运行下，精度差异会更加明显。

## 性能优化

- 该模块通过精确计算时间差和调整 `setTimeout` 的延迟时间，显著减少了由于 JavaScript 引擎和运行环境带来的定时误差。
- 通过采用浏览器和 Node.js 的高精度时间API，确保每次回调执行时的时间间隔尽可能准确。
- 动态调整定时器的延迟时间，而不是直接依赖 `setTimeout` 的定时精度，使得高精度定时器能应对不同的执行环境和多线程影响。