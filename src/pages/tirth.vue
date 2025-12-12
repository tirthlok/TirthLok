<template>
    <router-view v-if="hasId" />
    <div v-else :class="[
      'min-h-screen py-4 sm:py-8 md:py-12',
      themeStore?.isDarkMode ? 'dark bg-gray-950' : 'bg-white'
    ]">
      <div class="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
       <div class="flex items-center gap-2 text-sm text-gray-500">
          <NuxtLink to="/" class="hover:text-gray-900 transition-colors">Home</NuxtLink>
          <Icon name="ChevronRight" :size="14" />
          <NuxtLink to="/tirth" class="hover:text-gray-900 transition-colors">Tirth</NuxtLink>
       </div>
      <div class="mb-8">
        <h1 :class="[
          'text-3xl sm:text-4xl md:text-5xl font-bold mb-2',
          themeStore?.isDarkMode ? 'text-white' : 'text-gray-900'
        ]">All Tirth Locations</h1>
        <p :class="[
          'text-base md:text-lg',
          themeStore?.isDarkMode ? 'text-gray-300' : 'text-gray-600'
        ]">Explore sacred Jain pilgrimage sites</p>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center py-20">
        <div class="animate-spin rounded-full h-12 w-12 border-4 border-red-500 border-t-transparent"></div>
      </div>

      <!-- Error State -->
      <div v-if="error && !loading" :class="[
        'mb-6 p-4 sm:p-6 border-l-4 rounded-lg',
        themeStore?.isDarkMode 
          ? 'bg-red-900/20 border-red-500 text-red-300' 
          : 'bg-red-50 border-red-500 text-red-700'
      ]">
        <p class="text-sm md:text-base font-semibold">Error loading tirths</p>
        <p :class="[
          'text-xs md:text-sm mt-1',
          themeStore?.isDarkMode ? 'text-red-400' : 'text-red-600'
        ]">{{ error }}</p>
      </div>

      <!-- Tirth Cards Grid - Using BaseCard -->
      <div v-if="!loading && displayedTirths.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-max" style="grid-auto-rows: 1fr;">
        <BaseCard
          v-for="tirth in displayedTirths"
          :key="tirth.id"
          :item="tirth"
          card-type="tirth"
          :show-wishlist="true"
          :show-details="true"
          route-prefix="/tirth"
          :tag-fields="[tirth.sect, tirth.type]"
        />
      </div>

      <!-- Empty State -->
      <div v-if="!loading && displayedTirths.length === 0" class="text-center py-8 md:py-12">
        <Icon name="MapPin" :size="48" class="mx-auto mb-4 text-gray-400 dark:text-gray-600" />
        <h3 :class="[
          'text-lg sm:text-xl md:text-2xl font-semibold mb-2',
          themeStore?.isDarkMode ? 'text-white' : 'text-gray-900'
        ]">No Tirths Found</h3>
        <p :class="[
          'text-sm md:text-base mb-6',
          themeStore?.isDarkMode ? 'text-gray-400' : 'text-gray-600'
        ]">Try adjusting your search or filter criteria</p>
      </div>

      <!-- Pagination Controls -->
      <div v-if="!loading && displayedTirths.length > 0 && pagination.pages > 1" class="mt-8 flex items-center justify-center gap-4">
        <button
          @click="previousPage"
          :disabled="currentPage <= 1"
          :class="[
            'px-4 py-2 rounded-lg font-medium transition-all',
            currentPage <= 1
              ? (themeStore?.isDarkMode ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-gray-200 text-gray-400 cursor-not-allowed')
              : (themeStore?.isDarkMode ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-red-500 hover:bg-red-600 text-white')
          ]"
        >
          ← Previous
        </button>

        <div :class="[
          'text-sm font-medium',
          themeStore?.isDarkMode ? 'text-gray-300' : 'text-gray-600'
        ]">
          Page {{ currentPage }} of {{ pagination.pages }}
        </div>

        <button
          @click="nextPage"
          :disabled="currentPage >= pagination.pages"
          :class="[
            'px-4 py-2 rounded-lg font-medium transition-all',
            currentPage >= pagination.pages
              ? (themeStore?.isDarkMode ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-gray-200 text-gray-400 cursor-not-allowed')
              : (themeStore?.isDarkMode ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-red-500 hover:bg-red-600 text-white')
          ]"
        >
          Next →
        </button>
      </div>

      <!-- Results Info -->
      <div v-if="!loading && displayedTirths.length > 0" :class="[
        'mt-8 text-center text-sm',
        themeStore?.isDarkMode ? 'text-gray-400' : 'text-gray-600'
      ]">
        Showing {{ displayedTirths.length }} of {{ pagination.total }} tirth locations
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, onMounted } from 'vue'
import { useThemeStore } from '~/stores/theme'
import { useTirthStore } from '~/stores/tirth'
import { BaseCard, Icon } from '~/components/shared'
import type { Tirth } from '~/types/models'

definePageMeta({
  layout: 'default'
})

const themeStore = useThemeStore()
const tirthStore = useTirthStore()
const route = useRoute()
const hasId = computed(() => !!(route && route.params && route.params.id))

const currentPage = ref(1)



// Server-side data fetching using useAsyncData with proper key handling
const { data: tirthData, pending: loading, error: fetchError } = await useAsyncData(
  () => `tirth-list-page-${currentPage.value}`,
  () => $fetch<{ success: boolean; data: Tirth[]; pagination: { total: number; page: number; pages: number } }>('/api/tirth', {
    query: {
      page: currentPage.value,
      limit: 10
    }
  }),
  {
    watch: [currentPage],
  }
)

const allTirths = computed(() => (tirthData.value?.data || []) as Tirth[])
const pagination = computed(() => tirthData.value?.pagination || { total: 0, page: 1, pages: 1 })
const error = computed(() => {
  if (!fetchError.value) return null
  return typeof fetchError.value === 'string' ? fetchError.value : fetchError.value.message || 'Error loading data'
})

// Sync API data to store for filtering
watch(allTirths, (newTirths) => {
  if (newTirths.length > 0) {
    tirthStore.tirths = newTirths
    tirthStore.filteredTirths = newTirths
  }
}, { deep: true, immediate: true })

// Initialize filter options on mount
onMounted(async () => {
  await tirthStore.fetchFilterOptions()
})

// Display filtered or all tirths
const displayedTirths = computed(() => {
  // Check if any filters are actually set (not just empty values)
  const hasActiveFilters = tirthStore.currentFilters && (
    (tirthStore.currentFilters.searchTerm && tirthStore.currentFilters.searchTerm.trim()) ||
    tirthStore.currentFilters.state ||
    tirthStore.currentFilters.sect ||
    tirthStore.currentFilters.type ||
    (tirthStore.currentFilters.amenities && tirthStore.currentFilters.amenities.length > 0)
  )
  
  // If filters are active, show filtered results
  if (hasActiveFilters) {
    return tirthStore.filteredTirths.length > 0 ? tirthStore.filteredTirths : []
  }
  
  // Otherwise show paginated results
  return allTirths.value
})

// Pagination methods
const nextPage = () => {
  if (currentPage.value < pagination.value.pages) {
    currentPage.value++
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}
</script>
