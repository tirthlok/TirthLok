<template>
  <div class="min-h-screen bg-gradient-to-b from-cream to-white py-4 sm:py-8 md:py-12">
    <div class="px-4 sm:px-6 lg:px-8">
      <!-- Back Button -->
      <div class="mb-4 sm:mb-6">
        <NuxtLink
          to="/"
          class="inline-flex items-center gap-2 text-sage hover:text-opacity-80 font-semibold transition-colors text-sm sm:text-base"
        >
          <Icon name="ArrowLeft" :size="20" />
          Back to Explore
        </NuxtLink>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center py-20">
        <div class="animate-spin rounded-full h-12 w-12 border-4 border-sage border-t-charcoal"></div>
      </div>

      <!-- Error State -->
      <div v-if="error" class="p-4 sm:p-6 bg-red-50 border-l-4 border-red-500 rounded-lg text-red-700 mb-6">
        <p class="font-semibold text-sm md:text-base">Error loading temple</p>
        <p class="text-xs md:text-sm mt-1">{{ error }}</p>
      </div>

      <!-- Temple Content -->
      <div v-if="tirth" class="space-y-6 sm:space-y-8">
        <!-- Header -->
        <TirthHeader :tirth="tirth" />

        <!-- Tabs Navigation -->
        <div class="border-b border-gray-200 -mx-4 sm:mx-0 px-4 sm:px-0 overflow-x-auto">
          <div class="flex gap-2 sm:gap-8">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              @click="activeTab = tab.id"
              :class="[
                'pb-3 sm:pb-4 px-1 font-semibold transition-colors border-b-2 whitespace-nowrap text-sm sm:text-base',
                activeTab === tab.id
                  ? 'border-sage text-sage'
                  : 'border-transparent text-light-gray hover:text-charcoal'
              ]"
            >
              {{ tab.label }}
            </button>
          </div>
        </div>

        <!-- Tab Content -->
        <div class="min-h-[300px]">
          <TirthAbout v-show="activeTab === 'about'" :tirth="tirth" />
          <TirthFacilities v-show="activeTab === 'facilities'" :tirth="tirth" />
          <TirthFestivals v-show="activeTab === 'festivals'" :tirth="tirth" />
        </div>

        <!-- Related Tirths -->
        <div class="border-t pt-6 sm:pt-8 mt-6 sm:mt-8">
          <h2 class="text-xl sm:text-2xl md:text-3xl font-bold text-charcoal mb-4 sm:mb-6">Similar Locations</h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
            <TirthCard
              v-for="relatedTirth in relatedTirths"
              :key="relatedTirth.id"
              :tirth="relatedTirth"
            />
          </div>
        </div>
      </div>

      <!-- Not Found State -->
      <div v-if="!loading && !tirth" class="text-center py-16 sm:py-20">
        <Icon name="AlertCircle" :size="48" class="text-light-gray mx-auto mb-4" />
        <h3 class="text-lg sm:text-xl md:text-2xl font-semibold text-charcoal mb-2">Temple Not Found</h3>
        <p class="text-light-gray text-sm md:text-base mb-6">The temple you're looking for doesn't exist</p>
        <NuxtLink
          to="/"
          class="inline-block px-6 py-2 bg-sage text-white rounded-lg hover:bg-opacity-90 transition-colors text-sm md:text-base"
        >
          Go Home
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Tirth } from '~/types/models'
import { useTirthStore } from '~/stores/tirth'

definePageMeta({
  layout: 'default',
})

const route = useRoute()
const tithStore = useTirthStore()
const activeTab = ref('about')
const tirth = ref<Tirth | null>(null)
const loading = ref(false)
const error = ref<string | null>(null)

const tabs = [
  { id: 'about', label: 'About' },
  { id: 'facilities', label: 'Facilities' },
  { id: 'festivals', label: 'Festivals & Events' },
]

const relatedTirths = computed(() => {
  if (!tirth.value) return []
  return tithStore.tirths
    .filter((t) => t.id !== tirth.value!.id && t.sect === tirth.value!.sect)
    .slice(0, 3)
})

onMounted(async () => {
  const id = route.params.id as string
  loading.value = true
  try {
    const result = await tithStore.fetchTirthById(id)
    tirth.value = result
  } catch (err) {
    error.value = 'Failed to load temple details'
    console.error(err)
  } finally {
    loading.value = false
  }
})
</script>
