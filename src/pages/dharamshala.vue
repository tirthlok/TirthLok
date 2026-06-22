<template>
    <router-view v-if="hasId" />
    <div v-else :class="[
      'min-h-screen py-4 sm:py-8 md:py-12',
      themeStore?.isDarkMode ? 'dark bg-gray-950' : 'bg-white'
    ]">
      <div class="page-container py-6">
      <!-- Header -->
       <div class="flex items-center gap-2 text-sm text-gray-600">
          <NuxtLink to="/" class="hover:text-gray-900 transition-colors">Home</NuxtLink>
          <Icon name="ChevronRight" :size="14" />
          <NuxtLink to="/dharamshala" class="hover:text-gray-900 transition-colors">Dharamshala</NuxtLink>
       </div>
      <div class="my-2">
          <h2 :class="[
            'text-2xl md:text-3xl font-bold',
            themeStore?.isDarkMode ? 'text-white' : 'text-gray-900'
          ]">Dharamshala</h2>
          <p :class="[
            'text-base',
            themeStore?.isDarkMode ? 'text-gray-400' : 'text-gray-600'
          ]">
            Browse all {{ loading ? '...' : allDharamshalas.length }} dharamshala locations.
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
                    ? 'bg-blue-500 text-white border-blue-500 shadow-md'
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
                  ? 'text-blue-500 border-blue-500 shadow-md'
                  : (themeStore?.isDarkMode 
                    ? 'bg-gray-700 text-gray-300 border-gray-600 hover:border-gray-500 hover:bg-gray-600' 
                    : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50')
              ]"
            >
              <Icon name="Sliders" :size="16" />
              <span>Advanced</span>
              <span v-if="hasActiveFilters" class="ml-2 inline-flex items-center justify-center w-5 h-5 text-xs font-bold bg-white text-blue-500 rounded-full">{{ activeFilterCount }}</span>
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
        <p class="text-sm md:text-base font-semibold">Error loading dharamshalas</p>
        <p :class="[
          'text-xs md:text-sm mt-1',
          themeStore?.isDarkMode ? 'text-red-400' : 'text-red-600'
        ]">{{ error }}</p>
      </div>

      <!-- Loading Skeleton Grid -->
      <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-4">
        <CardSkeleton v-for="n in 8" :key="n" />
      </div>

      <!-- Dharamshala Cards Grid -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-4">
        <div
            v-for="dharamshala in filteredDharamshalas"
            :key="dharamshala.id"
            class="transition-transform hover:-translate-y-2 duration-300 group relative"
          >
            <!-- New badge with animation -->
            <div v-if="dharamshala.dharamshala_tags && dharamshala.dharamshala_tags.length > 0" class="absolute -top-3 -right-3 z-10">
              <span class="inline-block bg-gradient-to-r from-accent to-pink-400 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg border border-white/20">✨ {{ dharamshala.dharamshala_tags[0] }}</span>
            </div>
            <BaseCard
              :item="dharamshala"
              card-type="dharamshala"
              :show-wishlist="true"
              :show-details="false"
              variant="featured"
              :image-height="'h-72'"
              route-prefix="/dharamshala"
              :tag-fields="[dharamshala.type]"
            />
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="!loading && filteredDharamshalas.length === 0" :class="[
        'text-center py-12',
        themeStore?.isDarkMode ? 'text-gray-400' : 'text-gray-600'
      ]">
        <Icon name="Home" :size="48" :class="themeStore?.isDarkMode ? 'text-gray-500' : 'text-gray-400'" class="mx-auto mb-4" />
        <h3 :class="[
          'text-lg sm:text-xl md:text-2xl font-semibold mb-2',
          themeStore?.isDarkMode ? 'text-white' : 'text-gray-900'
        ]">No Dharamshalas Found</h3>
        <p class="text-sm md:text-base">Try adjusting your filter or search criteria</p>
      </div>

      <!-- Results Info -->
      <div v-if="!loading && filteredDharamshalas.length > 0" :class="[
        'mt-8 text-center text-sm',
        themeStore?.isDarkMode ? 'text-gray-400' : 'text-gray-600'
      ]">
        Showing {{ filteredDharamshalas.length }} of {{ allDharamshalas.length }} dharamshala locations
      </div>
    </div>

    <!-- Advanced Filter Panel -->
    <DharamshalaFilterPanel
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
import { useDharamshalaStore } from '~/features/dharamshala/composables/useDharamshalaStore'
import { useWishlistStore } from '~/features/wishlist'
import { useAuth } from '~/features/auth/composables/useAuth'
import { BaseCard, Icon, CardSkeleton } from '~/components/ui'
import DharamshalaFilterPanel from '~/features/dharamshala/components/DharamshalaFilterPanel.vue'
import type { Dharamshala } from '~/types/models'

definePageMeta({
  layout: 'default'
})

const themeStore = useThemeStore()
const dharamshalaStore = useDharamshalaStore()
const wishlistStore = useWishlistStore()
const { isAuthenticated } = useAuth()
const { formatGroupingTitle } = useGrouping()
const route = useRoute()

const hasId = computed(() => !!(route?.params?.id))
const showAdvancedFilters = ref(false)

