import { defineConfig } from 'vitest/config';
import preact from '@preact/preset-vite'

// https://vite.dev/config/
export default defineConfig({
    base: '/key-layout-visualizer/',
    plugins: [preact()],
    build: {
        outDir: 'dist',
    },
    server: {
        port: 3000,
    },
    test: {
        environment: 'jsdom',
        globals: true,
        setupFiles: './src/test/setup.ts',
        exclude: ['e2e/**', 'node_modules/**']
    }
})
