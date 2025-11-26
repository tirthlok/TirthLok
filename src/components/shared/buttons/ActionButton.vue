<template>
  <button
    :class="[
      'px-4 py-2 rounded-lg font-semibold transition-all duration-200 flex items-center gap-2',
      'hover:shadow-lg active:scale-95',
      getButtonClass(),
    ]"
    :disabled="disabled"
    :aria-label="label"
    v-bind="$attrs"
  >
    <Icon v-if="icon" :name="(icon as any)" :size="iconSize" />
    <span>{{ label }}</span>
  </button>
</template>

<script setup lang="ts">
import Icon from '~/components/common/Icon.vue'

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'danger' | 'success'
export type ButtonSize = 'sm' | 'md' | 'lg'

interface Props {
  label: string
  icon?: string
  iconSize?: number
  variant?: ButtonVariant
  size?: ButtonSize
  disabled?: boolean
  fullWidth?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  icon: undefined,
  iconSize: 18,
  variant: 'primary',
  size: 'md',
  disabled: false,
  fullWidth: false,
})

const getButtonClass = () => {
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-400',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 disabled:bg-gray-300',
    outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50 disabled:opacity-50',
    danger: 'bg-red-600 text-white hover:bg-red-700 disabled:bg-gray-400',
    success: 'bg-green-600 text-white hover:bg-green-700 disabled:bg-gray-400',
  }

  const sizes = {
    sm: 'px-3 py-1 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  }

  const width = props.fullWidth ? 'w-full' : ''

  return `${variants[props.variant]} ${sizes[props.size]} ${width}`
}
</script>
