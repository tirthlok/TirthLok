<template>
  <div id="top" class="min-h-screen bg-gradient-to-b from-amber-50 via-white to-orange-50 py-4 sm:py-8 md:py-12">
    <div class="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center py-32">
        <div class="text-center space-y-6">
          <div class="relative w-16 h-16 mx-auto">
            <div class="absolute inset-0 bg-gradient-to-r from-amber-600 to-orange-600 rounded-full animate-spin" style="clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%, 0% 50%)" />
            <div class="absolute inset-2 bg-white rounded-full" />
          </div>
          <p class="text-gray-600 font-semibold text-lg">Loading tirth details...</p>
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

      <!-- Content -->
      <div v-else-if="tirth" class="space-y-8 sm:space-y-10">
              <!-- Breadcrumb -->
        <div class="flex items-center gap-2 text-sm text-gray-500">
          <NuxtLink to="/" class="hover:text-gray-900 transition-colors">Home</NuxtLink>
          <Icon name="ChevronRight" :size="14" />
          <NuxtLink to="/tirth" class="hover:text-gray-900 transition-colors">Tirth</NuxtLink>
          <Icon name="ChevronRight" :size="14" />
          <span class="text-gray-900 font-medium truncate">{{ tirth.name }}</span>
        </div>
        <!-- Header Section -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
          <!-- Image Gallery -->
          <div class="space-y-4">
            <div class="relative group overflow-hidden rounded-2xl shadow-2xl bg-gradient-to-br from-amber-100 to-orange-100 h-96 lg:h-[500px]">
              <img
                :src="currentImage"
                :alt="tirth.name"
                class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <!-- Image Counter -->
              <div v-if="tirth.images && tirth.images.length > 1" class="absolute top-4 right-4 bg-black/50 backdrop-blur-md px-4 py-2 rounded-full text-white text-sm font-semibold">
                {{ currentImageIndex + 1 }} / {{ tirth.images.length }}
              </div>

              <!-- Navigation Dots -->
              <div v-if="tirth.images && tirth.images.length > 1" class="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
                <button
                  v-for="(_, index) in tirth.images"
                  :key="index"
                  @click="currentImageIndex = index"
                  :class="[
                    'transition-all duration-300 backdrop-blur-sm',
                    index === currentImageIndex 
                      ? 'w-8 h-3 bg-white rounded-full' 
                      : 'w-3 h-3 bg-white/50 hover:bg-white/75 rounded-full'
                  ]"
                />
              </div>

              <!-- Arrow Navigation -->
              <button
                v-if="tirth.images && tirth.images.length > 1"
                @click="previousImage"
                class="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-gray-900 p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 z-10 shadow-lg hover:shadow-xl hover:scale-110"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                v-if="tirth.images && tirth.images.length > 1"
                @click="nextImage"
                class="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-gray-900 p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 z-10 shadow-lg hover:shadow-xl hover:scale-110"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            <!-- Thumbnails -->
            <div v-if="tirth.images && tirth.images.length > 1" class="flex gap-2 overflow-x-auto pb-2 scroll-smooth">
              <button
                v-for="(image, index) in tirth.images"
                :key="index"
                @click="currentImageIndex = index"
                :class="[
                  'flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-3 transition-all duration-300 hover:shadow-lg transform hover:scale-105',
                  index === currentImageIndex 
                    ? 'border-amber-500 ring-2 ring-amber-300 shadow-lg' 
                    : 'border-gray-200 hover:border-amber-400'
                ]"
              >
                <img :src="image" :alt="`${tirth.name} ${index + 1}`" class="w-full h-full object-cover" />
              </button>
            </div>
          </div>          <!-- Info Section -->
          <div class="space-y-6 flex flex-col justify-center">
            <!-- Header -->
            <div>
              <div class="flex items-center gap-3 mb-3">
                <div class="w-2 h-8 bg-gradient-to-b from-amber-500 to-orange-600 rounded-full" />
                <h1 class="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-amber-900 via-amber-700 to-orange-600 bg-clip-text text-transparent">
                  {{ tirth?.name || '' }}
                </h1>
              </div>
              <p class="text-lg text-gray-600 flex items-center gap-2 ml-5">
                <Icon name="MapPin" :size="18" class="text-amber-600" />
                {{ tirth?.location?.city || '' }}, {{ tirth?.location?.state || '' }}
              </p>
            </div>

            <!-- Rating & Badges -->
            <div class="flex flex-wrap items-center gap-3 pb-4 border-b-2 border-gradient-to-r from-amber-200 to-transparent">
              <div class="flex items-center gap-2 bg-gradient-to-r from-yellow-50 to-amber-50 px-4 py-2 rounded-xl border border-yellow-200 shadow-sm">
                <Icon name="Star" :size="20" class="fill-yellow-400 text-yellow-400 animate-pulse" />
                <span class="font-bold text-gray-900">{{ tirth?.rating ?? '-' }}</span>
                <span class="text-xs text-gray-600">({{ tirth?.reviews ?? 0 }} reviews)</span>
              </div>
              <span class="px-4 py-2 bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 rounded-xl text-sm font-bold border border-amber-300 shadow-sm">
                {{ tirth?.type || '' }}
              </span>
            </div>

            <!-- Key Info Grid -->
            <div class="grid grid-cols-3 gap-3">
              <div class="bg-gradient-to-br from-amber-50 to-orange-50 p-4 rounded-xl border border-amber-200 hover:shadow-lg transition-all">
                <Icon name="MapPin" :size="20" class="text-amber-600 mb-2" />
                <p class="text-xs text-gray-600 font-semibold uppercase tracking-wide">Type</p>
                <p class="text-sm font-bold text-amber-900">{{ tirth?.type ?? '-' }}</p>
              </div>
              <div class="bg-gradient-to-br from-orange-50 to-red-50 p-4 rounded-xl border border-orange-200 hover:shadow-lg transition-all">
                <Icon name="Users" :size="20" class="text-orange-600 mb-2" />
                <p class="text-xs text-gray-600 font-semibold uppercase tracking-wide">Sect</p>
                <p class="text-sm font-bold text-orange-900">{{ tirth?.sect || '-' }}</p>
              </div>
              <div class="bg-gradient-to-br from-red-50 to-rose-50 p-4 rounded-xl border border-red-200 hover:shadow-lg transition-all">
                <Icon name="Calendar" :size="20" class="text-red-600 mb-2" />
                <p class="text-xs text-gray-600 font-semibold uppercase tracking-wide">Founded</p>
                <p class="text-sm font-bold text-red-900">{{ tirth?.foundingYear ?? '-' }}</p>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex gap-3 pt-2">
              <button class="flex-1 py-3 px-4 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-xl font-bold hover:from-amber-700 hover:to-orange-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center justify-center gap-2 group">
                <Icon name="Phone" :size="20" class="group-hover:animate-bounce" />
                <span>Call Now</span>
              </button>
              <button class="flex-1 py-3 px-4 bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-xl font-bold hover:from-red-700 hover:to-rose-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center justify-center gap-2 group">
                <Icon name="MapPin" :size="20" class="group-hover:animate-pulse" />
                <span>Directions</span>
              </button>
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
import { onBeforeRouteUpdate } from 'vue-router'
import { useTirthStore } from '~/stores/tirth'
import { BaseCard } from '~/components/shared'
import Icon from '~/components/common/Icon.vue'

