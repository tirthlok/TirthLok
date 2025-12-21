<template>
  <div :class="['space-y-3', containerClass]">
    <!-- Section Title -->
    <h3 v-if="title" class="text-lg font-bold text-gray-900">{{ title }}</h3>

    <!-- Grid Container -->
    <div :class="['grid gap-4', getGridColsClass()]">
      <!-- Item Slot -->
      <div v-for="(item, index) in items" :key="item.id || item.name || index" class="p-3 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
        <!-- Use Custom Slot if Provided -->
        <slot v-if="$slots.default" :item="item" :index="index" />

        <!-- Default Template -->
        <template v-else>
          <div class="flex items-start gap-3">
            <!-- Icon -->
            <div v-if="item.icon" :class="['flex-shrink-0 p-2 rounded-lg', itemIconBg]">
              <Icon :name="item.icon" :size="20" :class="itemIconColor" />
            </div>

            <!-- Content -->
            <div class="flex-1 min-w-0">
              <h4 class="font-semibold text-gray-900 text-sm">{{ item.name || item.title }}</h4>
              <p v-if="item.description || item.subtitle" class="text-xs text-gray-600 mt-1 line-clamp-2">
                {{ item.description || item.subtitle }}
              </p>

              <!-- Tags -->
              <div v-if="item.tags && item.tags.length > 0" class="flex flex-wrap gap-1 mt-2">
                <span v-for="tag in item.tags" :key="tag" class="inline-block px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs">
                  {{ tag }}
                </span>
              </div>

              <!-- Badge -->
              <span v-if="item.badge" :class="['inline-block mt-2 px-2 py-0.5 rounded text-xs font-semibold', itemBadgeClass]">
                {{ item.badge }}
              </span>
            </div>
          </div>
        </template>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="items.length === 0" class="text-center py-8 text-gray-500">
      <p>{{ emptyMessage }}</p>
    </div>

    <!-- Footer Slot -->
    <slot v-if="$slots.footer" name="footer" />
  </div>
</template>

<script setup lang="ts">
import Icon from './Icon.vue'

export type GridColumns = 1 | 2 | 3 | 4

export interface FacilityItem {
  id?: string
  name?: string
  title?: string
  description?: string
  subtitle?: string
  icon?: string
  tags?: string[]
  badge?: string
  [key: string]: any
}

interface Props {
  title?: string
  items: FacilityItem[]
  columns?: GridColumns
  itemIconColor?: string
  itemIconBg?: string
  itemBadgeClass?: string
  emptyMessage?: string
  containerClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  title: undefined,
  columns: 2,
  itemIconColor: 'text-blue-600',
  itemIconBg: 'bg-blue-100',
  itemBadgeClass: 'bg-green-100 text-green-700',
  emptyMessage: 'No items found',
  containerClass: '',
})

const getGridColsClass = () => {
  const colsMap = {
    1: 'grid-cols-1',
    2: 'sm:grid-cols-2',
    3: 'sm:grid-cols-2 md:grid-cols-3',
    4: 'sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
  }
  return colsMap[props.columns]
}
</script>
