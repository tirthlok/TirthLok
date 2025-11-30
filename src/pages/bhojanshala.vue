<template>

    <router-view v-if="hasId" />
    <div v-else :class="[
      'min-h-screen py-4 sm:py-8 md:py-12 px-4 sm:px-6 lg:px-8',
      themeStore?.isDarkMode ? 'dark bg-gray-950' : 'bg-white'
    ]">
      <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <h1 :class="[
          'text-3xl sm:text-4xl md:text-5xl font-bold mb-2',
          themeStore?.isDarkMode ? 'text-white' : 'text-gray-900'
        ]">All Bhojanshala</h1>
        <p :class="[
          'text-base md:text-lg',
          themeStore?.isDarkMode ? 'text-gray-300' : 'text-gray-600'
        ]">Authentic vegetarian dining facilities</p>
      </div>

     <!-- Sticky Filter Bar -->
    <div :class="[
      'sticky top-[84px] z-30 backdrop-blur-sm border-b mb-1 py-3 px-4 sm:px-6 lg:px-8 transition-all duration-300',
      themeStore?.isDarkMode 
        ? 'bg-gray-950/95 border-gray-800' 
        : 'bg-white/95 border-gray-100'
    ]">
      <div class="max-w-7xl mx-auto">
        <div class="flex items-center gap-3 overflow-x-auto no-scrollbar">
          <button
            v-for="filter in filterOptions"
            :key="filter.id"
            @click="selectedFilter = filter.id"
            :class="[
              'flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap border',
              selectedFilter === filter.id
                ? 'bg-green-500 text-white border-green-500 shadow-md'
                : (themeStore?.isDarkMode 
                  ? 'bg-gray-700 text-gray-300 border-gray-600 hover:border-gray-500 hover:bg-gray-600' 
                  : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50')
            ]"
          >
            <Icon :name="getFilterIcon(filter.id)" :size="16" />
            <span>{{ filter.label }}</span>
          </button>
        </div>
      </div>
    </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center py-20">
        <div class="animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent"></div>
      </div>

      <!-- Error State -->
      <div v-if="error" :class="[
        'mb-6 p-4 sm:p-6 border-l-4 rounded-lg',
        themeStore?.isDarkMode 
          ? 'bg-red-900/20 border-red-500 text-red-300' 
          : 'bg-red-50 border-red-500 text-red-700'
      ]">
        <p class="text-sm md:text-base font-semibold">Error loading bhojanshala</p>
        <p :class="[
          'text-xs md:text-sm mt-1',
          themeStore?.isDarkMode ? 'text-red-400' : 'text-red-600'
        ]">{{ error }}</p>
      </div>

      <!-- Bhojanshala Cards Grid - Using BaseCard -->
      <div v-if="!loading && displayedBhojanShalas.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <BaseCard
          v-for="bhojanshala in displayedBhojanShalas"
          :key="bhojanshala.id"
          :item="bhojanshala"
          card-type="bhojanshala"
          :show-wishlist="true"
          :show-details="true"
          route-prefix="/bhojanshala"
          :tag-fields="(bhojanshala as any).cuisines || bhojanshala.cuisineTypes || []"
        />
      </div>

      <!-- Empty State -->
      <div v-if="!loading && displayedBhojanShalas.length === 0" :class="[
        'text-center py-8 md:py-12',
        themeStore?.isDarkMode ? 'text-gray-400' : 'text-gray-600'
      ]">
        <Icon name="UtensilsCrossed" :size="48" :class="themeStore?.isDarkMode ? 'text-gray-500' : 'text-gray-400'" class="mx-auto mb-4" />
        <h3 :class="[
          'text-lg sm:text-xl md:text-2xl font-semibold mb-2',
          themeStore?.isDarkMode ? 'text-gray-200' : 'text-gray-900'
        ]">No Bhojanshala Found</h3>
        <p class="text-sm md:text-base mb-6">Try adjusting your search or filter criteria</p>
      </div>

      <!-- Results Info -->
      <div v-if="!loading && displayedBhojanShalas.length > 0" :class="[
        'mt-8 text-center text-sm',
        themeStore?.isDarkMode ? 'text-gray-400' : 'text-gray-600'
      ]">
        Showing {{ displayedBhojanShalas.length }} of {{ filteredBhojanShalas.length }} bhojanshala locations
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useBhojanshalaStore } from '~/stores/bhojanshala'
import { useFavoritesStore } from '~/stores/favorites'
import { useThemeStore } from '~/stores/theme'
import type { Bhojanshala } from '~/types/models'
import { BaseCard, SearchBox, TagButton, Icon } from '~/components/shared'
import type { CardItem } from '~/components/shared'

