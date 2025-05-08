import { ref } from 'vue'

export interface Toast {
    id: number
    message: string
    type: 'success' | 'error' | 'info' | 'warning'
    timeout?: number
}

const toasts = ref<Toast[]>([])
let id = 0

export function useToast() {
    const add = (toast: Omit<Toast, 'id'>) => {
        const newToast = { ...toast, id: id++ }
        toasts.value.push(newToast)

        if (toast.timeout !== 0) {
            setTimeout(() => {
                remove(newToast.id)
            }, toast.timeout || 3000)
        }

        return newToast.id
    }

    const remove = (id: number) => {
        toasts.value = toasts.value.filter(t => t.id !== id)
    }

    const success = (message: string, timeout?: number) => {
        return add({ message, type: 'success', timeout })
    }

    const error = (message: string, timeout?: number) => {
        return add({ message, type: 'error', timeout })
    }

    const info = (message: string, timeout?: number) => {
        return add({ message, type: 'info', timeout })
    }

    const warning = (message: string, timeout?: number) => {
        return add({ message, type: 'warning', timeout })
    }

    return {
        toasts,
        add,
        remove,
        success,
        error,
        info,
        warning
    }
} 