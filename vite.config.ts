import { defineConfig } from "vite";
import uni from "@dcloudio/vite-plugin-uni";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [uni()],
  server: {
    proxy: {
      '/api': {
        target: 'https://tools.bobochang.cn',
        changeOrigin: true,
        rewrite: (path) => path
      }
    }
  }
});
