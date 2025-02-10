# convert-case 模块说明文档

`convert-case` 是 `jsly` 库中的一个字符串格式转换模块，提供了三种常见的字符串格式转换功能：小驼峰转下划线、下划线转小驼峰、以及根据输入数据类型自动选择转换方式。此模块非常适合在不同命名风格之间进行快速转换，尤其在处理前端与后端数据交互时非常有用。

## 安装

### 使用 npm 安装

```bash
npm install jsly
```

## 导入

```javascript
import { camelToSnake, snakeToCamel, toggleConvertCase } from 'jsly'
```

## 函数说明

### 1. `camelToSnake(str)`

将小驼峰格式的字符串（camelCase）转换为下划线格式（snake_case）。

#### 参数

- `str`（String）：需要转换的小驼峰格式字符串。

#### 返回

返回一个下划线格式的字符串（snake_case）。

#### 示例

```javascript
const result = camelToSnake('myVariableName')
console.log(result)  // 输出: my_variable_name
```

##### 说明：

- 该函数使用正则表达式匹配大写字母，并在大写字母前添加下划线，将其转换为小写字母。
- 例如，`myVariableName` 会被转换为 `my_variable_name`。

#### 使用场景

- 数据库字段通常使用下划线命名风格（`my_variable_name`），此函数可以方便地将 JavaScript 中的小驼峰格式转换为适用于数据库的下划线格式。
- 用于 API 与客户端之间的数据转换，确保符合不同系统的命名规范。

### 2. `snakeToCamel(str)`

将下划线格式的字符串（snake_case）转换为小驼峰格式（camelCase）。

#### 参数

- `str`（String）：需要转换的下划线格式字符串。

#### 返回

返回一个小驼峰格式的字符串（camelCase）。

#### 示例

```javascript
const result = snakeToCamel('my_variable_name')
console.log(result)  // 输出: myVariableName
```

##### 说明：

- 该函数会将每个下划线后面的字母转换为大写，并去掉下划线。
- 例如，`my_variable_name` 会被转换为 `myVariableName`。

#### 使用场景

- 前端 JavaScript 中常用小驼峰格式（`myVariableName`），但后端接口返回的数据通常使用下划线命名风格。此函数帮助将后端返回的下划线格式数据转换为前端所需的小驼峰格式。
- 适用于 API 与前端代码之间的命名规范一致性处理。

### 3. `toggleConvertCase(str)`

根据输入的数据类型自动选择转换方式：如果字符串包含下划线，则转换为小驼峰格式；如果字符串是小驼峰格式，则转换为下划线格式。

#### 参数

- `str`（String）：需要转换的字符串。

#### 返回

返回转换后的字符串（根据输入的类型，返回小驼峰格式或下划线格式）。

#### 示例

```javascript
const result1 = toggleConvertCase('my_variable_name')
console.log(result1)  // 输出: myVariableName

const result2 = toggleConvertCase('myVariableName')
console.log(result2)  // 输出: my_variable_name
```

##### 说明：

- 该函数首先检查输入字符串是否包含下划线。如果包含下划线，则调用 `snakeToCamel` 进行转换。
- 如果字符串没有下划线（即是小驼峰格式），则调用 `camelToSnake` 进行转换。

#### 使用场景

- 该函数非常适合需要在两种命名风格之间切换的场景，特别是当数据的命名风格不确定时，自动判断并转换为目标格式。
- 适用于处理前后端或不同模块间的数据转换，自动适配不同命名规则。

## 适用场景

该模块非常适合在以下场景中使用：

- **API 与前端代码之间的转换**：后端通常使用下划线命名规则，而前端 JavaScript 通常使用小驼峰命名规则。使用此模块可以自动处理命名风格的转换。
- **数据库与编程语言的命名规则统一**：在许多数据库中，字段名通常使用下划线命名，而编程语言（如 JavaScript）则使用小驼峰命名。此模块能轻松转换字段名格式。
- **代码规范统一**：在不同的项目中，命名风格可能不一致。此模块帮助开发者快速转换代码中的变量命名风格，确保一致性。

## 错误处理

此模块依赖输入是有效的字符串类型。如果传递给任何一个函数的参数不是字符串类型，将会抛出一个 `TypeError`。

#### 错误处理示例

```javascript
try {
  camelToSnake(123)
} catch (error) {
  console.error(error)  // 输出: TypeError: str is not a string
}

try {
  snakeToCamel(null)
} catch (error) {
  console.error(error)  // 输出: TypeError: str is not a string
}
```

### 错误处理说明

- 该模块的函数假定输入是字符串，因此如果传入非字符串类型（如数字、数组、对象等），会抛出 `TypeError` 错误。
- 在使用前，可以通过 `typeof` 或者 `instanceof` 等方式验证传入的参数类型，确保不会传递不符合要求的参数。

## 性能说明

- 该模块的转换函数对于常见的字符串长度（如 100 字符以内）具有非常高的性能，能在几乎所有常规使用场景中迅速完成转换。
- 对于极长的字符串，转换性能也足够优秀，但由于转换函数内部使用了正则表达式，复杂字符串可能稍微增加转换时间。

## 其他说明

- 该模块对字符串的转换方法非常简洁且高效，适合用于各种场景。
- 可以配合其他模块一起使用，提供灵活的字符串格式化方案。