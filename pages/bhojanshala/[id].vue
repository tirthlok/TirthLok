<template>
  <div class="min-h-screen bg-gradient-to-b from-green-50 via-white to-emerald-50 py-4 sm:py-8 md:py-12">
    <div class="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <!-- Back Button -->
      <div class="mb-6 sm:mb-8">
        <NuxtLink
          to="/bhojanshala"
          class="inline-flex items-center gap-2 text-green-600 hover:text-green-700 font-bold transition-all duration-300 transform hover:scale-105 hover:gap-3"
        >
          <Icon name="ArrowLeft" :size="22" />
          <span class="text-base sm:text-lg">Back to Bhojanshala List</span>
        </NuxtLink>
      </div>

      <!-- Loading State -->
      <div v-if="!bhojanshala" class="flex justify-center items-center py-32">
        <div class="text-center space-y-6">
          <div class="relative w-16 h-16 mx-auto">
            <div class="absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full animate-spin" style="clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%, 0% 50%)" />
            <div class="absolute inset-2 bg-white rounded-full" />
          </div>
          <p class="text-gray-600 font-semibold text-lg">Loading bhojanshala details...</p>
        </div>
      </div>

      <!-- Content -->
      <div v-else class="space-y-8 sm:space-y-10">
        <!-- Header Section -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
          <!-- Image Gallery -->
          <div class="space-y-4">
            <div class="relative group overflow-hidden rounded-2xl shadow-2xl bg-gradient-to-br from-green-100 to-emerald-100 h-96 lg:h-[500px]">
              <img
                :src="currentImage"
                :alt="bhojanshala.name"
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
                    ? 'border-green-500 ring-2 ring-green-300 shadow-lg' 
                    : 'border-gray-200 hover:border-green-400'
                ]"
              >
                <img :src="image" :alt="`${bhojanshala.name} ${index + 1}`" class="w-full h-full object-cover" />
              </button>
            </div>
          </div>

          <!-- Info Section -->
          <div class="space-y-6 flex flex-col justify-center">
            <!-- Header -->
            <div>
              <div class="flex items-center gap-3 mb-3">
                <div class="w-2 h-8 bg-gradient-to-b from-green-500 to-emerald-600 rounded-full" />
                <h1 class="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-green-900 via-green-700 to-emerald-600 bg-clip-text text-transparent">
                  {{ bhojanshala.name }}
                </h1>
              </div>
              <p class="text-lg text-gray-600 flex items-center gap-2 ml-5">
                <Icon name="MapPin" :size="18" class="text-green-600" />
                {{ bhojanshala.location.city }}, {{ bhojanshala.location.state }}
              </p>
            </div>

            <!-- Rating & Badges -->
            <div class="flex flex-wrap items-center gap-3 pb-4 border-b-2 border-gradient-to-r from-green-200 to-transparent">
              <div class="flex items-center gap-2 bg-gradient-to-r from-yellow-50 to-amber-50 px-4 py-2 rounded-xl border border-yellow-200 shadow-sm">
                <Icon name="Star" :size="20" class="fill-yellow-400 text-yellow-400 animate-pulse" />
                <span class="font-bold text-gray-900">{{ bhojanshala.rating }}</span>
                <span class="text-xs text-gray-600">({{ bhojanshala.reviews }} reviews)</span>
              </div>
              <span class="px-4 py-2 bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 rounded-xl text-sm font-bold border border-green-300 shadow-sm">
                {{ bhojanshala.type }}
              </span>
            </div>

            <!-- Key Info Grid -->
            <div class="grid grid-cols-3 gap-3">
              <div class="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-xl border border-green-200 hover:shadow-lg transition-all">
                <Icon name="Clock" :size="20" class="text-green-600 mb-2" />
                <p class="text-xs text-gray-600 font-semibold uppercase tracking-wide">Hours</p>
                <p class="text-sm font-bold text-green-900">{{ bhojanshala.operatingHours }}</p>
              </div>
              <div class="bg-gradient-to-br from-emerald-50 to-teal-50 p-4 rounded-xl border border-emerald-200 hover:shadow-lg transition-all">
                <Icon name="IndianRupee" :size="20" class="text-emerald-600 mb-2" />
                <p class="text-xs text-gray-600 font-semibold uppercase tracking-wide">Price</p>
                <p class="text-sm font-bold text-emerald-900">{{ bhojanshala.priceRange }}</p>
              </div>
              <div class="bg-gradient-to-br from-teal-50 to-cyan-50 p-4 rounded-xl border border-teal-200 hover:shadow-lg transition-all">
                <Icon name="Leaf" :size="20" class="text-teal-600 mb-2" />
                <p class="text-xs text-gray-600 font-semibold uppercase tracking-wide">Pure</p>
                <p class="text-sm font-bold text-teal-900">Vegetarian</p>
              </div>
            </div>

            <!-- Contact Section -->
            <div class="space-y-3 bg-gradient-to-r from-green-50 to-emerald-50 p-5 rounded-xl border-l-4 border-green-600">
              <div class="flex items-center gap-3 font-semibold text-gray-900">
                <Icon name="Phone" :size="20" class="text-green-600" />
                <span class="uppercase text-sm tracking-wide">Contact</span>
              </div>
              <div class="space-y-2 ml-8">
                <div class="flex items-center gap-2 text-gray-700">
                  <div class="w-2 h-2 bg-green-500 rounded-full" />
                  <a :href="`tel:${bhojanshala.contact.phone}`" class="text-green-600 hover:underline font-semibold">{{ bhojanshala.contact.phone }}</a>
                </div>
                <div v-if="bhojanshala.contact.email" class="flex items-center gap-2 text-gray-700">
                  <div class="w-2 h-2 bg-emerald-500 rounded-full" />
                  <a :href="`mailto:${bhojanshala.contact.email}`" class="text-green-600 hover:underline font-semibold truncate">{{ bhojanshala.contact.email }}</a>
                </div>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex gap-3 pt-2">
              <button class="flex-1 py-3 px-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-bold hover:from-green-700 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center justify-center gap-2 group">
                <Icon name="Phone" :size="20" class="group-hover:animate-bounce" />
                <span>Call Now</span>
              </button>
              <button class="flex-1 py-3 px-4 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-xl font-bold hover:from-amber-700 hover:to-orange-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center justify-center gap-2 group">
                <Icon name="MapPin" :size="20" class="group-hover:animate-pulse" />
                <span>Location</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Cuisines Section -->
        <div class="bg-gradient-to-r from-green-50 to-emerald-50 p-8 rounded-2xl border-2 border-green-200">
          <h2 class="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <Icon name="Utensils" :size="28" class="text-green-600" />
            Cuisines Available
          </h2>
          <div class="flex flex-wrap gap-3">
            <span v-for="cuisine in bhojanshala.cuisines" :key="cuisine" class="px-4 py-2 bg-white rounded-lg border-2 border-green-200 font-semibold text-green-700 hover:border-green-400 transition-all">
              {{ cuisine }}
            </span>
          </div>
        </div>

        <!-- Description Section -->
        <div class="bg-gradient-to-r from-blue-50 to-cyan-50 p-8 rounded-2xl border-2 border-blue-200">
          <h2 class="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
            <Icon name="BookOpen" :size="28" class="text-blue-600" />
            About This Bhojanshala
          </h2>
          <p class="text-gray-700 leading-relaxed text-lg mb-4">
            {{ bhojanshala.description }}
          </p>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
            <div class="p-4 bg-white rounded-lg border-l-4 border-green-500">
              <p class="text-sm text-gray-600 mb-1"><strong>Specialty:</strong></p>
              <p class="text-green-700 font-semibold">Vegetarian cuisine following traditional recipes</p>
            </div>
            <div class="p-4 bg-white rounded-lg border-l-4 border-emerald-500">
              <p class="text-sm text-gray-600 mb-1"><strong>Service:</strong></p>
              <p class="text-emerald-700 font-semibold">Dine-in and takeaway options available</p>
            </div>
          </div>
        </div>

        <!-- Back to Top Button -->
        <div class="flex justify-center pt-8 border-t">
          <button
            @click="scrollToTop"
            class="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-full font-bold hover:from-green-700 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center gap-2"
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
const bhojanshala = ref<any>(null)

