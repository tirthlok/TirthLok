<template>
  <!-- Show bottom nav on all sizes (removed md:hidden) so it's visible during development/testing -->
  <nav class="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40">
    <div
      class="inline-flex items-center gap-3 px-3 py-2 bg-white/80 backdrop-blur-md border border-gray-100 rounded-full shadow-lg safe-area-bottom"
      role="navigation"
      aria-label="Bottom navigation"
    >
      <NuxtLink
        to="/"
        class="inline-flex items-center justify-center p-2 rounded-full transition-colors"
        :class="isActive('/') ? 'bg-white text-red-500 shadow-sm' : 'text-gray-500 hover:text-gray-700'"
        aria-label="Home"
      >
        <Icon name="Home" :size="20" />
      </NuxtLink>

      <NuxtLink
        to="/tirth"
        class="inline-flex items-center justify-center p-2 rounded-full transition-colors"
        :class="isActive('/tirth') ? 'bg-white text-red-500 shadow-sm' : 'text-gray-500 hover:text-gray-700'"
        aria-label="Tirths"
      >
        <Icon name="Building2" :size="20" />
      </NuxtLink>

      <NuxtLink
        to="/dharamshala"
        class="inline-flex items-center justify-center p-2 rounded-full transition-colors"
        :class="isActive('/dharamshala') ? 'bg-white text-red-500 shadow-sm' : 'text-gray-500 hover:text-gray-700'"
        aria-label="Dharamshala"
      >
        <Icon name="Building" :size="20" />
      </NuxtLink>

      <NuxtLink
        to="/bhojanshala"
        class="inline-flex items-center justify-center p-2 rounded-full transition-colors"
        :class="isActive('/bhojanshala') ? 'bg-white text-red-500 shadow-sm' : 'text-gray-500 hover:text-gray-700'"
        aria-label="Bhojanshala"
      >
        <Icon name="UtensilsCrossed" :size="20" />
      </NuxtLink>

      <NuxtLink
        to="/profile"
        class="inline-flex items-center justify-center p-2 rounded-full transition-colors"
        :class="isActive('/profile') ? 'bg-white text-red-500 shadow-sm' : 'text-gray-500 hover:text-gray-700'"
        aria-label="Profile"
      >
        <Icon name="User" :size="20" />
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
