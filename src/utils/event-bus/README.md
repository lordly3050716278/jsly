# event-bus 模块说明文档

`event-bus` 是 `jsly` 库中的事件总线模块，提供了高效的事件管理和通信机制，支持事件的订阅、发布、取消订阅以及高级功能如优先级、一次性监听、异步触发等。它非常适合于解耦应用中的各个部分，允许不同模块之间进行通信，而无需直接依赖。

## 安装

### 使用 npm 安装

```bash
npm install jsly
```

### 导入

```javascript
import { $bus } from 'jsly' // 引入事件总线实例
```

`$bus` 是 `event-bus` 模块提供的单例实例，用户可以直接使用该实例进行事件管理。

## API 参考

### 1. `on(event, listener, options)`

订阅一个事件并绑定监听器。可以通过 `options` 设置监听器的优先级和上下文。

#### 参数

- `event`（String）：事件名称。
- `listener`（Function）：事件触发时执行的回调函数。
- `options`（Object，可选）：订阅选项。
  - `priority`（Number，可选）：监听器的优先级，数字越大越优先执行，默认是 `0`。
  - `context`（Object，可选）：为监听器指定执行上下文（即 `this`）。

#### 返回

返回 `$bus` 实例，支持链式调用。

#### 示例

```javascript
$bus
.on('event1', function(data) {
    console.log('Event 1 triggered with data:', data)
}, { priority: 10, context: this })
.on('event2', () => { 
    console.log('Event 2 triggered')
})
.emit('event1', 'Data for Event 1')
.emit('event2')
```

在上面的示例中，我们通过链式调用的方式，订阅多个事件，并立即触发它们。

### 2. `off(event, listener)`

取消订阅事件。可以指定某个事件的某个监听器，也可以取消所有监听器。

#### 参数

- `event`（String）：事件名称。
- `listener`（Function）：需要取消的监听器。

#### 返回

返回 `$bus` 实例，支持链式调用。

#### 示例

```javascript
const listener = () => { 
    console.log('This should be removed')
}
$bus
.on('event1', listener)
.off('event1', listener)
.emit('event1')  // 该事件不会触发任何监听器
```

### 3. `once(event, listener, options)`

一次性订阅事件，事件触发一次后自动移除监听器。

#### 参数

- `event`（String）：事件名称。
- `listener`（Function）：事件触发时执行的回调函数。
- `options`（Object，可选）：订阅选项。

#### 返回

返回 `$bus` 实例，支持链式调用。

#### 示例

```javascript
$bus
.once('event1', () => {
    console.log('Event 1 triggered once')
})
.emit('event1') // 触发一次后，监听器会被移除
```

### 4. `emit(event, ...args)`

发布一个事件，并传递事件参数给所有订阅该事件的监听器。

#### 参数

- `event`（String）：事件名称。
- `args`（Array）：事件的参数，会传递给所有监听器。

#### 返回

返回 `$bus` 实例，支持链式调用。

#### 示例

```javascript
$bus
.emit('event1', 'Hello', 'World')
.emit('event2', 'Data for event 2')
```

### 5. `emitAsync(event, ...args)`

异步触发事件，返回一个 `Promise` 对象。适用于需要异步处理的场景。

#### 参数

- `event`（String）：事件名称。
- `args`（Array）：事件参数。

#### 返回

返回一个 `Promise`，可以用于链式调用。

#### 示例

```javascript
$bus
.emitAsync('event1', 'Hello', 'World')
.then(() => {
    console.log('Event handled')
})
.catch((error) => {
    console.error('Event error:', error)
})
```

### 6. `removeAllListeners(event)`

移除指定事件的所有监听器。也可以移除所有事件的监听器。

#### 参数

- `event`（String，可选）：事件名称。如果不传递该参数，则移除所有事件的所有监听器。

#### 返回

返回 `$bus` 实例，支持链式调用。

#### 示例

```javascript
$bus
.removeAllListeners('event1')
.removeAllListeners() // 移除所有事件的所有监听器
.emit('event1')  // 事件不会触发任何监听器
```

### 7. `listenerCount(event)`

获取指定事件的监听器数量。

#### 参数

- `event`（String）：事件名称。

#### 返回

返回事件监听器的数量。

#### 示例

```javascript
const count = $bus.listenerCount('event1')
console.log('Number of listeners for event1:', count)
```

## 错误处理

如果在事件触发时发生错误，`$bus` 会自动触发 `error` 事件，可以通过订阅 `error` 事件来捕获和处理这些错误。

### 错误处理示例

```javascript
$bus.on('error', (error, event, args) => {
  console.error(`Error in event "${event}" with arguments:`, args, error)
})

$bus.on('event1', () => {
    throw new Error('Something went wrong')
})
$bus.emit('event1', 'data')  // 会触发 error 事件
```

## 通配符事件

`$bus` 支持 `*` 通配符事件，用于监听所有事件的触发。当任何事件触发时，绑定的通配符监听器都会被调用。

### 示例

```javascript
$bus.on('*', (event, ...args) => {
  console.log(`Event "${event}" triggered with arguments:`, args)
})

$bus.emit('event1', 'data1')  // 会触发 * 监听器
$bus.emit('event2', 'data2')  // 会触发 * 监听器
```

## 高级功能

### 1. 优先级排序

`$bus` 支持根据优先级执行事件监听器。优先级高的监听器会先被触发。优先级默认值为 `0`，数值越大优先级越高。

#### 示例

```javascript
$bus
.on('event1', () => { 
    console.log('Low priority listener')
}, { priority: 1 })
.on('event1', () => {
    console.log('High priority listener')
}, { priority: 10 })
.emit('event1')  // 输出顺序为: High priority listener, Low priority listener
```

### 2. 监听器上下文

通过 `context` 选项，可以为事件监听器设置执行时的 `this` 上下文。这样可以在事件监听器中访问指定的上下文。

#### 示例

```javascript
class MyClass {
  constructor() {
    this.name = 'MyClass'
  }

  logName() {
    console.log(this.name)
  }
}

const myClassInstance = new MyClass()
$bus.on('event1', myClassInstance.logName, { context: myClassInstance }).emit('event1')  // 输出: MyClass
```

## 性能优化

`$bus` 在内部使用了数组来存储事件和监听器，为了提高性能，它会根据优先级对监听器进行排序。对于频繁触发的事件，确保订阅的监听器数量较少，可以获得更好的性能。

## 常见问题

### 1. 如何移除所有事件的监听器？

调用 `removeAllListeners()` 即可移除所有事件的监听器。

```javascript
$bus.removeAllListeners()
```

### 2. 如何获取某个事件的监听器数量？

可以使用 `listenerCount(event)` 来获取指定事件的监听器数量。

```javascript
const count = $bus.listenerCount('event1')
console.log(count)
```