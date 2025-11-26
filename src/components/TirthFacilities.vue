<template>
  <div class="space-y-6">
    <!-- Header with Icon -->
    <div class="flex items-center gap-3 mb-8">
      <Icon name="Home" :size="32" class="text-blue-600" />
      <h2 class="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Facilities & Amenities</h2>
    </div>

    <!-- Filter Tabs with Modern Styling -->
    <div class="flex gap-2 overflow-x-auto pb-3 scroll-smooth">
      <button
        @click="resetFilters"
        :class="[
          'px-5 py-2.5 rounded-xl font-semibold transition-all duration-300 whitespace-nowrap border-2 flex items-center gap-2',
          activeFilter === null
            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-blue-600 shadow-lg'
            : 'bg-white text-gray-700 border-gray-200 hover:border-blue-300 hover:bg-blue-50'
        ]"
      >
        <Icon name="Grid3X3" :size="18" />
        All Facilities
      </button>
      <button
        v-for="type in facilityTypes"
        :key="type"
        @click="setFilter('type', type)"
        :class="[
          'px-5 py-2.5 rounded-xl font-semibold transition-all duration-300 whitespace-nowrap border-2 flex items-center gap-2',
          activeFilter === type
            ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white border-amber-600 shadow-lg'
            : 'bg-white text-gray-700 border-gray-200 hover:border-amber-300 hover:bg-amber-50'
        ]"
      >
        <Icon name="Check" :size="16" />
        {{ formatType(type) }}
      </button>
    </div>

    <!-- Facilities Grid -->
    <div v-if="filteredItems.length === 0" class="text-center py-16 bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl border-2 border-dashed border-gray-300">
      <Icon name="Home" :size="64" class="text-gray-300 mx-auto mb-4" />
      <p class="text-gray-600 font-semibold text-lg">No facilities found for this category</p>
      <p class="text-gray-500 text-sm mt-2">Try selecting a different filter</p>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div
        v-for="facility in filteredItems"
        :key="facility.id"
        class="bg-white rounded-2xl border-2 border-gray-100 hover:border-blue-300 hover:shadow-2xl transition-all duration-300 overflow-hidden group transform hover:scale-105"
      >
        <!-- Facility Image -->
        <div class="relative h-48 bg-gradient-to-br from-gray-200 to-gray-300 overflow-hidden">
          <img
            :src="facility.image || 'https://via.placeholder.com/300x200'"
            :alt="facility.name"
            class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <!-- Type Badge -->
          <div class="absolute top-4 left-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
            {{ formatType(facility.type) }}
          </div>
          <!-- Rating Badge -->
          <div class="absolute top-4 right-4 flex items-center gap-1 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-lg">
            <Icon name="Star" :size="16" class="fill-yellow-400 text-yellow-400" />
            <span class="text-sm font-bold text-gray-900">{{ facility.rating }}</span>
          </div>
        </div>

        <!-- Facility Info -->
        <div class="p-5">
          <!-- Title -->
          <h3 class="font-bold text-xl text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
            {{ facility.name }}
          </h3>

          <!-- Description -->
          <p class="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">{{ facility.description }}</p>

          <!-- Contact Info Section -->
          <div class="space-y-3 mb-4 pb-4 border-b-2 border-gray-100">
            <div v-if="facility.contact.phone" class="flex items-center gap-3 group/item hover:bg-blue-50 p-2 rounded-lg transition-colors">
              <div class="p-2 bg-blue-100 rounded-lg">
                <Icon name="Phone" :size="16" class="text-blue-600" />
              </div>
              <a :href="`tel:${facility.contact.phone}`" class="text-sm font-semibold text-blue-600 hover:text-blue-800">
                {{ facility.contact.phone }}
              </a>
            </div>
            <div v-if="facility.contact.email" class="flex items-center gap-3 group/item hover:bg-green-50 p-2 rounded-lg transition-colors">
              <div class="p-2 bg-green-100 rounded-lg">
                <Icon name="Mail" :size="16" class="text-green-600" />
              </div>
              <a :href="`mailto:${facility.contact.email}`" class="text-sm font-semibold text-green-600 hover:text-green-800 truncate">
                {{ facility.contact.email }}
              </a>
            </div>
            <div class="flex items-start gap-3">
              <div class="p-2 bg-amber-100 rounded-lg flex-shrink-0">
                <Icon name="MapPin" :size="16" class="text-amber-600" />
              </div>
              <span class="text-xs text-gray-600 leading-relaxed">{{ facility.location.address }}</span>
            </div>
          </div>

          <!-- Availability & Hours Info Cards -->
          <div class="space-y-2 mb-4">
            <div v-if="facility.availability" class="p-3 bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500 rounded-lg">
              <div class="flex items-center gap-2 mb-1">
                <Icon name="CheckCircle" :size="16" class="text-green-600" />
                <p class="text-xs font-bold text-green-700 uppercase tracking-wide">Available</p>
              </div>
              <p class="text-sm text-green-800 font-semibold">{{ facility.availability }}</p>
            </div>
            <div v-if="facility.operatingHours" class="p-3 bg-gradient-to-r from-purple-50 to-pink-50 border-l-4 border-purple-500 rounded-lg">
              <div class="flex items-center gap-2 mb-1">
                <Icon name="Clock" :size="16" class="text-purple-600" />
                <p class="text-xs font-bold text-purple-700 uppercase tracking-wide">Operating Hours</p>
              </div>
              <p class="text-sm text-purple-800 font-semibold">{{ facility.operatingHours }}</p>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex gap-2">
            <button
              v-if="facility.contact.phone"
              @click="callFacility(facility.contact.phone)"
              class="flex-1 py-2.5 px-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-bold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 flex items-center justify-center gap-2 hover:shadow-lg transform hover:scale-105"
            >
              <Icon name="Phone" :size="16" />
              <span class="text-sm">Call</span>
            </button>
            <button
              v-if="facility.contact.website"
              @click="openWebsite(facility.contact.website)"
              class="flex-1 py-2.5 px-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-lg font-bold hover:from-amber-700 hover:to-orange-700 transition-all duration-300 flex items-center justify-center gap-2 hover:shadow-lg transform hover:scale-105"
            >
              <Icon name="ExternalLink" :size="16" />
              <span class="text-sm">Visit</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Facility, Tirth } from '~/types/models'
import { useFilter } from '~/composables/useFilter'

const props = defineProps<{
  tirth: Tirth
}>()

const { filters, filteredItems, setFilter, resetFilters } = useFilter(props.tirth.facilities, ['type'])

const activeFilter = computed(() => filters.value.type || null)

const facilityTypes = computed(() => {
  const types = new Set(props.tirth.facilities.map((f) => f.type))
  return Array.from(types)
})

const formatType = (type: string) => {
  return type
    .replace(/-/g, ' ')
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

const callFacility = (phone: string) => {
  window.open(`tel:${phone}`)
}

const openWebsite = (url: string) => {
  window.open(url, '_blank')
}
</script>
