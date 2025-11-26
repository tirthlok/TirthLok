<template>
  <div :class="['space-y-4', containerClass]">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <h3 v-if="title" class="text-lg font-bold text-gray-900">{{ title }}</h3>
      <button
        v-if="showClearButton && hasActiveFilters"
        @click="clearFilters"
        class="text-sm text-red-600 hover:text-red-700 font-semibold"
      >
        Clear All
      </button>
    </div>

    <!-- Filter Items -->
    <div :class="['space-y-3', filtersContainerClass]">
      <div v-for="filter in filters" :key="filter.key" class="space-y-2">
        <!-- Filter Label -->
        <label class="text-sm font-semibold text-gray-700">{{ filter.label }}</label>

        <!-- Checkbox Group -->
        <div v-if="filter.type === 'checkbox'" class="space-y-2">
          <div
            v-for="option in filter.options"
            :key="option.value"
            class="flex items-center gap-2"
          >
            <input
              :id="`filter-${filter.key}-${option.value}`"
              type="checkbox"
              :checked="isOptionSelected(filter.key, option.value)"
              @change="updateFilter(filter.key, option.value, $event)"
              class="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-2 focus:ring-blue-500"
            />
            <label
              :for="`filter-${filter.key}-${option.value}`"
              class="text-sm text-gray-700 cursor-pointer"
            >
              {{ option.label }}
            </label>
          </div>
        </div>

        <!-- Radio Group -->
        <div v-else-if="filter.type === 'radio'" class="space-y-2">
          <div
            v-for="option in filter.options"
            :key="option.value"
            class="flex items-center gap-2"
          >
            <input
              :id="`filter-${filter.key}-${option.value}`"
              type="radio"
              :name="filter.key"
              :value="option.value"
              :checked="getSelectedValue(filter.key) === option.value"
              @change="updateFilter(filter.key, option.value, $event)"
              class="w-4 h-4 text-blue-600 border-gray-300 focus:ring-2 focus:ring-blue-500"
            />
            <label
              :for="`filter-${filter.key}-${option.value}`"
              class="text-sm text-gray-700 cursor-pointer"
            >
              {{ option.label }}
            </label>
          </div>
        </div>

        <!-- Select Dropdown -->
        <div v-else-if="filter.type === 'select'">
          <select
            :value="getSelectedValue(filter.key)"
            @change="updateFilter(filter.key, ($event.target as HTMLSelectElement).value, $event)"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
          >
            <option value="">-- Select --</option>
            <option
              v-for="option in filter.options"
              :key="option.value"
              :value="option.value"
            >
              {{ option.label }}
            </option>
          </select>
        </div>

        <!-- Range Slider -->
        <div v-else-if="filter.type === 'range'" class="space-y-2">
          <div class="flex items-center justify-between text-sm">
            <span>{{ filter.min }}</span>
            <span class="font-semibold">{{ getSelectedValue(filter.key) }}</span>
            <span>{{ filter.max }}</span>
          </div>
          <input
            type="range"
            :min="filter.min"
            :max="filter.max"
            :value="getSelectedValue(filter.key) || filter.min"
            @change="updateFilter(filter.key, ($event.target as HTMLInputElement).value, $event)"
            class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>
      </div>
    </div>

    <!-- Apply Button -->
    <button
      v-if="showApplyButton"
      @click="applyFilters"
      class="w-full px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
    >
      Apply Filters
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

export interface FilterOption {
  value: string | number
  label: string
}

export interface FilterDefinition {
  key: string
  label: string
  type: 'checkbox' | 'radio' | 'select' | 'range'
  options?: FilterOption[]
  min?: number
  max?: number
}

interface Props {
  filters: FilterDefinition[]
  activeFilters: Record<string, any>
  title?: string
  showApplyButton?: boolean
  showClearButton?: boolean
  containerClass?: string
  filtersContainerClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Filters',
  showApplyButton: false,
  showClearButton: true,
  containerClass: '',
  filtersContainerClass: '',
})

const emit = defineEmits<{
  'update-filters': [filters: Record<string, any>]
  'apply-filters': [filters: Record<string, any>]
}>()

const localFilters = ref<Record<string, any>>({ ...props.activeFilters })

const hasActiveFilters = computed(() => {
  return Object.values(localFilters.value).some((v) => v && (!Array.isArray(v) || v.length > 0))
})

const isOptionSelected = (filterKey: string, optionValue: string | number) => {
  const selected = localFilters.value[filterKey]
  if (Array.isArray(selected)) {
    return selected.includes(optionValue)
  }
  return selected === optionValue
}

const getSelectedValue = (filterKey: string) => {
  return localFilters.value[filterKey] || ''
}

const updateFilter = (key: string, value: string | number, event: Event) => {
  const target = event.target as HTMLInputElement | HTMLSelectElement
  const filter = props.filters.find((f) => f.key === key)

  if (filter?.type === 'checkbox') {
    const current = localFilters.value[key] || []
    if (target.checked) {
      localFilters.value[key] = [...current, value]
    } else {
      localFilters.value[key] = current.filter((v: any) => v !== value)
    }
  } else {
    localFilters.value[key] = value
  }

  emit('update-filters', localFilters.value)
}

const applyFilters = () => {
  emit('apply-filters', localFilters.value)
}

const clearFilters = () => {
  localFilters.value = {}
  emit('update-filters', localFilters.value)
}
</script>
