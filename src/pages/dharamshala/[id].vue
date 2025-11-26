<template>
  <div class="min-h-screen bg-gradient-to-b from-blue-50 via-white to-cyan-50 py-4 sm:py-8 md:py-12">
    <div class="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <!-- Back Button -->
      <div class="mb-6 sm:mb-8">
        <NuxtLink
          to="/dharamshala"
          class="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-bold transition-all duration-300 transform hover:scale-105 hover:gap-3"
        >
          <Icon name="ArrowLeft" :size="22" />
          <span class="text-base sm:text-lg">Back to Dharamshala List</span>
        </NuxtLink>
      </div>

      <!-- Loading State -->
      <div v-if="!dharamshala" class="flex justify-center items-center py-32">
        <div class="text-center space-y-6">
          <div class="relative w-16 h-16 mx-auto">
            <div class="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full animate-spin" style="clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%, 0% 50%)" />
            <div class="absolute inset-2 bg-white rounded-full" />
          </div>
          <p class="text-gray-600 font-semibold text-lg">Loading dharamshala details...</p>
        </div>
      </div>

      <!-- Content -->
      <div v-else class="space-y-8 sm:space-y-10">
        <!-- Header Section -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
          <!-- Image Gallery -->
          <div class="space-y-4">
            <div class="relative group overflow-hidden rounded-2xl shadow-2xl bg-gradient-to-br from-blue-100 to-cyan-100 h-96 lg:h-[500px]">
              <img
                :src="currentImage"
                :alt="dharamshala.name"
                class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <!-- Image Counter -->
              <div v-if="imagesArr.length > 1" class="absolute top-4 right-4 bg-black/50 backdrop-blur-md px-4 py-2 rounded-full text-white text-sm font-semibold">
                {{ currentImageIndex + 1 }} / {{ imagesArr.length }}
              </div>

              <!-- Navigation Dots -->
              <div v-if="imagesArr.length > 1" class="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
                <button
                  v-for="(_, index) in imagesArr"
                  :key="index"
                  @click="currentImageIndex = index"
                  :class="[
                    'transition-all duration-300 backdrop-blur-sm',
                    index === currentImageIndex 
                      ? 'w-8 h-3 bg-white rounded-full' 
                      : 'w-3 h-3 bg-white/50 hover:bg-white/75 rounded-full'
                  ]"
                />
              </div>

              <!-- Arrow Navigation -->
              <button
                v-if="imagesArr.length > 1"
                @click="previousImage"
                class="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-gray-900 p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 z-10 shadow-lg hover:shadow-xl hover:scale-110"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                v-if="imagesArr.length > 1"
                @click="nextImage"
                class="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-gray-900 p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 z-10 shadow-lg hover:shadow-xl hover:scale-110"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            <!-- Thumbnails -->
            <div v-if="imagesArr.length > 1" class="flex gap-2 overflow-x-auto pb-2 scroll-smooth">
              <button
                v-for="(image, index) in imagesArr"
                :key="index"
                @click="currentImageIndex = index"
                :class="[
                  'flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-3 transition-all duration-300 hover:shadow-lg transform hover:scale-105',
                  index === currentImageIndex 
                    ? 'border-blue-500 ring-2 ring-blue-300 shadow-lg' 
                    : 'border-gray-200 hover:border-blue-400'
                ]"
              >
                <img :src="image" :alt="`${dharamshala.name} ${index + 1}`" class="w-full h-full object-cover" />
              </button>
            </div>
          </div>

          <!-- Info Section -->
          <div class="space-y-6 flex flex-col justify-center">
            <!-- Header -->
            <div>
              <div class="flex items-center gap-3 mb-3">
                <div class="w-2 h-8 bg-gradient-to-b from-blue-500 to-cyan-600 rounded-full" />
                <h1 class="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-900 via-blue-700 to-cyan-600 bg-clip-text text-transparent">
                  {{ dharamshala.name }}
                </h1>
              </div>
              <p class="text-lg text-gray-600 flex items-center gap-2 ml-5">
                <Icon name="MapPin" :size="18" class="text-blue-600" />
                {{ dharamshala.location.city }}, {{ dharamshala.location.state }}
              </p>
            </div>

            <!-- Rating & Badges -->
            <div class="flex flex-wrap items-center gap-3 pb-4 border-b-2 border-gradient-to-r from-blue-200 to-transparent">
              <div class="flex items-center gap-2 bg-gradient-to-r from-yellow-50 to-amber-50 px-4 py-2 rounded-xl border border-yellow-200 shadow-sm">
                <Icon name="Star" :size="20" class="fill-yellow-400 text-yellow-400 animate-pulse" />
                <span class="font-bold text-gray-900">{{ dharamshala.rating }}</span>
                <span class="text-xs text-gray-600">({{ dharamshala.reviews }} reviews)</span>
              </div>
              <span class="px-4 py-2 bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-800 rounded-xl text-sm font-bold border border-blue-300 shadow-sm">
                {{ dharamshala.type }}
              </span>
            </div>

            <!-- Key Info Grid -->
            <div class="grid grid-cols-3 gap-3">
              <div class="bg-gradient-to-br from-blue-50 to-cyan-50 p-4 rounded-xl border border-blue-200 hover:shadow-lg transition-all">
                <Icon name="Users" :size="20" class="text-blue-600 mb-2" />
                <p class="text-xs text-gray-600 font-semibold uppercase tracking-wide">Capacity</p>
                <p class="text-lg font-bold text-blue-900">{{ dharamshala.capacity }}</p>
              </div>
              <div class="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-xl border border-green-200 hover:shadow-lg transition-all">
                <Icon name="IndianRupee" :size="20" class="text-green-600 mb-2" />
                <p class="text-xs text-gray-600 font-semibold uppercase tracking-wide">Price</p>
                <p class="text-lg font-bold text-green-900">{{ dharamshala.priceRange }}</p>
              </div>
              <div class="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-xl border border-purple-200 hover:shadow-lg transition-all">
                <Icon name="CheckCircle" :size="20" class="text-purple-600 mb-2" />
                <p class="text-xs text-gray-600 font-semibold uppercase tracking-wide">Available</p>
                <p class="text-lg font-bold text-purple-900">24/7</p>
              </div>
            </div>

            <!-- Contact Section -->
            <div class="space-y-3 bg-gradient-to-r from-blue-50 to-cyan-50 p-5 rounded-xl border-l-4 border-blue-600">
              <div class="flex items-center gap-3 font-semibold text-gray-900">
                <Icon name="Phone" :size="20" class="text-blue-600" />
                <span class="uppercase text-sm tracking-wide">Contact</span>
              </div>
              <div class="space-y-2 ml-8">
                <div class="flex items-center gap-2 text-gray-700">
                  <div class="w-2 h-2 bg-blue-500 rounded-full" />
                  <a :href="`tel:${dharamshala.contact.phone}`" class="text-blue-600 hover:underline font-semibold">{{ dharamshala.contact.phone }}</a>
                </div>
                <div v-if="dharamshala.contact.email" class="flex items-center gap-2 text-gray-700">
                  <div class="w-2 h-2 bg-cyan-500 rounded-full" />
                  <a :href="`mailto:${dharamshala.contact.email}`" class="text-blue-600 hover:underline font-semibold truncate">{{ dharamshala.contact.email }}</a>
                </div>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex gap-3 pt-2">
              <button class="flex-1 py-3 px-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-bold hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center justify-center gap-2 group">
                <Icon name="Phone" :size="20" class="group-hover:animate-bounce" />
                <span>Call Now</span>
              </button>
              <button class="flex-1 py-3 px-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-bold hover:from-green-700 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center justify-center gap-2 group">
                <Icon name="MapPin" :size="20" class="group-hover:animate-pulse" />
                <span>Directions</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Features Section -->
        <div class="bg-gradient-to-r from-blue-50 to-cyan-50 p-8 rounded-2xl border-2 border-blue-200">
          <h2 class="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <Icon name="Sparkles" :size="28" class="text-blue-600" />
            Amenities & Features
          </h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div v-for="feature in dharamshala.features" :key="feature" class="flex items-center gap-3 p-4 bg-white rounded-xl border-2 border-blue-100 hover:border-blue-300 hover:shadow-md transition-all">
              <div class="p-2 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-lg">
                <Icon name="Check" :size="20" class="text-white" />
              </div>
              <span class="font-semibold text-gray-900">{{ feature }}</span>
            </div>
          </div>
        </div>

        <!-- Location Map Section -->
        <div class="bg-gradient-to-r from-blue-50 to-cyan-50 p-8 rounded-2xl border-2 border-blue-200">
          <h2 class="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <Icon name="MapPin" :size="28" class="text-blue-600" />
            Location Details
          </h2>
          <div class="bg-white p-6 rounded-xl border-2 border-blue-100">
            <p class="text-gray-700 mb-4">{{ dharamshala.location.address }}</p>
            <div class="text-sm text-gray-600 space-y-2">
              <p><strong>Latitude:</strong> {{ dharamshala.location.latitude }}</p>
              <p><strong>Longitude:</strong> {{ dharamshala.location.longitude }}</p>
            </div>
            <button class="mt-4 px-6 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-bold hover:from-blue-700 hover:to-cyan-700 transition-all">
              Open in Maps
            </button>
          </div>
        </div>

        <!-- Back to Top Button -->
        <div class="flex justify-center pt-8 border-t">
          <button
            @click="scrollToTop"
            class="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-full font-bold hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center gap-2"
          >
            <Icon name="ArrowUp" :size="20" />
            <span>Back to Top</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import Icon from '~/components/Icon.vue'

