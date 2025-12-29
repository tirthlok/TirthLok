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
  title: 'Tirthlok',
  meta: [
    {
      name: 'description',
      content:
        'Explore Jain Tirths with Tirthlok. Discover detailed information, nearby facilities like Dharamshala and Bhojanshala .',
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
