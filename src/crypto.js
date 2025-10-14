import CryptoJS from 'crypto-js'
import { v1, v3, v4, v5 } from 'uuid'

/**
 * 使用 SHA-256 算法对字符串进行哈希加密。
 *
 * SHA-256（Secure Hash Algorithm 256-bit）是一种单向哈希算法，
 * 常用于数据完整性校验、签名验证等场景。
 *
 * @param {string} message - 需要加密的明文字符串。
 * @returns {string} 返回加密后的 16 进制（Hex）字符串。
 *
 * @example
 * const hash = sha256('hello world')
 * console.log(hash)
 * // 输出: b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9
 *
 * @example
 * const passwordHash = sha256('mypassword123')
 * console.log(passwordHash)
 */
export function sha256(message) {
    if (typeof message !== 'string') {
        throw new TypeError('sha256 expected a string as the first argument')
    }
    return CryptoJS.SHA256(message).toString(CryptoJS.enc.Hex)
}

/**
 * 生成一个唯一的、经过 SHA-256 加密的 UUID 哈希字符串。
 *
 * 默认使用 UUID v1（基于时间戳与节点信息），
 * 也可通过参数指定使用其他版本（如 v4 基于随机数）。
 *
 * @param {'v1' | 'v3' | 'v4' | 'v5'} [version='v1'] - 指定要使用的 UUID 版本，默认 'v1'。
 * @returns {string} 返回生成的 SHA-256 哈希值，格式为 64 位的十六进制字符串。
 *
 * @example
 * // 默认使用 UUID v1
 * const hash1 = randomHash()
 * console.log(hash1)
 * // 输出：64位十六进制哈希
 *
 * @example
 * // 使用 UUID v4（随机数版本）
 * const hash2 = randomHash('v4')
 * console.log(hash2)
 */
export function randomHash(version = 'v1') {
    let uuidStr

    switch (version) {
        case 'v1':
            uuidStr = v1()
            break
        case 'v3':
            // v3 / v5 需要命名空间和名称，可以根据实际业务调整
            uuidStr = v3('default', v3.DNS)
            break
        case 'v4':
            uuidStr = v4()
            break
        case 'v5':
            uuidStr = v5('default', v5.DNS)
            break
        default:
            throw new Error(`Invalid UUID version: ${version}. Expected one of 'v1', 'v3', 'v4', 'v5'.`)
    }

    return sha256(uuidStr)
}
