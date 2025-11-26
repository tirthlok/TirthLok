<template>
  <div class="min-h-screen bg-white py-4 sm:py-8 md:py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-2">All Tirth</h1>
        <p class="text-gray-600 text-base md:text-lg">Explore all Jain pilgrimage sites</p>
      </div>

      <!-- Filter chips (All / Visited / Wishlist) -->
      <div class="mb-8">
        <div
          class="flex items-center gap-3 overflow-x-auto no-scrollbar py-2 hide-scrollbar whitespace-nowrap px-2 sm:px-4"
          role="tablist"
          tabindex="0"
          @keydown="onChipsKeydown"
          aria-label="Tirth filters"
        >
              <button
                role="tab"
                @click="selectedFilter = 'all'"
                :class="chipClass('all')"
                :aria-selected="selectedFilter === 'all'"
                title="Show all tirths"
              >
                <Icon name="MapPin" :size="16" class="inline-block mr-2" />
                <span>All Tirths</span>
                <span class="ml-2 inline-flex items-center justify-center px-2 py-0.5 text-xs font-medium rounded-full bg-white/20">
                  {{ allCount }}
                </span>
              </button>

          <!-- Visited chip removed per request -->

          <button
            role="tab"
            @click="selectedFilter = 'wishlist'"
            :class="chipClass('wishlist')"
            :aria-selected="selectedFilter === 'wishlist'"
            title="Show wishlist tirths"
          >
            <Icon name="Heart" :size="16" class="inline-block mr-2" />
            <span>Wishlist</span>
            <span class="ml-2 inline-flex items-center justify-center px-2 py-0.5 text-xs font-medium rounded-full bg-white/20">
              {{ wishlistCount }}
            </span>
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center py-20">
        <div class="animate-spin rounded-full h-12 w-12 border-4 border-red-500 border-t-gray-900"></div>
      </div>

      <!-- Error State -->
      <div v-if="error" class="mb-6 p-4 sm:p-6 bg-red-50 border-l-4 border-red-500 rounded-lg">
        <p class="text-red-700 text-sm md:text-base font-semibold">Error loading tirths</p>
        <p class="text-red-600 text-xs md:text-sm mt-1">{{ error }}</p>
      </div>

      <!-- Tirth Cards Grid -->
      <div v-if="!loading && displayedTirths.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <TirthCard
          v-for="tirth in displayedTirths"
          :key="tirth.id"
          :tirth="tirth"
        />
      </div>

      <!-- Empty State -->
      <div v-if="!loading && filteredTirths.length === 0" class="text-center py-12 md:py-16">
        <Icon name="MapPin" :size="48" class="text-gray-400 mx-auto mb-4" />
        <h3 class="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900 mb-2">No Tirths Found</h3>
        <p class="text-gray-600 text-sm md:text-base mb-6">Try adjusting your search or filter criteria</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useTirthStore } from '~/stores/tirth'
import { useUserStore } from '~/stores/user'

definePageMeta({
  layout: 'default'
})

const tithStore = useTirthStore()

const loading = computed(() => tithStore.loading)
const error = computed(() => tithStore.error)
const filteredTirths = computed(() => tithStore.filteredTirths)

const userStore = useUserStore()

// filter chips state (All / Wishlist)
const selectedFilter = ref<'all' | 'wishlist'>('all')

const displayedTirths = computed(() => {
  const all = filteredTirths.value || []
  if (selectedFilter.value === 'all') return all

  if (selectedFilter.value === 'wishlist') {
    let favs: string[] = []
    try {
      if (typeof userStore.getFavorites === 'function') {
        favs = userStore.getFavorites()
      } else {
        favs = userStore.getFavorites || []
      }
    } catch (e) {
      favs = []
    }
    return all.filter((t) => favs.includes(t.id))
  }

  return all
})

// counts for chips
const allCount = computed(() => (filteredTirths.value || []).length)
const wishlistCount = computed(() => {
  try {
    if (typeof userStore.getFavorites === 'function') {
      return userStore.getFavorites().length || 0
    }
    return (userStore.getFavorites || []).length
  } catch (e) {
    return 0
  }
})

// return classes for chips (Airbnb-like coral active color and neutral inactive)
const chipClass = (filter: 'all' | 'wishlist') => {
  const base = 'px-4 py-2 rounded-full border transition-transform transform-gpu inline-flex items-center gap-2 text-sm select-none focus:outline-none'
  // Airbnb coral: #FF5A5F, hover tint and ring
  const active = 'bg-[#FF5A5F] text-white border-transparent shadow-lg scale-105 ring-2 ring-[#FFD1D1]'
  const inactive = 'bg-white text-gray-700 border-gray-200 hover:bg-[#fff5f5] hover:shadow-sm hover:scale-102'
  return `${base} ${selectedFilter.value === filter ? active : inactive}`
}

// keyboard navigation for chips (left/right)
const navFilters: Array<'all' | 'wishlist'> = ['all', 'wishlist']
const onChipsKeydown = (e: KeyboardEvent) => {
  if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return
  e.preventDefault()
  const idx = navFilters.indexOf(selectedFilter.value)
  if (idx === -1) return
  let next = idx
  if (e.key === 'ArrowRight') next = Math.min(navFilters.length - 1, idx + 1)
  if (e.key === 'ArrowLeft') next = Math.max(0, idx - 1)
  selectedFilter.value = navFilters[next]
}

// Fetch data on mount
onMounted(async () => {
  if (tithStore.tirths.length === 0) {
    await tithStore.fetchTirths()
  } else if (tithStore.filteredTirths.length === 0) {
    // If seeded tirths exist but filtered list is empty, populate it so cards render
    tithStore.filteredTirths = [...tithStore.tirths]
  }
})
</script>
