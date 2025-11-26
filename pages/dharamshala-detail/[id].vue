<template>
  <div class="min-h-screen bg-gradient-to-b from-blue-50 via-white to-cyan-50 py-4 sm:py-8 md:py-12">
    <div class="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <!-- Back Button with Enhanced Styling -->
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
          <p class="text-gray-600 font-semibold text-lg">Loading dharamshala data...</p>
        </div>
      </div>

      <!-- Dharamshala Content -->
      <div v-else class="space-y-6 sm:space-y-8">
        <!-- Hero Section with Image Gallery -->
        <div class="rounded-2xl overflow-hidden shadow-2xl">
          <div class="relative w-full h-96 bg-gradient-to-br from-blue-200 to-cyan-200 overflow-hidden">
            <img
              :src="imagesArr[currentImageIndex] || 'https://via.placeholder.com/1200x400'"
              :alt="dharamshala.name"
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
                    ? 'w-8 h-3 bg-blue-400 rounded-full'
                    : 'w-3 h-3 bg-white/60 rounded-full hover:bg-white/80'
                ]"
              />
            </div>

            <!-- Title Overlay -->
            <div class="absolute bottom-0 left-0 right-0 p-6 text-white">
              <h1 class="text-4xl sm:text-5xl font-bold mb-2">{{ dharamshala.name }}</h1>
              <p class="text-lg opacity-90">
                <Icon name="MapPin" :size="18" class="inline mr-2" />
                {{ dharamshala.location.city }}, {{ dharamshala.location.state }}
              </p>
            </div>

            <!-- Rating Badge -->
            <div class="absolute top-6 right-6 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
              <Icon name="Star" :size="20" class="fill-yellow-400 text-yellow-400" />
              <span class="font-bold text-gray-900">{{ dharamshala.rating }}/5</span>
              <span class="text-sm text-gray-600">({{ dharamshala.reviews }} reviews)</span>
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
                  ? 'border-blue-600 text-blue-700'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              ]"
            >
              <div class="flex items-center gap-2">
                <component :is="getTabIcon(tab.id)" :size="18" />
                {{ tab.label }}
              </div>
              <div v-if="activeTab === tab.id" class="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-t-full" />
            </button>
          </div>
        </div>

        <!-- Tab Content with Smooth Transitions -->
        <div class="min-h-[400px] animate-fadeIn">
          <Transition name="fade" mode="out-in">
            <div :key="activeTab">
              <!-- Overview Tab -->
              <div v-if="activeTab === 'overview'" class="space-y-6">
                <div class="bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-200 p-6 rounded-2xl">
                  <p class="text-gray-700 text-lg leading-relaxed">{{ dharamshala.description }}</p>
                </div>
              </div>

              <!-- Amenities Tab -->
              <div v-if="activeTab === 'amenities'" class="space-y-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div
                    v-for="feature in dharamshala.features"
                    :key="feature"
                    class="bg-white border-2 border-blue-200 p-6 rounded-2xl hover:shadow-lg transition-all duration-300 hover:border-blue-400"
                  >
                    <div class="flex items-center gap-4">
                      <div class="p-3 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-lg">
                        <Icon name="Check" :size="24" class="text-white" />
                      </div>
                      <h3 class="font-bold text-gray-900 text-lg">{{ feature }}</h3>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Info Tab -->
              <div v-if="activeTab === 'info'" class="space-y-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <!-- Capacity & Pricing -->
                  <div class="bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200 p-6 rounded-2xl">
                    <h3 class="font-bold text-gray-900 text-lg mb-4 flex items-center gap-2">
                      <Icon name="Users" :size="22" class="text-blue-600" />
                      Capacity & Pricing
                    </h3>
                    <div class="space-y-3">
                      <div class="flex justify-between items-center pb-3 border-b border-blue-200">
                        <span class="text-gray-600 font-semibold">Available Capacity:</span>
                        <span class="text-blue-600 font-bold text-lg">{{ dharamshala.capacity }}</span>
                      </div>
                      <div class="flex justify-between items-center">
                        <span class="text-gray-600 font-semibold">Price Range:</span>
                        <span class="text-blue-600 font-bold text-lg">{{ dharamshala.priceRange }}</span>
                      </div>
                    </div>
                  </div>

                  <!-- Contact Information -->
                  <div class="bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200 p-6 rounded-2xl">
                    <h3 class="font-bold text-gray-900 text-lg mb-4 flex items-center gap-2">
                      <Icon name="Phone" :size="22" class="text-blue-600" />
                      Contact Information
                    </h3>
                    <div class="space-y-3">
                      <div class="flex items-center gap-3">
                        <Icon name="Phone" :size="18" class="text-blue-600 flex-shrink-0" />
                        <a :href="`tel:${dharamshala.contact.phone}`" class="text-blue-600 hover:underline font-semibold">
                          {{ dharamshala.contact.phone }}
                        </a>
                      </div>
                      <div v-if="dharamshala.contact.email" class="flex items-center gap-3">
                        <Icon name="Mail" :size="18" class="text-blue-600 flex-shrink-0" />
                        <a :href="`mailto:${dharamshala.contact.email}`" class="text-blue-600 hover:underline font-semibold">
                          {{ dharamshala.contact.email }}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Location Details -->
                <div class="bg-white border-2 border-blue-200 p-6 rounded-2xl">
                  <h3 class="font-bold text-gray-900 text-lg mb-4 flex items-center gap-2">
                    <Icon name="MapPin" :size="22" class="text-blue-600" />
                    Location Details
                  </h3>
                  <p class="text-gray-700 text-lg leading-relaxed">{{ dharamshala.location.address }}</p>
                  <p class="text-gray-600 text-sm mt-4">
                    Coordinates: {{ dharamshala.location.latitude }}, {{ dharamshala.location.longitude }}
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
            class="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-full font-bold hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center justify-center gap-2"
          >
            <Icon name="Phone" :size="22" />
            <span>Contact Now</span>
          </button>
        </div>

        <!-- Back to Top Button -->
        <div class="flex justify-center mt-12 pt-8 border-t">
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
import { useRouter } from 'vue-router'
import { BookOpen, Home, Info } from 'lucide-vue-next'

