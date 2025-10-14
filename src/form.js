/**
 * 将一个普通对象封装为 FormData 对象。
 *
 * @param {Record<string, any>} obj - 需要转换的对象
 * @returns {FormData} 转换后的 FormData 实例
 *
 * @note
 * 1. `null` 和 `undefined` 字段会被忽略；
 * 2. 数组会被序列化为 JSON 字符串；
 * 3. 文件对象（`File` / `Blob` / `FileList`）会直接添加；
 * 4. 日期对象会转换为 ISO 字符串；
 * 5. 若当前环境不支持 `FormData`（如 Node.js），会抛出错误。
 *
 * @example
 * const formData = buildObjFormData({
 *   name: 'John',
 *   files: [file1, file2],
 *   date: new Date(),
 *   extra: null
 * })
 *
 * // formData 中包含 name、files (JSON字符串)、date (ISO日期)，不会包含 extra
 */
export function buildObjFormData(obj) {
    if (typeof FormData === 'undefined') {
        throw new Error('当前环境不支持 FormData')
    }

    const fd = new FormData()

    if (!obj || typeof obj !== 'object') return fd

    Object.entries(obj).forEach(([key, value]) => {
        if (value === null || value === undefined) return

        // ✅ 数组：序列化为 JSON
        if (Array.isArray(value)) {
            fd.append(key, JSON.stringify(value))
            return
        }

        // ✅ FileList：转换为多个 File
        if (typeof FileList !== 'undefined' && value instanceof FileList) {
            Array.from(value).forEach(file => fd.append(key, file))
            return
        }

        // ✅ File / Blob
        if (
            (typeof File !== 'undefined' && value instanceof File) ||
            (typeof Blob !== 'undefined' && value instanceof Blob)
        ) {
            fd.append(key, value)
            return
        }

        // ✅ Date
        if (value instanceof Date) {
            fd.append(key, value.toISOString())
            return
        }

        // ✅ 其他普通类型
        fd.append(key, String(value))
    })

    return fd
}
