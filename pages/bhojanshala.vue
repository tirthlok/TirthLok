<template>
  <div class="min-h-screen bg-gradient-to-b from-cream to-white py-4 sm:py-8 md:py-12">
    <div class="px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl sm:text-4xl md:text-5xl font-bold text-charcoal mb-2">Bhojnshala</h1>
        <p class="text-light-gray text-base md:text-lg">Find authentic vegetarian dining and food facilities</p>
      </div>

      <!-- Bhojanshala Cards Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
        <!-- Shahapur Bhojanshala -->
        <NuxtLink to="/shahapur">
          <div class="group rounded-3xl overflow-hidden transition-all duration-300 cursor-pointer bg-white shadow-lg hover:shadow-2xl hover:scale-105">
            <div class="relative w-full h-64 overflow-hidden bg-gray-200">
              <img
                src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&h=400&fit=crop"
                alt="Shahapur Bhojanshala"
                class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

              <!-- Rating Badge -->
              <div class="absolute top-3 left-3 bg-amber-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg flex items-center gap-1">
                <Icon name="Star" :size="16" class="fill-current" />
                4.8
              </div>

              <!-- Type Badge -->
              <div class="absolute top-3 right-3 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
                Bhojanshala
              </div>

              <!-- Title -->
              <div class="absolute bottom-0 left-0 right-0 p-4 text-white">
                <h3 class="text-lg font-bold line-clamp-2">Shahapur Bhojanshala</h3>
                <p class="text-sm text-gray-200 mt-1 line-clamp-1">Shahapur, Maharashtra</p>
              </div>
            </div>

            <!-- Details -->
            <div class="p-4 sm:p-5">
              <p class="text-sm text-gray-600 mb-4">Traditional vegetarian cuisine with authentic Jain recipes and dietary accommodations.</p>

              <!-- Info Grid -->
              <div class="space-y-2 mb-4 text-sm">
                <div class="flex items-center gap-2 text-gray-700">
                  <Icon name="Clock" :size="16" class="text-amber-600" />
                  <span>11:00 AM - 9:00 PM</span>
                </div>
                <div class="flex items-center gap-2 text-gray-700">
                  <Icon name="Phone" :size="16" class="text-amber-600" />
                  <span>+91-7275-223445</span>
                </div>
                <div class="flex items-center gap-2 text-gray-700">
                  <Icon name="MapPin" :size="16" class="text-amber-600" />
                  <span>Main Bazaar, Shahapur</span>
                </div>
              </div>

              <!-- Features Tags -->
              <div class="flex flex-wrap gap-2">
                <span class="px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-semibold">Jain Friendly</span>
                <span class="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold">Vegetarian</span>
                <span class="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-xs font-semibold">Budget Friendly</span>
              </div>
            </div>
          </div>
        </NuxtLink>

        <!-- Coming Soon Placeholder -->
        <div class="rounded-3xl overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 shadow-lg p-8 flex flex-col items-center justify-center h-96 group hover:shadow-2xl transition-all duration-300">
          <Icon name="UtensilsCrossed" :size="48" class="text-gray-300 mb-4" />
          <h3 class="text-lg font-semibold text-gray-600 mb-2">More Coming Soon</h3>
          <p class="text-sm text-gray-500 text-center">Additional Bhojanshala locations will be added soon</p>
        </div>
      </div>

      <!-- Empty Features Info -->
      <div class="mt-12 bg-amber-50 border-l-4 border-amber-500 p-6 rounded">
        <h3 class="font-semibold text-amber-900 mb-2">About Bhojanshala</h3>
        <p class="text-amber-800 text-sm">
          Bhojanshala (भोजनशाला) are traditional vegetarian dining facilities that serve authentic Jain cuisine. They are typically run by religious organizations and provide affordable, wholesome meals for pilgrims and devotees following strict dietary practices.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default'
})
</script>
