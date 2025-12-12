<template>
  <div id="top" class="min-h-screen bg-gradient-to-b from-red-50 via-white to-blue-50 py-4 sm:py-8 md:py-12">
    <div class="px-4 sm:px-6 lg:px-8 max-w-[1920px] mx-auto">

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center py-32">
        <div class="text-center space-y-6">
          <div class="relative w-16 h-16 mx-auto">
            <div class="absolute inset-0 bg-gradient-to-r from-red-600 to-rose-600 rounded-full animate-spin" style="clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%, 0% 50%)" />
            <div class="absolute inset-2 bg-white rounded-full" />
          </div>
          <p class="text-gray-600 font-semibold text-lg">Loading temple data...</p>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="flex justify-center items-center py-32">
        <div class="text-center space-y-6 max-w-md">
          <Icon name="AlertTriangle" :size="48" class="text-red-500 mx-auto" />
          <p class="text-red-600 font-semibold text-lg">{{ error }}</p>
          <NuxtLink to="/tirth" class="inline-block px-6 py-3 bg-amber-600 text-white rounded-lg font-bold hover:bg-amber-700">
            Return to List
          </NuxtLink>
        </div>
      </div>

      <!-- Temple Content -->
      <div v-else-if="tirth" class="space-y-8 sm:space-y-12">
        <!-- Breadcrumb -->
        <div class="hidden md:flex items-center gap-2 text-sm text-gray-500">
          <NuxtLink to="/" class="hover:text-gray-900 transition-colors">Home</NuxtLink>
          <Icon name="ChevronRight" :size="14" />
          <NuxtLink to="/tirth" class="hover:text-gray-900 transition-colors">Tirth</NuxtLink>
          <Icon name="ChevronRight" :size="14" />
          <span class="text-gray-900 font-medium truncate">{{ tirth.name }}</span>
        </div>

        <!-- Header Section with Image and Info -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          <!-- Image Carousel (Left) -->
          <div class="w-full lg:w-[400px]">
            <div class="relative group overflow-hidden rounded-2xl shadow-2xl bg-gradient-to-br from-amber-100 to-orange-100 h-96 lg:h-[500px]">
              <ImageCarousel
                :images="tirth.images"
                :title="tirth.name"
                :subtitle="`${tirth.location.city}, ${tirth.location.state}`"
                image-height="h-full"
                :accent-dot-color="'bg-amber-400'"
                :show-title-overlay="false"
                :show-dots="true"
              />
            </div>
          </div>

          <!-- Info Section (Right) -->
          <div class="space-y-6">
            <!-- Title and Basic Info -->
            <div>
              <h1 class="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">{{ tirth.name }}</h1>
              <div class="flex items-center gap-2 text-gray-600">
                <Icon name="MapPin" :size="18" class="text-red-500" />
                <span class="font-semibold">{{ tirth.location.city }}, {{ tirth.location.state }}</span>
              </div>
            </div>

            <!-- Rating and Type -->
            <div class="flex items-center gap-3 flex-wrap">
              <div v-if="tirth.rating" class="flex items-center gap-2 bg-yellow-50 px-4 py-2 rounded-lg">
                <Icon name="Star" :size="20" class="text-yellow-400 fill-yellow-400" />
                <span class="font-bold text-gray-900">{{ tirth.rating }}</span>
                <span class="text-gray-600 text-sm">({{ tirth.reviews || 0 }} reviews)</span>
              </div>
              <span v-if="tirth.sect" class="px-3 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">{{ tirth.sect }}</span>
            </div>

            <!-- Info Cards -->
            <div class="space-y-4">
              <!-- Card 1: Sect -->
              <div class="bg-gradient-to-br from-blue-50 to-blue-100 border-l-4 border-blue-600 p-4 rounded-lg">
                <div class="text-gray-600 text-sm font-semibold uppercase tracking-wide">Sect</div>
                <div class="text-2xl font-bold text-blue-700 mt-1">{{ tirth.sect }}</div>
              </div>

              <!-- Card 2: Type/Kshetra -->
              <div class="bg-gradient-to-br from-purple-50 to-purple-100 border-l-4 border-purple-600 p-4 rounded-lg">
                <div class="text-gray-600 text-sm font-semibold uppercase tracking-wide">Type</div>
                <div class="text-2xl font-bold text-purple-700 mt-1">{{ tirth.type }}</div>
              </div>

              <!-- Card 3: Rating -->
              <div class="bg-gradient-to-br from-green-50 to-green-100 border-l-4 border-green-600 p-4 rounded-lg">
                <div class="text-gray-600 text-sm font-semibold uppercase tracking-wide">Rating</div>
                <div class="text-2xl font-bold text-green-700 mt-1">{{ tirth.rating ? `${tirth.rating} / 5` : 'N/A' }}</div>
              </div>
            </div>
          </div>
        </div>
        <!-- Tabs Navigation -->
        <div class="border-b-2 border-gray-200 -mx-4 sm:mx-0 px-4 sm:px-0 overflow-x-auto">
          <div class="flex gap-2 sm:gap-8 scroll-smooth">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              @click="activeTab = tab.id"
              :class="[
                'pb-4 px-1 font-bold transition-all duration-300 border-b-4 whitespace-nowrap text-sm sm:text-base',
                activeTab === tab.id
                  ? 'border-amber-600 text-amber-700'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              ]"
            >
              {{ tab.label }}
            </button>
          </div>
        </div>

        <!-- Tab Content -->
        <div class="min-h-[400px]">
          <Transition name="fade" mode="out-in">
            <div :key="activeTab">
              <TirthAbout v-if="activeTab === 'about'" :tirth="tirth" />
              <TirthFacilities v-if="activeTab === 'facilities'" :tirth="tirth" />
              <TirthFestivals v-if="activeTab === 'festivals'" :tirth="tirth" />
            </div>
          </Transition>
        </div>

        <!-- Related Tirths -->
        <div v-if="relatedTirths.length > 0" class="border-t-2 pt-8 sm:pt-12 mt-8 sm:mt-12">
          <h2 class="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-8">
            Explore Similar Locations
          </h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            <BaseCard
              v-for="relatedTirth in relatedTirths"
              :key="relatedTirth.id"
              :item="relatedTirth"
              card-type="tirth"
              :show-wishlist="true"
              :show-details="true"
              route-prefix="/tirth"
              :tag-fields="[relatedTirth.sect, relatedTirth.type]"
            />
          </div>
        </div>

        <!-- Back to Top -->
        <div class="flex justify-center pt-8 border-t">
          <a
            href="#top"
            class="px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-full font-bold hover:from-amber-700 hover:to-orange-700 transition-all"
          >
            <Icon name="ArrowUp" :size="20" />
            <span>Back to Top</span>
          </a>
        </div>
      </div>

      <!-- Not Found -->
      <div v-else class="flex justify-center items-center py-32">
        <div class="text-center space-y-6 max-w-md">
          <p class="text-gray-600 font-semibold text-lg">Temple not found</p>
          <NuxtLink to="/tirth" class="inline-block px-6 py-3 bg-amber-600 text-white rounded-lg font-bold hover:bg-amber-700">
            Return to List
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Tirth } from '~/types/models'
import { ref, computed } from 'vue'
import { useTirthStore } from '~/stores/tirth'
import { BaseCard } from '~/components/shared'
import TirthAbout from '~/components/tirth/TirthAbout.vue'
import TirthFacilities from '~/components/tirth/TirthFacilities.vue'
import TirthFestivals from '~/components/tirth/TirthFestivals.vue'

