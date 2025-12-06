<template>
  <div class="bg-white rounded-xl border-2 border-blue-200 shadow-md hover:shadow-lg hover:border-blue-400 transition-all duration-300 overflow-hidden group hover:scale-105">
    <!-- Room Image Carousel -->
    <div class="relative h-40 overflow-hidden bg-blue-100">
      <img
        :src="currentImage"
        :alt="`${room.roomNumber}`"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
      />
      <div class="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <!-- Carousel Navigation -->
      <div v-if="images.length > 1" class="absolute inset-0 flex items-center justify-between px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <button
          @click.stop="previousImage"
          class="p-1 bg-white/80 hover:bg-white rounded-full transition-all transform hover:scale-110"
        >
          <Icon name="ChevronLeft" :size="16" class="text-gray-900" />
        </button>
        <button
          @click.stop="nextImage"
          class="p-1 bg-white/80 hover:bg-white rounded-full transition-all transform hover:scale-110"
        >
          <Icon name="ChevronRight" :size="16" class="text-gray-900" />
        </button>
      </div>
      
      <!-- Image Indicators -->
      <div v-if="images.length > 1" class="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
        <button
          v-for="(_, index) in images"
          :key="index"
          @click.stop="currentImageIndex = index"
          :class="[
            'w-1.5 h-1.5 rounded-full transition-all',
            index === currentImageIndex ? 'bg-white w-4' : 'bg-white/60'
          ]"
        />
      </div>

      <!-- Availability Badge -->
      <div class="absolute top-4 right-4">
        <span
          v-if="room.available"
          class="px-3 py-1 bg-green-500 text-white text-xs font-bold rounded-full shadow-lg"
        >
          Available
        </span>
        <span v-else class="px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full shadow-lg">
          Booked
        </span>
      </div>

      <!-- Room Type Badge -->
      <div class="absolute top-4 left-4">
        <span class="px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded-full shadow-lg capitalize">
          {{ room.type }}
        </span>
      </div>
    </div>

    <!-- Room Details -->
    <div class="p-4 space-y-3">
      <!-- Room Header -->
      <div class="flex justify-between items-start gap-2">
        <div>
          <div class="flex items-center gap-2 mb-0.5">
            <div class="w-0.5 h-4 bg-blue-600 rounded-full" />
            <h3 class="text-base font-bold text-gray-900">Room {{ room.roomNumber }}</h3>
          </div>
          <p class="text-xs text-gray-600 ml-2.5">{{ room.bedType }}</p>
        </div>
        <div class="text-right">
          <p class="text-xl font-bold text-blue-600">₹{{ room.price }}</p>
          <p class="text-xs text-gray-600">per night</p>
        </div>
      </div>

      <!-- Room Description -->
      <p v-if="room.description" class="text-xs text-gray-700 leading-relaxed line-clamp-2">{{ room.description }}</p>

      <!-- Capacity & Max Guests -->
      <div class="grid grid-cols-2 gap-2">
        <div class="bg-blue-50 p-2 rounded-lg border border-blue-200 hover:shadow-md transition-all">
          <Icon name="Users" :size="16" class="text-blue-600 mb-1" />
          <p class="text-xs text-gray-600 font-semibold">Capacity</p>
          <p class="text-sm font-bold text-blue-900">{{ room.capacity }}</p>
        </div>
        <div class="bg-blue-50 p-2 rounded-lg border border-blue-200 hover:shadow-md transition-all">
          <Icon name="Users" :size="16" class="text-blue-600 mb-1" />
          <p class="text-xs text-gray-600 font-semibold">Max Guests</p>
          <p class="text-sm font-bold text-blue-900">{{ room.maxGuests }}</p>
        </div>
      </div>

      <!-- Amenities -->
      <div v-if="room.amenities && room.amenities.length > 0" class="bg-blue-50 p-2 rounded-lg border border-blue-200 space-y-1.5">
        <p class="text-xs font-semibold text-gray-700 uppercase tracking-wide">Amenities</p>
        <div class="flex flex-wrap gap-1">
          <span v-for="amenity in room.amenities.slice(0, 2)" :key="amenity" class="text-xs bg-white text-blue-700 px-2 py-0.5 rounded-full border border-blue-200 font-semibold">
            {{ amenity }}
          </span>
          <span v-if="room.amenities.length > 2" class="text-xs bg-white text-gray-600 px-2 py-0.5 rounded-full border border-gray-200 font-semibold">
            +{{ room.amenities.length - 2 }} more
          </span>
        </div>
      </div>

      <!-- Action Button -->
      <div v-if="room.available" class="pt-1">
        <button
          @click="selectRoom"
          class="w-full py-2 px-3 bg-blue-600 text-white rounded-lg font-bold text-sm hover:bg-blue-700 transition-all duration-300 transform hover:shadow-md flex items-center justify-center gap-2"
        >
          <Icon name="Calendar" :size="14" />
          Book Now
        </button>
      </div>
      <div v-else class="pt-1">
        <button disabled class="w-full py-2 px-3 bg-gray-300 text-gray-500 rounded-lg font-bold text-sm cursor-not-allowed flex items-center justify-center gap-2">
          <Icon name="X" :size="14" />
          Unavailable
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Room } from '~/types/models'
import { Icon } from '~/components/shared'

interface Props {
  room: Room
  dharamshalaId: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  selectRoom: [room: Room]
}>()

const currentImageIndex = ref(0)

// Generate multiple images for carousel (using room image and placeholder variations)
const images = computed(() => {
  const imageList: string[] = []
  if (props.room.image) {
    imageList.push(props.room.image)
  }
  // Add 2 more placeholder variations
  imageList.push(`https://via.placeholder.com/400x300?text=${props.room.type}+Room+1`)
  imageList.push(`https://via.placeholder.com/400x300?text=${props.room.type}+Room+2`)
  return imageList
})

const currentImage = computed(() => images.value[currentImageIndex.value] || images.value[0])

const nextImage = () => {
  currentImageIndex.value = (currentImageIndex.value + 1) % images.value.length
}

const previousImage = () => {
  currentImageIndex.value = (currentImageIndex.value - 1 + images.value.length) % images.value.length
}

const selectRoom = () => {
  if (props.room.available) {
    emit('selectRoom', props.room)
  }
}
</script>
