<template>
  <div
    :class="[
      'rounded-2xl overflow-hidden shadow-lg animate-pulse',
      isDarkMode ? 'bg-gray-800' : 'bg-white'
    ]"
  >
    <!-- Image Skeleton -->
    <div
      :class="[
        'h-72 w-full',
        isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
      ]"
    >
      <!-- Shimmer effect overlay -->
      <div class="w-full h-full relative overflow-hidden">
        <div
          :class="[
            'absolute inset-0 -translate-x-full animate-shimmer',
            isDarkMode ? 'bg-gradient-to-r from-transparent via-gray-600/30 to-transparent' : 'bg-gradient-to-r from-transparent via-white/60 to-transparent'
          ]"
        />
      </div>
    </div>

    <!-- Content Skeleton -->
    <div class="p-4 space-y-3">
      <!-- Title skeleton -->
      <div
        :class="[
          'h-6 rounded-lg w-3/4',
          isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
        ]"
      />

      <!-- Location skeleton -->
      <div
        :class="[
          'h-4 rounded-lg w-1/2',
          isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
        ]"
      />

      <!-- Tags skeleton -->
      <div class="flex gap-2 pt-2">
        <div
          :class="[
            'h-6 w-16 rounded-full',
            isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
          ]"
        />
        <div
          :class="[
            'h-6 w-20 rounded-full',
            isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
          ]"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useThemeStore } from '~/stores/theme'

const themeStore = useThemeStore()
const isDarkMode = computed(() => themeStore?.isDarkMode ?? false)
</script>

<style scoped>
@keyframes shimmer {
  100% {
    transform: translateX(100%);
  }
}

.animate-shimmer {
  animation: shimmer 1.5s infinite;
}
</style>
