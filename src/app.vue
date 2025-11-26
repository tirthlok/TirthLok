<template>
  <div class="min-h-screen bg-white">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <BottomNav />
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'Jain Tirth Explorer - Discover Sacred Pilgrimage Sites',
  meta: [
    {
      name: 'description',
      content:
        'Explore Jain Tirth pilgrimage sites with detailed information, nearby facilities, and interactive maps.',
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

<style scoped>
/* Global styles handled by Tailwind CSS */
</style>
