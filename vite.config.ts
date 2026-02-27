import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(),
  nodePolyfills({
    // 要 polyfill 的全局变量
    globals: {
      Buffer: true, // 启用 Buffer polyfill
      global: true,
      process: true,
    },
  })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  optimizeDeps: {
    include: ['gray-matter']
  },
  define: {
    global: 'globalThis'
  },
  server:{
    port:3000,
    host:true,
    strictPort:false,
    open:true
  }
})
