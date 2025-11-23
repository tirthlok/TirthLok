<template>
  <div class="bg-white min-h-screen">
    <!-- Hero Section - Airbnb Style -->
    <div class="px-4 sm:px-6 lg:px-8 py-6 md:py-10 text-center">
      <h1 class="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-3 md:mb-4">
        Discover Jain <span class="text-red-500">Tirths</span>
      </h1>
      <p class="text-base sm:text-lg md:text-lg text-gray-600 max-w-2xl mx-auto px-2 font-light">
        Explore sacred pilgrimage sites with complete information, facilities, and local experiences
      </p>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center py-20">
      <div class="animate-spin rounded-full h-12 w-12 border-4 border-red-500 border-t-gray-900"></div>
    </div>

    <!-- Error State -->
    <div v-if="error" class="mb-6 p-4 sm:p-6 mx-4 sm:mx-6 lg:mx-8 bg-red-50 border-l-4 border-red-500 rounded-lg">
      <p class="text-red-700 text-sm md:text-base font-semibold">Error loading temples</p>
      <p class="text-red-600 text-xs md:text-sm mt-1">{{ error }}</p>
    </div>

    <!-- Tirth Cards Horizontal Scroll -->
    <div v-if="!loading && filteredTirths.length > 0" class="px-4 sm:px-6 lg:px-8 pb-12">
      <div class="overflow-x-auto no-scrollbar -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
        <div class="flex gap-4 sm:gap-5 md:gap-6 w-max snap-x snap-mandatory">
          <div
            v-for="tirth in filteredTirths"
            :key="tirth.id"
            class="flex-shrink-0 snap-start w-[150px] sm:w-[150px] md:w-[160px] lg:w-[180px]"
          >
            <TirthCard :tirth="tirth" />
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="!loading && filteredTirths.length === 0" class="text-center py-12 md:py-16 px-4">
      <Icon name="MapPin" :size="48" class="text-gray-400 mx-auto mb-4" />
      <h3 class="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900 mb-2">No Temples Found</h3>
      <p class="text-gray-600 text-sm md:text-base mb-6">Try adjusting your search or filter criteria</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useTirthStore } from '~/stores/tirth'

definePageMeta({
  layout: 'default',
})

const tithStore = useTirthStore()

const loading = computed(() => tithStore.loading)
const error = computed(() => tithStore.error)
const filteredTirths = computed(() => tithStore.filteredTirths)

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
