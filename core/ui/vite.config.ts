import { defineConfig } from 'vite';
import Vue from '@vitejs/plugin-vue';
import VueJsx from '@vitejs/plugin-vue-jsx';
import WindiCSS from 'vite-plugin-windicss';
import Icons from 'unplugin-icons/vite';
import { resolve as pathResolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [Vue(), VueJsx(), WindiCSS(), Icons({ compiler: 'vue3' })],
  resolve: {
    alias: {
      '@': pathResolve(__dirname, '/src'),
    },
  },
  server: {
    proxy: {
      '^/api/.*': 'http://localhost:1323/',
    },
  },
});