// Track active filters
const hasActiveFilters = computed(() => {
  const filters = dharamshalaStore.currentFilters
  return !!(filters.state || filters.city || (filters.facilities && filters.facilities.length > 0))
})

const activeFilterCount = computed(() => {
  const filters = dharamshalaStore.currentFilters
  let count = 0
  if (filters.state) count++
  if (filters.city) count++
  if (filters.facilities && filters.facilities.length > 0) count += filters.facilities.length
  return count
})

// Fetch all dharamshalas using useFetch with cache disabled
const { data: dharamshalaData, pending: loading, error: fetchError } = useFetch(
  () => `/api/dharamshala?_t=${Date.now()}`, // Add timestamp to bust cache
  {
    cache: 'no-store', // Disable all caching, fetch fresh data every time
    server: true, // Fetch starts on server for faster initial load
  }
)

// Computed that returns data from fetch response
const allDharamshalas = computed(() => {
  return (dharamshalaData.value || []) as Dharamshala[]
})

const error = computed(() => {
  if (!fetchError.value) return null
  return typeof fetchError.value === 'string' 
    ? fetchError.value 
    : fetchError.value?.message || 'Error loading data'
})

// Sync to store when data arrives AND apply filters
watch(allDharamshalas, (newDharamshalas) => {
  if (newDharamshalas && newDharamshalas.length > 0) {
    console.log('🔍 Dharamshala page: Data arrived, syncing to store and applying filters', newDharamshalas.length)
    dharamshalaStore.dharamshalas = newDharamshalas
    // Fetch filter options from the loaded data
    dharamshalaStore.fetchFilterOptions()
    // CRITICAL: Call applyFilters immediately when fresh data arrives
    applyFilters()
  }
}, { deep: true, immediate: false })

// Dynamic filter options based on unique dharamshala_grouping values
const uniqueGroupings = computed(() => {
  const groupings = new Map<string, boolean>()
  
  allDharamshalas.value.forEach(dharamshala => {
    if (dharamshala.dharamshala_grouping) {
      // Handle both string and array
      const values = Array.isArray(dharamshala.dharamshala_grouping)
        ? dharamshala.dharamshala_grouping
        : [dharamshala.dharamshala_grouping]
      
      values.forEach(value => {
        if (value && !groupings.has(value)) {
          groupings.set(value, true)
        }
      })
    }
  })
  
  return Array.from(groupings.keys())
})

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
    default: return 'Home'
  }
}

// State for selected grouping filter
const selectedGrouping = ref<string>('all')

// Apply combined filters (grouping + wishlist)
const applyFilters = () => {
  let result = allDharamshalas.value

  // Apply wishlist filter
  if (selectedGrouping.value === 'wishlist') {
    if (!isAuthenticated.value) {
      result = []
    } else {
      result = result.filter((d: Dharamshala) => wishlistStore.isInWishlist(d.id, 'dharamshala'))
    }
  }
  // Apply grouping filter
  else if (selectedGrouping.value !== 'all') {
    result = result.filter((d: Dharamshala) => {
      if (Array.isArray(d.dharamshala_grouping)) {
        return d.dharamshala_grouping.includes(selectedGrouping.value)
      }
      return d.dharamshala_grouping === selectedGrouping.value
    })
  }

  // Apply advanced filters from store
  const filters = dharamshalaStore.currentFilters
  if (filters.state) {
    result = result.filter((d: Dharamshala) => d.location?.state === filters.state)
  }
  if (filters.city) {
    result = result.filter((d: Dharamshala) => d.location?.city === filters.city)
  }
  if (filters.facilities && filters.facilities.length > 0) {
    result = result.filter((d: Dharamshala) => {
      return filters.facilities!.some(facility =>
        d.amenities?.some((a: any) => a.toLowerCase() === facility.toLowerCase())
      )
    })
  }

  console.log('📋 Dharamshala page: applyFilters result:', result.length, 'after filtering from', allDharamshalas.value.length)
  dharamshalaStore.filteredDharamshalas = result
}

const filteredDharamshalas = computed(() => dharamshalaStore.filteredDharamshalas)

// Watch grouping changes
watch(selectedGrouping, () => {
  console.log('🎯 Dharamshala page: Grouping changed to:', selectedGrouping.value)
  applyFilters()
})

// Watch wishlist changes to re-apply filter when wishlist is updated
watch(
  () => wishlistStore.wishlistItems,
  () => {
    if (selectedGrouping.value === 'wishlist') {
      console.log('📜 Dharamshala page: Wishlist changed, re-applying wishlist filter')
      applyFilters()
    }
  },
  { deep: true }
)

// Watch store filters changes
watch(
  () => dharamshalaStore.currentFilters,
  () => {
    console.log('⚙️ Dharamshala page: Store filters changed')
    applyFilters()
  },
  { deep: true }
)

onMounted(async () => {
  console.log('🔧 Dharamshala page: Mounted, checking if data exists')
  
  // Apply filters in case data was already loaded by plugin/SSR
  if (allDharamshalas.value.length > 0) {
    console.log('💾 Dharamshala page: Data already loaded from plugin/SSR, applying filters')
    await dharamshalaStore.fetchFilterOptions()
    applyFilters()
  } else {
    console.log('⏳ Dharamshala page: Waiting for useFetch to load data')
  }
})
</script>