// Sample bhojanshala data
const bhojanshalasData = {
  'shri-krishna-bhojanshala': {
    id: 'shri-krishna-bhojanshala',
    name: 'Shri Krishna Bhojanshala',
    description: 'Traditional vegetarian restaurant serving authentic Gujarati cuisine with strict adherence to Jain dietary principles. We prepare fresh, wholesome meals daily using organic vegetables and traditional cooking methods.',
    type: 'bhojanshala',
    rating: 4.8,
    reviews: 312,
    operatingHours: '11:00 AM - 9:00 PM',
    priceRange: '₹60-150',
    cuisines: ['Gujarati', 'Jain', 'North Indian', 'South Indian'],
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
      'https://images.unsplash.com/photo-1501195530297-a145d97f3a7f?w=600&h=400&fit=crop'
    ]
  },
  'annapurna-dining': {
    id: 'annapurna-dining',
    name: 'Annapurna Dining Hall',
    description: 'Premium vegetarian fine dining with organic ingredients. Experience authentic regional vegetarian cuisine in a comfortable and peaceful setting perfect for pilgrims.',
    type: 'bhojanshala',
    rating: 4.7,
    reviews: 289,
    operatingHours: '12:00 PM - 10:00 PM',
    priceRange: '₹200-400',
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
  }
}

const imagesArr = computed(() => {
  if (!bhojanshala.value?.images) return [] as string[]
  return Array.isArray(bhojanshala.value.images) ? bhojanshala.value.images : [bhojanshala.value.images]
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
  bhojanshala.value = bhojanshalasData[id as keyof typeof bhojanshalasData] || null
})
</script>
