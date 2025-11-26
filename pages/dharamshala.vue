<template>
  <div class="min-h-screen bg-gradient-to-b from-blue-50 via-white to-cyan-50 py-4 sm:py-8 md:py-12">
    <div class="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <!-- Back Button -->
      <div class="mb-6 sm:mb-8">
        <NuxtLink
          to="/tirth"
          class="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-bold transition-all duration-300 transform hover:scale-105 hover:gap-3"
        >
          <Icon name="ArrowLeft" :size="22" />
          <span class="text-base sm:text-lg">Back to Home</span>
        </NuxtLink>
      </div>

      <!-- Header Section -->
      <div class="mb-8 sm:mb-12">
        <div class="flex items-center gap-4 mb-4">
          <Icon name="Home" :size="40" class="text-blue-600" />
          <div>
            <h1 class="text-4xl sm:text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-700 bg-clip-text text-transparent mb-2">
              Dharamshala
            </h1>
          </div>
        </div>
      </div>

      <!-- Filter Clips (All / Wishlist) -->
      <div class="mb-8">
        <div
          class="flex items-center gap-3 overflow-x-auto no-scrollbar py-2 hide-scrollbar whitespace-nowrap px-2 sm:px-4"
          role="tablist"
          tabindex="0"
          aria-label="Dharamshala filters"
        >
          <button
            role="tab"
            @click="selectedClip = 'all'"
            :class="chipClass('all')"
            :aria-selected="selectedClip === 'all'"
            title="Show all dharamshala"
          >
            <Icon name="Home" :size="16" class="inline-block mr-2" />
            <span>All Dharamshala</span>
            <span class="ml-2 inline-flex items-center justify-center px-2 py-0.5 text-xs font-medium rounded-full bg-white/20">
              {{ allCount }}
            </span>
          </button>

          <button
            role="tab"
            @click="selectedClip = 'wishlist'"
            :class="chipClass('wishlist')"
            :aria-selected="selectedClip === 'wishlist'"
            title="Show wishlist dharamshala"
          >
            <Icon name="Heart" :size="16" class="inline-block mr-2" />
            <span>Wishlist</span>
            <span class="ml-2 inline-flex items-center justify-center px-2 py-0.5 text-xs font-medium rounded-full bg-white/20">
              {{ wishlistCount }}
            </span>
          </button>
        </div>
      </div>

      <!-- Dharamshala Cards Grid -->
      <div v-if="displayedDharamshalas.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-12">
        <DharamshalCard
          v-for="dharamshala in displayedDharamshalas"
          :key="dharamshala.id"
          :dharamshala="dharamshala"
        />
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-16 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl border-2 border-dashed border-blue-300">
        <Icon name="Home" :size="64" class="text-blue-300 mx-auto mb-4" />
        <p class="text-gray-600 font-semibold text-lg">No dharamshala found</p>
        <p class="text-gray-500 text-sm mt-2">Try adjusting your filter</p>
      </div>

      <!-- Features Info Section -->
      <div class="mt-12 bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-200 p-8 rounded-2xl">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="flex items-start gap-4">
            <div class="p-3 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-lg">
              <Icon name="DollarSign" :size="24" class="text-white" />
            </div>
            <div>
              <h3 class="font-bold text-gray-900 mb-1">Budget Friendly</h3>
              <p class="text-gray-600 text-sm">Affordable rates that don't compromise on comfort</p>
            </div>
          </div>
          <div class="flex items-start gap-4">
            <div class="p-3 bg-gradient-to-br from-cyan-600 to-blue-600 rounded-lg">
              <Icon name="Users" :size="24" class="text-white" />
            </div>
            <div>
              <h3 class="font-bold text-gray-900 mb-1">Community Focused</h3>
              <p class="text-gray-600 text-sm">Run by local communities for pilgrims</p>
            </div>
          </div>
          <div class="flex items-start gap-4">
            <div class="p-3 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-lg">
              <Icon name="Heart" :size="24" class="text-white" />
            </div>
            <div>
              <h3 class="font-bold text-gray-900 mb-1">Warm Hospitality</h3>
              <p class="text-gray-600 text-sm">Experience spiritual atmosphere and genuine care</p>
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
import { useUserStore } from '~/stores/user'

