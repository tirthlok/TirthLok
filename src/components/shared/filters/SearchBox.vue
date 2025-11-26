<template>
  <div class="relative">
    <div class="relative">
      <!-- Search Input -->
      <input
        :value="searchQuery"
        @input="handleInput"
        @keydown.enter="handleSearch"
        :placeholder="placeholder"
        type="text"
        :class="[
          'w-full px-4 py-2 pl-10 pr-10 border-2 rounded-lg transition-all focus:outline-none',
          focused ? `border-${focusColor} ring-2 ring-${focusColor}/20` : 'border-gray-300',
        ]"
        @focus="focused = true"
        @blur="focused = false"
      />

      <!-- Search Icon -->
      <div class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
        <Icon name="Search" :size="18" />
      </div>

      <!-- Clear Button -->
      <button
        v-if="searchQuery && showClearButton"
        @click="clearSearch"
        class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
        aria-label="Clear search"
      >
        <Icon name="X" :size="18" />
      </button>

      <!-- Loading Indicator -->
      <div v-if="isLoading" class="absolute right-3 top-1/2 -translate-y-1/2">
        <div class="animate-spin">
          <Icon name="Loader" :size="18" class="text-blue-600" />
        </div>
      </div>
    </div>

    <!-- Search Suggestions/Results -->
    <div
      v-if="showResults && results.length > 0"
      class="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-64 overflow-y-auto"
    >
      <button
        v-for="(result, index) in results"
        :key="result.id || index"
        @click="selectResult(result)"
        class="w-full px-4 py-2 text-left hover:bg-gray-100 transition-colors border-b border-gray-100 last:border-b-0"
      >
        <div class="font-semibold text-gray-900">{{ result.name }}</div>
        <div class="text-sm text-gray-600">{{ result.subtitle }}</div>
      </button>
    </div>

    <!-- No Results Message -->
    <div
      v-if="showResults && searchQuery && results.length === 0 && !isLoading"
      class="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 p-4 text-center text-gray-500"
    >
      No results found for "{{ searchQuery }}"
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import Icon from '~/components/common/Icon.vue'

export interface SearchResult {
  id: string
  name: string
  subtitle?: string
  [key: string]: any
}

interface Props {
  modelValue?: string
  placeholder?: string
  results?: SearchResult[]
  isLoading?: boolean
  focusColor?: string
  showClearButton?: boolean
  showResults?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  placeholder: 'Search...',
  results: () => [],
  isLoading: false,
  focusColor: 'blue-600',
  showClearButton: true,
  showResults: true,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  search: [query: string]
  'select-result': [result: SearchResult]
}>()

const focused = ref(false)

const searchQuery = computed({
  get: () => props.modelValue,
  set: (value: string) => {
    emit('update:modelValue', value)
  },
})

const handleInput = (event: Event) => {
  const value = (event.target as HTMLInputElement).value
  searchQuery.value = value
}

const handleSearch = () => {
  emit('search', searchQuery.value)
}

const clearSearch = () => {
  searchQuery.value = ''
}

const selectResult = (result: SearchResult) => {
  emit('select-result', result)
  searchQuery.value = result.name
}
</script>
