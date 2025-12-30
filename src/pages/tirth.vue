<template>
    <router-view v-if="hasId" />
    <div v-else :class="[
      'min-h-screen py-4 sm:py-8 md:py-12',
      themeStore?.isDarkMode ? 'dark bg-gray-950' : 'bg-white'
    ]">
      <div class="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
       <div class="flex items-center gap-2 text-sm text-gray-600">
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
            Browse all {{ loading ? '...' : allTirths.length }} tirths.
          </p>
        </div>

      <!-- Sticky Filter Bar - Always visible -->
      <div :class="[
        'sticky top-[84px] z-40 backdrop-blur-sm border-b mb-6 py-3 px-4 md:px-6 transition-all duration-300 -mx-4 sm:-mx-6 lg:-mx-8',
        themeStore?.isDarkMode 
          ? 'bg-gray-950/95 border-gray-800' 
          : 'bg-white/95 border-gray-100'
      ]">
        <div class="max-w-[1920px] mx-auto">
          <!-- Use justify-between to keep Advanced button fixed on right -->
          <div class="flex items-center justify-between gap-3">
            <!-- Scrollable filter buttons container -->
            <div class="flex items-center gap-3 overflow-x-auto no-scrollbar flex-1 min-w-0">
              <button
                v-for="filter in filterOptions"
                :key="filter.id"
                @click="selectedGrouping = filter.id"
                :class="[
                  'flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap border flex-shrink-0',
                  selectedGrouping === filter.id
                    ? 'bg-red-500 text-white border-red-500 shadow-md'
                    : (themeStore?.isDarkMode 
                      ? 'bg-gray-700 text-gray-300 border-gray-600 hover:border-gray-500 hover:bg-gray-600' 
                      : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50')
                ]"
              >
                <Icon :name="getFilterIcon(filter.id)" :size="16" />
                <span>{{ filter.label }}</span>
              </button>
            </div>
            <!-- Advanced Filter Button - Fixed position on right -->
            <button
              @click="showAdvancedFilters = true"
              :class="[
                'hidden md:flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap border flex-shrink-0',
                hasActiveFilters
                  ? 'text-red-500 border-red-500 shadow-md'
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

      <!-- Loading Skeleton Grid -->
      <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-4">
        <TirthCardSkeleton v-for="n in 8" :key="n" />
      </div>

      <!-- Tirth Cards Grid -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-4">
        <div
            v-for="tirth in tirthStore.filteredTirths"
            :key="tirth.id"
            class="transition-transform hover:-translate-y-2 duration-300 group relative"
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
    <TirthFilterPanel
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
import { useWishlistStore } from '~/features/wishlist'
import { useAuth } from '~/features/auth/composables/useAuth'
import { useGrouping } from '~/composables/ui/useGrouping'
import { BaseCard, Icon, TirthFilterPanel, TirthCardSkeleton } from '~/components/ui'
import type { Tirth } from '~/types/models'

definePageMeta({
  layout: 'default'
})

const themeStore = useThemeStore()
const tirthStore = useTirthStore()
const wishlistStore = useWishlistStore()
const { isAuthenticated } = useAuth()
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

// Fetch all tirths using useFetch with cache disabled
// Non-blocking fetch - UI renders immediately with loading state, fetch runs in parallel
const { data: tirthData, pending: loading, error: fetchError } = useFetch(
  () => `/api/tirth?limit=1000&_t=${Date.now()}`, // Add timestamp to bust cache
  {
    cache: 'no-store', // Disable all caching, fetch fresh data every time
    server: true, // Fetch starts on server for faster initial load
  }
)

// Computed that returns data from fetch response
const allTirths = computed(() => {
  const response = tirthData.value as any
  return (response?.data || []) as Tirth[]
})

const error = computed(() => {
  if (!fetchError.value) return null
  return typeof fetchError.value === 'string' 
    ? fetchError.value 
    : fetchError.value?.message || 'Error loading data'
})