definePageMeta({
  layout: 'default'
})

const userStore = useUserStore()
const selectedClip = ref<'all' | 'wishlist'>('all')

// Sample dharamshala data
const dharamshalas = [
  {
    id: 'shanti-dharamshala',
    name: 'Shanti Dharamshala',
    description: 'Peaceful lodging with clean rooms and basic amenities for pilgrims',
    type: 'dharamshala',
    rating: 4.2,
    reviews: 156,
    capacity: '50 Rooms',
    priceRange: '₹200-500',
    category: 'Budget',
    features: ['WiFi', 'Vegetarian Kitchen', '24-Hour Security'],
    location: {
      city: 'Palitana',
      state: 'Gujarat',
      address: 'Near Temple Gate, Palitana',
      latitude: 22.129,
      longitude: 71.829
    },
    contact: {
      phone: '+91-2848-252333',
      email: 'info@shanti-dharamshala.com'
    },
    images: [
      'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1611142351537-a3c87d3364e9?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&h=400&fit=crop'
    ]
  },
  {
    id: 'divya-nivas',
    name: 'Divya Nivas Dharamshala',
    description: 'Comfortable accommodation with modern facilities for spiritual seekers',
    type: 'dharamshala',
    rating: 4.5,
    reviews: 234,
    capacity: '75 Rooms',
    priceRange: '₹500-1000',
    category: 'Mid-Range',
    features: ['AC Rooms', 'Conference Hall', 'Prayer Room'],
    location: {
      city: 'Ranakpur',
      state: 'Rajasthan',
      address: 'Main Road, Ranakpur',
      latitude: 25.05,
      longitude: 73.8
    },
    contact: {
      phone: '+91-2954-224456',
      email: 'contact@divya-nivas.com'
    },
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1540932239986-310128078ceb?w=600&h=400&fit=crop'
    ]
  },
  {
    id: 'golden-rest',
    name: 'Golden Rest Dharamshala',
    description: 'Premium pilgrim accommodation with luxury amenities and services',
    type: 'dharamshala',
    rating: 4.8,
    reviews: 345,
    capacity: '100 Rooms',
    priceRange: '₹1000-2000',
    category: 'Premium',
    features: ['Spa', 'Fine Dining', 'Meditation Hall'],
    location: {
      city: 'Girnar',
      state: 'Gujarat',
      address: 'Hill Road, Girnar',
      latitude: 21.506,
      longitude: 71.711
    },
    contact: {
      phone: '+91-2845-334567',
      email: 'info@golden-rest.com'
    },
    images: [
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1578683078519-e21cc028cb29?w=600&h=400&fit=crop'
    ]
  }
]

// Wishlist functionality
const allCount = computed(() => dharamshalas.length)

const wishlistCount = computed(() => {
  try {
    if (typeof userStore.getFavorites === 'function') {
      return userStore.getFavorites().length || 0
    }
    return (userStore.getFavorites || []).length
  } catch (e) {
    return 0
  }
})

// Display dharamshalas based on selected clip
const displayedDharamshalas = computed(() => {
  const all = dharamshalas
  if (selectedClip.value === 'all') return all

  if (selectedClip.value === 'wishlist') {
    let favs: string[] = []
    try {
      if (typeof userStore.getFavorites === 'function') {
        favs = userStore.getFavorites()
      } else {
        favs = userStore.getFavorites || []
      }
    } catch (e) {
      favs = []
    }
    return all.filter((d) => favs.includes(d.id))
  }

  return all
})

// Chip styling
const chipClass = (filter: 'all' | 'wishlist') => {
  const base = 'px-4 py-2 rounded-full border transition-transform transform-gpu inline-flex items-center gap-2 text-sm select-none focus:outline-none'
  const active = 'bg-blue-600 text-white border-transparent shadow-lg scale-105 ring-2 ring-blue-300'
  const inactive = 'bg-white text-gray-700 border-gray-200 hover:bg-blue-50 hover:shadow-sm hover:scale-102'
  return `${base} ${selectedClip.value === filter ? active : inactive}`
}
</script>
