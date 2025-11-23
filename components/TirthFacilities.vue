<template>
  <div class="space-y-6">
    <!-- Filter Tabs -->
    <div class="flex gap-2 overflow-x-auto pb-2">
      <BaseButton
        variant="primary"
        size="md"
        @click="resetFilters"
        :class="{ '!bg-gray-100 !text-gray-900': activeFilter !== null }"
      >
        All
      </BaseButton>
      <BaseButton
        v-for="type in facilityTypes"
        :key="type"
        :variant="activeFilter === type ? 'primary' : 'secondary'"
        size="md"
        @click="setFilter('type', type)"
        class="whitespace-nowrap"
      >
        {{ formatType(type) }}
      </BaseButton>
    </div>

    <!-- Facilities Grid -->
    <div v-if="filteredItems.length === 0" class="text-center py-12 bg-gray-50 rounded-lg">
      <Icon name="Home" :size="48" class="text-gray-400 mx-auto mb-4 opacity-50" />
      <p class="text-gray-900 font-semibold">No facilities found</p>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div
        v-for="facility in filteredItems"
        :key="facility.id"
        class="bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-all group"
      >
        <!-- Facility Image -->
        <div class="h-40 bg-gray-200 overflow-hidden rounded-t-lg">
          <img
            :src="facility.image || 'https://via.placeholder.com/300x200'"
            :alt="facility.name"
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>

        <!-- Facility Info -->
        <div class="p-4">
          <div class="flex items-start justify-between mb-2">
            <h3 class="font-bold text-lg text-gray-900">{{ facility.name }}</h3>
            <div class="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg">
              <Icon name="Star" :size="16" class="fill-yellow-400 text-yellow-400" />
              <span class="text-sm font-semibold text-gray-900">{{ facility.rating }}</span>
            </div>
          </div>

          <p class="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-3">
            {{ formatType(facility.type) }}
          </p>

          <p class="text-sm text-gray-700 mb-3 line-clamp-2">{{ facility.description }}</p>

          <!-- Contact Info -->
          <div class="space-y-2 mb-4 pb-4 border-b border-gray-200 text-sm">
            <div v-if="facility.contact.phone" class="flex items-center gap-2">
              <Icon name="Phone" :size="16" class="text-gray-400" />
              <a :href="`tel:${facility.contact.phone}`" class="text-blue-600 hover:underline">
                {{ facility.contact.phone }}
              </a>
            </div>
            <div v-if="facility.contact.email" class="flex items-center gap-2">
              <Icon name="Mail" :size="16" class="text-gray-400" />
              <a :href="`mailto:${facility.contact.email}`" class="text-blue-600 hover:underline truncate">
                {{ facility.contact.email }}
              </a>
            </div>
            <div class="flex items-center gap-2">
              <Icon name="MapPin" :size="16" class="text-gray-400" />
              <span class="text-xs text-gray-700">{{ facility.location.address }}</span>
            </div>
          </div>

          <!-- Availability & Hours -->
          <div class="space-y-2 mb-4">
            <div v-if="facility.availability" class="p-2 bg-green-50 border border-green-200 rounded-lg">
              <p class="text-xs text-green-700">
                <strong>Available:</strong> {{ facility.availability }}
              </p>
            </div>
            <div v-if="facility.operatingHours" class="p-2 bg-blue-50 border border-blue-200 rounded-lg">
              <p class="text-xs text-blue-700">
                <strong>Hours:</strong> {{ facility.operatingHours }}
              </p>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex gap-2">
            <BaseButton
              v-if="facility.contact.phone"
              variant="primary"
              size="md"
              :icon="true"
              @click="callFacility(facility.contact.phone)"
              class="flex-1"
            >
              <Icon name="Phone" :size="16" />
              Call
            </BaseButton>
            <BaseButton
              v-if="facility.contact.website"
              variant="secondary"
              size="md"
              :icon="true"
              @click="openWebsite(facility.contact.website)"
              class="flex-1"
            >
              <Icon name="ExternalLink" :size="16" />
              Visit
            </BaseButton>
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
