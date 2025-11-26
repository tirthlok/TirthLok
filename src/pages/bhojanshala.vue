<template>
  <div class="min-h-screen bg-gradient-to-b from-green-50 via-white to-emerald-50 py-4 sm:py-8 md:py-12">
    <div class="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <!-- Back Button -->
      <div class="mb-6 sm:mb-8">
        <NuxtLink
          to="/tirth"
          class="inline-flex items-center gap-2 text-green-600 hover:text-green-700 font-bold transition-all duration-300 transform hover:scale-105 hover:gap-3"
        >
          <Icon name="ArrowLeft" :size="22" />
          <span class="text-base sm:text-lg">Back to Home</span>
        </NuxtLink>
      </div>

      <!-- Header Section -->
      <div class="mb-8 sm:mb-12">
        <div class="flex items-center gap-4 mb-4">
          <Icon name="UtensilsCrossed" :size="40" class="text-green-600" />
          <div>
            <h1 class="text-4xl sm:text-5xl md:text-6xl font-bold bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2">
              Bhojanshala
            </h1>
            <p class="text-lg text-gray-600">Authentic vegetarian dining facilities</p>
          </div>
        </div>
        <p class="text-gray-700 leading-relaxed text-base sm:text-lg max-w-3xl">
          Bhojanshala (भोजनशाला) are traditional vegetarian dining facilities that serve authentic cuisine following strict dietary practices. They provide affordable, wholesome meals for pilgrims and devotees, maintaining the spiritual essence of vegetarian hospitality.
        </p>
      </div>

      <!-- Filter & Search Section -->
      <div class="mb-8 flex flex-wrap gap-3">
        <button
          v-for="filter in ['All', 'Budget', 'Mid-Range', 'Premium']"
          :key="filter"
          :class="[
            'px-5 py-2.5 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 border-2',
            activeFilter === filter
              ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white border-green-600 shadow-lg'
              : 'bg-white text-gray-700 border-gray-200 hover:border-green-300 hover:bg-green-50'
          ]"
          @click="activeFilter = filter"
        >
          <Icon name="Filter" :size="18" />
          {{ filter }}
        </button>
      </div>

      <!-- Bhojanshala Cards Grid -->
      <div v-if="filteredBhojanShalas.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-12">
        <BhojanshalaCard
          v-for="bhojanshala in filteredBhojanShalas"
          :key="bhojanshala.id"
          :bhojanshala="bhojanshala"
        />
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-16 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border-2 border-dashed border-green-300">
        <Icon name="UtensilsCrossed" :size="64" class="text-green-300 mx-auto mb-4" />
        <p class="text-gray-600 font-semibold text-lg">No bhojanshala found</p>
        <p class="text-gray-500 text-sm mt-2">Try adjusting your filter</p>
      </div>

      <!-- Features Info Section -->
      <div class="mt-12 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 p-8 rounded-2xl">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="flex items-start gap-4">
            <div class="p-3 bg-gradient-to-br from-green-600 to-emerald-600 rounded-lg">
              <Icon name="Leaf" :size="24" class="text-white" />
            </div>
            <div>
              <h3 class="font-bold text-gray-900 mb-1">Vegetarian Only</h3>
              <p class="text-gray-600 text-sm">100% pure vegetarian cuisine</p>
            </div>
          </div>
          <div class="flex items-start gap-4">
            <div class="p-3 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-lg">
              <Icon name="Heart" :size="24" class="text-white" />
            </div>
            <div>
              <h3 class="font-bold text-gray-900 mb-1">Jain Friendly</h3>
              <p class="text-gray-600 text-sm">Strict dietary accommodations available</p>
            </div>
          </div>
          <div class="flex items-start gap-4">
            <div class="p-3 bg-gradient-to-br from-teal-600 to-green-600 rounded-lg">
              <Icon name="Utensils" :size="24" class="text-white" />
            </div>
            <div>
              <h3 class="font-bold text-gray-900 mb-1">Traditional Recipes</h3>
              <p class="text-gray-600 text-sm">Authentic regional vegetarian cuisine</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import Icon from '~/components/Icon.vue'

definePageMeta({
  layout: 'default'
})

const activeFilter = ref('All')

// Sample bhojanshala data
const bhojanShalas = [
  {
    id: 'shri-krishna-bhojanshala',
    name: 'Shri Krishna Bhojanshala',
    description: 'Traditional vegetarian restaurant serving authentic Gujarati cuisine',
    type: 'bhojanshala',
    rating: 4.8,
    reviews: 312,
    operatingHours: '11:00 AM - 9:00 PM',
    priceRange: '₹60-150',
    category: 'Budget',
    cuisines: ['Gujarati', 'Jain', 'North Indian'],
    location: {
      city: 'Palitana',
      state: 'Gujarat',
      address: 'Main Market, Palitana',
      latitude: 22.128,
      longitude: 71.828
    },
    contact: {
      phone: '+91-2848-252222',
      email: 'info@krishna-bhojanshala.com',
      website: 'www.krishna-bhojanshala.com'
    },
    images: [
      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1501195530297-a145d97f3a7f?w=600&h=400&fit=crop'
    ]
  },
  {
    id: 'annapurna-dining',
    name: 'Annapurna Dining Hall',
    description: 'Premium vegetarian fine dining with organic ingredients',
    type: 'bhojanshala',
    rating: 4.7,
    reviews: 289,
    operatingHours: '12:00 PM - 10:00 PM',
    priceRange: '₹200-400',
    category: 'Mid-Range',
    cuisines: ['Gujarati', 'Rajasthani', 'Jain'],
    location: {
      city: 'Ranakpur',
      state: 'Rajasthan',
      address: 'Near Temple, Ranakpur',
      latitude: 25.05,
      longitude: 73.8
    },
    contact: {
      phone: '+91-2954-224789',
      email: 'contact@annapurna-dining.com',
      website: 'www.annapurna-dining.com'
    },
    images: [
      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&h=400&fit=crop'
    ]
  },
  {
    id: 'divine-taste',
    name: 'Divine Taste Restaurant',
    description: 'Luxury vegetarian dining experience with gourmet cuisine',
    type: 'bhojanshala',
    rating: 4.9,
    reviews: 405,
    operatingHours: '10:00 AM - 11:00 PM',
    priceRange: '₹400-800',
    category: 'Premium',
    cuisines: ['Fusion', 'International Vegetarian', 'Jain'],
    location: {
      city: 'Girnar',
      state: 'Gujarat',
      address: 'Hill Road, Girnar',
      latitude: 21.506,
      longitude: 71.711
    },
    contact: {
      phone: '+91-2845-334890',
      email: 'info@divine-taste.com',
      website: 'www.divine-taste.com'
    },
    images: [
      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1455619452474-d2be8b1e4e31?w=600&h=400&fit=crop'
    ]
  }
]

const filteredBhojanShalas = computed(() => {
  if (activeFilter.value === 'All') return bhojanShalas
  return bhojanShalas.filter(b => b.category === activeFilter.value)
})
</script>