definePageMeta({
  layout: 'default'
})

const bhojanshalaStore = useBhojanshalaStore()
const favoritesStore = useFavoritesStore()
const themeStore = useThemeStore()

// Server-side fetch and hydrate store
const { data: serverBhojans } = await useAsyncData<Bhojanshala[]>('bhojanshala', () => $fetch('/api/bhojanshala'))
if (serverBhojans?.value) {
  bhojanshalaStore.$patch((state) => {
    state.bhojanshalas = serverBhojans.value as Bhojanshala[]
    state.filteredBhojanshalas = serverBhojans.value as Bhojanshala[]
  })
}

const { data: serverFavorites } = await useAsyncData<string[]>('favorites', () => $fetch('/api/favorites'))
if (serverFavorites?.value) {
  favoritesStore.setFavorites(serverFavorites.value as string[])
}

const loading = computed(() => bhojanshalaStore.loading)
const error = computed(() => bhojanshalaStore.error)
const filteredBhojanShalas = computed(() => bhojanshalaStore.filteredBhojanshalas)

// Search & Filter State
type SearchResult = { id: string; name: string; subtitle: string }
const searchQuery = ref('')
const searchLoading = ref(false)
const searchResults = ref<SearchResult[]>([])
const selectedFilter = defineModel<string>('filter', { default: 'all' })
const filterOptions = computed(() => [
  { id: 'all', label: 'All' },
  { id: 'wishlist', label: `Favorites (${favoritesStore.getFavoriteCount})` },
])

const getFilterIcon = (id: string) => {
  switch (id) {
    case 'all': return 'Grid3X3'
    case 'wishlist': return 'Heart'
    default: return 'Circle'
  }
}

  const route = useRoute()
  const hasId = computed(() => !!(route && route.params && route.params.id))
// Display bhojanshala based on filter
const displayedBhojanShalas = computed(() => {
  const all = filteredBhojanShalas.value || []
  
  if (selectedFilter.value === 'all') return all
  
  if (selectedFilter.value === 'wishlist') {
    return all.filter((b: CardItem) => favoritesStore.isFavorite(b.id))
  }

  return all
})

// Handle search
const handleSearch = (query: string) => {
  if (!query.trim()) {
    searchResults.value = []
    return
  }

  searchLoading.value = true
  try {
    const term = query.toLowerCase()
    const results = (filteredBhojanShalas.value || [])
      .filter(
        (b: CardItem) =>
          b.name.toLowerCase().includes(term) ||
          b.location.city.toLowerCase().includes(term) ||
          b.location.state.toLowerCase().includes(term) ||
          ((b.cuisines as string[]) && (b.cuisines as string[]).some((c: string) => c.toLowerCase().includes(term)))
      )
      .slice(0, 5)
      .map((b: CardItem) => ({
        id: b.id,
        name: b.name,
        subtitle: `${b.location.city}, ${b.location.state}`,
      }))

    searchResults.value = results
  } finally {
    searchLoading.value = false
  }
}

// Handle search result selection
const handleSelectResult = (result: any) => {
  const selected = bhojanshalaStore.getBhojanshalAById(result.id)
  bhojanshalaStore.setSelectedBhojanshala(selected || null)
  navigateTo(`/bhojanshala/${result.id}`)
}

// Data is fetched and stores hydrated on the server via useAsyncData
</script>
