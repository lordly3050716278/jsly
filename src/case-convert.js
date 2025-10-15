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
 * 转换对象的键名格式（支持可选递归）
 *
 * @param {object} obj - 需要转换的对象
 * @param {'camel'|'snake'} targetType - 目标格式：'camel' 转小驼峰；'snake' 转下划线
 * @param {boolean} [deep=false] - 是否递归转换（默认 false，仅转换首层）
 * @returns {object} - 转换后的新对象
 *
 * @example
 * convertKeys({ user_name: 'Tom', user_info: { phone_number: '123' } }, 'camel')
 * // => { userName: 'Tom', userInfo: { phone_number: '123' } }
 *
 * @example
 * convertKeys({ user_name: 'Tom', user_info: { phone_number: '123' } }, 'camel', true)
 * // => { userName: 'Tom', userInfo: { phoneNumber: '123' } }
 *
 * @example
 * convertKeys({ userName: 'Tom', userInfo: { phoneNumber: '123' } }, 'snake')
 * // => { user_name: 'Tom', user_info: { phoneNumber: '123' } }
 *
 * @example
 * convertKeys({ userName: 'Tom', userInfo: { phoneNumber: '123' } }, 'snake', true)
 * // => { user_name: 'Tom', user_info: { phone_number: '123' } }
 */
export function convertKeys(obj, targetType = 'camel', deep = false) {
    if (obj === null || typeof obj !== 'object' || Array.isArray(obj)) {
        throw new Error('convertKeys 仅支持对象类型')
    }

    if (!['camel', 'snake'].includes(targetType)) {
        throw new Error("convertKeys targetType 必须是 'camel' 或 'snake'")
    }

    const result = {}

    for (const [key, value] of Object.entries(obj)) {
        const newKey = targetType === 'camel' ? snakeToCamel(key) : camelToSnake(key)

        // 如果开启递归并且值是对象，则递归转换
        if (deep && value && typeof value === 'object' && !Array.isArray(value)) {
            result[newKey] = convertKeys(value, targetType, deep)
        } else {
            result[newKey] = value
        }
    }

    return result
}
