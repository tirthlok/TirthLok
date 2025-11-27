<template>

    <router-view v-if="hasId" />
    <div v-else class="min-h-screen bg-gray-50 py-4 sm:py-8 md:py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-2">All Tirth Locations</h1>
        <p class="text-gray-600 text-base md:text-lg">Explore sacred Jain pilgrimage sites</p>
      </div>

      <!-- Search & Filter Section -->
      <div class="mb-8 space-y-4">
        <!-- Search Bar -->
        <SearchBox 
          v-model="searchQuery"
          placeholder="Search tirths by name, city, or state..."
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
        <div class="animate-spin rounded-full h-12 w-12 border-4 border-red-500 border-t-transparent"></div>
      </div>

      <!-- Error State -->
      <div v-if="error" class="mb-6 p-4 sm:p-6 bg-red-50 border-l-4 border-red-500 rounded-lg">
        <p class="text-red-700 text-sm md:text-base font-semibold">Error loading tirths</p>
        <p class="text-red-600 text-xs md:text-sm mt-1">{{ error }}</p>
      </div>

      <!-- Tirth Cards Grid - Using BaseCard -->
      <div v-if="!loading && displayedTirths.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
        <Icon name="MapPin" :size="48" class="text-gray-400 mx-auto mb-4" />
        <h3 class="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900 mb-2">No Tirths Found</h3>
        <p class="text-gray-600 text-sm md:text-base mb-6">Try adjusting your search or filter criteria</p>
      </div>

      <!-- Results Info -->
      <div v-if="!loading && displayedTirths.length > 0" class="mt-8 text-center text-sm text-gray-600">
        Showing {{ displayedTirths.length }} of {{ filteredTirths.length }} tirth locations
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Tirth } from '~/types/models'
import { useTirthStore } from '~/stores/tirth'
import { useFavoritesStore } from '~/stores/favorites'
import { BaseCard, SearchBox, TagButton, Icon } from '~/components/shared'

definePageMeta({
  layout: 'default'
})

const tirthStore = useTirthStore()
const route = useRoute()
const hasId = computed(() => !!(route && route.params && route.params.id))
const favoritesStore = useFavoritesStore()

const loading = computed(() => tirthStore.loading)
const error = computed(() => tirthStore.error)
const filteredTirths = computed(() => tirthStore.filteredTirths)

// Search & Filter State
type SearchResult = { id: string; name: string; subtitle: string }
const searchQuery = ref('')
const searchLoading = ref(false)
const searchResults = ref<SearchResult[]>([])
const selectedFilter = ref<'all' | 'wishlist'>('all')

// Filter options (computed so labels update reactively)
const filterOptions = computed(() => [
  { id: 'all', label: `All (${(filteredTirths.value || []).length})` },
  { id: 'wishlist', label: `Wishlist (${favoritesStore.getFavoriteCount})` },
])

// Display tirths based on filter
const displayedTirths = computed(() => {
  const all = filteredTirths.value || []
  
  if (selectedFilter.value === 'all') return all
  
  if (selectedFilter.value === 'wishlist') {
    return all.filter((t) => favoritesStore.isFavorite(t.id))
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
    const results = (filteredTirths.value || [])
      .filter(
        (t) =>
          t.name.toLowerCase().includes(term) ||
          t.location.city.toLowerCase().includes(term) ||
          t.location.state.toLowerCase().includes(term)
      )
      .slice(0, 5)
      .map((t) => ({
        id: t.id,
        name: t.name,
        subtitle: `${t.location.city}, ${t.location.state}`,
      }))

    searchResults.value = results
  } finally {
    searchLoading.value = false
  }
}

// Handle search result selection
const handleSelectResult = (result: any) => {
  tirthStore.setSelectedTirth(tirthStore.getTirthById(result.id) || null)
  navigateTo(`/tirth/${result.id}`)
}

// Server-side data fetching (runs during SSR) and store hydration
const { data: serverTirths } = await useAsyncData<Tirth[]>('tirths', () => $fetch('/api/tirth'))
if (serverTirths?.value) {
  tirthStore.$patch((state) => {
    state.tirths = serverTirths.value as Tirth[]
    state.filteredTirths = serverTirths.value as Tirth[]
  })
}

const { data: serverFavorites } = await useAsyncData<string[]>('favorites', () => $fetch('/api/favorites'))
if (serverFavorites?.value) {
  favoritesStore.setFavorites(serverFavorites.value as string[])
}
</script>
