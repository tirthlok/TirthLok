<template>
    <router-view v-if="hasId" />
    <div v-else id="top" class="min-h-screen bg-gradient-to-b from-blue-50 via-white to-cyan-50 py-4 sm:py-8 md:py-12">
      <div class="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Breadcrumb -->
        <div class="flex items-center gap-2 text-sm text-gray-500 mb-8">
          <NuxtLink to="/" class="hover:text-gray-900 transition-colors">Home</NuxtLink>
          <Icon name="ChevronRight" :size="14" />
          <NuxtLink to="/dharamshala" class="hover:text-gray-900 transition-colors">Dharamshala</NuxtLink>
       </div>

        <!-- Header -->
        <div class="mb-12">
          <h1 class="text-4xl sm:text-5xl md:text-6xl font-bold mb-3 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
            All Dharamshala
          </h1>
          <p class="text-lg md:text-xl text-gray-600">
            Traditional lodging and accommodation facilities for pilgrims
          </p>
        </div>

        <!-- Sticky Filter Bar -->
        <div class="sticky top-[84px] z-40 backdrop-blur-md border-b mb-8 py-4 px-4 transition-all duration-300 -mx-4 sm:-mx-6 lg:-mx-8 bg-white/80 border-blue-100 shadow-sm">
          <div class="max-w-[1920px] mx-auto">
            <div class="flex items-center gap-3 overflow-x-auto no-scrollbar">
              <button
                v-for="filter in filterOptions"
                :key="filter.id"
                @click="selectedFilter = filter.id"
                :class="[
                  'flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap border-2',
                  selectedFilter === filter.id
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-blue-500 shadow-lg' 
                    : 'bg-white text-gray-700 border-gray-200 hover:border-blue-300 hover:shadow-md'
                ]"
              >
                <Icon :name="getFilterIcon(filter.id)" :size="16" />
                <span>{{ filter.label }}</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="flex justify-center items-center py-32">
          <div class="text-center space-y-6">
            <div class="relative w-16 h-16 mx-auto">
              <div class="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full animate-spin" style="clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%, 0% 50%)" />
              <div class="absolute inset-2 bg-white rounded-full" />
            </div>
            <p class="text-gray-600 font-semibold text-lg">Loading dharamshala locations...</p>
          </div>
        </div>

        <!-- Error State -->
        <div v-if="error" class="flex justify-center items-center py-32">
          <div class="text-center space-y-6 max-w-md bg-white p-8 rounded-2xl shadow-lg border-2 border-red-200">
            <Icon name="AlertTriangle" :size="48" class="text-red-500 mx-auto" />
            <div>
              <p class="text-red-600 font-semibold text-lg mb-2">Error Loading Dharamshala</p>
              <p class="text-red-500 text-sm">{{ error }}</p>
            </div>
            <NuxtLink to="/dharamshala" class="inline-block px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-bold hover:from-blue-700 hover:to-cyan-700 transition-all">
              Try Again
            </NuxtLink>
          </div>
        </div>

        <!-- Dharamshala Cards Grid - Using BaseCard -->
        <div v-if="!loading && displayedDharamshalas.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
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
        <div v-if="!loading && displayedDharamshalas.length === 0" class="flex justify-center items-center py-32">
          <div class="text-center space-y-6 max-w-md bg-white p-8 rounded-2xl shadow-lg border-2 border-blue-100">
            <Icon name="Home" :size="48" class="text-blue-400 mx-auto" />
            <div>
              <h3 class="text-2xl font-bold text-gray-900 mb-2">No Dharamshala Found</h3>
              <p class="text-gray-600">Try adjusting your search or filter criteria</p>
            </div>
            <button 
              @click="selectedFilter = 'all'" 
              class="inline-block px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-bold hover:from-blue-700 hover:to-cyan-700 transition-all"
            >
              Reset Filters
            </button>
          </div>
        </div>

        <!-- Results Info -->
        <div v-if="!loading && displayedDharamshalas.length > 0" class="mt-12 text-center">
          <p class="text-gray-600 text-lg font-medium">
            Showing <span class="font-bold text-blue-600">{{ displayedDharamshalas.length }}</span> of <span class="font-bold text-blue-600">{{ filteredDharamshalas.length }}</span> dharamshala locations
          </p>
        </div>

        <!-- Back to Top Button -->
        <div v-if="!loading && displayedDharamshalas.length > 0" class="flex justify-center pt-12 border-t border-blue-100">
          <a
            href="#top"
            class="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-full font-bold hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center gap-2"
          >
            <Icon name="ArrowUp" :size="20" />
            <span>Back to Top</span>
          </a>
        </div>
      </div>
    </div>
  </template><script setup lang="ts">
import { computed } from 'vue'
import { useDharamshalaStore } from '~/stores/dharamshala'
import { useFavoritesStore } from '~/stores/favorites'
import { useThemeStore } from '~/stores/theme'
import type { Dharamshala } from '~/types/models'
import { BaseCard } from '~/components/shared'
import type { CardItem } from '~/components/shared'
import Icon from '~/components/common/Icon.vue'

definePageMeta({
  layout: 'default'
})

const dharamshalaStore = useDharamshalaStore()
const themeStore = useThemeStore()
const route = useRoute()
const hasId = computed(() => !!(route && route.params && route.params.id))
const favoritesStore = useFavoritesStore()

// Server-side fetch and hydrate store
const { data: serverDharamshala } = await useAsyncData<Dharamshala[]>('dharamshala', () => $fetch('/api/dharamshala'))
if (serverDharamshala?.value) {
  dharamshalaStore.$patch((state) => {
    state.dharamshalas = serverDharamshala.value as Dharamshala[]
    state.filteredDharamshalas = serverDharamshala.value as Dharamshala[]
  })
}

const { data: serverFavorites } = await useAsyncData<string[]>('favorites', () => $fetch('/api/favorites'))
if (serverFavorites?.value) {
  favoritesStore.setFavorites(serverFavorites.value as string[])
}

const loading = computed(() => dharamshalaStore.loading)
const error = computed(() => dharamshalaStore.error)
const filteredDharamshalas = computed(() => dharamshalaStore.filteredDharamshalas)

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
// Display dharamshala based on filter
const displayedDharamshalas = computed(() => {
  const all = filteredDharamshalas.value || []
  
  if (selectedFilter.value === 'all') return all
  
  if (selectedFilter.value === 'wishlist') {
    return all.filter((d: CardItem) => favoritesStore.isFavorite(d.id))
  }

  return all
})
</script>