definePageMeta({
  layout: 'default',
})

const router = useRouter()
const activeTab = ref('overview')
const currentImageIndex = ref(0)
const isFavorited = ref(false)

const dharamshala = ref<any>(null)

const tabs = [
  { id: 'overview', label: 'Overview', icon: 'BookOpen' },
  { id: 'amenities', label: 'Amenities', icon: 'Home' },
  { id: 'info', label: 'Information', icon: 'Info' },
]

const imagesArr = computed(() => {
  if (!dharamshala.value?.images) return []
  return Array.isArray(dharamshala.value.images) ? dharamshala.value.images : [dharamshala.value.images]
})

const getTabIcon = (tabId: string) => {
  const iconMap: { [key: string]: any } = {
    overview: BookOpen,
    amenities: Home,
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
    
    // Sample dharamshala data
    const dharamshalas = [
      {
        id: 'shanti-dharamshala',
        name: 'Shanti Dharamshala',
        description: 'Peaceful lodging with clean rooms and basic amenities for pilgrims. Experience the tranquility of spiritual living with dedicated staff ready to serve you.',
        type: 'dharamshala',
        rating: 4.2,
        reviews: 156,
        capacity: '50 Rooms',
        priceRange: '₹200-500',
        category: 'Budget',
        features: ['WiFi', 'Vegetarian Kitchen', '24-Hour Security', 'Prayer Room', 'Common Dining Hall', 'Laundry Service'],
        location: {
          city: 'Palitana',
          state: 'Gujarat',
          address: 'Near Temple Gate, Palitana, Gujarat 364001',
          latitude: 22.129,
          longitude: 71.829
        },
        contact: {
          phone: '+91-2848-252333',
          email: 'info@shanti-dharamshala.com'
        },
        images: [
          'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1200&h=400&fit=crop',
          'https://images.unsplash.com/photo-1611142351537-a3c87d3364e9?w=1200&h=400&fit=crop',
          'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&h=400&fit=crop'
        ]
      },
      {
        id: 'divya-nivas',
        name: 'Divya Nivas Dharamshala',
        description: 'Comfortable accommodation with modern facilities for spiritual seekers. Offering premium comfort while maintaining the essence of spiritual hospitality.',
        type: 'dharamshala',
        rating: 4.5,
        reviews: 234,
        capacity: '75 Rooms',
        priceRange: '₹500-1000',
        category: 'Mid-Range',
        features: ['AC Rooms', 'Conference Hall', 'Prayer Room', 'Hot Water', 'TV Lounge', 'Meditation Hall'],
        location: {
          city: 'Ranakpur',
          state: 'Rajasthan',
          address: 'Main Road, Ranakpur, Rajasthan 345033',
          latitude: 25.05,
          longitude: 73.8
        },
        contact: {
          phone: '+91-2954-224456',
          email: 'contact@divya-nivas.com'
        },
        images: [
          'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&h=400&fit=crop',
          'https://images.unsplash.com/photo-1540932239986-310128078ceb?w=1200&h=400&fit=crop'
        ]
      },
      {
        id: 'golden-rest',
        name: 'Golden Rest Dharamshala',
        description: 'Premium pilgrim accommodation with luxury amenities and services. Experience world-class hospitality in a spiritual environment.',
        type: 'dharamshala',
        rating: 4.8,
        reviews: 345,
        capacity: '100 Rooms',
        priceRange: '₹1000-2000',
        category: 'Premium',
        features: ['Spa', 'Fine Dining', 'Meditation Hall', 'Library', 'Garden', 'Personal Attendant'],
        location: {
          city: 'Girnar',
          state: 'Gujarat',
          address: 'Hill Road, Girnar, Gujarat 362001',
          latitude: 21.506,
          longitude: 71.711
        },
        contact: {
          phone: '+91-2845-334567',
          email: 'info@golden-rest.com'
        },
        images: [
          'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&h=400&fit=crop',
          'https://images.unsplash.com/photo-1578683078519-e21cc028cb29?w=1200&h=400&fit=crop'
        ]
      }
    ]
    
    const found = dharamshalas.find(d => d.id === id)
    dharamshala.value = found || null
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
