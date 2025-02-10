class EventBus {
    constructor() {
        this.events = {} // 存储事件及监听器数组
        this.onceWrappers = new Map() // 用于once的监听器包装映射
    }

    // 订阅事件，支持优先级和上下文
    on(event, listener, options = {}) {
        if (!event) {
            throw new Error('Event name must be a non-empty string')
        }

        if (typeof listener !== 'function') {
            throw new TypeError('Listener must be a function')
        }

        const { priority = 0, context = null } = options

        const boundListener = context ? listener.bind(context) : listener

        if (!this.events[event]) {
            this.events[event] = []
        }

        this.events[event].push({ listener: boundListener, priority })
        // 按优先级降序排序
        this.events[event].sort((a, b) => b.priority - a.priority)

        return this // 支持链式调用
    }

    // 取消订阅事件
    off(event, listener) {
        if (!this.events[event]) return this

        // 处理once包装器
        const wrapper = this.onceWrappers.get(listener)
        if (wrapper) {
            this._removeListener(event, wrapper)
            this.onceWrappers.delete(listener)
            return this
        }
        this._removeListener(event, listener)
        return this
    }

    // 内部方法：移除监听器
    _removeListener(event, targetListener) {
        const listeners = this.events[event]
        for (let i = listeners.length - 1; i >= 0; i--) {
            if (listeners[i].listener !== targetListener) continue
            listeners.splice(i, 1)
        }
    }

    // 触发事件
    emit(event, ...args) {
        if (!event) {
            throw new Error('Event name must be a non-empty string')
        }

        // 触发通配符事件
        if (event !== '*' && this.events['*']) {
            this._triggerEvent('*', [event, ...args])
        }

        if (this.events[event]) {
            this._triggerEvent(event, args)
        }

        return this // 支持链式调用
    }

    // 内部方法：触发指定事件的监听器
    _triggerEvent(event, args) {
        const listeners = this.events[event].slice() // 创建副本避免迭代时修改

        for (const entry of listeners) {
            try {
                entry.listener.apply(null, args)
            } catch (error) {
                this._handleError(error, event, args)
            }
        }
    }

    // 错误处理
    _handleError(error, event, args) {
        console.error(`[EventBus] Error in "${event}" handler:`, error)

        if (error.stack) {
            console.error(error.stack)
        }

        if (this.events['error']) {
            this.emit('error', error, event, args)
        }
    }

    // 一次性订阅
    once(event, listener, options = {}) {
        if (!event) {
            throw new Error('Event name must be a non-empty string')
        }

        if (typeof listener !== 'function') {
            throw new TypeError('Listener must be a function')
        }

        const wrapper = (...args) => {
            // 先移除再触发，避免多次触发
            this.off(event, wrapper)
            this.onceWrappers.delete(listener)
            listener.apply(options.context || null, args)
        }

        this.onceWrappers.set(listener, wrapper)
        this.on(event, wrapper, options)

        return this // 支持链式调用
    }

    // 移除所有监听器
    removeAllListeners(event) {
        if (event) {
            delete this.events[event]
        } else {
            this.events = {}
        }

        return this // 支持链式调用
    }

    // 获取事件监听器数量
    listenerCount(event) {
        const listeners = this.events[event]
        return listeners ? listeners.length : 0
    }

    // 异步触发
    emitAsync(event, ...args) {
        return new Promise((resolve, reject) => {
            Promise.resolve().then(() => {
                try {
                    this.emit(event, ...args)
                    resolve()
                } catch (error) {
                    reject(error)
                }
            })
        })
    }
}

// 导出单例实例
export const $bus = new EventBus()