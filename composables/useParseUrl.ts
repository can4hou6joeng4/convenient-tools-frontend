import { ref } from 'vue'

export interface Author {
    uid: string
    name: string
    avatar: string
}

export interface ParseResult {
    author: Author
    title: string
    video_url: string
    music_url: string
    cover_url: string
    images: string[]
}

export interface ParseResponse {
    status: 'success' | 'fail'
    message: string
    data: ParseResult
}

export function useParseUrl() {
    const isLoading = ref(false)
    const error = ref<string | null>(null)
    const result = ref<ParseResult | null>(null)

    // 用于取消请求的任务ID
    let requestTask: UniApp.RequestTask | null = null

    const parseUrl = async (url: string) => {
        // 如果有正在进行的请求，取消它
        if (requestTask) {
            requestTask.abort()
            requestTask = null
        }

        isLoading.value = true
        error.value = null
        result.value = null

        return new Promise<ParseResult | null>((resolve) => {
            try {
                // 使用uni.request代替useFetch
                requestTask = uni.request({
                    url: 'https://api.example.com/api/tools/parse', // 替换为实际的API地址
                    method: 'POST',
                    data: { url },
                    timeout: 10000, // 设置10秒超时
                    success: (res) => {
                        const responseData = res.data as ParseResponse

                        if (responseData.status === 'fail') {
                            error.value = responseData.message || '解析失败'
                            resolve(null)
                            return
                        }

                        result.value = responseData.data || null
                        resolve(result.value)
                    },
                    fail: (err) => {
                        // 处理请求失败
                        if (err.errMsg.includes('abort')) {
                            // 请求被取消，不需要显示错误
                        } else {
                            error.value = '请求失败，请检查网络连接'
                        }
                        resolve(null)
                    },
                    complete: () => {
                        requestTask = null
                        isLoading.value = false
                    }
                })
            } catch (err: any) {
                error.value = err.message || '发生未知错误'
                isLoading.value = false
                resolve(null)
            }
        })
    }

    return {
        isLoading,
        error,
        result,
        parseUrl
    }
} 