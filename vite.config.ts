import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";
import { nodePolyfills } from "vite-plugin-node-polyfills";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    nodePolyfills({
      // 要 polyfill 的全局变量
      globals: {
        Buffer: true, // 启用 Buffer polyfill
        global: true,
        process: true,
      },
    }),
  ],
  // 关键1：设置为相对路径，适配GitHub Pages的子路径部署
  base: "./",
  build: {
    // 关键2：打包输出到dist文件夹
    outDir: "dist",
    // 关键3：静态资源命名规范，避免特殊字符导致MIME识别错误
    rollupOptions: {
      output: {
        entryFileNames: "assets/[name].js",
        chunkFileNames: "assets/[name].js",
        assetFileNames: "assets/[name].[ext]",
      },
    },
    // 关键4：禁用sourcemap，避免生成多余文件干扰
    sourcemap: false,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  optimizeDeps: {
    include: ["gray-matter"],
  },
  define: {
    global: "globalThis",
  },
  server: {
    port: 3000,
    host: true,
    strictPort: false,
    open: true,
  },
});
