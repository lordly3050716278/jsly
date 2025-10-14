/**
 * 获取两个对象第一层的差异字段
 * 
 * @param {object} oldObj - 原对象
 * @param {object} newObj - 新对象
 * @returns {object|null} - 返回第一层变化字段的键值对，若无变化则返回 null
 *
 * @example
 * const oldData = { name: 'Alice', age: 18 }
 * const newData = { name: 'Bob', age: 18 }
 * console.log(shallowDiff(oldData, newData))
 * // 输出: { name: 'Bob' }
 */
export function shallowDiff(oldObj, newObj) {
    const diff = {}

    for (const key in newObj) {
        if (newObj[key] !== oldObj[key]) {
            diff[key] = newObj[key]
        }
    }

    return Object.keys(diff).length > 0 ? diff : null
}

/**
 * 获取两个对象中变化的字段
 * 支持深度递归比较
 * 可选是否只返回最小差异结构
 * 
 * @param {object} oldObj - 原对象
 * @param {object} newObj - 新对象
 * @param {boolean} [minimal=false] - 是否只返回最小差异结构，默认 false
 * @returns {object|null} - 返回变化字段对象，若无变化返回 null
 *
 * @example
 * const oldData = {
 *   user: { name: 'Alice', age: 18, tags: ['dev'] },
 *   active: true
 * }
 * const newData = {
 *   user: { name: 'Bob', age: 18, tags: ['dev', 'music'] },
 *   active: true
 * }
 *
 * // 默认 minimal = false
 * console.log(deepDiff(oldData, newData))
 * // 输出:
 * // {
 * //   user: { name: 'Bob', age: 18, tags: ['dev', 'music'] }
 * // }
 *
 * // minimal = true
 * console.log(deepDiff(oldData, newData, true))
 * // 输出:
 * // {
 * //   user: { name: 'Bob', tags: ['dev', 'music'] }
 * // }
 */
export function deepDiff(oldObj, newObj, minimal = false) {
    const isEqual = (a, b) => {
        if (a === b) return true
        if (a === null || b === null) return a === b

        if (a instanceof Date && b instanceof Date) return a.getTime() === b.getTime()
        if (a instanceof Map && b instanceof Map) {
            if (a.size !== b.size) return false
            for (const [key, value] of a) {
                if (!b.has(key) || !isEqual(value, b.get(key))) return false
            }
            return true
        }
        if (a instanceof Set && b instanceof Set) {
            if (a.size !== b.size) return false
            for (const v of a) if (!b.has(v)) return false
            return true
        }
        if (Array.isArray(a) && Array.isArray(b)) {
            if (a.length !== b.length) return false
            for (let i = 0; i < a.length; i++) if (!isEqual(a[i], b[i])) return false
            return true
        }
        if (typeof a === 'object' && typeof b === 'object') {
            const keysA = Object.keys(a)
            const keysB = Object.keys(b)
            if (keysA.length !== keysB.length) return false
            return keysA.every(key => keysB.includes(key) && isEqual(a[key], b[key]))
        }
        return false
    }

    const diffRecursive = (oldVal, newVal) => {
        if (isEqual(oldVal, newVal)) return null

        if (!minimal || typeof oldVal !== 'object' || oldVal === null || typeof newVal !== 'object' || newVal === null) {
            return newVal
        }

        if (Array.isArray(newVal) || newVal instanceof Map || newVal instanceof Set) {
            return newVal
        }

        // 对象递归比较
        const result = {}
        const keys = new Set([...Object.keys(oldVal || {}), ...Object.keys(newVal || {})])
        for (const key of keys) {
            const subDiff = diffRecursive(oldVal?.[key], newVal?.[key])
            if (subDiff !== null) {
                result[key] = subDiff
            }
        }

        return Object.keys(result).length > 0 ? result : null
    }

    return diffRecursive(oldObj, newObj)
}
