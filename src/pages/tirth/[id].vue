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
        <div class="flex items-center gap-2 text-sm text-gray-600">
          <NuxtLink to="/" class="hover:text-gray-900 transition-colors">Home</NuxtLink>
          <Icon name="ChevronRight" :size="14" />
          <NuxtLink to="/tirth" class="hover:text-gray-900 transition-colors">Tirth</NuxtLink>
          <Icon name="ChevronRight" :size="14" />
          <span class="text-gray-900 font-medium truncate">{{ tirth.name }}</span>
        </div>

        <!-- Header Section with Image and Info -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          <!-- Image Carousel (Left) -->
          <div class="w-full">
            <div class="relative group overflow-hidden rounded-2xl shadow-2xl bg-gradient-to-br from-amber-100 to-orange-100 h-80 sm:h-96 lg:h-[450px]">
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



            <!-- Key Details - Two Column Layout -->
            <div class="grid grid-cols-2 gap-4">
              <!-- Sect Card -->
              <div class="bg-gradient-to-br from-blue-50 to-blue-100 border-l-4 border-blue-600 p-4 rounded-lg">
                <div class="flex items-center gap-2 mb-2">
                  <Icon name="User" :size="16" class="text-blue-600" />
                  <div class="text-gray-600 text-xs font-semibold uppercase tracking-wide">Sect</div>
                </div>
                <div class="text-xl font-bold text-blue-700">{{ tirth.sect }}</div>
              </div>

              <!-- Type Card -->
              <div class="bg-gradient-to-br from-purple-50 to-purple-100 border-l-4 border-purple-600 p-4 rounded-lg">
                <div class="flex items-center gap-2 mb-2">
                  <Icon name="Landmark" :size="16" class="text-purple-600" />
                  <div class="text-gray-600 text-xs font-semibold uppercase tracking-wide">Type</div>
                </div>
                <div class="text-xl font-bold text-purple-700">{{ tirth.type }}</div>
              </div>

              <!-- Contact Card -->
              <div class="bg-gradient-to-br from-teal-50 to-cyan-100 border-l-4 border-teal-600 p-4 rounded-lg">
                <div class="flex items-center gap-2 mb-2">
                  <Icon name="Phone" :size="16" class="text-teal-600" />
                  <div class="text-gray-600 text-xs font-semibold uppercase tracking-wide">Contact</div>
                </div>
                <a v-if="tirth.contact?.phone" :href="`tel:${tirth.contact.phone}`" class="text-xl font-bold text-teal-700 hover:text-teal-800 transition-colors">
                  {{ tirth.contact.phone }}
                </a>
                <div v-else class="text-lg text-gray-500 italic">
                  To Be Updated Soon
                </div>
              </div>

              <!-- Email Card -->
              <div class="bg-gradient-to-br from-orange-50 to-amber-100 border-l-4 border-orange-600 p-4 rounded-lg">
                <div class="flex items-center gap-2 mb-2">
                  <Icon name="Mail" :size="16" class="text-orange-600" />
                  <div class="text-gray-600 text-xs font-semibold uppercase tracking-wide">Email</div>
                </div>
                <a v-if="tirth.contact?.email" :href="`mailto:${tirth.contact.email}`" class="text-xl font-bold text-orange-700 hover:text-orange-800 transition-colors break-all">
                  {{ tirth.contact.email }}
                </a>
                <div v-else class="text-lg text-gray-500 italic">
                  To Be Updated Soon
                </div>
              </div>
            </div>

            <!-- Directions Button -->
            <div class="mt-6">
              <a 
                :href="getDirectionsUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="group relative inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 text-white rounded-2xl font-semibold text-base overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/50 hover:-translate-y-0.5"
              >
                <!-- Animated background overlay -->
                <div class="absolute inset-0 bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <!-- Content -->
                <div class="relative flex items-center gap-3">
                  <div class="p-1.5 bg-white/20 rounded-lg backdrop-blur-sm group-hover:bg-white/30 transition-all">
                    <Icon name="Navigation" :size="20" class="group-hover:rotate-12 transition-transform duration-300" />
                  </div>
                  <span class="font-semibold">Get Directions</span>
                  <Icon name="ArrowRight" :size="18" class="group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </a>
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
              <TirthEvents v-if="activeTab === 'events'" :tirth="tirth" />
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
            class="p-4 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-full font-bold hover:from-amber-700 hover:to-orange-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-110"
            aria-label="Back to top"
          >
            <Icon name="ArrowUp" :size="24" />
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
import { BaseCard } from '~/components/ui'
import TirthAbout from '~/features/tirth/components/TirthAbout.vue'
import TirthFacilities from '~/features/tirth/components/TirthFacilities.vue'
import TirthEvents from '~/features/tirth/components/TirthEvents.vue'

definePageMeta({
  layout: 'default',
})

const route = useRoute()
const tirthStore = useTirthStore()
const activeTab = ref('about')

const tabs = [
  { id: 'about', label: 'About' },
  { id: 'facilities', label: 'Facilities' },
  { id: 'events', label: 'Events' },
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

// Generate Google Maps directions URL
const getDirectionsUrl = computed(() => {
  if (!tirth.value) return '#'
  
  const location = tirth.value.location
  
  // If we have latitude and longitude, use coordinates (most accurate)
  if (location.latitude && location.longitude) {
    return `https://www.google.com/maps/dir/?api=1&destination=${location.latitude},${location.longitude}`
  }
  
  // Otherwise, use the address
  const address = `${location.address}, ${location.city}, ${location.state}${location.zipCode ? ' ' + location.zipCode : ''}`
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`
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
