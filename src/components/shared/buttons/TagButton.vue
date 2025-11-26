<template>
  <button
    :class="[
      'px-3 py-1 rounded-full text-xs font-semibold transition-all duration-200 flex items-center gap-1',
      isSelected ? selectedClass : defaultClass,
      'hover:shadow-md active:scale-95',
    ]"
    @click="$emit('toggle', tag)"
    :aria-pressed="isSelected"
  >
    <Icon v-if="icon" :name="(icon as any)" :size="14" />
    <span>{{ label }}</span>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Icon from '~/components/common/Icon.vue'

interface Props {
  tag: string
  label: string
  icon?: string
  isSelected?: boolean
  selectedClass?: string
  defaultClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  icon: undefined,
  isSelected: false,
  selectedClass: 'bg-blue-600 text-white',
  defaultClass: 'bg-gray-200 text-gray-900 hover:bg-gray-300',
})

defineEmits<{
  toggle: [tag: string]
}>()
</script>
