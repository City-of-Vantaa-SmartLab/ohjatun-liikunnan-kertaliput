import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],
    base: '/app/',
    build: {
        outDir: 'build',
        chunkSizeWarningLimit: 1000
    },
    esbuild: {
        loader: 'jsx',
        include: /src\/.*\.js$/,
        exclude: [],
    },
    optimizeDeps: {
        esbuildOptions: {
            loader: {
                '.js': 'jsx',
            },
        },
    },
    server: {
        host: true,
        port: 3000,
        proxy: {
            '/api': {
                target: 'http://backend:80',
                changeOrigin: true,
            },
        },
    }
});
