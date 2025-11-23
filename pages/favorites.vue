<template>
  <div class="min-h-screen bg-gradient-to-b from-cream to-white py-4 sm:py-8 md:py-12 px-4 sm:px-6 lg:px-8">
    <!-- Header -->
    <div class="mb-6 sm:mb-8">
      <h1 class="text-2xl sm:text-3xl md:text-4xl font-bold text-charcoal mb-2">My Favorite Tirths</h1>
      <p class="text-light-gray text-sm md:text-base">{{ favorites.length }} saved temple{{ favorites.length !== 1 ? 's' : '' }}</p>
    </div>

    <!-- Empty State -->
    <div v-if="favorites.length === 0" class="text-center py-12 sm:py-16 md:py-20">
      <Icon name="Heart" :size="48" class="text-light-gray mx-auto mb-4" />
      <h3 class="text-lg sm:text-xl md:text-2xl font-semibold text-charcoal mb-2">No Favorites Yet</h3>
      <p class="text-light-gray text-sm md:text-base mb-6">Save your favorite temples to view them here</p>
      <NuxtLink
        to="/"
        class="inline-block px-6 py-2 bg-sage text-white font-semibold rounded-lg hover:bg-opacity-90 transition-colors text-sm md:text-base"
      >
        Explore Temples
      </NuxtLink>
    </div>

    <!-- Favorites Grid -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 md:gap-6 pb-32 md:pb-12">
      <TirthCard v-for="tirth in favorites" :key="tirth.id" :tirth="tirth" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Tirth } from '~/types/models'
import { useTirthStore } from '~/stores/tirth'
import { useUserStore } from '~/stores/user'

definePageMeta({
  layout: 'default',
})

const tithStore = useTirthStore()
const userStore = useUserStore()

const favorites = computed(() => {
  return tithStore.tirths.filter((t) => userStore.isFavorite(t.id))
})

onMounted(async () => {
  if (tithStore.tirths.length === 0) {
    await tithStore.fetchTirths()
  }
})
</script>
