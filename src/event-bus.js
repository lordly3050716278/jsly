/**
 * 精简版事件总线
 */
class EventBus {
    constructor() {
        this.events = {} // 存储事件及监听器数组
        this.onceWrappers = new Map() // 用于once的监听器包装映射
    }

    /**
     * 订阅事件
     * @param {string} event - 事件名
     * @param {Function} listener - 回调函数
     * @param {object} [options] - 选项 { priority, context }
     * @returns {EventBus} 支持链式调用
     */
    on(event, listener, options = {}) {
        if (!event) throw new Error('Event name must be a non-empty string')
        if (typeof listener !== 'function') throw new TypeError('Listener must be a function')

        const { priority = 0, context = null } = options
        const boundListener = context ? listener.bind(context) : listener

        if (!this.events[event]) this.events[event] = []
        this.events[event].push({ listener: boundListener, priority })
        this.events[event].sort((a, b) => b.priority - a.priority)

        return this
    }

    /**
     * 取消订阅事件
     * @param {string} event - 事件名
     * @param {Function} listener - 回调函数
     * @returns {EventBus} 支持链式调用
     */
    off(event, listener) {
        if (!this.events[event]) return this

        const wrapper = this.onceWrappers.get(listener)
        if (wrapper) {
            this._removeListener(event, wrapper)
            this.onceWrappers.delete(listener)
            return this
        }

        this._removeListener(event, listener)
        return this
    }

    _removeListener(event, targetListener) {
        const listeners = this.events[event]
        for (let i = listeners.length - 1; i >= 0; i--) {
            if (listeners[i].listener === targetListener) {
                listeners.splice(i, 1)
            }
        }
    }

    /**
     * 触发事件
     * @param {string} event - 事件名
     * @param  {...any} args - 传递给回调的参数
     * @returns {EventBus} 支持链式调用
     */
    emit(event, ...args) {
        if (!event) throw new Error('Event name must be a non-empty string')
        if (!this.events[event]) return this

        const listeners = this.events[event].slice()
        for (const entry of listeners) {
            try {
                entry.listener(...args)
            } catch {
                // 精简版不处理错误
            }
        }

        return this
    }

    /**
     * 一次性订阅
     * @param {string} event - 事件名
     * @param {Function} listener - 回调函数
     * @param {object} [options] - 选项 { priority, context }
     * @returns {EventBus} 支持链式调用
     */
    once(event, listener, options = {}) {
        const wrapper = (...args) => {
            this.off(event, wrapper)
            this.onceWrappers.delete(listener)
            listener.apply(options.context || null, args)
        }
        this.onceWrappers.set(listener, wrapper)
        return this.on(event, wrapper, options)
    }

    /**
     * 移除所有监听器
     * @param {string} [event] - 可选事件名，不传则移除所有事件
     * @returns {EventBus} 支持链式调用
     */
    removeAllListeners(event) {
        if (event) {
            delete this.events[event]
        } else {
            this.events = {}
        }
        return this
    }

    /**
     * 获取事件监听器数量
     * @param {string} event - 事件名
     * @returns {number} 监听器数量
     */
    listenerCount(event) {
        return this.events[event]?.length || 0
    }
}

// 导出单例
export const $bus = new EventBus()
