<template>
  <div class="min-h-screen bg-white py-4 sm:py-8 md:py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-2">Dharamshala</h1>
        <p class="text-gray-600 text-base md:text-lg">Find pilgrim lodges and accommodations</p>
      </div>

      <!-- Content coming soon -->
      <div class="text-center py-16">
        <Icon name="Building" :size="64" class="text-gray-300 mx-auto mb-4" />
        <h2 class="text-xl md:text-2xl font-semibold text-gray-900 mb-2">Dharamshala</h2>
        <p class="text-gray-600">Pilgrim accommodations and lodges coming soon</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default'
})
</script>