definePageMeta({
  layout: 'default',
})

const currentImageIndex = ref(0)
const dharamshala = ref<any>(null)

// Sample dharamshala data
const dharamshalasData = {
  'shanti-dharamshala': {
    id: 'shanti-dharamshala',
    name: 'Shanti Dharamshala',
    description: 'Peaceful lodging with clean rooms and basic amenities for pilgrims',
    type: 'dharamshala',
    rating: 4.2,
    reviews: 156,
    capacity: '50 Rooms',
    priceRange: '₹200-500',
    features: ['WiFi Available', 'Vegetarian Kitchen', '24-Hour Security', 'Prayer Room', 'Common Lounge', 'Free Parking'],
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
  'divya-nivas': {
    id: 'divya-nivas',
    name: 'Divya Nivas Dharamshala',
    description: 'Comfortable accommodation with modern facilities for spiritual seekers',
    type: 'dharamshala',
    rating: 4.5,
    reviews: 234,
    capacity: '75 Rooms',
    priceRange: '₹500-1000',
    features: ['AC Rooms', 'Conference Hall', 'Prayer Room', 'Restaurant', 'Laundry Service', 'Room Service'],
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
  }
}

const imagesArr = computed(() => {
  if (!dharamshala.value?.images) return [] as string[]
  return Array.isArray(dharamshala.value.images) ? dharamshala.value.images : [dharamshala.value.images]
})

const currentImage = computed(() => {
  if (!imagesArr.value || imagesArr.value.length === 0) {
    return 'https://via.placeholder.com/500x500'
  }
  return imagesArr.value[currentImageIndex.value] || 'https://via.placeholder.com/500x500'
})

const nextImage = () => {
  if (imagesArr.value.length > 0) {
    currentImageIndex.value = (currentImageIndex.value + 1) % imagesArr.value.length
  }
}

const previousImage = () => {
  if (imagesArr.value.length > 0) {
    currentImageIndex.value = (currentImageIndex.value - 1 + imagesArr.value.length) % imagesArr.value.length
  }
}

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const route = useRoute()

onMounted(() => {
  const id = route.params.id as string
  dharamshala.value = dharamshalasData[id as keyof typeof dharamshalasData] || null
})
</script>