// Sync to store for other components AND apply filters when data arrives
// Watch the actual fetched data - this fires whenever new data arrives
watch(allTirths, (newTirths) => {
  if (newTirths && newTirths.length > 0) {
    console.log('🔍 Tirth page: Data arrived, syncing to store and applying filters', newTirths.length)
    tirthStore.tirths = newTirths
    // CRITICAL: Call applyFilters immediately when fresh data arrives
    applyFilters()
  }
}, { deep: true, immediate: false })

// Dynamic filter options based on unique tirth_grouping values
const uniqueGroupings = computed(() => getUniqueGroupings(allTirths.value))

const filterOptions = computed(() => [
  { id: 'all', label: 'All' },
  { id: 'wishlist', label: `Wishlist (${wishlistStore.getWishlistCount})` },
  ...uniqueGroupings.value.map(grouping => ({
    id: grouping,
    label: formatGroupingTitle(grouping)
  }))
])

const getFilterIcon = (id: string) => {
  switch (id) {
    case 'all': return 'Grid3X3'
    case 'wishlist': return 'Heart'
    default: return 'MapPin'
  }
}

// State for selected grouping filter
const selectedGrouping = ref<string>('all')

// Apply combined filters (grouping + advanced filters + search)
const applyFilters = () => {
  let result = allTirths.value

  // Apply wishlist filter
  if (selectedGrouping.value === 'wishlist') {
    if (!isAuthenticated.value) {
      result = []
    } else {
      result = result.filter((t: Tirth) => wishlistStore.isInWishlist(t.id))
    }
  }
  // Apply grouping filter
  else if (selectedGrouping.value !== 'all') {
    result = result.filter((t: Tirth) => {
      if (Array.isArray(t.tirth_grouping)) {
        return t.tirth_grouping.includes(selectedGrouping.value)
      }
      return t.tirth_grouping === selectedGrouping.value
    })
  }

  // Apply advanced filters from store
  const filters = tirthStore.currentFilters
  if (filters.state) {
    result = result.filter((t: Tirth) => t.location?.state === filters.state)
  }
  if (filters.sect) {
    result = result.filter((t: Tirth) => t.sect === filters.sect)
  }
  if (filters.amenities && filters.amenities.length > 0) {
    result = result.filter((t: Tirth) => {
      return filters.amenities!.some(amenity =>
        t.facilities?.some((f: any) => f.type === amenity)
      )
    })
  }
  
  // Apply search filter
  if (filters.searchTerm) {
    const searchLower = filters.searchTerm.toLowerCase()
    result = result.filter((t: Tirth) =>
      t.name?.toLowerCase().includes(searchLower) ||
      t.description?.toLowerCase().includes(searchLower) ||
      t.location?.city?.toLowerCase().includes(searchLower) ||
      t.location?.state?.toLowerCase().includes(searchLower)
    )
  }

  console.log('📋 Tirth page: applyFilters result:', result.length, 'after filtering from', allTirths.value.length)
  tirthStore.filteredTirths = result
}

// Watch grouping changes
watch(selectedGrouping, () => {
  console.log('🎯 Tirth page: Grouping changed to:', selectedGrouping.value)
  applyFilters()
})

// Watch store filters changes
watch(
  () => tirthStore.currentFilters,
  () => {
    console.log('⚙️ Tirth page: Store filters changed')
    applyFilters()
  },
  { deep: true }
)

// Watch wishlist changes to re-apply filter when wishlist is updated
watch(
  () => wishlistStore.wishlistItems,
  () => {
    if (selectedGrouping.value === 'wishlist') {
      console.log('📜 Tirth page: Wishlist changed, re-applying wishlist filter')
      applyFilters()
    }
  },
  { deep: true }
)

onMounted(async () => {
  console.log('🔧 Tirth page: Mounted, checking if data exists')
  
  // Apply filters in case data was already loaded by plugin/SSR
  if (allTirths.value.length > 0) {
    console.log('💾 Tirth page: Data already loaded from plugin/SSR, applying filters')
    applyFilters()
  } else {
    console.log('⏳ Tirth page: Waiting for useFetch to load data')
  }
  await tirthStore.fetchFilterOptions()
})
</script>
