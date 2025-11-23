<template>
  <nav class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg md:hidden z-40">
    <div class="flex items-center justify-around h-20 safe-area-bottom px-2">
      <NuxtLink
        to="/"
        class="flex flex-col items-center justify-center gap-1 flex-1 h-full hover:bg-gray-50 transition-colors rounded-lg"
        :class="{ 'text-red-500': isActive('/') }"
      >
        <Icon name="Home" :size="24" />
        <span class="text-xs font-medium">Home</span>
      </NuxtLink>

      <NuxtLink
        to="/tirth"
        class="flex flex-col items-center justify-center gap-1 flex-1 h-full hover:bg-gray-50 transition-colors rounded-lg"
        :class="{ 'text-red-500': isActive('/tirth') }"
      >
        <Icon name="Building2" :size="24" />
        <span class="text-xs font-medium">Tirth</span>
      </NuxtLink>

      <NuxtLink
        to="/dharamshala"
        class="flex flex-col items-center justify-center gap-1 flex-1 h-full hover:bg-gray-50 transition-colors rounded-lg"
        :class="{ 'text-red-500': isActive('/dharamshala') }"
      >
        <Icon name="Building" :size="24" />
        <span class="text-xs font-medium">Dharamshala</span>
      </NuxtLink>

      <NuxtLink
        to="/bhojanshala"
        class="flex flex-col items-center justify-center gap-1 flex-1 h-full hover:bg-gray-50 transition-colors rounded-lg"
        :class="{ 'text-red-500': isActive('/bhojanshala') }"
      >
        <Icon name="UtensilsCrossed" :size="24" />
        <span class="text-xs font-medium">Bhojanshala</span>
      </NuxtLink>

      <NuxtLink
        to="/profile"
        class="flex flex-col items-center justify-center gap-1 flex-1 h-full hover:bg-gray-50 transition-colors rounded-lg"
        :class="{ 'text-red-500': isActive('/profile') }"
      >
        <Icon name="User" :size="24" />
        <span class="text-xs font-medium">Profile</span>
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
