<template>
  <component :is="iconComponent" :size="size" :class="className" v-bind="$attrs" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import * as Icons from 'lucide-vue-next'

interface Props {
  name: keyof typeof Icons
  size?: number
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  size: 24,
})

const iconComponent = computed(() => {
  return Icons[props.name] || Icons.AlertCircle
})

const className = computed(() => {
  return `w-[${props.size}px] h-[${props.size}px] ${props.class || ''}`
})
</script>
