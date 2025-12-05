/**
 * 转义正则表达式中的特殊字符。
 *
 * @private
 * @function escapeRegExp
 * @description
 * 将字符串中的正则表达式特殊字符（如 `. * + ? ^ $ { } ( ) | [ ] \\`）全部转义，
 * 以便安全地用于构建正则表达式。通常用于用户输入的关键字过滤，避免因
 * 正则表达式语法导致的匹配异常。
 *
 * @param {string} str - 需要进行转义的原始字符串。
 * @returns {string} 已转义、可安全用于 RegExp 的字符串。
 *
 * @example
 * escapeRegExp("a+b*c") // => "a\\+b\\*c"
 */
function escapeRegExp(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

/**
 * 高亮文本中的关键词。
 *
 * @function highlightKeyword
 * @description
 * 在给定的文本中查找所有匹配的关键词（不区分大小写），并使用带样式的
 * HTML 标签（默认 `<span>`）包裹，使其以高亮方式显示。该方法适用于搜索
 * 结果展示、文本匹配提示等场景。
 *
 * @param {string} text - 原始完整文本。
 * @param {string} keyword - 需要高亮显示的关键词。如果为空，则直接返回原文本。
 * @param {Object} [config] - 配置对象，用于自定义高亮标签和样式。
 * @param {string} [config.tag="span"] - 包裹关键词的 HTML 标签名。
 * @param {string} [config.bgColor="#ff0"] - 高亮背景颜色。
 * @param {string} [config.color="#001"] - 关键词文字颜色。
 *
 * @returns {string} 返回插入带样式标签后的 HTML 字符串。
 *
 * @example
 * highlightKeyword(
 *   "泡泡音乐是一款好用的播放器",
 *   "音乐"
 * )
 * // => '泡泡<span style="background-color: #ff0;color: #001;">音乐</span>是一款好用的播放器'
 */
export function highlightKeyword(
    text,
    keyword,
    config = { tag: "span", bgColor: "#ff0", color: "#001" }
) {
    if (!keyword) return text

    const { tag, bgColor, color } = config
    const pattern = new RegExp(escapeRegExp(keyword), "gi")
    const style = `background-color: ${bgColor};color: ${color};`

    return text.replace(pattern, (match) => `<${tag} style="${style}">${match}</${tag}>`)
}
