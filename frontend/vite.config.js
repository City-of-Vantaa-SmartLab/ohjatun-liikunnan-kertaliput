import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/app/',
  build: {
    outDir: 'build',
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://backend',
        changeOrigin: true,
      },
    },
  },
  preview: {
    port: 3000,
  },
});
