import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve as pathResolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  alias: {
    '@': pathResolve(__dirname, '/src'),
  },
  server: {
    proxy: {
      '^/api/.*': 'http://localhost:1323/',
    },
  },
});
