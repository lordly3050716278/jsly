/**
 * 获取新旧两个对象中第一层变化的内容
 * 
 * @param {object} oldObj - 原对象
 * @param {object} newObj - 新对象
 * @returns {object|null} - 返回第一层变化的字段及值，若没有变化则返回 null
 */
export function shallowDiff(oldObj, newObj) {
    const diffObj = {}

    // 遍历新对象的所有键，比较第一层字段
    for (const key in newObj) {
        if (newObj[key] !== oldObj[key]) {
            diffObj[key] = newObj[key]
        }
    }

    // 如果结果是空对象则返回 null
    return Object.keys(diffObj).length > 0 ? diffObj : null
}

/**
 * 获取新旧两个对象中变化过的内容，支持深度递归比较
 * 
 * @param {object} oldObj - 原对象
 * @param {object} newObj - 新对象
 * @returns {object|null} - 返回变化的字段及值，若没有变化则返回 null
 */
export function deepDiff(oldObj, newObj) {
    const diffObj = {}

    // 辅助函数：深度比较对象或数组
    const deepEqual = (a, b) => {
        if (a === b) return true
        if (a === null || b === null || typeof a !== 'object' || typeof b !== 'object') return false

        // 处理特殊情况：Date 类型
        if (a instanceof Date && b instanceof Date) return a.getTime() === b.getTime()

        // 处理 Map 类型
        if (a instanceof Map && b instanceof Map) {
            if (a.size !== b.size) return false
            for (let [key, value] of a) {
                if (!b.has(key) || !deepEqual(value, b.get(key))) return false
            }
            return true
        }

        // 处理 Set 类型
        if (a instanceof Set && b instanceof Set) {
            if (a.size !== b.size) return false
            for (let value of a) {
                if (!b.has(value)) return false
            }
            return true
        }

        // 常规对象或数组深度比较
        const keysA = Object.keys(a), keysB = Object.keys(b)
        if (keysA.length !== keysB.length) return false
        for (let key of keysA) {
            if (!keysB.includes(key) || !deepEqual(a[key], b[key])) return false
        }
        return true
    }

    // 遍历新对象的所有键，递归比较
    for (const key in newObj) {
        const newVal = newObj[key]
        const oldVal = oldObj[key]

        // 如果新旧值不相同，递归比较
        if (!deepEqual(newVal, oldVal)) {
            diffObj[key] = newVal
        }
    }

    // 如果结果是空对象则返回 null
    return Object.keys(diffObj).length > 0 ? diffObj : null
}