/**
 * 小驼峰转下划线
 * 
 * @param {string} str - 小驼峰格式的字符串
 * @returns {string} - 下划线格式的字符串
 */
export function camelToSnake(str) {
    if (typeof str !== 'string') {
        throw new TypeError('camelToSnake requires a string argument.')
    }
    return str.replace(/([A-Z])/g, (match) => `_${match.toLowerCase()}`)
}

/**
 * 下划线转小驼峰
 * 
 * @param {string} str - 下划线格式的字符串
 * @returns {string} - 小驼峰格式的字符串
 */
export function snakeToCamel(str) {
    if (typeof str !== 'string') {
        throw new TypeError('snakeToCamel requires a string argument.')
    }
    return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase())
}

/**
 * 根据输入字符串自动判断并转换命名格式
 * - 若包含下划线则转为小驼峰
 * - 否则将小驼峰转为下划线
 * 
 * @param {string} str - 需要转换的字符串
 * @returns {string} - 转换后的字符串
 */
export function toggleConvertCase(str) {
    if (typeof str !== 'string') {
        throw new TypeError('toggleConvertCase requires a string argument.')
    }
    return str.includes('_') ? snakeToCamel(str) : camelToSnake(str)
}

/**
 * 递归转换对象或数组的键名格式
 * 
 * @param {object|array} data - 需要转换的对象或数组
 * @param {'camel'|'snake'} type - 指定目标格式：'camel' 转小驼峰；'snake' 转下划线
 * @returns {object|array} - 转换后的新对象或数组
 *
 * @example
 * convertKeys({ user_name: 'Tom', user_info: { phone_number: '123' } }, 'camel')
 * // => { userName: 'Tom', userInfo: { phoneNumber: '123' } }
 *
 * @example
 * convertKeys({ userName: 'Tom', userInfo: { phoneNumber: '123' } }, 'snake')
 * // => { user_name: 'Tom', user_info: { phone_number: '123' } }
 */
export function convertKeys(data, type = 'camel') {
    if (data === null || typeof data !== 'object') {
        return data // 原始类型直接返回
    }

    if (!['camel', 'snake'].includes(type)) {
        throw new Error("convertKeys type must be 'camel' or 'snake'.")
    }

    // 处理数组
    if (Array.isArray(data)) {
        return data.map(item => convertKeys(item, type))
    }

    // 处理对象
    const result = {}
    Object.entries(data).forEach(([key, value]) => {
        const newKey = type === 'camel' ? snakeToCamel(key) : camelToSnake(key)
        result[newKey] = convertKeys(value, type)
    })

    return result
}
