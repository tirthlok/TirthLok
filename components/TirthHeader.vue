<template>
  <div class="relative overflow-hidden">
    <!-- Animated Background -->
    <div class="absolute inset-0 bg-gradient-to-br from-amber-50 via-white to-blue-50 opacity-60 pointer-events-none" />
    <div class="relative">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
        <!-- Image Gallery Section -->
        <div class="space-y-4">
          <!-- Main Image Container with advanced effects -->
          <div class="relative group overflow-hidden rounded-2xl shadow-2xl bg-gradient-to-br from-gray-100 to-gray-200 h-96 lg:h-[500px]">
            <!-- Image with zoom effect -->
            <img
              :src="currentImage"
              :alt="tirth.name"
              class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            
            <!-- Gradient Overlay -->
            <div class="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            <!-- Image Counter Badge -->
            <div v-if="imagesArr.length > 1" class="absolute top-4 right-4 bg-black/50 backdrop-blur-md px-4 py-2 rounded-full text-white text-sm font-semibold">
              {{ currentImageIndex + 1 }} / {{ imagesArr.length }}
            </div>

            <!-- Image Navigation Dots -->
            <div v-if="imagesArr.length > 1" class="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
              <button
                v-for="(_, index) in imagesArr"
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
              v-if="imagesArr.length > 1"
              @click="previousImage"
              class="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-gray-900 p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 z-10 shadow-lg hover:shadow-xl hover:scale-110"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              v-if="imagesArr.length > 1"
              @click="nextImage"
              class="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-gray-900 p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 z-10 shadow-lg hover:shadow-xl hover:scale-110"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          <!-- Thumbnail Strip with Advanced Styling -->
          <div v-if="imagesArr.length > 1" class="flex gap-2 overflow-x-auto pb-2 scroll-smooth">
            <button
              v-for="(image, index) in imagesArr"
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
        </div>

        <!-- Information Section -->
        <div class="space-y-6 flex flex-col justify-center">
          <!-- Header with Icon -->
          <div>
            <div class="flex items-start justify-between mb-4">
              <div class="flex-1">
                <div class="flex items-center gap-3 mb-3">
                  <div class="w-2 h-8 bg-gradient-to-b from-amber-500 to-amber-600 rounded-full" />
                  <h1 class="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-amber-900 via-amber-700 to-orange-600 bg-clip-text text-transparent">
                    {{ tirth.name }}
                  </h1>
                </div>
                <p class="text-lg text-gray-600 flex items-center gap-2 ml-5">
                  <Icon name="MapPin" :size="18" class="text-amber-600" />
                  {{ tirth.location.city }}, {{ tirth.location.state }}
                </p>
              </div>
              <button
                @click="toggleFavorite"
                :class="[
                  'p-3 rounded-full transition-all duration-300 transform hover:scale-110',
                  isFav 
                    ? 'bg-red-100 shadow-md' 
                    : 'bg-gray-100 hover:bg-gray-200'
                ]"
              >
                <Icon
                  :name="isFav ? 'Heart' : 'HeartOff'"
                  :size="28"
                  :class="isFav ? 'fill-red-500 text-red-500' : 'text-gray-600'"
                />
              </button>
            </div>
          </div>

          <!-- Rating & Badges Section -->
          <div class="flex flex-wrap items-center gap-3 pb-4 border-b-2 border-gradient-to-r from-amber-200 to-transparent">
            <!-- Rating Card -->
            <div class="flex items-center gap-2 bg-gradient-to-r from-yellow-50 to-amber-50 px-4 py-2 rounded-xl border border-yellow-200 shadow-sm">
              <Icon name="Star" :size="20" class="fill-yellow-400 text-yellow-400 animate-pulse" />
              <div>
                <span class="font-bold text-gray-900">{{ tirth.rating }}</span>
                <span class="text-xs text-gray-600 ml-1">({{ tirth.reviews }} reviews)</span>
              </div>
            </div>
            
            <!-- Type Badge -->
            <span class="px-4 py-2 bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 rounded-xl text-sm font-bold border border-amber-300 shadow-sm">
              {{ formatType(tirth.type) }}
            </span>
            
            <!-- Sect Badge -->
            <span class="px-4 py-2 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 rounded-xl text-sm font-bold border border-blue-300 shadow-sm">
              {{ tirth.sect }}
            </span>
          </div>

          <!-- Key Information Grid -->
          <div class="grid grid-cols-3 gap-3">
            <div class="bg-gradient-to-br from-amber-50 to-orange-50 p-4 rounded-xl border border-amber-200 hover:shadow-lg transition-all">
              <Icon name="Calendar" :size="20" class="text-amber-600 mb-2" />
              <p class="text-xs text-gray-600 font-semibold uppercase tracking-wide">Founded</p>
              <p class="text-xl font-bold text-amber-900">{{ tirth.foundingYear }}</p>
            </div>
            <div class="bg-gradient-to-br from-blue-50 to-cyan-50 p-4 rounded-xl border border-blue-200 hover:shadow-lg transition-all">
              <Icon name="Gem" :size="20" class="text-blue-600 mb-2" />
              <p class="text-xs text-gray-600 font-semibold uppercase tracking-wide">Pratishtha</p>
              <p class="text-xl font-bold text-blue-900">{{ tirth.pratisthaYear }}</p>
            </div>
            <div class="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-xl border border-purple-200 hover:shadow-lg transition-all">
              <Icon name="User" :size="20" class="text-purple-600 mb-2" />
              <p class="text-xs text-gray-600 font-semibold uppercase tracking-wide">Acharya</p>
              <p class="text-sm font-bold text-purple-900 line-clamp-2">{{ tirth.acharya }}</p>
            </div>
          </div>

          <!-- Timings Section -->
          <div class="space-y-3 bg-gradient-to-r from-amber-50 to-orange-50 p-5 rounded-xl border-l-4 border-amber-600">
            <div class="flex items-center gap-3 font-semibold text-gray-900">
              <Icon name="Clock" :size="20" class="text-amber-600" />
              <span class="uppercase text-sm tracking-wide">Timings</span>
            </div>
            <div class="space-y-2 ml-8">
              <div class="flex items-center gap-2 text-gray-700">
                <div class="w-2 h-2 bg-amber-500 rounded-full" />
                <span class="text-sm"><strong>Darshan:</strong> {{ tirth.darshanTimings }}</span>
              </div>
              <div class="flex items-center gap-2 text-gray-700">
                <div class="w-2 h-2 bg-orange-500 rounded-full" />
                <span class="text-sm"><strong>Pooja:</strong> {{ tirth.poojaTimings }}</span>
              </div>
            </div>
          </div>

          <!-- Action Buttons with Enhanced Styling -->
          <div class="flex gap-3 pt-2">
            <button
              @click="openMap"
              class="flex-1 py-3 px-4 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-xl font-bold hover:from-amber-700 hover:to-orange-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center justify-center gap-2 group"
            >
              <Icon name="MapPin" :size="20" class="group-hover:animate-bounce" />
              <span>View on Map</span>
            </button>
            <button
              @click="openDirections"
              class="flex-1 py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center justify-center gap-2 group"
            >
              <Icon name="Navigation" :size="20" class="group-hover:animate-pulse" />
              <span>Directions</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Tirth } from '~/types/models'
