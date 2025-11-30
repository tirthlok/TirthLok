<template>
  <div id="top" class="min-h-screen bg-gradient-to-b from-green-50 via-white to-emerald-50 py-4 sm:py-8 md:py-12">
    <div class="px-3 sm:px-4 lg:px-6 max-w-full mx-auto">

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center py-32">
        <div class="text-center space-y-6">
          <div class="relative w-16 h-16 mx-auto">
            <div class="absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full animate-spin" style="clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%, 0% 50%)" />
            <div class="absolute inset-2 bg-white rounded-full" />
          </div>
          <p class="text-gray-600 font-semibold text-lg">Loading bhojanshala details...</p>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="flex justify-center items-center py-32">
        <div class="text-center space-y-6 max-w-md">
          <Icon name="AlertTriangle" :size="48" class="text-red-500 mx-auto" />
          <p class="text-red-600 font-semibold text-lg">{{ error }}</p>
          <NuxtLink to="/bhojanshala" class="inline-block px-6 py-3 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700">
            Return to List
          </NuxtLink>
        </div>
      </div>

      <!-- Content -->
      <div v-else-if="bhojanshala" class="space-y-8 sm:space-y-10">
              <!-- Breadcrumb -->
        <div class="flex items-center gap-2 text-sm text-gray-500">
          <NuxtLink to="/" class="hover:text-gray-900 transition-colors">Home</NuxtLink>
          <Icon name="ChevronRight" :size="14" />
          <NuxtLink to="/bhojanshala" class="hover:text-gray-900 transition-colors">Bhojanshala</NuxtLink>
          <Icon name="ChevronRight" :size="14" />
          <span class="text-gray-900 font-medium truncate">{{ bhojanshala.name }}</span>
        </div>
        <!-- Header Section -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
          <!-- Image Gallery -->
          <div class="space-y-4">
            <div class="relative group overflow-hidden rounded-2xl shadow-2xl bg-gradient-to-br from-green-100 to-emerald-100 h-96 lg:h-[500px]">
              <img
                :src="currentImage"
                :alt="bhojanshala.name"
                class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <!-- Image Counter -->
              <div v-if="bhojanshala.images && bhojanshala.images.length > 1" class="absolute top-4 right-4 bg-black/50 backdrop-blur-md px-4 py-2 rounded-full text-white text-sm font-semibold">
                {{ currentImageIndex + 1 }} / {{ bhojanshala.images.length }}
              </div>

              <!-- Navigation Dots -->
              <div v-if="bhojanshala.images && bhojanshala.images.length > 1" class="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
                <button
                  v-for="(_, index) in bhojanshala.images"
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
                v-if="bhojanshala.images && bhojanshala.images.length > 1"
                @click="previousImage"
                class="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-gray-900 p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 z-10 shadow-lg hover:shadow-xl hover:scale-110"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                v-if="bhojanshala.images && bhojanshala.images.length > 1"
                @click="nextImage"
                class="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-gray-900 p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 z-10 shadow-lg hover:shadow-xl hover:scale-110"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            <!-- Thumbnails -->
            <div v-if="bhojanshala.images && bhojanshala.images.length > 1" class="flex gap-2 overflow-x-auto pb-2 scroll-smooth">
              <button
                v-for="(image, index) in bhojanshala.images"
                :key="index"
                @click="currentImageIndex = index"
                :class="[
                  'flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-3 transition-all duration-300 hover:shadow-lg transform hover:scale-105',
                  index === currentImageIndex 
                    ? 'border-green-500 ring-2 ring-green-300 shadow-lg' 
                    : 'border-gray-200 hover:border-green-400'
                ]"
              >
                <img :src="image" :alt="`${bhojanshala.name} ${index + 1}`" class="w-full h-full object-cover" />
              </button>
            </div>
          </div>

          <!-- Info Section -->
          <div class="space-y-6 flex flex-col justify-center">
            <!-- Header -->
            <div>
              <div class="flex items-center gap-3 mb-3">
                <div class="w-2 h-8 bg-gradient-to-b from-green-500 to-emerald-600 rounded-full" />
                <h1 class="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-green-900 via-green-700 to-emerald-600 bg-clip-text text-transparent">
                  {{ bhojanshala.name }}
                </h1>
              </div>
              <p class="text-lg text-gray-600 flex items-center gap-2 ml-5">
                <Icon name="MapPin" :size="18" class="text-green-600" />
                {{ bhojanshala.location.city }}, {{ bhojanshala.location.state }}
              </p>
            </div>

            <!-- Rating & Badges -->
            <div class="flex flex-wrap items-center gap-3 pb-4 border-b-2 border-gradient-to-r from-green-200 to-transparent">
              <div class="flex items-center gap-2 bg-gradient-to-r from-yellow-50 to-amber-50 px-4 py-2 rounded-xl border border-yellow-200 shadow-sm">
                <Icon name="Star" :size="20" class="fill-yellow-400 text-yellow-400 animate-pulse" />
                <span class="font-bold text-gray-900">{{ bhojanshala.rating }}</span>
                <span class="text-xs text-gray-600">({{ bhojanshala.reviews }} reviews)</span>
              </div>
              <span class="px-4 py-2 bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 rounded-xl text-sm font-bold border border-green-300 shadow-sm">
                {{ bhojanshala.type }}
              </span>
            </div>

            <!-- Key Info Grid -->
            <div class="grid grid-cols-3 gap-3">
              <div class="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-xl border border-green-200 hover:shadow-lg transition-all">
                <Icon name="Clock" :size="20" class="text-green-600 mb-2" />
                <p class="text-xs text-gray-600 font-semibold uppercase tracking-wide">Hours</p>
                <p class="text-sm font-bold text-green-900">{{ bhojanshala.operatingHours }}</p>
              </div>
              <div class="bg-gradient-to-br from-emerald-50 to-teal-50 p-4 rounded-xl border border-emerald-200 hover:shadow-lg transition-all">
                <Icon name="IndianRupee" :size="20" class="text-emerald-600 mb-2" />
                <p class="text-xs text-gray-600 font-semibold uppercase tracking-wide">Price</p>
                <p class="text-sm font-bold text-emerald-900">{{ bhojanshala.priceRange }}</p>
              </div>
              <div class="bg-gradient-to-br from-teal-50 to-cyan-50 p-4 rounded-xl border border-teal-200 hover:shadow-lg transition-all">
                <Icon name="Leaf" :size="20" class="text-teal-600 mb-2" />
                <p class="text-xs text-gray-600 font-semibold uppercase tracking-wide">Pure</p>
                <p class="text-sm font-bold text-teal-900">Vegetarian</p>
              </div>
            </div>

            <!-- Contact Section -->
            <div class="space-y-3 bg-gradient-to-r from-green-50 to-emerald-50 p-5 rounded-xl border-l-4 border-green-600">
              <div class="flex items-center gap-3 font-semibold text-gray-900">
                <Icon name="Phone" :size="20" class="text-green-600" />
                <span class="uppercase text-sm tracking-wide">Contact</span>
              </div>
              <div class="space-y-2 ml-8">
                <div class="flex items-center gap-2 text-gray-700">
                  <div class="w-2 h-2 bg-green-500 rounded-full" />
                  <a :href="`tel:${bhojanshala.contact.phone}`" class="text-green-600 hover:underline font-semibold">{{ bhojanshala.contact.phone }}</a>
                </div>
                <div v-if="bhojanshala.contact.email" class="flex items-center gap-2 text-gray-700">
                  <div class="w-2 h-2 bg-emerald-500 rounded-full" />
                  <a :href="`mailto:${bhojanshala.contact.email}`" class="text-green-600 hover:underline font-semibold truncate">{{ bhojanshala.contact.email }}</a>
                </div>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex gap-3 pt-2">
              <button class="flex-1 py-3 px-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-bold hover:from-green-700 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center justify-center gap-2 group">
                <Icon name="Phone" :size="20" class="group-hover:animate-bounce" />
                <span>Call Now</span>
              </button>
              <button class="flex-1 py-3 px-4 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-xl font-bold hover:from-amber-700 hover:to-orange-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center justify-center gap-2 group">
                <Icon name="MapPin" :size="20" class="group-hover:animate-pulse" />
                <span>Location</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Cuisines Section -->
        <div v-if="bhojanshala.cuisineTypes && bhojanshala.cuisineTypes.length > 0" class="bg-gradient-to-r from-green-50 to-emerald-50 p-8 rounded-2xl border-2 border-green-200">
          <h2 class="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <Icon name="Utensils" :size="28" class="text-green-600" />
            Cuisines Available
          </h2>
          <div class="flex flex-wrap gap-3">
            <span v-for="cuisine in bhojanshala.cuisineTypes" :key="cuisine" class="px-4 py-2 bg-white rounded-lg border-2 border-green-200 font-semibold text-green-700 hover:border-green-400 transition-all">
              {{ cuisine }}
            </span>
          </div>
        </div>

        <!-- Description Section -->
        <div class="bg-gradient-to-r from-blue-50 to-cyan-50 p-8 rounded-2xl border-2 border-blue-200">
          <h2 class="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
            <Icon name="BookOpen" :size="28" class="text-blue-600" />
            About This Bhojanshala
          </h2>
          <p class="text-gray-700 leading-relaxed text-lg mb-4">
            {{ bhojanshala.description }}
          </p>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
            <div class="p-4 bg-white rounded-lg border-l-4 border-green-500">
              <p class="text-sm text-gray-600 mb-1"><strong>Specialty:</strong></p>
              <p class="text-green-700 font-semibold">Vegetarian cuisine following traditional recipes</p>
            </div>
            <div class="p-4 bg-white rounded-lg border-l-4 border-emerald-500">
              <p class="text-sm text-gray-600 mb-1"><strong>Service:</strong></p>
              <p class="text-emerald-700 font-semibold">Dine-in and takeaway options available</p>
            </div>
          </div>
        </div>

        <!-- Back to Top Button -->
        <div class="flex justify-center pt-8 border-t">
          <a
            href="#top"
            class="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-full font-bold hover:from-green-700 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center gap-2"
          >
            <Icon name="ArrowUp" :size="20" />
            <span>Back to Top</span>
          </a>
        </div>
      </div>

      <!-- Not Found -->
      <div v-else class="flex justify-center items-center py-32">
        <div class="text-center space-y-6 max-w-md">
          <p class="text-gray-600 font-semibold text-lg">Bhojanshala not found</p>
          <NuxtLink to="/bhojanshala" class="inline-block px-6 py-3 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700">
            Return to List
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Bhojanshala } from '~/types/models'
import { ref, computed } from 'vue'
import { onBeforeRouteUpdate } from 'vue-router'
import { useBhojanshalaStore } from '~/stores/bhojanshala'
import Icon from '~/components/common/Icon.vue'

