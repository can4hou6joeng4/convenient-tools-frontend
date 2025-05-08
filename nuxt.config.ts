// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    // ... existing config ...

    // 配置模块
    modules: [
        // ... other modules ...
        '@nuxtjs/tailwindcss',
    ],

    // 运行时配置
    runtimeConfig: {
        public: {
            apiBase: process.env.NUXT_PUBLIC_API_BASE || 'https://tools.bobochang.cn',
        }
    },

    // API代理配置，用于解决跨域问题
    nitro: {
        devProxy: {
            '/api': {
                target: 'https://tools.bobochang.cn',
                changeOrigin: true,
            }
        },
        routeRules: {
            '/api/**': {
                proxy: 'https://tools.bobochang.cn/api/**'
            }
        }
    },

    // ... other config ...
}) 