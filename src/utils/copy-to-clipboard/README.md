# copy-to-clipboard 模块说明文档

`copy-to-clipboard` 是 `jsly` 库中的一个模块，提供了将文本复制到剪贴板的功能。该模块包括三个函数，支持使用现代浏览器的 `Clipboard API` 进行复制，并且提供了兼容性回退方案（通过 `textarea` + `execCommand`）以确保在较老浏览器中也能正常使用。

## 安装

### 使用 npm 安装

```bash
npm install jsly
```

## 导入

```javascript
import { copyByClipboardAPI, copyByExecCommand, copyToClipboard } from 'jsly'
```

## 函数说明

### 1. `copyByClipboardAPI(text)`

通过 Clipboard API 将文本复制到剪贴板。

#### 参数

- `text`（String）：需要复制的文本。

#### 返回

返回一个 Promise，复制成功时 Promise 成功，失败时返回错误信息。

#### 示例

```javascript
copyByClipboardAPI('Hello, World!')
    .then(() => console.log('复制成功!'))
    .catch(error => console.error('复制失败:', error))
```

##### 说明：

- 使用现代浏览器的 `Clipboard API` 进行复制，如果浏览器不支持该 API 或者权限被拒绝，函数会抛出错误。
- 推荐在支持该 API 的浏览器中使用此方法。

#### 错误处理

- 如果浏览器不支持 `Clipboard API`，会返回一个包含错误信息的 Promise。
- 如果用户的权限被拒绝，抛出 `NotAllowedError` 错误，提示用户检查浏览器权限设置。

### 2. `copyByExecCommand(text)`

通过创建一个不可见的 `textarea` 元素并使用 `execCommand` 方法进行复制。适用于不支持 `Clipboard API` 的浏览器。

#### 参数

- `text`（String）：需要复制的文本。

#### 返回

返回一个 Promise，复制成功时 Promise 成功，失败时返回错误信息。

#### 示例

```javascript
copyByExecCommand('Hello, World!')
    .then(() => console.log('复制成功!'))
    .catch(error => console.error('复制失败:', error))
```

##### 说明：

- 创建一个 `textarea` 元素，设置其值为要复制的文本，选中该文本并调用 `execCommand('copy')` 方法来执行复制操作。
- 如果 `execCommand` 复制失败，函数会返回一个错误。

#### 错误处理

- 如果 `execCommand` 复制失败，返回一个包含错误信息的 Promise。

### 3. `copyToClipboard(text)`

统一的复制函数，会先尝试使用 `Clipboard API` 复制文本，如果失败，则会回退到 `textarea` + `execCommand` 方案。

#### 参数

- `text`（String）：需要复制的文本。

#### 返回

返回一个 Promise，复制成功时 Promise 成功，失败时返回错误信息。

#### 示例

```javascript
copyToClipboard('Hello, World!')
    .then(() => console.log('复制成功!'))
    .catch(error => console.error('复制失败:', error))
```

##### 说明：

- 首先尝试通过 `Clipboard API` 进行复制，如果失败，则回退到 `execCommand` 方案，确保在所有浏览器中都能正常工作。
- 该函数是该模块的主要接口，用户只需调用此函数即可完成复制任务，函数会自动处理不同浏览器的兼容性问题。

#### 错误处理

- 如果在 `Clipboard API` 和 `execCommand` 都失败的情况下，最终会抛出一个错误，提示用户检查浏览器的兼容性或权限设置。

## 使用场景

该模块适用于以下场景：

- **网页应用中的复制功能**：例如，在用户点击按钮时，自动将某个内容复制到剪贴板。
- **表单自动填写**：用户提交表单时，可以自动将数据复制到剪贴板，方便用户粘贴到其他地方。
- **支持浏览器兼容性**：通过回退到 `execCommand`，确保在所有浏览器中都能正确工作。

## 错误处理

- 如果浏览器不支持 `Clipboard API`，会自动回退到 `execCommand` 方法进行复制。
- 如果权限被拒绝或发生其他错误，会抛出详细的错误信息，帮助用户解决问题。

#### 错误示例

```javascript
copyToClipboard('Hello, World!')
    .catch(error => {
        console.error(error.message)  // 输出: 复制文本失败，请检查浏览器兼容性或权限设置。
    })
```

## 性能说明

- 该模块的复制操作非常快速，能够快速响应用户操作。
- 由于 `Clipboard API` 和 `execCommand` 方法本身的高效性，复制过程在大多数情况下是无感知的。
- 对于较长文本的复制，性能表现良好，基本不影响用户体验。

## 其他说明

- 该模块对浏览器版本的要求较低，支持大部分现代浏览器。
- 在不支持 `Clipboard API` 的旧浏览器中，`execCommand` 提供了兼容性保障。
- 如果要确保更好的用户体验，建议使用 `Clipboard API`，并在可能的情况下进行权限请求，以提升操作的成功率。