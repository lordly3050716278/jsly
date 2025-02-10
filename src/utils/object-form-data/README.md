# object-form-data 说明文档

`object-form-data` 是 `jsly` 库中的一个模块，用于将一个普通 JavaScript 对象转换为 `FormData` 对象。该函数适用于将包含不同类型数据（如字符串、数组、文件、日期等）的对象，转化为适合通过表单提交的格式。

该方法特别适用于处理需要上传文件、时间、列表数据等的场景，例如表单提交、数据传输等。

## 安装

### 使用 npm 安装

```bash
npm install jsly
```

## 导入

```javascript
import { buildObjFormData } from 'jsly'
```

### 函数概述

`buildObjFormData` 将一个普通的 JavaScript 对象转换成一个 `FormData` 对象。它支持处理多个常见数据类型，如字符串、数字、文件、数组和日期，并将其转换为表单提交所需的格式。

### `buildObjFormData` 函数

#### 参数

- `obj` (Object)：一个普通 JavaScript 对象，包含要转换的表单数据。

#### 返回值

返回一个 `FormData` 对象，其中包含了从 `obj` 中提取的有效字段。这个对象可以直接用于表单提交。

### 示例

假设我们有一个包含不同类型字段的对象：

```javascript
const obj = {
  name: 'John',               // 普通字符串字段
  files: [file1, file2],      // 文件数组（File 对象）
  date: new Date(),           // 日期对象
  extra: null                 // null 值字段（会被排除）
}
```

我们可以通过 `buildObjFormData` 函数将其转换为 `FormData`：

```javascript
const formData = buildObjFormData(obj)
```

在这个例子中，`formData` 将包含：

- `name`: 'John' （字符串字段）
- `files`: 文件数组的 JSON 序列化字符串
- `date`: 当前日期的 ISO 格式字符串
- `extra`: 不会被添加到 `FormData` 中（因为它是 `null`）

### 数据处理逻辑

#### 1. **Null 和 undefined**

对于值为 `null` 或 `undefined` 的字段，它们不会被添加到 `FormData` 中。这样可以避免提交无效的数据。

例如：

```javascript
const obj = {
  name: 'Alice',
  age: null, // null 值不会添加
  city: undefined // undefined 值也不会添加
}
```

#### 2. **数组**

如果字段的值是一个数组，函数会将该数组序列化为一个 JSON 字符串并添加到 `FormData` 中。这样，可以将复杂的数组数据结构作为字符串传输。

例如：

```javascript
const obj = {
  colors: ['red', 'green', 'blue']
}

const formData = buildObjFormData(obj)
// formData 中的 "colors" 字段会是一个 JSON 字符串：'["red", "green", "blue"]'
```

#### 3. **文件类型（File 和 Blob）**

如果字段的值是 `File` 或 `Blob` 对象，这些对象会直接被添加到 `FormData` 中，适用于上传文件的场景。

例如：

```javascript
const file1 = new File(["content"], "file1.txt", { type: "text/plain" })
const obj = {
  file: file1
}

const formData = buildObjFormData(obj)
// "file" 字段将包含文件对象 file1
```

#### 4. **日期类型**

如果字段的值是 `Date` 对象，函数会将其转换为 ISO 格式的字符串并添加到 `FormData` 中。ISO 格式的日期字符串广泛用于数据交换和 API 请求。

例如：

```javascript
const obj = {
  createdAt: new Date()
}

const formData = buildObjFormData(obj)
// "createdAt" 字段会是一个 ISO 格式的日期字符串
```

#### 5. **普通类型**

对于普通类型（如字符串、数字、布尔值等），函数会直接将其原值添加到 `FormData` 中。

例如：

```javascript
const obj = {
  username: 'john_doe',
  age: 30,
  isActive: true
}

const formData = buildObjFormData(obj)
// "username", "age", 和 "isActive" 字段会直接添加到 formData
```

### 注意事项

1. **Null 和 undefined**：它们不会被添加到 `FormData` 中。
2. **数组**：数组会被 JSON 序列化为字符串后添加到 `FormData` 中。
3. **文件对象**：`File` 和 `Blob` 对象将被直接添加到 `FormData` 中。
4. **日期类型**：日期类型的字段将被转换为 ISO 格式的字符串。
5. **表单提交**：可以直接将返回的 `FormData` 对象用作 `fetch`、`XMLHttpRequest` 或其他表单提交操作的参数。

### 示例代码

```javascript
// 示例：构建一个包含不同类型数据的 FormData 对象
const obj = {
  name: 'John Doe',           // 普通字符串
  profilePicture: file1,      // 文件对象
  tags: ['developer', 'js'],  // 字符串数组
  registeredAt: new Date(),   // 日期对象
  extra: undefined            // undefined 字段（不会添加）
}

const formData = buildObjFormData(obj)
console.log(formData)
```

在上面的示例中，`formData` 会包含：
- 一个名为 `name` 的字段，值为 'John Doe'
- 一个名为 `profilePicture` 的字段，值为 `File` 对象
- 一个名为 `tags` 的字段，值为字符串 '["developer", "js"]'
- 一个名为 `registeredAt` 的字段，值为当前日期的 ISO 字符串
- `extra` 字段不会添加，因为其值为 `undefined`

## 性能优化

该方法通过对对象数据类型的判断，确保了高效的数据转换。通过遍历对象中的属性并处理不同类型，能够灵活地应对多种数据结构，确保只将有效数据添加到 `FormData` 对象中。