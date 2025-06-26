import {defineConfig} from 'vite'
import preact from '@preact/preset-vite'

// https://vite.dev/config/
export default defineConfig({
    base: '/key-layout-visualizer/',
    plugins: [preact()],
    build: {
        // because Github pages only takes it from here
        outDir: 'docs',
    },
    server: {
        port: 3000,
    },
    // TODO: does this actually exist? does it belong somewhere else?
    // test: {
    //     environment: 'jsdom',
    //     globals: true,
    //     setupFiles: './src/test/setup.ts'
    // }
})
