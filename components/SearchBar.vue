<template>
  <div class="w-full bg-white border-b border-gray-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <!-- Airbnb-style Search Bar -->
      <div class="relative">
        <div class="flex items-center gap-3 bg-white border border-gray-300 rounded-full px-4 py-2.5 shadow-sm hover:shadow-lg transition-all">
          <Icon name="Search" :size="18" class="text-gray-600 flex-shrink-0" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search temples, cities..."
            class="flex-1 bg-transparent text-gray-900 placeholder-gray-500 outline-none text-sm"
            @input="handleSearch"
            @focus="showSuggestions = true"
            @blur="setTimeout(() => (showSuggestions = false), 200)"
          />
          <Icon name="Sliders" :size="18" class="text-gray-600 flex-shrink-0 cursor-pointer hover:text-gray-900" />
        </div>

        <!-- Search Suggestions Dropdown -->
        <div
          v-if="showSuggestions && filteredSuggestions.length > 0"
          class="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 z-10 animate-slide-up"
        >
          <div class="max-h-96 overflow-y-auto">
            <!-- Recent Searches -->
            <div v-if="!searchQuery && recentSearches.length > 0" class="border-b border-gray-200">
              <div class="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Recent
              </div>
              <button
                v-for="search in recentSearches"
                :key="search"
                @click="selectSuggestion(search)"
                class="w-full text-left px-4 py-2.5 hover:bg-gray-50 transition-colors flex items-center gap-2"
              >
                <Icon name="Clock" :size="16" class="text-gray-400" />
                <span class="text-sm text-gray-900">{{ search }}</span>
              </button>
            </div>

            <!-- Suggestions -->
            <div>
              <div v-if="searchQuery" class="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Results
              </div>
              <button
                v-for="suggestion in filteredSuggestions"
                :key="suggestion"
                @click="selectSuggestion(suggestion)"
                class="w-full text-left px-4 py-2.5 hover:bg-gray-50 transition-colors flex items-center gap-2"
              >
                <Icon name="MapPin" :size="16" class="text-red-500" />
                <span class="text-sm text-gray-900">{{ suggestion }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Filters - Airbnb Style -->
      <div class="mt-4 flex items-center gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
        <button
          v-for="filter in quickFilters"
          :key="filter.id"
          @click="applyQuickFilter(filter.id)"
          :class="[
            'px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all border',
            activeFilter === filter.id
              ? 'border-gray-900 text-gray-900 bg-white'
              : 'border-gray-300 text-gray-700 hover:border-gray-900'
          ]"
        >
          <span class="flex items-center gap-1.5">
            <Icon :name="filter.icon" :size="16" />
            {{ filter.label }}
          </span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const searchQuery = ref('')
const showSuggestions = ref(false)
const activeFilter = ref<string | null>(null)
const recentSearches = ref(['Palitana', 'Ranakpur', 'Hastinapur'])

const suggestions = [
  'Palitana',
  'Ranakpur',
  'Hastinapur',
  'Indore',
  'Ujjain',
  'Mathura',
  'Gaya',
  'Shirpur',
]

const quickFilters = [
  { id: 'all', label: 'All Tirths', icon: 'MapPin' },
  { id: 'visited', label: 'Visited', icon: 'CheckCircle' },
  { id: 'wishlist', label: 'Wishlist', icon: 'Heart' },
  { id: 'festivals', label: 'Festivals', icon: 'Calendar' },
  { id: 'facilities', label: 'Facilities', icon: 'Home' },
]

const filteredSuggestions = computed(() => {
  if (!searchQuery.value) return []
  return suggestions.filter(s =>
    s.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

const handleSearch = () => {
  // Emit search event
  emit('search', searchQuery.value)
}

const selectSuggestion = (suggestion: string) => {
  searchQuery.value = suggestion
  showSuggestions.value = false
  if (!recentSearches.value.includes(suggestion)) {
    recentSearches.value.unshift(suggestion)
    if (recentSearches.value.length > 5) {
      recentSearches.value.pop()
    }
  }
  emit('search', suggestion)
}

const clearSearch = () => {
  searchQuery.value = ''
  emit('search', '')
}

const applyQuickFilter = (filterId: string) => {
  activeFilter.value = activeFilter.value === filterId ? null : filterId
  emit('filter', filterId)
}

const emit = defineEmits<{
  search: [query: string]
  filter: [filterId: string]
}>()
</script>
