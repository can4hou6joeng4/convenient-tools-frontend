<script setup lang="ts">
import { useToast, type Toast } from '~/composables/useToast'

const { toasts, remove } = useToast()

const getIcon = (type: Toast['type']) => {
  switch (type) {
    case 'success':
      return 'i-heroicons-check-circle'
    case 'error':
      return 'i-heroicons-x-circle'
    case 'warning':
      return 'i-heroicons-exclamation-triangle'
    case 'info':
      return 'i-heroicons-information-circle'
    default:
      return 'i-heroicons-information-circle'
  }
}

const getColor = (type: Toast['type']) => {
  switch (type) {
    case 'success':
      return 'bg-green-50 text-green-500 border-green-200'
    case 'error':
      return 'bg-red-50 text-red-500 border-red-200'
    case 'warning':
      return 'bg-yellow-50 text-yellow-500 border-yellow-200'
    case 'info':
      return 'bg-blue-50 text-blue-500 border-blue-200'
    default:
      return 'bg-gray-50 text-gray-500 border-gray-200'
  }
}
</script>

<template>
  <div class="fixed top-4 right-4 z-50 flex flex-col gap-2 w-72">
    <transition-group name="toast">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        :class="['px-4 py-3 rounded-lg shadow-md border flex items-start gap-2', getColor(toast.type)]"
      >
        <div :class="[getIcon(toast.type), 'text-lg flex-shrink-0 mt-0.5']"></div>
        <div class="flex-1">{{ toast.message }}</div>
        <button
          @click="remove(toast.id)"
          class="text-sm opacity-70 hover:opacity-100 flex-shrink-0"
          aria-label="关闭"
        >
          <div class="i-heroicons-x-mark"></div>
        </button>
      </div>
    </transition-group>
  </div>
</template>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.toast-leave-to {
  transform: translateX(100%);
  opacity: 0;
}
</style> 