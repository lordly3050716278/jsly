import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
    build: {
        outDir: resolve(__dirname, 'dist'),
        lib: {
            entry: resolve(__dirname, 'src/index.js'),
            name: 'jsly',
            formats: ['umd', 'cjs', 'es'],
            fileName: format => {
                if (format === 'umd') return 'index.umd.js'
                if (format === 'cjs') return 'index.cjs'
                return 'index.js'
            }
        }
    }
})