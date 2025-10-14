/**
 * 防抖函数（Debounce）
 *
 * 防抖的核心思想是：在指定的时间 `delay` 内多次触发，只会在最后一次触发后执行。
 * 常用于搜索输入、窗口大小调整、按钮点击等高频事件。
 *
 * @template {(...args: any[]) => any} F
 * @param {F} fn - 需要防抖的原始函数。
 * @param {number} [delay=200] - 防抖延迟时间（毫秒），默认 200ms。
 * @returns {F} 返回一个经过防抖包装后的新函数。
 *
 * @example
 * const handler = debounce(() => console.log('执行了'), 300)
 * window.addEventListener('resize', handler)
 *
 * @example
 * const search = debounce((keyword) => console.log('搜索：', keyword), 500)
 * input.addEventListener('input', e => search(e.target.value))
 */
export function debounce(fn, delay = 200) {
    if (typeof fn !== 'function') {
        throw new TypeError('debounce expected a function as the first argument')
    }

    let timer = null

    return function (...args) {
        const context = this
        if (timer) clearTimeout(timer)
        timer = setTimeout(() => fn.apply(context, args), delay)
    }
}
