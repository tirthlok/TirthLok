<template>
  <button
    :type="type"
    :disabled="disabled"
    :class="[
      'font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed',
      sizeClasses,
      variantClasses,
    ]"
    v-bind="$attrs"
  >
    <div class="flex items-center justify-center gap-2">
      <Icon v-if="icon" :name="icon" :size="iconSize" />
      <span><slot /></span>
    </div>
  </button>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    type?: 'button' | 'submit' | 'reset'
    variant?: 'primary' | 'secondary' | 'ghost'
    size?: 'sm' | 'md' | 'lg'
    disabled?: boolean
    icon?: string
    iconSize?: number
  }>(),
  {
    type: 'button',
    variant: 'primary',
    size: 'md',
    disabled: false,
    iconSize: 16,
  }
)

const sizeClasses = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'px-3 py-1 text-sm'
    case 'lg':
      return 'px-6 py-3 text-lg'
    case 'md':
    default:
      return 'px-4 py-2 text-sm'
  }
})

const variantClasses = computed(() => {
  switch (props.variant) {
    case 'primary':
      return 'bg-red-500 text-white hover:bg-red-600 rounded-lg'
    case 'secondary':
      return 'bg-gray-100 text-gray-900 hover:bg-gray-200 rounded-lg'
    case 'ghost':
      return 'text-gray-700 hover:bg-gray-100 rounded-lg'
    default:
      return 'bg-red-500 text-white hover:bg-red-600 rounded-lg'
  }
})
</script>
