<template>
    <router-view v-if="hasId" />
    <div v-else :class="[
      'min-h-screen py-4 sm:py-8 md:py-12 px-4 sm:px-6 lg:px-8',
      themeStore?.isDarkMode ? 'dark bg-gray-950' : 'bg-white'
    ]">
      <div class="max-w-7xl mx-auto">
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

       <!-- Sticky Filter Bar -->
    <div :class="[
      'sticky top-[57px] z-30 backdrop-blur-sm border-b mb-1 py-3 px-4 sm:px-6 lg:px-8 transition-all duration-300',
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
      </div>
    </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center py-20">
        <div class="animate-spin rounded-full h-12 w-12 border-4 border-red-500 border-t-transparent"></div>
      </div>

      <!-- Error State -->
      <div v-if="error" :class="[
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
        <Icon name="MapPin" :size="48" :class="[
          'mx-auto mb-4',
          themeStore?.isDarkMode ? 'text-gray-600' : 'text-gray-400'
        ]" />
        <h3 :class="[
          'text-lg sm:text-xl md:text-2xl font-semibold mb-2',
          themeStore?.isDarkMode ? 'text-white' : 'text-gray-900'
        ]">No Tirths Found</h3>
        <p :class="[
          'text-sm md:text-base mb-6',
          themeStore?.isDarkMode ? 'text-gray-400' : 'text-gray-600'
        ]">Try adjusting your search or filter criteria</p>
      </div>

      <!-- Results Info -->
      <div v-if="!loading && displayedTirths.length > 0" :class="[
        'mt-8 text-center text-sm',
        themeStore?.isDarkMode ? 'text-gray-400' : 'text-gray-600'
      ]">
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
import { useThemeStore } from '~/stores/theme'
import { BaseCard, SearchBox, TagButton, Icon } from '~/components/shared'

definePageMeta({
  layout: 'default'
})

const tirthStore = useTirthStore()
const themeStore = useThemeStore()
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
