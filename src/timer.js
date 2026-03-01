/**
 * 基于 requestAnimationFrame 实现的定时器（RAF Interval）
 *
 * 功能类似于 setInterval，但内部使用 requestAnimationFrame 驱动。
 * 相比 setInterval：
 * - 与浏览器刷新率同步，更平滑
 * - 页面不可见时会自动暂停（节省性能）
 * - 不易出现掉帧或时间漂移问题
 *
 * 适用于动画、轮播、游戏循环等需要与渲染帧同步的场景。
 *
 * @template {(...args: any[]) => any} F
 * @param {F} callback - 每次间隔触发时执行的函数。
 * @param {number} delay - 执行间隔时间（毫秒）。
 * @returns {() => void} 返回一个停止函数，用于取消循环。
 *
 * @example
 * const stop = rafInterval(() => {
 *   console.log('每秒执行一次')
 * }, 1000)
 *
 * // 停止
 * stop()
 *
 * @example
 * // 在 Vue 中使用
 * let stop
 * onMounted(() => {
 *   stop = rafInterval(() => {
 *     rotate.value += 1
 *   }, 16)
 * })
 *
 * onUnmounted(() => {
 *   stop()
 * })
 */
export function rafInterval(callback, delay) {
    if (typeof callback !== 'function') {
        throw new TypeError('rafInterval expected a function as the first argument')
    }

    let start = performance.now()
    let frameId = null
    let stopped = false

    function loop(now) {
        if (stopped) return

        const delta = now - start

        if (delta >= delay) {
            callback()
            // 使用 += 防止时间漂移
            start += delay
        }

        frameId = requestAnimationFrame(loop)
    }

    frameId = requestAnimationFrame(loop)

    return function stop() {
        stopped = true
        if (frameId) cancelAnimationFrame(frameId)
    }
}

/**
 * 轮询函数（Polling）
 *
 * 按指定间隔重复执行异步任务，直到：
 * 1. 任务返回 truthy 值（成功）
 * 2. 超时
 * 3. 被手动停止
 *
 * 常用于：
 * - 接口状态查询
 * - 等待资源加载完成
 * - 检测条件成立
 *
 * @template T
 * @param {() => Promise<T> | T} task - 需要轮询执行的函数（支持同步或异步）。
 * @param {Object} [options]
 * @param {number} [options.interval=1000] - 每次轮询间隔时间（毫秒）。
 * @param {number} [options.timeout=0] - 超时时间（毫秒），0 表示不限制。
 * @returns {{ promise: Promise<T>, stop: () => void }}
 *
 * @example
 * const { promise, stop } = poll(
 *   () => fetch('/api/status').then(r => r.json()),
 *   { interval: 2000, timeout: 10000 }
 * )
 *
 * promise.then(res => console.log('成功：', res))
 */
export function poll(task, { interval = 1000, timeout = 0 } = {}) {
    if (typeof task !== 'function') {
        throw new TypeError('poll expected a function as the first argument')
    }

    let stopped = false
    let startTime = Date.now()
    let timer = null

    const promise = new Promise((resolve, reject) => {
        async function execute() {
            if (stopped) return

            try {
                const result = await task()

                if (result) {
                    resolve(result)
                    return
                }

                if (timeout && Date.now() - startTime >= timeout) {
                    reject(new Error('Polling timeout'))
                    return
                }

                timer = setTimeout(execute, interval)
            } catch (err) {
                reject(err)
            }
        }

        execute()
    })

    function stop() {
        stopped = true
        if (timer) clearTimeout(timer)
    }

    return { promise, stop }
}