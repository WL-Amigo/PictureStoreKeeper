import { defineConfig } from 'vite';
import Vue from '@vitejs/plugin-vue';
import VueJsx from '@vitejs/plugin-vue-jsx';
import WindiCSS from 'vite-plugin-windicss';
import Icons from 'unplugin-icons/vite';
import { resolve as pathResolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  root: "./frontend",
  plugins: [Vue(), VueJsx(), WindiCSS({config: "../windi.config.ts"}), Icons({ compiler: 'vue3' })],
  resolve: {
    alias: {
      '@': pathResolve('./node_modules/core-ui/src'),
    },
  },
  server: {
    proxy: {
      '^/api/.*': 'http://localhost:1323/',
    },
  },
});