definePageMeta({
  layout: 'default',
})

const route = useRoute()
const tirthStore = useTirthStore()

const currentImageIndex = ref(0)
const activeTab = ref('about')
const tirth = ref<Tirth | null>(null)
const loading = ref(false)
const error = ref<string | null>(null)

const currentImage = computed(() => {
  if (!tirth.value?.images || tirth.value.images.length === 0) {
    return 'https://via.placeholder.com/500x500'
  }
  return tirth.value.images[currentImageIndex.value] || 'https://via.placeholder.com/500x500'
})

const nextImage = () => {
  if (tirth.value?.images && tirth.value.images.length > 0) {
    currentImageIndex.value = (currentImageIndex.value + 1) % tirth.value.images.length
  }
}

const previousImage = () => {
  if (tirth.value?.images && tirth.value.images.length > 0) {
    currentImageIndex.value = (currentImageIndex.value - 1 + tirth.value.images.length) % tirth.value.images.length
  }
}

const tabs = [
  { id: 'about', label: 'About' },
  { id: 'facilities', label: 'Facilities' },
  { id: 'festivals', label: 'Festivals & Events' },
]

const relatedTirths = computed(() => {
  if (!tirth.value) return []
  return tirthStore.tirths
    .filter((t: Tirth) => t.id !== tirth.value!.id && t.sect === tirth.value!.sect)
    .slice(0, 3)
})

// Back-to-top behavior handled by global `scroll.client.ts` plugin and anchor link

// Server-side initial fetch: hydrate store and selected tirth during SSR
const idParam = (route.params.id ?? '') as string
const { data: serverTirth } = await useAsyncData(`tirth-${idParam}`, () => tirthStore.fetchTirthById(idParam))
if (serverTirth?.value) {
  tirth.value = serverTirth.value as any
  currentImageIndex.value = 0
} else if (tirthStore.tirths.length > 0) {
  // fallback to local store if available
  const found = tirthStore.getTirthById(idParam)
  if (found) {
    tirth.value = found
    currentImageIndex.value = 0
  } else {
    error.value = `Tirth with ID "${idParam}" not found`
  }
} else {
  // If there is nothing available, mark not found
  error.value = `Tirth with ID "${idParam}" not found`
}

// Client navigation: fetch when route param changes
const loadData = async (idParam?: string) => {
  try {
    loading.value = true
    error.value = null
    const id = (idParam ?? route.params.id) as string

    // Try store first, then remote
    const foundLocal = tirthStore.getTirthById(id)
    if (foundLocal) {
      tirth.value = foundLocal
      currentImageIndex.value = 0
      return
    }

    await tirthStore.fetchTirthById(id)
    const found = tirthStore.getTirthById(id)
    if (found) {
      tirth.value = found
      currentImageIndex.value = 0
    } else {
      error.value = `Tirth with ID "${id}" not found`
    }
  } catch (err) {
    error.value = 'Failed to load tirth data'
    console.error('Error loading tirth:', err)
  } finally {
    loading.value = false
  }
}

// React to route param updates when the same component instance is reused
onBeforeRouteUpdate((to) => {
  const nextId = to.params.id as string
  loadData(nextId)
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
