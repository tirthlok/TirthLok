<template>
    <router-view v-if="hasId" />
    <div v-else class="min-h-screen bg-gray-50 py-4 sm:py-8 md:py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-2">All Dharamshala</h1>
        <p class="text-gray-600 text-base md:text-lg">Traditional lodging and accommodation facilities</p>
      </div>

      <!-- Search & Filter Section -->
      <div class="mb-8 space-y-4">
        <!-- Search Bar -->
        <SearchBox 
          v-model="searchQuery"
          placeholder="Search dharamshala by name, city, or amenities..."
          :results="searchResults"
          :is-loading="searchLoading"
          @search="handleSearch"
          @select-result="handleSelectResult"
        />

        <!-- Filter Chips (All / Wishlist) -->
        <div class="flex items-center gap-3 overflow-x-auto pb-2">
          <TagButton
            v-for="filter in filterOptions"
            :key="filter.id"
            :tag="filter.id"
            :label="filter.label"
            :is-selected="selectedFilter === filter.id"
            @toggle="(tag: string) => selectedFilter = (tag as 'all' | 'wishlist')"
          />
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center py-20">
        <div class="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>

      <!-- Error State -->
      <div v-if="error" class="mb-6 p-4 sm:p-6 bg-red-50 border-l-4 border-red-500 rounded-lg">
        <p class="text-red-700 text-sm md:text-base font-semibold">Error loading dharamshala</p>
        <p class="text-red-600 text-xs md:text-sm mt-1">{{ error }}</p>
      </div>

      <!-- Dharamshala Cards Grid - Using BaseCard -->
      <div v-if="!loading && displayedDharamshalas.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <BaseCard
          v-for="dharamshala in displayedDharamshalas"
          :key="dharamshala.id"
          :item="dharamshala"
          card-type="dharamshala"
          :show-wishlist="true"
          :show-details="true"
          route-prefix="/dharamshala"
          :tag-fields="(dharamshala.amenities as string[]) || []"
        />
      </div>

      <!-- Empty State -->
      <div v-if="!loading && displayedDharamshalas.length === 0" class="text-center py-12 md:py-16">
        <Icon name="Home" :size="48" class="text-gray-400 mx-auto mb-4" />
        <h3 class="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900 mb-2">No Dharamshala Found</h3>
        <p class="text-gray-600 text-sm md:text-base mb-6">Try adjusting your search or filter criteria</p>
      </div>

      <!-- Results Info -->
      <div v-if="!loading && displayedDharamshalas.length > 0" class="mt-8 text-center text-sm text-gray-600">
        Showing {{ displayedDharamshalas.length }} of {{ filteredDharamshalas.length }} dharamshala locations
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useDharamshalaStore } from '~/stores/dharamshala'
import { useFavoritesStore } from '~/stores/favorites'
import { BaseCard, SearchBox, TagButton, Icon } from '~/components/shared'
import type { CardItem } from '~/components/shared'

definePageMeta({
  layout: 'default'
})

const dharamshalaStore = useDharamshalaStore()
const route = useRoute()
const hasId = computed(() => !!(route && route.params && route.params.id))
const favoritesStore = useFavoritesStore()

const loading = computed(() => dharamshalaStore.loading)
const error = computed(() => dharamshalaStore.error)
const filteredDharamshalas = computed(() => dharamshalaStore.filteredDharamshalas)

// Search & Filter State
type SearchResult = { id: string; name: string; subtitle: string }
const searchQuery = ref('')
const searchLoading = ref(false)
const searchResults = ref<SearchResult[]>([])
const selectedFilter = ref<'all' | 'wishlist'>('all')

// Filter options (computed so labels update reactively)
const filterOptions = computed(() => [
  { id: 'all', label: `All (${(filteredDharamshalas.value || []).length})` },
  { id: 'wishlist', label: `Wishlist (${favoritesStore.getFavoriteCount})` },
])

// Display dharamshala based on filter
const displayedDharamshalas = computed(() => {
  const all = filteredDharamshalas.value || []
  
  if (selectedFilter.value === 'all') return all
  
  if (selectedFilter.value === 'wishlist') {
    return all.filter((d: CardItem) => favoritesStore.isFavorite(d.id))
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
    const results = (filteredDharamshalas.value || [])
      .filter(
        (d: CardItem) =>
          d.name.toLowerCase().includes(term) ||
          d.location.city.toLowerCase().includes(term) ||
          d.location.state.toLowerCase().includes(term) ||
          ((d.amenities as string[]) && (d.amenities as string[]).some((a: string) => a.toLowerCase().includes(term)))
      )
      .slice(0, 5)
      .map((d: CardItem) => ({
        id: d.id,
        name: d.name,
        subtitle: `${d.location.city}, ${d.location.state}`,
      }))

    searchResults.value = results
  } finally {
    searchLoading.value = false
  }
}

// Handle search result selection
const handleSelectResult = (result: any) => {
  const selected = dharamshalaStore.getDharamshalaById(result.id)
  dharamshalaStore.setSelectedDharmadhala(selected || null)
  navigateTo(`/dharamshala/${result.id}`)
}

// Fetch data on mount
onMounted(async () => {
  if (dharamshalaStore.dharamshalas.length === 0) {
    await dharamshalaStore.fetchDharamshalas()
  } else if (dharamshalaStore.filteredDharamshalas.length === 0) {
    dharamshalaStore.filteredDharamshalas = [...dharamshalaStore.dharamshalas]
  }

  // Initialize favorites
  if (favoritesStore.favorites.length === 0) {
    await favoritesStore.fetchFavorites()
  }
})
</script>