import { useUserStore } from '~/stores/user'
import { computed, ref } from 'vue'

const props = defineProps<{
  tirth: Tirth
}>()

const userStore = useUserStore()
const currentImageIndex = ref(0)

// Normalize tirth.images to an array to handle both string or array cases
const imagesArr = computed(() => {
  if (!props.tirth.images) return [] as string[]
  return Array.isArray(props.tirth.images) ? props.tirth.images : [props.tirth.images]
})

const isFav = computed(() => userStore.isFavorite(props.tirth.id))

// Safely get current image
const currentImage = computed(() => {
  if (!imagesArr.value || imagesArr.value.length === 0) {
    return 'https://via.placeholder.com/500x500'
  }
  return imagesArr.value[currentImageIndex.value] || 'https://via.placeholder.com/500x500'
})

// Simple navigation functions with safety guards
const nextImage = () => {
  if (imagesArr.value.length > 0) {
    currentImageIndex.value = (currentImageIndex.value + 1) % imagesArr.value.length
  }
}

const previousImage = () => {
  if (imagesArr.value.length > 0) {
    currentImageIndex.value = (currentImageIndex.value - 1 + imagesArr.value.length) % imagesArr.value.length
  }
}

const toggleFavorite = async () => {
  if (isFav.value) {
    await userStore.removeFavorite(props.tirth.id)
  } else {
    await userStore.addFavorite(props.tirth.id)
  }
}

const formatType = (type: string) => {
  return type.replace(/-/g, ' ')
}

const openMap = () => {
  // TODO: Open map modal
}

const openDirections = () => {
  const { latitude, longitude } = props.tirth.location
  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`
  window.open(googleMapsUrl, '_blank')
}
</script>

<style scoped>
/* Smooth transitions for interactive elements */
button {
  transition: all 0.2s ease;
}
</style>