definePageMeta({
  layout: 'default',
})

const route = useRoute()
const tirthStore = useTirthStore()
const activeTab = ref('about')

const tabs = [
  { id: 'about', label: 'About' },
  { id: 'facilities', label: 'Facilities' },
  { id: 'festivals', label: 'Festivals & Events' },
]

// Watch route params to ensure data is fetched when params change
const tirthId = computed(() => {
  const id = route.params.id as string
  // Decode URI component to handle spaces and special characters
  return id ? decodeURIComponent(id) : ''
})

// Server-side data fetching using useAsyncData with proper error handling
const { data: tirth, pending: loading, error: fetchError } = await useAsyncData(
  () => `tirth-detail-${tirthId.value}`,
  () => {
    if (!tirthId.value) return Promise.resolve(null)
    return $fetch<Tirth>(`/api/tirth/${tirthId.value}`)
  },
  {
    watch: [tirthId], // Refetch when tirthId changes
  }
)

const error = computed(() => {
  if (!fetchError.value) return null
  return typeof fetchError.value === 'string' ? fetchError.value : fetchError.value.message || 'Failed to load temple data'
})

const relatedTirths = computed(() => {
  if (!tirth.value) return []
  return tirthStore.tirths
    .filter((t: Tirth) => t.id !== tirth.value!.id && t.sect === tirth.value!.sect)
    .slice(0, 3)
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
