<template>
  <!-- Mobile bottom nav: hide on desktop (md and above) -->
  <nav class="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40 md:hidden">
    <div
      class="inline-flex items-center justify-center gap-2 p-2 bg-white/85 backdrop-blur-sm border border-gray-200 rounded-full shadow-lg"
      role="navigation"
      aria-label="Bottom navigation"
    >
      <!-- Home -->
      <NuxtLink
        to="/"
        class="inline-flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 hover:scale-110"
        :class="isActive('/') ? 'bg-yellow-400 text-white shadow-md' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'"
        aria-label="Home"
        title="Home"
      >
        <Icon name="Home" :size="20" />
      </NuxtLink>

      <!-- Tirths - Red/Coral -->
      <NuxtLink
        to="/tirth"
        class="inline-flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 hover:scale-110"
        :class="isActive('/tirth') ? 'bg-red-500 text-white shadow-md' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'"
        aria-label="Tirths"
        title="All Tirths"
      >
        <Icon name="Building2" :size="20" />
      </NuxtLink>

      <!-- Dharamshala - Blue -->
      <NuxtLink
        to="/dharamshala"
        class="inline-flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 hover:scale-110"
        :class="isActive('/dharamshala') ? 'bg-blue-500 text-white shadow-md' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'"
        aria-label="Dharamshala"
        title="Dharamshala"
      >
        <Icon name="Building" :size="20" />
      </NuxtLink>

      <!-- Bhojanshala - Green -->
      <NuxtLink
        to="/bhojanshala"
        class="inline-flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 hover:scale-110"
        :class="isActive('/bhojanshala') ? 'bg-green-500 text-white shadow-md' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'"
        aria-label="Bhojanshala"
        title="Bhojanshala"
      >
        <Icon name="UtensilsCrossed" :size="20" />
      </NuxtLink>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()

const isActive = (path: string) => {
  return route.path === path
}
</script>

<style scoped>
.safe-area-bottom {
  padding-bottom: max(0, env(safe-area-inset-bottom));
}
</style>

