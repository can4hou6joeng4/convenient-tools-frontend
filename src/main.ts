import { createSSRApp } from "vue";
import App from "./App.vue";

export function createApp() {
  const app = createSSRApp(App);

  // 全局错误处理
  app.config.errorHandler = (err, vm, info) => {
    console.error('全局错误:', err);
    console.error('错误信息:', info);
  };

  return {
    app
  };
}
