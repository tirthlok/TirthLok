<template>
  <div class="bg-white rounded-lg shadow-md p-6">
    <h2 class="text-2xl font-bold text-gray-900 mb-6">Festivals & Events</h2>

    <div v-if="tirth.festivals.length === 0" class="text-center py-8 text-gray-500">
      <p>No festivals recorded</p>
    </div>

    <div v-else class="space-y-4">
      <div
        v-for="festival in tirth.festivals"
        :key="festival.name"
        class="border-l-4 border-amber-600 pl-4 py-2"
      >
        <div class="flex items-start justify-between mb-2">
          <h3 class="font-semibold text-lg text-gray-900">{{ festival.name }}</h3>
          <span class="text-sm text-gray-600 bg-amber-50 px-3 py-1 rounded-full">
            {{ festival.month }}
          </span>
        </div>
        <p class="text-sm text-gray-600 mb-2">
          <Icon name="Calendar" :size="16" class="inline mr-2" />
          {{ festival.date }}
        </p>
        <p class="text-gray-700 mb-2">{{ festival.description }}</p>
        <p v-if="festival.specialEvent" class="text-sm text-amber-700 bg-amber-50 p-2 rounded">
          <strong>Special Event:</strong> {{ festival.specialEvent }}
        </p>
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
