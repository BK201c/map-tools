import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig({
  // 本地服务配置
  server: {
    host: "localhost",
    port: 3030,
    proxy: {
      "/api": {
        target: "http://jsonplaceholder.typicode.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },

  // 插件
  plugins: [vue()],

  //别名
  resolve: {
    alias: [
      {
        find: "@",
        replacement: resolve(__dirname, "src"),
      },
    ],
  },

  // 强制预构建插件包
  optimizeDeps: {
    include: ["axios"],
  },

  // 打包配置
  build: {
    target: "modules",
    outDir: "dist", //指定输出路径
    assetsDir: "assets", // 指定生成静态资源的存放路径
    minify: "terser", // 混淆器，terser构建后文件体积更小
  },
});
