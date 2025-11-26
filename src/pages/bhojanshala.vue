<template>

    <router-view v-if="hasId" />
    <div v-else class="min-h-screen bg-gray-50 py-4 sm:py-8 md:py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-2">All Bhojanshala</h1>
        <p class="text-gray-600 text-base md:text-lg">Authentic vegetarian dining facilities</p>
      </div>

      <!-- Search & Filter Section -->
      <div class="mb-8 space-y-4">
        <!-- Search Bar -->
        <SearchBox 
          v-model="searchQuery"
          placeholder="Search bhojanshala by name, city, or cuisine..."
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
        <div class="animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent"></div>
      </div>

      <!-- Error State -->
      <div v-if="error" class="mb-6 p-4 sm:p-6 bg-red-50 border-l-4 border-red-500 rounded-lg">
        <p class="text-red-700 text-sm md:text-base font-semibold">Error loading bhojanshala</p>
        <p class="text-red-600 text-xs md:text-sm mt-1">{{ error }}</p>
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
      <div v-if="!loading && displayedBhojanShalas.length === 0" class="text-center py-12 md:py-16">
        <Icon name="UtensilsCrossed" :size="48" class="text-gray-400 mx-auto mb-4" />
        <h3 class="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900 mb-2">No Bhojanshala Found</h3>
        <p class="text-gray-600 text-sm md:text-base mb-6">Try adjusting your search or filter criteria</p>
      </div>

      <!-- Results Info -->
      <div v-if="!loading && displayedBhojanShalas.length > 0" class="mt-8 text-center text-sm text-gray-600">
        Showing {{ displayedBhojanShalas.length }} of {{ filteredBhojanShalas.length }} bhojanshala locations
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useBhojanshalaStore } from '~/stores/bhojanshala'
import { useFavoritesStore } from '~/stores/favorites'
import { BaseCard, SearchBox, TagButton, Icon } from '~/components/shared'
import type { CardItem } from '~/components/shared'

definePageMeta({
  layout: 'default'
})

const bhojanshalaStore = useBhojanshalaStore()
const favoritesStore = useFavoritesStore()

const loading = computed(() => bhojanshalaStore.loading)
const error = computed(() => bhojanshalaStore.error)
const filteredBhojanShalas = computed(() => bhojanshalaStore.filteredBhojanshalas)

// Search & Filter State
type SearchResult = { id: string; name: string; subtitle: string }
const searchQuery = ref('')
const searchLoading = ref(false)
const searchResults = ref<SearchResult[]>([])
const selectedFilter = ref<'all' | 'wishlist'>('all')

// Filter options (computed so labels update reactively)
const filterOptions = computed(() => [
  { id: 'all', label: `All (${(filteredBhojanShalas.value || []).length})` },
  { id: 'wishlist', label: `Wishlist (${favoritesStore.getFavoriteCount})` },
])

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

// Fetch data on mount
onMounted(async () => {
  if (bhojanshalaStore.bhojanshalas.length === 0) {
    await bhojanshalaStore.fetchBhojanshalas()
  } else if (bhojanshalaStore.filteredBhojanshalas.length === 0) {
    bhojanshalaStore.filteredBhojanshalas = [...bhojanshalaStore.bhojanshalas]
  }

  // Initialize favorites
  if (favoritesStore.favorites.length === 0) {
    await favoritesStore.fetchFavorites()
  }
})
</script>
