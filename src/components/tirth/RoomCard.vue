<template>
  <div class="bg-white rounded-2xl border-2 border-blue-100 shadow-md hover:shadow-xl hover:border-blue-300 transition-all duration-300 overflow-hidden group">
    <!-- Room Image -->
    <div class="relative h-48 overflow-hidden bg-gradient-to-br from-blue-100 to-cyan-100">
      <img
        v-if="room.image"
        :src="room.image"
        :alt="`${room.roomNumber}`"
        class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
      />
      <div v-else class="w-full h-full flex items-center justify-center">
        <Icon name="Home" :size="48" class="text-blue-300" />
      </div>

      <!-- Availability Badge -->
      <div class="absolute top-3 right-3">
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
      <div class="absolute top-3 left-3">
        <span class="px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded-full shadow-lg capitalize">
          {{ room.type }}
        </span>
      </div>
    </div>

    <!-- Room Details -->
    <div class="p-5 space-y-4">
      <!-- Room Header -->
      <div class="flex justify-between items-start">
        <div>
          <h3 class="text-lg font-bold text-gray-900">Room {{ room.roomNumber }}</h3>
          <p class="text-sm text-gray-600">{{ room.bedType }}</p>
        </div>
        <div class="text-right">
          <p class="text-2xl font-bold text-blue-600">₹{{ room.price }}</p>
          <p class="text-xs text-gray-600">per night</p>
        </div>
      </div>

      <!-- Room Description -->
      <p v-if="room.description" class="text-sm text-gray-700">{{ room.description }}</p>

      <!-- Capacity & Max Guests -->
      <div class="grid grid-cols-2 gap-3">
        <div class="bg-blue-50 p-3 rounded-lg border border-blue-100">
          <p class="text-xs text-gray-600 font-semibold uppercase">Capacity</p>
          <p class="text-lg font-bold text-blue-600">{{ room.capacity }}</p>
        </div>
        <div class="bg-cyan-50 p-3 rounded-lg border border-cyan-100">
          <p class="text-xs text-gray-600 font-semibold uppercase">Max Guests</p>
          <p class="text-lg font-bold text-cyan-600">{{ room.maxGuests }}</p>
        </div>
      </div>

      <!-- Amenities -->
      <div v-if="room.amenities && room.amenities.length > 0" class="space-y-2">
        <p class="text-xs font-semibold text-gray-700 uppercase">Amenities</p>
        <div class="flex flex-wrap gap-2">
          <span v-for="amenity in room.amenities.slice(0, 3)" :key="amenity" class="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full border border-blue-200">
            {{ amenity }}
          </span>
          <span v-if="room.amenities.length > 3" class="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
            +{{ room.amenities.length - 3 }} more
          </span>
        </div>
      </div>

      <!-- Action Buttons -->
      <div v-if="room.available" class="flex gap-2 pt-2">
        <button
          @click="selectRoom"
          class="flex-1 py-2 px-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-bold text-sm hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 transform hover:scale-105"
        >
          <Icon name="Calendar" :size="16" class="inline mr-1" />
          Book Now
        </button>
        <button
          class="flex-1 py-2 px-3 bg-gray-100 text-gray-700 rounded-lg font-bold text-sm hover:bg-gray-200 transition-all"
        >
          <Icon name="Info" :size="16" class="inline mr-1" />
          Details
        </button>
      </div>
      <div v-else class="flex gap-2 pt-2">
        <button disabled class="flex-1 py-2 px-3 bg-gray-300 text-gray-500 rounded-lg font-bold text-sm cursor-not-allowed">
          <Icon name="X" :size="16" class="inline mr-1" />
          Unavailable
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
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

const selectRoom = () => {
  if (props.room.available) {
    emit('selectRoom', props.room)
  }
}
</script>
