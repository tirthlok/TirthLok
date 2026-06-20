<template>
  <!-- Airbnb-style skeleton matching TirthCard's square layout -->
  <div class="tirth-card-skeleton">
    <!-- Square image skeleton -->
    <div class="skeleton-image" :class="isDark ? 'dark' : 'light'" />
    <!-- Text block skeleton -->
    <div class="skeleton-text">
      <div class="skeleton-line line-name" :class="isDark ? 'dark' : 'light'" />
      <div class="skeleton-line line-location" :class="isDark ? 'dark' : 'light'" />
      <div class="skeleton-line line-kshetra" :class="isDark ? 'dark' : 'light'" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useThemeStore } from '~/stores/theme'

const themeStore = useThemeStore()
const isDark = computed(() => themeStore?.isDarkMode ?? false)
</script>

<style scoped>
.tirth-card-skeleton {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.skeleton-image {
  aspect-ratio: 1 / 1;
  border-radius: 12px;
  animation: shimmer-pulse 1.8s ease-in-out infinite;
}

.skeleton-image.light { background: #E9E9E9; }
.skeleton-image.dark  { background: #374151; }

.skeleton-text {
  padding-top: 8px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.skeleton-line {
  border-radius: 6px;
  animation: shimmer-pulse 1.8s ease-in-out infinite;
}

.skeleton-line.light { background: #E9E9E9; }
.skeleton-line.dark  { background: #374151; }

.line-name     { height: 13px; width: 75%; }
.line-location { height: 11px; width: 55%; animation-delay: 0.1s; }
.line-kshetra  { height: 11px; width: 40%; animation-delay: 0.2s; }

@keyframes shimmer-pulse {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.45; }
}
</style>
