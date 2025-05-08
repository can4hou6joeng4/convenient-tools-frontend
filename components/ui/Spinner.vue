<script setup lang="ts">
defineProps<{
  size?: 'sm' | 'md' | 'lg'
  color?: 'primary' | 'white'
}>()
</script>

<template>
  <div
    class="inline-block animate-spin rounded-full border-2 border-solid border-current border-e-transparent align-[-0.125em]"
    :class="{
      'h-4 w-4 border-2': size === 'sm',
      'h-6 w-6 border-2': !size || size === 'md',
      'h-8 w-8 border-3': size === 'lg',
      'text-primary': !color || color === 'primary',
      'text-white': color === 'white',
    }"
    role="status"
  >
    <span class="sr-only">加载中...</span>
  </div>
</template> 