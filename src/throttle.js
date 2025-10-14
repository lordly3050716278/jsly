/**
 * 节流函数（Throttle）
 *
 * 节流的核心思想是：在指定的时间间隔 `delay` 内，多次触发只会执行一次。
 * 常用于滚动监听、窗口缩放、按钮点击等高频事件。
 *
 * @template {(...args: any[]) => any} F
 * @param {F} fn - 需要节流的原始函数。
 * @param {number} [delay=200] - 节流间隔时间（毫秒），默认 200ms。
 * @returns {F} 返回一个经过节流包装后的新函数。
 *
 * @example
 * const onScroll = throttle(() => console.log('滚动中...'), 300)
 * window.addEventListener('scroll', onScroll)
 *
 * @example
 * const handleClick = throttle(() => console.log('点击触发'), 1000)
 * button.addEventListener('click', handleClick)
 */
export function throttle(fn, delay = 200) {
    if (typeof fn !== 'function') {
        throw new TypeError('throttle expected a function as the first argument')
    }

    let lastTime = 0

    return function (...args) {
        const now = Date.now()
        const context = this

        if (now - lastTime >= delay) {
            fn.apply(context, args)
            lastTime = now
        }
    }
}
