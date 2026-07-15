<template>
  <div class="min-h-screen bg-background flex flex-col">
    <div class="flex-1" :class="{ 'pb-16 md:pb-0': !isAuthPage && !isDetailPage }">
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </div>
    <BottomNav v-if="!isAuthPage && !isDetailPage" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const route = useRoute()

// Exact-segment match — `startsWith('/auth')` would also match `/authors`,
// `/authentication-*`, or anything else that happens to share the prefix.
const isAuthPage = computed(() => {
  const path = route.path
  return path === '/auth' || path.startsWith('/auth/')
})

// Check if current route is a details sub-page (e.g. /tirth/TL-GJ-0001, /dharamshala/abc)
const isDetailPage = computed(() => {
  const path = route.path
  return /\/(tirth|dharamshala|bhojanshala)\/[^/]+$/.test(path)
})

useHead({
  title: 'Tirthlok',
  meta: [
    {
      name: 'description',
      content:
        'Explore Jain Tirths with Tirthlok. Discover detailed information, nearby facilities like Dharamshala and Bhojanshala.',
    },
    {
      name: 'viewport',
      content: 'width=device-width, initial-scale=1, viewport-fit=cover',
    },
  ],
  htmlAttrs: {
    lang: 'en',
  },
})
</script>