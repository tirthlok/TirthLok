<template>
  <div :class="['space-y-3', containerClass]">
    <!-- Section Title -->
    <h3 v-if="title" class="text-lg font-bold text-gray-900">{{ title }}</h3>

    <!-- Items Container -->
    <div :class="getLayoutClass()">
      <!-- List Layout -->
      <div
        v-for="item in items"
        :key="item.key || item.label"
        :class="['flex items-start gap-3', itemClass]"
      >
        <!-- Icon -->
        <Icon
          v-if="item.icon"
          :name="item.icon"
          :size="18"
          :class="['flex-shrink-0 mt-0.5', iconColor]"
        />

        <!-- Content -->
        <div class="flex-1">
          <label v-if="item.label" class="text-sm font-semibold text-gray-700">{{ item.label }}</label>
          <p :class="['text-sm', item.label ? 'text-gray-600 mt-1' : 'text-gray-700']">
            {{ item.value }}
          </p>
        </div>
      </div>
    </div>

    <!-- Footer Slot -->
    <slot v-if="$slots.footer" name="footer" />
  </div>
</template>

<script setup lang="ts">
import Icon from './Icon.vue'

export type InfoLayout = 'list' | 'grid' | 'compact'

export interface InfoItem {
  key?: string
  label: string
  value: string
  icon?: string
}

interface Props {
  title?: string
  items: InfoItem[]
  layout?: InfoLayout
  iconColor?: string
  containerClass?: string
  itemClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  title: undefined,
  layout: 'list',
  iconColor: 'text-gray-600',
  containerClass: '',
  itemClass: '',
})

const getLayoutClass = () => {
  switch (props.layout) {
    case 'grid':
      return 'grid grid-cols-2 gap-4'
    case 'compact':
      return 'flex flex-wrap gap-2'
    case 'list':
    default:
      return 'space-y-3'
  }
}
</script>
