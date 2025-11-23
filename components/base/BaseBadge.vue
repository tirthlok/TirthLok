<template>
  <div :class="['inline-block px-3 py-1 rounded-full text-xs font-semibold', variantClasses]">
    <slot />
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger'
  }>(),
  {
    variant: 'primary',
  }
)

const variantClasses = computed(() => {
  switch (props.variant) {
    case 'primary':
      return 'bg-red-100 text-red-800'
    case 'secondary':
      return 'bg-gray-100 text-gray-800'
    case 'success':
      return 'bg-green-100 text-green-800'
    case 'warning':
      return 'bg-yellow-100 text-yellow-800'
    case 'danger':
      return 'bg-red-50 text-red-700'
    default:
      return 'bg-red-100 text-red-800'
  }
})
</script>
