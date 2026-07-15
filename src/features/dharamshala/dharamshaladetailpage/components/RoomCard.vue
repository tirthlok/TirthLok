<template>
  <div
    :class="[
      'bg-white rounded-2xl border-2 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group',
      statusClass === 'sold_out'
        ? 'border-gray-200 opacity-75'
        : 'border-blue-200 hover:border-blue-400 hover:scale-[1.02]'
    ]"
  >
    <!-- Room Image Carousel -->
    <div class="relative h-48 sm:h-52 overflow-hidden bg-gradient-to-br from-blue-100 to-cyan-100">
      <img
        :src="currentImage"
        :alt="room.name"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        loading="lazy"
        @error="handleImageError"
      />
      <div class="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <!-- Carousel Navigation -->
      <div v-if="images.length > 1" class="absolute inset-0 flex items-center justify-between px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <button
          @click.stop="previousImage"
          class="p-1.5 bg-white/80 hover:bg-white rounded-full transition-all transform hover:scale-110 shadow-md"
          aria-label="Previous image"
        >
          <Icon name="ChevronLeft" :size="16" class="text-gray-900" />
        </button>
        <button
          @click.stop="nextImage"
          class="p-1.5 bg-white/80 hover:bg-white rounded-full transition-all transform hover:scale-110 shadow-md"
          aria-label="Next image"
        >
          <Icon name="ChevronRight" :size="16" class="text-gray-900" />
        </button>
      </div>

      <!-- Image Indicators -->
      <div v-if="images.length > 1" class="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
        <button
          v-for="(_, index) in images"
          :key="index"
          @click.stop="currentImageIndex = index"
          :class="[
            'rounded-full transition-all duration-300',
            index === currentImageIndex ? 'w-5 h-2 bg-white' : 'w-2 h-2 bg-white/60 hover:bg-white/80'
          ]"
          :aria-label="`Go to image ${index + 1}`"
        />
      </div>

      <!-- Availability Badge -->
      <div class="absolute top-3 right-3">
        <span
          v-if="statusClass === 'available'"
          class="px-3 py-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-bold rounded-full shadow-lg flex items-center gap-1"
        >
          <span class="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
          Available
        </span>
        <span
          v-else-if="statusClass === 'limited'"
          class="px-3 py-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold rounded-full shadow-lg flex items-center gap-1"
        >
          <span class="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
          {{ room.total_inventory }} left
        </span>
        <span
          v-else
          class="px-3 py-1 bg-gradient-to-r from-red-500 to-rose-500 text-white text-xs font-bold rounded-full shadow-lg"
        >
          Sold Out
        </span>
      </div>

      <!-- Room Category Badge -->
      <div class="absolute top-3 left-3">
        <span class="px-3 py-1 bg-gradient-to-r from-blue-600 to-cyan-600 text-white text-xs font-bold rounded-full shadow-lg capitalize">
          {{ room.room_category }}
        </span>
      </div>
    </div>

    <!-- Room Details -->
    <div class="p-4 sm:p-5 space-y-3">
      <!-- Room Header -->
      <div class="flex justify-between items-start gap-2">
        <div class="min-w-0">
          <div class="flex items-center gap-2 mb-0.5">
            <div class="w-1 h-5 bg-gradient-to-b from-blue-600 to-cyan-600 rounded-full flex-shrink-0" />
            <h3 class="text-lg font-bold text-gray-900 truncate">{{ room.name }}</h3>
          </div>
          <p class="text-xs text-gray-500 ml-3 font-medium">{{ room.bed_configuration }}</p>
        </div>
        <div class="text-right flex-shrink-0">
          <p class="text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">₹{{ room.base_price }}</p>
          <p class="text-xs text-gray-500 font-medium">per night</p>
        </div>
      </div>

      <!-- Room Description -->
      <p v-if="room.description" class="text-xs text-gray-600 leading-relaxed line-clamp-2">{{ room.description }}</p>

      <!-- Capacity & Max Guests -->
      <div class="grid grid-cols-2 gap-2">
        <div class="bg-gradient-to-br from-blue-50 to-cyan-50 p-2.5 rounded-xl border border-blue-100 hover:shadow-md transition-all">
          <Icon name="Users" :size="16" class="text-blue-600 mb-1" />
          <p class="text-[10px] text-gray-500 font-semibold uppercase tracking-wider">Capacity</p>
          <p class="text-sm font-bold text-blue-900">{{ room.capacity }}</p>
        </div>
        <div class="bg-gradient-to-br from-blue-50 to-cyan-50 p-2.5 rounded-xl border border-blue-100 hover:shadow-md transition-all">
          <Icon name="Users" :size="16" class="text-blue-600 mb-1" />
          <p class="text-[10px] text-gray-500 font-semibold uppercase tracking-wider">Max Guests</p>
          <p class="text-sm font-bold text-blue-900">{{ room.max_guests }}</p>
        </div>
      </div>

      <!-- Inventory Count -->
      <div v-if="statusClass !== 'sold_out'" class="flex items-center gap-2 text-xs">
        <div :class="['w-2 h-2 rounded-full', statusClass === 'limited' ? 'bg-amber-500 animate-pulse' : 'bg-green-500']" />
        <span class="text-gray-600 font-medium">{{ room.total_inventory }} rooms available</span>
      </div>

      <!-- Amenities -->
      <div v-if="room.amenities && room.amenities.length > 0" class="space-y-1.5">
        <p class="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Amenities</p>
        <div class="flex flex-wrap gap-1">
          <span
            v-for="amenity in room.amenities.slice(0, 2)"
            :key="amenity"
            class="text-xs bg-blue-50 text-blue-700 px-2.5 py-0.5 rounded-full border border-blue-200 font-medium"
          >
            {{ amenity }}
          </span>
          <span
            v-if="room.amenities.length > 2"
            class="text-xs bg-gray-50 text-gray-500 px-2.5 py-0.5 rounded-full border border-gray-200 font-medium"
          >
            +{{ room.amenities.length - 2 }} more
          </span>
        </div>
      </div>

      <!-- Action Button -->
      <div class="pt-1">
        <button
          v-if="statusClass !== 'sold_out'"
          @click="selectRoom"
          class="w-full py-2.5 px-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-bold text-sm hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 transform hover:shadow-lg hover:scale-[1.02] flex items-center justify-center gap-2 active:scale-95"
        >
          <Icon name="Calendar" :size="16" />
          Book Now
        </button>
        <button
          v-else
          disabled
          class="w-full py-2.5 px-4 bg-gray-100 text-gray-400 rounded-xl font-bold text-sm cursor-not-allowed flex items-center justify-center gap-2 border border-gray-200"
        >
          <Icon name="X" :size="16" />
          Sold Out
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { RoomType, RoomAvailabilityStatus } from '~/types/models'
import Icon from '~/components/ui/Icon.vue'
import { useRoomBookingApi } from '~/features/dharamshala/dharamshaladetailpage/services/roomBookingApi'

interface Props {
  room: RoomType
  dharamshalaId: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  selectRoom: [room: RoomType]
}>()

const { getRoomAvailabilityStatus } = useRoomBookingApi()

const currentImageIndex = ref(0)
const imageErrored = ref(false)

// Use room_type_images from Supabase schema
const images = computed(() => {
  if (props.room.room_type_images && props.room.room_type_images.length > 0) {
    return props.room.room_type_images
  }
  return ['https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&h=400&fit=crop']
})

const currentImage = computed(() => {
  if (imageErrored.value) {
    return 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&h=400&fit=crop'
  }
  return images.value[currentImageIndex.value] || images.value[0]
})

const statusClass = computed<RoomAvailabilityStatus>(() => {
  return getRoomAvailabilityStatus(props.room)
})

const nextImage = () => {
  currentImageIndex.value = (currentImageIndex.value + 1) % images.value.length
  imageErrored.value = false
}

const previousImage = () => {
  currentImageIndex.value = (currentImageIndex.value - 1 + images.value.length) % images.value.length
  imageErrored.value = false
}

const handleImageError = () => {
  imageErrored.value = true
}

const selectRoom = () => {
  if (statusClass.value !== 'sold_out') {
    emit('selectRoom', props.room)
  }
}
</script>
