<template>
  <div class="space-y-6">
    <!-- Header with Icon -->
    <div class="flex items-center gap-3 mb-8">
      <Icon name="Sparkles" :size="32" class="text-yellow-600 animate-pulse" />
      <h2 class="text-3xl font-bold bg-gradient-to-r from-yellow-600 via-orange-600 to-red-600 bg-clip-text text-transparent">Festivals & Events</h2>
    </div>

    <!-- Empty State -->
    <div v-if="tirth.festivals.length === 0" class="text-center py-8 md:py-12 bg-gradient-to-r from-gray-50 to-yellow-50 rounded-2xl border-2 border-dashed border-gray-300">
      <Icon name="Calendar" :size="64" class="text-gray-300 mx-auto mb-4" />
      <p class="text-gray-600 font-semibold text-lg">No festivals recorded</p>
      <p class="text-gray-500 text-sm mt-2">Check back soon for festival updates</p>
    </div>

    <!-- Festivals Timeline -->
    <div v-else class="space-y-4">
      <div
        v-for="(festival, index) in tirth.festivals"
        :key="festival.name"
        class="relative group"
      >
        <!-- Timeline connector (optional visual) -->
        <div v-if="index !== tirth.festivals.length - 1" class="absolute left-8 top-24 w-1 h-8 bg-gradient-to-b from-amber-300 to-transparent" />

        <!-- Festival Card -->
        <div class="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 p-6 rounded-2xl hover:shadow-2xl hover:border-amber-400 transition-all duration-300 transform hover:scale-105">
          <div class="flex items-start gap-5">
            <!-- Icon Badge -->
            <div class="flex-shrink-0 p-4 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl shadow-lg group-hover:shadow-xl transition-all">
              <Icon name="Calendar" :size="28" class="text-white" />
            </div>

            <!-- Content -->
            <div class="flex-1 min-w-0">
              <!-- Title and Month Badge -->
              <div class="flex items-start justify-between gap-4 mb-3 flex-wrap">
                <h3 class="font-bold text-2xl text-gray-900 group-hover:text-amber-700 transition-colors">
                  {{ festival.name }}
                </h3>
                <span class="px-4 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-bold rounded-full shadow-md whitespace-nowrap">
                  {{ festival.month }}
                </span>
              </div>

              <!-- Date -->
              <p class="text-sm text-gray-700 mb-3 font-semibold flex items-center gap-2">
                <Icon name="Clock" :size="18" class="text-amber-600" />
                <span>{{ festival.date }}</span>
              </p>

              <!-- Description -->
              <p class="text-gray-700 mb-4 leading-relaxed text-base">{{ festival.description }}</p>

              <!-- Special Event Badge -->
              <div v-if="festival.specialEvent" class="p-4 bg-gradient-to-r from-red-100 to-pink-100 border-l-4 border-red-500 rounded-lg group-hover:shadow-md transition-all">
                <div class="flex items-start gap-3">
                  <Icon name="Star" :size="20" class="text-red-600 flex-shrink-0 mt-0.5 fill-red-600 animate-bounce" />
                  <div>
                    <p class="text-xs font-bold text-red-700 uppercase tracking-wide mb-1">Special Event</p>
                    <p class="text-red-800 font-semibold leading-relaxed">{{ festival.specialEvent }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Summary Section -->
    <div v-if="tirth.festivals.length > 0" class="mt-8 p-6 bg-gradient-to-r from-amber-100 to-yellow-100 rounded-2xl border-2 border-amber-300">
      <div class="flex items-start gap-4">
        <Icon name="Info" :size="24" class="text-amber-700 flex-shrink-0 mt-1" />
        <div>
          <h4 class="font-bold text-amber-900 mb-2">Festival Information</h4>
          <p class="text-amber-800 text-sm leading-relaxed">
            {{ tirth.festivals.length }} major festivals and events are celebrated throughout the year at {{ tirth.name }}. 
            These celebrations bring together devotees and pilgrims from across the region. Plan your visit accordingly to experience the spiritual energy and vibrant atmosphere.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Tirth } from '~/types/models'

defineProps<{
  tirth: Tirth
}>()
</script>
