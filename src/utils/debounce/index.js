/**
 * 防抖函数
 * 
 * @param { Function } fn 需要防抖的函数
 * @param { number } [delay] 防抖的延迟时间，单位毫秒，默认200
 * @returns { Function } 返回一个经过防抖后的新函数
 */
export function debounce(fn, delay = 200) {
    let timer = null
    return function (...args) {
        clearTimeout(timer)
        timer = setTimeout(() => fn.apply(this, args), delay)
    }
}