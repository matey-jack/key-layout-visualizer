import { defineConfig } from 'vitest/config';
import preact from '@preact/preset-vite'
import { resolve } from 'node:path'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
    return {
        base: '/key-layout-visualizer/',
        plugins: [
            preact(),
            {
                name: 'conditional-sentry',
                transformIndexHtml(html) {
                    if (mode !== 'production') {
                        return html.replace(/<script\b[^>]*src="https:\/\/js-de\.sentry-cdn\.com\/[^>]*><\/script>/gi, '');
                    }
                    return html;
                }
            }
        ],
        build: {
            rollupOptions: {
                input: {
                    main: resolve(__dirname, 'index.html'),
                    other: resolve(__dirname, 'semi-ergo.html'),
                },
            },
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
    };
});
