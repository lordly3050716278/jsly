/**
 * 将一个对象封装成为一个表单数据对象 FormData
 * 
 * @param { object } obj 原对象
 * @returns { FormData } 原对象中的数据添加到表单对象后的新的表单对象
 * 
 * @note
 * 1. 对于对象中的值为 null 和 undefined 的情况不会将该字段添加到表单中
 * 2. 如果对象中的值是数组，那么会直接添加该数组JSON序列化后的值到表单中
 * 3. 如果对象中的值是文件对象（File 或 Blob），会直接将该对象添加到表单中
 * 4. 如果对象中的值是日期类型，会转换为 ISO 格式的字符串
 * 
 * @example
 * const formData = buildObjFormData({
 *   name: 'John',
 *   files: [file1, file2],
 *   date: new Date(),
 *   extra: null
 * })
 * 
 * // formData 现在包含了 name, files (JSON 字符串), date (ISO 格式的日期) 和 extra 字段
 */
export function buildObjFormData(obj) {
    const fd = new FormData()

    Object.entries(obj).forEach(([key, value]) => {
        if (value === null || value === undefined) return

        // 处理数组类型：将数组序列化为 JSON 字符串
        if (Array.isArray(value)) {
            fd.append(key, JSON.stringify(value))
            return
        }

        // 处理文件类型：File 或 FileList，支持多个文件
        if (value instanceof File || value instanceof Blob) {
            fd.append(key, value)
            return
        }

        // 处理 Date 类型：转换为 ISO 格式的字符串
        if (value instanceof Date) {
            fd.append(key, value.toISOString())
            return
        }

        // 普通类型直接添加
        fd.append(key, value)
    })

    return fd
}