<template>
  <div class="bg-white rounded-lg shadow-lg overflow-hidden">
    <div class="flex flex-col md:flex-row gap-6 p-6">
      <!-- Image Carousel -->
      <div class="md:w-1/2">
        <div class="relative rounded-lg overflow-hidden bg-gray-200 h-96 mb-4">
          <img
            :src="imagesArr[currentImageIndex] || 'https://via.placeholder.com/500x500'"
            :alt="tirth.name"
            class="w-full h-full object-cover"
          />
          
          <!-- Image Navigation -->
          <div v-if="imagesArr.length > 1" class="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
            <button
              v-for="(_, index) in imagesArr"
              :key="index"
              @click="currentImageIndex = index"
              :class="[
                'w-2 h-2 rounded-full transition-all',
                index === currentImageIndex ? 'bg-white w-8' : 'bg-white/50 hover:bg-white/75'
              ]"
            />
          </div>
        </div>

        <!-- Thumbnail Strip -->
        <div v-if="imagesArr.length > 1" class="flex gap-2 overflow-x-auto">
          <button
            v-for="(image, index) in imagesArr"
            :key="index"
            @click="currentImageIndex = index"
            :class="[
              'flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all',
              index === currentImageIndex ? 'border-amber-600' : 'border-gray-200'
            ]"
          >
            <img :src="image" :alt="`Image ${index + 1}`" class="w-full h-full object-cover" />
          </button>
        </div>
      </div>

      <!-- Information -->
      <div class="md:w-1/2">
        <!-- Header -->
        <div class="flex items-start justify-between mb-4">
          <div>
            <h1 class="text-4xl font-bold text-gray-900 mb-2">{{ tirth.name }}</h1>
            <p class="text-lg text-gray-600">{{ tirth.location.city }}, {{ tirth.location.state }}</p>
          </div>
          <button
            @click="toggleFavorite"
            class="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <Icon
              :name="isFav ? 'Heart' : 'HeartOff'"
              :size="28"
              :class="isFav ? 'fill-red-500 text-red-500' : 'text-gray-600'"
            />
          </button>
        </div>

        <!-- Rating & Type -->
        <div class="flex items-center gap-4 mb-6 pb-6 border-b">
          <div class="flex items-center gap-2">
            <Icon name="Star" :size="20" class="fill-yellow-400 text-yellow-400" />
            <span class="font-semibold">{{ tirth.rating }}</span>
            <span class="text-gray-600">({{ tirth.reviews }} reviews)</span>
          </div>
          <span class="px-3 py-1 bg-amber-50 text-amber-700 rounded-full text-sm font-semibold">
            {{ formatType(tirth.type) }}
          </span>
          <span class="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-semibold">
            {{ tirth.sect }}
          </span>
        </div>

        <!-- Quick Info -->
        <div class="grid grid-cols-2 gap-4 mb-6">
          <div class="bg-gray-50 p-4 rounded-lg">
            <p class="text-sm text-gray-600 mb-1">Founded</p>
            <p class="text-lg font-semibold text-gray-900">{{ tirth.foundingYear }}</p>
          </div>
          <div class="bg-gray-50 p-4 rounded-lg">
            <p class="text-sm text-gray-600 mb-1">Pratishtha Year</p>
            <p class="text-lg font-semibold text-gray-900">{{ tirth.pratisthaYear }}</p>
          </div>
          <div class="bg-gray-50 p-4 rounded-lg col-span-2">
            <p class="text-sm text-gray-600 mb-1">Acharya</p>
            <p class="text-lg font-semibold text-gray-900">{{ tirth.acharya }}</p>
          </div>
        </div>

        <!-- Timings -->
        <div class="space-y-2 mb-6">
          <div class="flex items-center gap-2">
            <Icon name="Clock" :size="18" class="text-amber-600" />
            <span class="text-sm"><strong>Darshan:</strong> {{ tirth.darshanTimings }}</span>
          </div>
          <div class="flex items-center gap-2">
            <Icon name="Clock" :size="18" class="text-amber-600" />
            <span class="text-sm"><strong>Pooja:</strong> {{ tirth.poojaTimings }}</span>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex gap-3">
          <button
            @click="openMap"
            class="flex-1 py-3 bg-amber-600 text-white rounded-lg font-semibold hover:bg-amber-700 transition-colors flex items-center justify-center gap-2"
          >
            <Icon name="MapPin" :size="20" />
            View on Map
          </button>
          <button
            @click="openDirections"
            class="flex-1 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
          >
            <Icon name="Navigation" :size="20" />
            Directions
          </button>
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
