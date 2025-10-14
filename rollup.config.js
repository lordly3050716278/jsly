import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import babel from '@rollup/plugin-babel'
import terser from '@rollup/plugin-terser'

const INPUT = 'src/index.js'
const NAME = 'Jsly' // 浏览器 <script> 引入时的全局变量名

const buildConfig = ({ file, format, minify = false, globalName }) => ({
    input: INPUT,
    output: {
        file,
        format,
        sourcemap: true,
        name: globalName // 只在 UMD/IIFE 下有效
    },
    plugins: [
        resolve(),
        commonjs(),
        babel({ babelHelpers: 'bundled' }),
        minify ? terser() : null
    ].filter(Boolean)
})

export default [
    buildConfig({ file: 'dist/index.esm.js', format: 'esm' }),
    buildConfig({ file: 'dist/index.cjs.js', format: 'cjs' }),
    buildConfig({ file: 'dist/index.umd.js', format: 'umd', minify: true, globalName: NAME })
]