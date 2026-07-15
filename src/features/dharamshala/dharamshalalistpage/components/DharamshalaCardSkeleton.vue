<template>
  <div class="dharamshala-card-skeleton">
    <!-- Image Wrapper with shimmer -->
    <div class="skeleton-image-wrap" :class="isDark ? 'dark' : 'light'">
      <div class="shimmer-sweep" />
    </div>

    <!-- Info skeleton -->
    <div class="skeleton-info">
      <!-- Name line -->
      <div class="skeleton-line line-name" :class="isDark ? 'dark' : 'light'">
        <div class="shimmer-sweep" />
      </div>
      <!-- Location line -->
      <div class="skeleton-line line-location" :class="isDark ? 'dark' : 'light'">
        <div class="shimmer-sweep" />
      </div>
      <!-- Type line -->
      <div class="skeleton-line line-type" :class="isDark ? 'dark' : 'light'">
        <div class="shimmer-sweep" />
      </div>
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
.dharamshala-card-skeleton {
  display: flex;
  flex-direction: column;
  gap: 0;
  width: 100%;
}

.skeleton-image-wrap {
  position: relative;
  aspect-ratio: 4 / 3;
  border-radius: 12px;
  overflow: hidden;
}

.skeleton-image-wrap.light { background: #E9E9E9; }
.skeleton-image-wrap.dark  { background: #1F2937; }

.skeleton-info {
  padding-top: 10px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.skeleton-line {
  position: relative;
  border-radius: 6px;
  overflow: hidden;
}

.skeleton-line.light { background: #E9E9E9; }
.skeleton-line.dark  { background: #1F2937; }

.line-name {
  height: 14px;
  width: 75%;
}

.line-location {
  height: 12px;
  width: 55%;
}

.line-type {
  height: 10px;
  width: 35%;
}

/* Shimmer Sweep Effect */
.shimmer-sweep {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.4) 50%,
    rgba(255, 255, 255, 0) 100%
  );
  animation: shimmer 1.6s infinite linear;
}

.dark .shimmer-sweep {
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.08) 50%,
    rgba(255, 255, 255, 0) 100%
  );
}

@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}
</style>
