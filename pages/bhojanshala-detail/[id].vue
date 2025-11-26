<template>
  <div class="min-h-screen bg-gradient-to-b from-green-50 via-white to-emerald-50 py-4 sm:py-8 md:py-12">
    <div class="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <!-- Back Button with Enhanced Styling -->
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
          <p class="text-gray-600 font-semibold text-lg">Loading bhojanshala data...</p>
        </div>
      </div>

      <!-- Bhojanshala Content -->
      <div v-else class="space-y-6 sm:space-y-8">
        <!-- Hero Section with Image Gallery -->
        <div class="rounded-2xl overflow-hidden shadow-2xl">
          <div class="relative w-full h-96 bg-gradient-to-br from-green-200 to-emerald-200 overflow-hidden">
            <img
              :src="imagesArr[currentImageIndex] || 'https://via.placeholder.com/1200x400'"
              :alt="bhojanshala.name"
              class="w-full h-full object-cover transition-transform duration-700"
            />
            <!-- Gradient Overlay -->
            <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
            
            <!-- Navigation Arrows -->
            <div v-if="imagesArr.length > 1" class="absolute inset-0 flex items-center justify-between px-6 opacity-0 hover:opacity-100 transition-opacity">
              <button
                @click="prevImage"
                class="p-3 bg-white/80 hover:bg-white rounded-full shadow-lg transition-colors hover:shadow-xl transform hover:scale-110"
              >
                <Icon name="ChevronLeft" :size="28" class="text-gray-900" />
              </button>
              <button
                @click="nextImage"
                class="p-3 bg-white/80 hover:bg-white rounded-full shadow-lg transition-colors hover:shadow-xl transform hover:scale-110"
              >
                <Icon name="ChevronRight" :size="28" class="text-gray-900" />
              </button>
            </div>

            <!-- Image Dots Indicator -->
            <div v-if="imagesArr.length > 1" class="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
              <button
                v-for="(_, index) in imagesArr"
                :key="index"
                @click="currentImageIndex = index"
                :class="[
                  'transition-all duration-300',
                  index === currentImageIndex
                    ? 'w-8 h-3 bg-green-400 rounded-full'
                    : 'w-3 h-3 bg-white/60 rounded-full hover:bg-white/80'
                ]"
              />
            </div>

            <!-- Title Overlay -->
            <div class="absolute bottom-0 left-0 right-0 p-6 text-white">
              <h1 class="text-4xl sm:text-5xl font-bold mb-2">{{ bhojanshala.name }}</h1>
              <p class="text-lg opacity-90">
                <Icon name="MapPin" :size="18" class="inline mr-2" />
                {{ bhojanshala.location.city }}, {{ bhojanshala.location.state }}
              </p>
            </div>

            <!-- Rating Badge -->
            <div class="absolute top-6 right-6 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
              <Icon name="Star" :size="20" class="fill-yellow-400 text-yellow-400" />
              <span class="font-bold text-gray-900">{{ bhojanshala.rating }}/5</span>
              <span class="text-sm text-gray-600">({{ bhojanshala.reviews }} reviews)</span>
            </div>
          </div>
        </div>

        <!-- Tabs Navigation with Modern Styling -->
        <div class="border-b-2 border-gray-200 -mx-4 sm:mx-0 px-4 sm:px-0 overflow-x-auto">
          <div class="flex gap-2 sm:gap-8 scroll-smooth">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              @click="activeTab = tab.id"
              :class="[
                'pb-4 px-1 font-bold transition-all duration-300 border-b-4 whitespace-nowrap text-sm sm:text-base relative group',
                activeTab === tab.id
                  ? 'border-green-600 text-green-700'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              ]"
            >
              <div class="flex items-center gap-2">
                <component :is="getTabIcon(tab.id)" :size="18" />
                {{ tab.label }}
              </div>
              <div v-if="activeTab === tab.id" class="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-green-600 to-emerald-600 rounded-t-full" />
            </button>
          </div>
        </div>

        <!-- Tab Content with Smooth Transitions -->
        <div class="min-h-[400px] animate-fadeIn">
          <Transition name="fade" mode="out-in">
            <div :key="activeTab">
              <!-- Overview Tab -->
              <div v-if="activeTab === 'overview'" class="space-y-6">
                <div class="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 p-6 rounded-2xl">
                  <p class="text-gray-700 text-lg leading-relaxed">{{ bhojanshala.description }}</p>
                </div>
              </div>

              <!-- Cuisines Tab -->
              <div v-if="activeTab === 'cuisines'" class="space-y-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div
                    v-for="cuisine in bhojanshala.cuisines"
                    :key="cuisine"
                    class="bg-white border-2 border-green-200 p-6 rounded-2xl hover:shadow-lg transition-all duration-300 hover:border-green-400"
                  >
                    <div class="flex items-center gap-4">
                      <div class="p-3 bg-gradient-to-br from-green-600 to-emerald-600 rounded-lg">
                        <Icon name="Utensils" :size="24" class="text-white" />
                      </div>
                      <h3 class="font-bold text-gray-900 text-lg">{{ cuisine }}</h3>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Info Tab -->
              <div v-if="activeTab === 'info'" class="space-y-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <!-- Operating Hours & Pricing -->
                  <div class="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 p-6 rounded-2xl">
                    <h3 class="font-bold text-gray-900 text-lg mb-4 flex items-center gap-2">
                      <Icon name="Clock" :size="22" class="text-green-600" />
                      Hours & Pricing
                    </h3>
                    <div class="space-y-3">
                      <div class="flex justify-between items-center pb-3 border-b border-green-200">
                        <span class="text-gray-600 font-semibold">Operating Hours:</span>
                        <span class="text-green-600 font-bold text-lg">{{ bhojanshala.operatingHours }}</span>
                      </div>
                      <div class="flex justify-between items-center">
                        <span class="text-gray-600 font-semibold">Price Range:</span>
                        <span class="text-green-600 font-bold text-lg">{{ bhojanshala.priceRange }}</span>
                      </div>
                    </div>
                  </div>

                  <!-- Contact Information -->
                  <div class="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 p-6 rounded-2xl">
                    <h3 class="font-bold text-gray-900 text-lg mb-4 flex items-center gap-2">
                      <Icon name="Phone" :size="22" class="text-green-600" />
                      Contact Information
                    </h3>
                    <div class="space-y-3">
                      <div class="flex items-center gap-3">
                        <Icon name="Phone" :size="18" class="text-green-600 flex-shrink-0" />
                        <a :href="`tel:${bhojanshala.contact.phone}`" class="text-green-600 hover:underline font-semibold">
                          {{ bhojanshala.contact.phone }}
                        </a>
                      </div>
                      <div v-if="bhojanshala.contact.email" class="flex items-center gap-3">
                        <Icon name="Mail" :size="18" class="text-green-600 flex-shrink-0" />
                        <a :href="`mailto:${bhojanshala.contact.email}`" class="text-green-600 hover:underline font-semibold">
                          {{ bhojanshala.contact.email }}
                        </a>
                      </div>
                      <div v-if="bhojanshala.contact.website" class="flex items-center gap-3">
                        <Icon name="Globe" :size="18" class="text-green-600 flex-shrink-0" />
                        <a :href="`https://${bhojanshala.contact.website}`" target="_blank" class="text-green-600 hover:underline font-semibold">
                          {{ bhojanshala.contact.website }}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Location Details -->
                <div class="bg-white border-2 border-green-200 p-6 rounded-2xl">
                  <h3 class="font-bold text-gray-900 text-lg mb-4 flex items-center gap-2">
                    <Icon name="MapPin" :size="22" class="text-green-600" />
                    Location Details
                  </h3>
                  <p class="text-gray-700 text-lg leading-relaxed">{{ bhojanshala.location.address }}</p>
                  <p class="text-gray-600 text-sm mt-4">
                    Coordinates: {{ bhojanshala.location.latitude }}, {{ bhojanshala.location.longitude }}
                  </p>
                </div>
              </div>
            </div>
          </Transition>
        </div>

        <!-- Action Buttons -->
        <div class="flex flex-col sm:flex-row gap-4 mt-8 pt-8 border-t">
          <button
            @click="toggleWishlist"
            :class="[
              'flex-1 px-6 py-3 rounded-full font-bold transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2',
              isFavorited
                ? 'bg-red-500 text-white hover:bg-red-600'
                : 'bg-white border-2 border-red-300 text-red-600 hover:bg-red-50'
            ]"
          >
            <Icon name="Heart" :size="22" :class="isFavorited ? 'fill-current' : ''" />
            {{ isFavorited ? 'Saved to Wishlist' : 'Save to Wishlist' }}
          </button>
          <button
            class="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-full font-bold hover:from-green-700 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center justify-center gap-2"
          >
            <Icon name="Phone" :size="22" />
            <span>Reserve Table</span>
          </button>
        </div>

        <!-- Back to Top Button -->
        <div class="flex justify-center mt-12 pt-8 border-t">
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
import { useRouter } from 'vue-router'
import { BookOpen, Utensils, Info } from 'lucide-vue-next'

