import { v1 } from 'uuid'
import { sha256 } from '../sha256'

/**
 * 生成一个唯一的经过sha-256加密后的UUID-v1
 * 
 * @returns { string } 返回生成的 SHA-256 哈希值，格式为 64 位的十六进制字符串。 
 */
export function randomHash() {
    return sha256(v1())
}