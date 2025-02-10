
# `diff` 模块

`diff` 模块提供了两种方法，用于比较两个对象的差异。它支持浅比较（只对比对象的第一层属性）和深度比较（递归对比所有层级的属性）两种方式。

## 安装

### 使用 npm 安装

```bash
npm install jsly
```

## 导入

```javascript
import { shallowDiff, deepDiff } from 'jsly'
```

## 函数

### `shallowDiff`

获取新旧两个对象中第一层变化的内容。

#### 参数

- `oldObj` (object)：原对象。
- `newObj` (object)：新对象。

#### 返回值

- 返回一个对象，包含第一层变化的字段及值。如果没有变化，则返回 `null`。

#### 示例

```javascript
const oldObj = { name: 'John', age: 30, address: { city: 'New York' } }
const newObj = { name: 'John', age: 31, address: { city: 'Los Angeles' } }

const diff = shallowDiff(oldObj, newObj)
console.log(diff)
// 输出：{ age: 31 }
```

### `deepDiff`

获取新旧两个对象中变化过的内容，支持深度递归比较。

#### 参数

- `oldObj` (object)：原对象。
- `newObj` (object)：新对象。

#### 返回值

- 返回一个对象，包含变化的字段及值。如果没有变化，则返回 `null`。

#### 示例

```javascript
const oldObj = { 
    name: 'John', 
    address: { city: 'New York', zip: '10001' },
    friends: ['Alice', 'Bob'],
    date: new Date('2020-01-01')
}
const newObj = { 
    name: 'John', 
    address: { city: 'Los Angeles', zip: '90001' },
    friends: ['Alice', 'Charlie'],
    date: new Date('2021-01-01')
}

const diff = deepDiff(oldObj, newObj)
console.log(diff)
// 输出：{ 
//   address: { city: 'Los Angeles', zip: '90001' },
//   friends: ['Alice', 'Charlie'],
//   date: '2021-01-01'
// }
```

## 说明

### `shallowDiff`（浅比较）

- **功能**：只对比对象的第一层属性，忽略嵌套的对象或数组。
- **使用场景**：适用于只关心对象顶部字段差异的场景。

### `deepDiff`（深度比较）

- **功能**：递归对比两个对象的所有层级，找出所有差异。
- **支持**：
  - 对象和数组的递归比较
  - 处理特殊数据类型，如 `Date`、`Map`、`Set`
- **使用场景**：适用于需要检查对象嵌套结构中的变化。

## 安装

```bash
npm install jsly
```

## 引入

```javascript
import { shallowDiff, deepDiff } from 'jsly'
```

## API

### `shallowDiff(oldObj, newObj)`

- 比较新旧对象的第一层属性，返回不同的部分。

### `deepDiff(oldObj, newObj)`

- 比较新旧对象的所有层级属性，返回不同的部分。

## 注意事项

- **性能**：深度比较需要递归遍历对象的所有层级，可能会影响性能，尤其是在对象嵌套较深的情况下。
- **特殊类型支持**：`deepDiff` 支持 `Date`、`Map`、`Set` 类型的深度比较，并且能处理常规对象和数组的变化。