definePageMeta({
  layout: 'default',
})

const route = useRoute()
const bhojanshalaStore = useBhojanshalaStore()

const currentImageIndex = ref(0)
const bhojanshala = ref<Bhojanshala | null>(null)
const loading = ref(false)
const error = ref<string | null>(null)

const currentImage = computed(() => {
  if (!bhojanshala.value?.images || bhojanshala.value.images.length === 0) {
    return 'https://via.placeholder.com/500x500'
  }
  return bhojanshala.value.images[currentImageIndex.value] || 'https://via.placeholder.com/500x500'
})

const nextImage = () => {
  if (bhojanshala.value?.images && bhojanshala.value.images.length > 0) {
    currentImageIndex.value = (currentImageIndex.value + 1) % bhojanshala.value.images.length
  }
}

const previousImage = () => {
  if (bhojanshala.value?.images && bhojanshala.value.images.length > 0) {
    currentImageIndex.value = (currentImageIndex.value - 1 + bhojanshala.value.images.length) % bhojanshala.value.images.length
  }
}

// Back-to-top behavior handled by global `scroll.client.ts` plugin and anchor link

// Server-side initial fetch
const routeId = (route.params.id ?? '') as string
const { data: serverBh } = await useAsyncData(`bhojanshala-${routeId}`, () => bhojanshalaStore.fetchBhojanshalas())
if (serverBh?.value && Array.isArray((serverBh.value as any)) && (serverBh.value as any).length > 0) {
  const found = bhojanshalaStore.getBhojanshalAById(routeId)
  if (found) {
    bhojanshala.value = found
    currentImageIndex.value = 0
  }
} else if (bhojanshalaStore.bhojanshalas.length > 0) {
  const found = bhojanshalaStore.getBhojanshalAById(routeId)
  if (found) {
    bhojanshala.value = found
    currentImageIndex.value = 0
  } else {
    error.value = `Bhojanshala with ID "${routeId}" not found`
  }
} else {
  // attempt a direct fetch-by-id if list fetch didn't populate
  await bhojanshalaStore.fetchBhojanshalas()
  const found = bhojanshalaStore.getBhojanshalAById(routeId)
  if (found) {
    bhojanshala.value = found
    currentImageIndex.value = 0
  } else {
    error.value = `Bhojanshala with ID "${routeId}" not found`
  }
}

// Client navigation handler
const loadData = async (idParam?: string) => {
  try {
    loading.value = true
    error.value = null
    const id = (idParam ?? route.params.id) as string

    const local = bhojanshalaStore.getBhojanshalAById(id)
    if (local) {
      bhojanshala.value = local
      currentImageIndex.value = 0
      return
    }

    await bhojanshalaStore.fetchBhojanshalas()
    const found = bhojanshalaStore.getBhojanshalAById(id)
    if (found) {
      bhojanshala.value = found
      currentImageIndex.value = 0
    } else {
      error.value = `Bhojanshala with ID "${id}" not found`
    }
  } catch (err) {
    error.value = 'Failed to load bhojanshala data'
    console.error('Error loading bhojanshala:', err)
  } finally {
    loading.value = false
  }
}

onBeforeRouteUpdate((to) => {
  const nextId = to.params.id as string
  loadData(nextId)
})
</script>
