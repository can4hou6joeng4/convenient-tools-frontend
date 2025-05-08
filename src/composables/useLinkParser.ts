import { ref } from 'vue';

export interface Author {
    uid: string;
    name: string;
    avatar: string;
}

export interface ParseResult {
    author: Author;
    title: string;
    video_url: string;
    music_url: string;
    cover_url: string;
    images: string[];
}

export interface ApiResponse {
    status: 'success' | 'fail';
    message: string;
    data: ParseResult;
}

export function useLinkParser() {
    const isLoading = ref(false);
    const error = ref<string | null>(null);
    const result = ref<ParseResult | null>(null);

    // 格式化解析结果为页面需要的格式
    const formatResult = (apiResult: ParseResult) => {
        // 构建页面需要的数据结构
        const pageResult = {
            title: apiResult.title || '',
            content: [apiResult.title || ''],
            authorAvatar: apiResult.author?.avatar || '',
            authorName: apiResult.author?.name || '',
            authorUid: apiResult.author?.uid || '',
            images: [] as { url: string; selected: boolean }[],
            videos: [] as { url: string; title: string; cover: string }[]
        };

        // 处理图片
        if (apiResult.images && apiResult.images.length > 0) {
            pageResult.images = apiResult.images.map(url => ({
                url,
                selected: false
            }));
        }

        // 处理视频
        if (apiResult.video_url) {
            pageResult.videos.push({
                url: apiResult.video_url,
                title: apiResult.title || '',
                cover: apiResult.cover_url || ''
            });
        }

        return pageResult;
    };

    const parseLink = async (url: string) => {
        isLoading.value = true;
        error.value = null;
        result.value = null;

        try {
            return await new Promise((resolve, reject) => {
                // 根据环境选择请求URL
                let apiUrl = '/api/tools/parse';

                // 检测是否在小程序环境
                // #ifdef MP-WEIXIN
                const baseUrl = 'https://tools.bobochang.cn';
                apiUrl = baseUrl + '/api/tools/parse';
                console.log('小程序环境使用完整URL');
                // #endif

                uni.request({
                    url: apiUrl,
                    method: 'POST',
                    data: { url },
                    header: {
                        'content-type': 'application/json'
                    },
                    timeout: 10000, // 10秒超时
                    withCredentials: false,
                    success: (res) => {
                        if (res.statusCode !== 200) {
                            reject(new Error('服务器响应异常: ' + res.statusCode));
                            return;
                        }

                        const data = res.data as ApiResponse;

                        if (data.status === 'fail') {
                            reject(new Error(data.message || '解析失败'));
                            return;
                        }

                        // 格式化结果为页面需要的格式
                        const formattedResult = formatResult(data.data);
                        result.value = formattedResult;
                        resolve(formattedResult);
                    },
                    fail: (err) => {
                        console.error('请求失败详情:', err);
                        reject(new Error('网络请求失败'));
                    },
                    complete: () => {
                        isLoading.value = false;
                    }
                });
            });
        } catch (err: any) {
            // 直接显示toast，不保存错误状态
            let errorMessage = '解析失败，请稍后再试';
            if (err.message) {
                if (err.message.includes('服务器响应异常')) {
                    errorMessage = '服务器暂时无法响应，请稍后再试';
                } else if (err.message.includes('网络请求失败')) {
                    errorMessage = '网络连接失败，请检查网络设置';
                }
            }

            // 在小程序环境中显示toast
            // #ifdef MP
            uni.showToast({
                title: errorMessage,
                icon: 'none',
                duration: 3000
            });
            // #endif

            console.error('链接解析错误:', err);
            return null;
        }
    };

    return {
        isLoading,
        error,
        result,
        parseLink
    };
} 