definePageMeta({
  layout: 'default',
})

const router = useRouter()
const activeTab = ref('overview')
const currentImageIndex = ref(0)
const isFavorited = ref(false)

const bhojanshala = ref<any>(null)

const tabs = [
  { id: 'overview', label: 'Overview', icon: 'BookOpen' },
  { id: 'cuisines', label: 'Cuisines', icon: 'Utensils' },
  { id: 'info', label: 'Information', icon: 'Info' },
]

const imagesArr = computed(() => {
  if (!bhojanshala.value?.images) return []
  return Array.isArray(bhojanshala.value.images) ? bhojanshala.value.images : [bhojanshala.value.images]
})

const getTabIcon = (tabId: string) => {
  const iconMap: { [key: string]: any } = {
    overview: BookOpen,
    cuisines: Utensils,
    info: Info,
  }
  return iconMap[tabId] || BookOpen
}

const nextImage = () => {
  if (imagesArr.value.length === 0) return
  currentImageIndex.value = (currentImageIndex.value + 1) % imagesArr.value.length
}

const prevImage = () => {
  if (imagesArr.value.length === 0) return
  currentImageIndex.value = (currentImageIndex.value - 1 + imagesArr.value.length) % imagesArr.value.length
}

const toggleWishlist = () => {
  isFavorited.value = !isFavorited.value
}

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const loadData = () => {
  try {
    const id = router.currentRoute.value.params.id as string
    
    // Sample bhojanshala data
    const bhojanShalas = [
      {
        id: 'shri-krishna-bhojanshala',
        name: 'Shri Krishna Bhojanshala',
        description: 'Traditional vegetarian restaurant serving authentic Gujarati cuisine with pride and passion. Every dish is prepared with care using the finest ingredients, following traditional recipes passed down through generations.',
        type: 'bhojanshala',
        rating: 4.8,
        reviews: 312,
        operatingHours: '11:00 AM - 9:00 PM',
        priceRange: '₹60-150 per meal',
        category: 'Budget',
        cuisines: ['Gujarati', 'Jain', 'North Indian', 'South Indian'],
        location: {
          city: 'Palitana',
          state: 'Gujarat',
          address: 'Main Market, Palitana, Gujarat 364001',
          latitude: 22.128,
          longitude: 71.828
        },
        contact: {
          phone: '+91-2848-252222',
          email: 'info@krishna-bhojanshala.com',
          website: 'www.krishna-bhojanshala.com'
        },
        images: [
          'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=1200&h=400&fit=crop',
          'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=1200&h=400&fit=crop',
          'https://images.unsplash.com/photo-1501195530297-a145d97f3a7f?w=1200&h=400&fit=crop'
        ]
      },
      {
        id: 'annapurna-dining',
        name: 'Annapurna Dining Hall',
        description: 'Premium vegetarian fine dining with organic ingredients sourced locally. Experience exquisite culinary arts in an elegant ambiance designed for spiritual seekers and food enthusiasts alike.',
        type: 'bhojanshala',
        rating: 4.7,
        reviews: 289,
        operatingHours: '12:00 PM - 10:00 PM',
        priceRange: '₹200-400 per meal',
        category: 'Mid-Range',
        cuisines: ['Gujarati', 'Rajasthani', 'Jain', 'Continental'],
        location: {
          city: 'Ranakpur',
          state: 'Rajasthan',
          address: 'Near Temple, Ranakpur, Rajasthan 345033',
          latitude: 25.05,
          longitude: 73.8
        },
        contact: {
          phone: '+91-2954-224789',
          email: 'contact@annapurna-dining.com',
          website: 'www.annapurna-dining.com'
        },
        images: [
          'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=1200&h=400&fit=crop'
        ]
      },
      {
        id: 'divine-taste',
        name: 'Divine Taste Restaurant',
        description: 'Luxury vegetarian dining experience with gourmet cuisine blending traditional and modern culinary techniques. A haven for vegetarians seeking world-class dining in a serene spiritual setting.',
        type: 'bhojanshala',
        rating: 4.9,
        reviews: 405,
        operatingHours: '10:00 AM - 11:00 PM',
        priceRange: '₹400-800 per meal',
        category: 'Premium',
        cuisines: ['Fusion', 'International Vegetarian', 'Jain', 'Vegan'],
        location: {
          city: 'Girnar',
          state: 'Gujarat',
          address: 'Hill Road, Girnar, Gujarat 362001',
          latitude: 21.506,
          longitude: 71.711
        },
        contact: {
          phone: '+91-2845-334890',
          email: 'info@divine-taste.com',
          website: 'www.divine-taste.com'
        },
        images: [
          'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=1200&h=400&fit=crop',
          'https://images.unsplash.com/photo-1455619452474-d2be8b1e4e31?w=1200&h=400&fit=crop'
        ]
      }
    ]
    
    const found = bhojanShalas.find(b => b.id === id)
    bhojanshala.value = found || null
  } catch (error) {
    console.error('Error loading data:', error)
  }
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fadeIn {
  animation: fadeIn 0.3s ease-out;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
