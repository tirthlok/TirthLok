<template>
  <div class="bg-white rounded-lg shadow-md p-6">
    <h2 class="text-2xl font-bold text-gray-900 mb-6">About</h2>

    <!-- Description -->
    <div class="mb-8">
      <h3 class="text-lg font-semibold text-gray-900 mb-2">Description</h3>
      <p class="text-gray-700 leading-relaxed">{{ tirth.description }}</p>
    </div>

    <!-- Historical Background -->
    <div class="mb-8">
      <h3 class="text-lg font-semibold text-gray-900 mb-2">Historical Background</h3>
      <p class="text-gray-700 leading-relaxed">{{ tirth.historicalBackground }}</p>
    </div>

    <!-- Founding Details -->
    <div class="mb-8">
      <h3 class="text-lg font-semibold text-gray-900 mb-2">Founding Details</h3>
      <p class="text-gray-700 leading-relaxed">{{ tirth.foundingDetails }}</p>
    </div>

    <!-- Architecture -->
    <div class="mb-8">
      <h3 class="text-lg font-semibold text-gray-900 mb-2">Architecture</h3>
      <p class="text-gray-700 leading-relaxed">{{ tirth.architecture }}</p>
    </div>

    <!-- Mool Nayak (Idols) -->
    <div class="mb-8">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">Mool Nayak (Main Idols)</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div v-for="idol in tirth.moolnayak" :key="idol.name" class="bg-gray-50 p-4 rounded-lg">
          <h4 class="font-semibold text-gray-900 mb-2">{{ idol.name }}</h4>
          <div class="space-y-1 text-sm text-gray-600">
            <p v-if="idol.height"><strong>Height:</strong> {{ idol.height }}</p>
            <p v-if="idol.metal"><strong>Metal:</strong> {{ idol.metal }}</p>
            <p v-if="idol.year"><strong>Year:</strong> {{ idol.year }}</p>
            <p v-if="idol.details"><strong>Details:</strong> {{ idol.details }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Special Facts -->
    <div v-if="tirth.specialFacts.length > 0" class="mb-8">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">Special Facts</h3>
      <ul class="space-y-2">
        <li v-for="(fact, index) in tirth.specialFacts" :key="index" class="flex items-start gap-3">
          <Icon name="CheckCircle2" :size="20" class="text-green-600 flex-shrink-0 mt-0.5" />
          <span class="text-gray-700">{{ fact }}</span>
        </li>
      </ul>
    </div>

    <!-- Rules & Regulations -->
    <div v-if="tirth.rules && tirth.rules.length > 0" class="mb-8">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">Rules & Regulations</h3>
      <ul class="list-disc list-inside space-y-2 text-gray-700">
        <li v-for="(rule, idx) in tirth.rules" :key="idx">{{ rule }}</li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Tirth } from '~/types/models'

defineProps<{
  tirth: Tirth
}>()
</script>
