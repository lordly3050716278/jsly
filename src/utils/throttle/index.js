/**
 * 节流函数
 * 
 * @param { Function } fn 需要节流的函数
 * @param { number } duration 节流的时间间隔，单位毫秒，默认200
 * @returns { Function } 返回一个经过节流的新函数
 */
export function throttle(fn, duration = 200) {
    let lastCallTime = 0
    return function (...args) {
        const currentTime = Date.now()
        if (currentTime - lastCallTime >= duration) {
            lastCallTime = currentTime
            fn.apply(this, args)
        }
    }
}