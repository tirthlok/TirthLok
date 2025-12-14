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
      <div class="my-2">
          <h2 :class="[
            'text-2xl md:text-3xl font-bold',
            themeStore?.isDarkMode ? 'text-white' : 'text-gray-900'
          ]">Tirth</h2>
          <p :class="[
            'text-base',
            themeStore?.isDarkMode ? 'text-gray-400' : 'text-gray-600'
          ]">
            Browse all {{ allTirths.length }} tirths.
          </p>
        </div>
      <div v-if="loading" class="flex justify-center items-center py-20">
        <div class="animate-spin rounded-full h-12 w-12 border-4 border-red-500 border-t-transparent"></div>
      </div>

      <!-- Sticky Filter Bar -->
      <div :class="[
        'sticky top-[84px] z-40 backdrop-blur-sm border-b mb-6 py-3 px-4 md:px-6 transition-all duration-300 -mx-4 sm:-mx-6 lg:-mx-8',
        themeStore?.isDarkMode 
          ? 'bg-gray-950/95 border-gray-800' 
          : 'bg-white/95 border-gray-100'
      ]">
        <div class="max-w-[1920px] mx-auto">
          <div class="flex items-center gap-3 overflow-x-auto no-scrollbar">
            <button
              v-for="filter in filterOptions"
              :key="filter.id"
              @click="selectedGrouping = filter.id"
              :class="[
                'flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap border',
                selectedGrouping === filter.id
                  ? 'bg-blue-500 text-white border-blue-500 shadow-md'
                  : (themeStore?.isDarkMode 
                    ? 'bg-gray-700 text-gray-300 border-gray-600 hover:border-gray-500 hover:bg-gray-600' 
                    : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50')
              ]"
            >
              <Icon :name="getFilterIcon(filter.id)" :size="16" />
              <span>{{ filter.label }}</span>
            </button>
            <!-- Filter Panel Button -->
            <button
              @click="showAdvancedFilters = true"
              :class="[
                'flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap border ml-auto',
                hasActiveFilters
                  ? 'bg-red-500 text-white border-red-500 shadow-md'
                  : (themeStore?.isDarkMode 
                    ? 'bg-gray-700 text-gray-300 border-gray-600 hover:border-gray-500 hover:bg-gray-600' 
                    : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50')
              ]"
            >
              <Icon name="Sliders" :size="16" />
              <span>Advanced</span>
              <span v-if="hasActiveFilters" class="ml-2 inline-flex items-center justify-center w-5 h-5 text-xs font-bold bg-white text-red-500 rounded-full">{{ activeFilterCount }}</span>
            </button>
          </div>
        </div>
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

      <!-- Tirth Cards Grid -->
      <div class="flex flex-wrap pb-4 min-w-min">
        <div
            v-for="tirth in tirthStore.filteredTirths"
            :key="tirth.id"
            class="flex-shrink-0 m-4 snap-start w-[280px] transition-transform hover:-translate-y-2 duration-300 group relative"
          >
            <!-- New badge with animation -->
            <div v-if="tirth.tirth_tags && tirth.tirth_tags.length > 0" class="absolute -top-3 -right-3 z-10">
              <span class="inline-block bg-gradient-to-r from-accent to-pink-400 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg border border-white/20">✨ {{ tirth.tirth_tags[0] }}</span>
            </div>
            <BaseCard
              :item="tirth"
              card-type="tirth"
              :show-wishlist="true"
              :show-details="false"
              variant="featured"
              :image-height="'h-72'"
              route-prefix="/tirth"
              :tag-fields="[tirth.sect, tirth.type]"
            />
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="!loading && tirthStore.filteredTirths.length === 0" :class="[
        'text-center py-12',
        themeStore?.isDarkMode ? 'text-gray-400' : 'text-gray-600'
      ]">
        <Icon name="MapPin" :size="48" :class="themeStore?.isDarkMode ? 'text-gray-500' : 'text-gray-400'" class="mx-auto mb-4" />
        <h3 :class="[
          'text-lg sm:text-xl md:text-2xl font-semibold mb-2',
          themeStore?.isDarkMode ? 'text-white' : 'text-gray-900'
        ]">No Tirths Found</h3>
        <p class="text-sm md:text-base">Try adjusting your filter or search criteria</p>
      </div>

      <!-- Results Info -->
      <div v-if="!loading && tirthStore.filteredTirths.length > 0" :class="[
        'mt-8 text-center text-sm',
        themeStore?.isDarkMode ? 'text-gray-400' : 'text-gray-600'
      ]">
        Showing {{ tirthStore.filteredTirths.length }} of {{ allTirths.length }} tirth locations
      </div>
    </div>

    <!-- Advanced Filter Panel -->
    <FilterPanel
      :is-open="showAdvancedFilters"
      @update:is-open="showAdvancedFilters = $event"
      @apply="showAdvancedFilters = false"
      @reset="showAdvancedFilters = false"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, watch, onMounted, ref } from 'vue'
