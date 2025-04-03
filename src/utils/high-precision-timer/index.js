// 判断当前环境是浏览器还是 Node.js
const isBrowser = typeof window !== 'undefined' && typeof window.document !== 'undefined'

/**
 * 高精度的 setTimeout 实现，支持浏览器和 Node.js 环境。
 * 通过递归调用 setTimeout 来调整实际延迟，确保更精确的定时。
 *
 * @param {Function} cb - 回调函数，在延迟时间到达后执行。
 * @param {number} delay - 延迟时间（以毫秒为单位）。
 * @returns {Object} 包含 clear 方法的对象，用于取消定时器
 */
export function highPrecisionTimeout(cb, delay) {
    // 根据环境选择性能API
    const start = isBrowser ? performance.now() : process.hrtime()
    let timerId = null
    let isCancelled = false

    function loop() {
        if (isCancelled) return

        const elapsed = isBrowser ? performance.now() - start : process.hrtime(start)
        const elapsedTimeInMs = isBrowser ? elapsed : (elapsed[0] * 1e3) + (elapsed[1] / 1e6) // 转换为毫秒
        const remainingTime = Math.max(0, delay - elapsedTimeInMs)

        if (remainingTime <= 0) {
            cb()
            return
        }
        // 调整 setTimeout 的时间
        timerId = setTimeout(loop, remainingTime)
    }

    // 启动定时器
    timerId = setTimeout(loop, delay)

    return {
        clear: () => {
            isCancelled = true
            if (timerId) {
                clearTimeout(timerId)
                timerId = null
            }
        }
    }
}

/**
 * 高精度的 setInterval 实现，支持浏览器和 Node.js 环境。
 * 通过递归调用 setTimeout 来确保每个间隔时间的精度。
 *
 * @param {Function} cb - 回调函数，在每个间隔时间到达时执行。
 * @param {number} interval - 每次回调之间的间隔时间（以毫秒为单位）。
 * @returns {Object} 包含 clear 方法的对象，用于取消定时器
 */
export function highPrecisionInterval(cb, interval) {
    // 根据环境选择性能API
    let lastTime = isBrowser ? performance.now() : process.hrtime()
    let timerId = null
    let isCancelled = false

    function loop() {
        if (isCancelled) return

        const now = isBrowser ? performance.now() : process.hrtime()
        const elapsed = isBrowser ? now - lastTime : process.hrtime(lastTime)
        const elapsedTimeInMs = isBrowser ? elapsed : (elapsed[0] * 1e3) + (elapsed[1] / 1e6) // 转换为毫秒

        if (elapsedTimeInMs >= interval) {
            cb()
            lastTime = isBrowser ? performance.now() : process.hrtime() // 更新上次执行时间
        }

        timerId = setTimeout(loop, Math.max(0, interval - elapsedTimeInMs)) // 调整下次执行的时间
    }

    timerId = setTimeout(loop, interval) // 启动定时器

    return {
        clear: () => {
            isCancelled = true
            if (timerId) {
                clearTimeout(timerId)
                timerId = null
            }
        }
    }
}