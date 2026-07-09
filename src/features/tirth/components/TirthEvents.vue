<template>
  <section
    v-if="tirth.events && tirth.events.length > 0"
    id="section-events"
    class="px-4 sm:px-6 lg:px-8 py-8 sm:py-12"
  >
  <div class="space-y-12 bg-[#FFFBEE] p-6 sm:p-12 rounded-[3.5rem] border border-orange-100/50 shadow-sm">
    <!-- Header with Icon -->
    <div class="flex items-center gap-4 mb-10">
      <Icon name="Sparkles" :size="32" class="text-orange-500" />
      <h2 class="text-3xl font-black text-red-900 tracking-tight">Events</h2>
    </div>

    <!-- Events Timeline -->
    <div class="relative space-y-12">
      <!-- Continuous Timeline Line -->
      <div class="absolute left-10 top-0 bottom-0 w-0.5 bg-gradient-to-b from-orange-200 via-orange-100 to-transparent hidden md:block"></div>

      <div
        v-for="event in tirth.events"
        :key="event.name"
        class="relative flex flex-col md:flex-row items-start gap-8 group"
      >
        <!-- Date Marker -->
        <div class="hidden md:flex flex-shrink-0 w-20 flex-col items-center pt-2">
          <div class="w-12 h-12 bg-orange-500 rounded-2xl border-4 border-white shadow-xl flex items-center justify-center relative z-10 group-hover:scale-110 transition-all duration-500 shadow-orange-200">
            <Icon name="Calendar" :size="20" class="text-white" />
          </div>
        </div>

        <!-- Event Card -->
        <div class="flex-1 bg-white border border-orange-100 p-8 rounded-[2.5rem] shadow-sm hover:shadow-md transition-all duration-700 hover:-translate-y-1">
          <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-6">
            <div class="space-y-2">
              <div class="flex items-center gap-3">
                <div class="flex items-center gap-1.5 text-orange-600 font-bold text-sm uppercase tracking-widest">
                  <Icon name="Clock" :size="14" />
                  {{ event.date }}
                </div>
              </div>
              <h3 class="text-2xl font-black text-gray-900 leading-tight">
                {{ event.name }}
              </h3>
            </div>
            
            <div class="shrink-0">
              <span class="px-5 py-2 bg-orange-500 text-white text-[10px] font-black rounded-full uppercase tracking-widest shadow-md">
                {{ event.month }}
              </span>
            </div>
          </div>

          <p class="text-lg text-gray-600 leading-relaxed font-medium mb-8">
            {{ event.description }}
          </p>

          <div v-if="event.specialEvent" class="p-6 bg-rose-50/80 rounded-2xl border-l-4 border-red-500 relative overflow-hidden group/special shadow-sm">
            <div class="flex items-start gap-4 relative z-10">
              <Icon name="Star" :size="20" class="text-red-600 fill-red-600 mt-1" />
              <div class="space-y-1">
                <p class="text-[10px] font-black text-red-600 uppercase tracking-widest">Special Event</p>
                <p class="text-red-900 font-bold text-lg leading-tight">{{ event.specialEvent }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="bg-gradient-to-br from-orange-100/50 to-orange-50/20 border border-orange-200/50 p-10 rounded-[3rem] relative overflow-hidden group">
      <div class="absolute right-0 bottom-0 opacity-5 group-hover:opacity-10 transition-opacity">
        <Icon name="Sparkles" :size="200" class="text-orange-500" />
      </div>
      <div class="relative z-10 space-y-4">
        <h4 class="text-2xl font-black text-red-900 tracking-tight">A Year of Celebration</h4>
        <p class="text-lg text-gray-600 leading-relaxed max-w-3xl font-medium">
          Devotion comes alive at {{ tirth.name }} with {{ tirth.events.length }} significant events across the year. 
          Each celebration is an opportunity to witness the timeless spiritual energy that defines this sacred portal.
        </p>
      </div>
    </div>
  </div>
  </section>
</template>

<script setup lang="ts">
import type { Tirth } from '~/types/models'
import Icon from '~/components/ui/Icon.vue'

defineProps<{
  tirth: Tirth
}>()
</script>