import { useThemeStore } from '~/stores/theme'
import { useTirthStore } from '~/stores/tirth'
import { useGrouping } from '~/composables/ui/useGrouping'
import { BaseCard, Icon, FilterPanel } from '~/components/shared'
import type { Tirth } from '~/types/models'

definePageMeta({
  layout: 'default'
})

const themeStore = useThemeStore()
const tirthStore = useTirthStore()
const { getUniqueGroupings, formatGroupingTitle } = useGrouping()
const route = useRoute()

const hasId = computed(() => !!(route?.params?.id))
const showAdvancedFilters = ref(false)

// Track active filters
const hasActiveFilters = computed(() => {
  const filters = tirthStore.currentFilters
  return !!(filters.state || filters.sect || (filters.amenities && filters.amenities.length > 0))
})

const activeFilterCount = computed(() => {
  const filters = tirthStore.currentFilters
  let count = 0
  if (filters.state) count++
  if (filters.sect) count++
  if (filters.amenities && filters.amenities.length > 0) count += filters.amenities.length
  return count
})

// Fetch all tirths (full dataset)
const { data: tirthData, pending: loading, error: fetchError } = await useAsyncData(
  'all-tirths',
  () => $fetch<{ success: boolean; data: Tirth[] }>('/api/tirth', {
    query: { limit: 1000 }
  })
)

const allTirths = computed(() => (tirthData.value?.data || []) as Tirth[])

const error = computed(() => {
  if (!fetchError.value) return null
  return typeof fetchError.value === 'string' 
    ? fetchError.value 
    : fetchError.value?.message || 'Error loading data'
})

// Sync to store for other components
watch(allTirths, (newTirths) => {
  if (newTirths.length > 0) {
    tirthStore.tirths = newTirths
  }
}, { deep: true, immediate: true })

// Dynamic filter options based on unique tirth_grouping values
const uniqueGroupings = computed(() => getUniqueGroupings(allTirths.value))

const filterOptions = computed(() => [
  { id: 'all', label: 'All' },
  ...uniqueGroupings.value.map(grouping => ({
    id: grouping,
    label: formatGroupingTitle(grouping)
  }))
])

const getFilterIcon = (id: string) => {
  switch (id) {
    case 'all': return 'Grid3X3'
    default: return 'MapPin'
  }
}

// State for selected grouping filter
const selectedGrouping = ref<string>('all')

// Update store when grouping changes
watch(selectedGrouping, (newGrouping) => {
  if (newGrouping === 'all') {
    // Reset filters when selecting 'all'
    tirthStore.filterTirths({})
  } else {
    // Filter by grouping - this will be handled by the grouping filter in the grouping tab
    // and combined with any other filters applied via FilterPanel
    const filteredByGrouping = allTirths.value?.filter((t: Tirth) => {
      if (Array.isArray(t.tirth_grouping)) {
        return t.tirth_grouping.includes(newGrouping)
      }
      return t.tirth_grouping === newGrouping
    }) || []
    tirthStore.filteredTirths = filteredByGrouping
  }
})

onMounted(async () => {
  await tirthStore.fetchFilterOptions()
})
</script>


