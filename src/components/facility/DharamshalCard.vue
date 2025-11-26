<template>
  <div class="relative group" @click="handleCardClick">
    <div class="rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer bg-white shadow-lg hover:shadow-2xl hover:scale-105 border-2 border-blue-100 hover:border-blue-300">
      <!-- Image Container -->
      <div class="relative w-full h-64 overflow-hidden bg-gradient-to-br from-blue-200 to-cyan-200">
        <!-- Image with lazy loading effect -->
        <img
          :src="imagesArr[currentImageIndex] || 'https://via.placeholder.com/400x320'"
          :alt="dharamshala.name"
          class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />

        <!-- Gradient Overlay -->
        <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>

        <!-- Navigation Arrows -->
        <div v-if="imagesArr.length > 1" class="absolute inset-0 flex items-center justify-between px-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            @click.stop="prevImage"
            class="p-2 bg-white/80 hover:bg-white rounded-full shadow-lg transition-colors hover:shadow-xl transform hover:scale-110"
          >
            <Icon name="ChevronLeft" :size="24" class="text-gray-900" />
          </button>
          <button
            @click.stop="nextImage"
            class="p-2 bg-white/80 hover:bg-white rounded-full shadow-lg transition-colors hover:shadow-xl transform hover:scale-110"
          >
            <Icon name="ChevronRight" :size="24" class="text-gray-900" />
          </button>
        </div>

        <!-- Image Dots -->
        <div v-if="imagesArr.length > 1" class="absolute bottom-3 left-0 right-0 flex justify-center gap-2">
          <button
            v-for="(_, index) in imagesArr"
            :key="index"
            @click.stop="currentImageIndex = index"
            :class="[
              'transition-all duration-300',
              index === currentImageIndex
                ? 'w-8 h-2 bg-blue-400 rounded-full'
                : 'w-2 h-2 bg-white/60 rounded-full hover:bg-white/80'
            ]"
          />
        </div>

        <!-- Rating & Type Badges -->
        <div class="absolute top-4 left-4 right-4 flex items-start justify-between gap-2">
          <div class="flex items-center gap-1 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-lg">
            <Icon name="Star" :size="16" class="fill-yellow-400 text-yellow-400" />
            <span class="text-sm font-bold text-gray-900">{{ dharamshala.rating }}</span>
          </div>
        </div>

        <!-- Title and Subtitle positioned over gradient -->
        <div class="absolute bottom-0 left-0 right-0 p-4 text-white">
          <h3 class="text-lg font-bold line-clamp-2">{{ dharamshala.name }}</h3>
          <p class="text-sm text-gray-200 mt-1 line-clamp-1">{{ dharamshala.location.city }}, {{ dharamshala.location.state }}</p>
        </div>
      </div>

      <!-- Quick Info Section -->
      <div class="p-4 space-y-3">
        <!-- Features Tags -->
        <div class="flex flex-wrap gap-2">
          <span v-for="feature in dharamshala.features.slice(0, 3)" :key="feature" class="px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold">
            {{ feature }}
          </span>
        </div>
      </div>
    </div>

    <!-- Wishlist Heart Button -->
    <button
      @click.stop="toggleWishlist"
      :aria-pressed="isFavorited"
      :title="isFavorited ? 'Remove from wishlist' : 'Add to wishlist'"
      class="absolute top-4 right-4 z-10 w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-xl"
      :class="isFavorited 
        ? 'bg-blue-600 text-white scale-110' 
        : 'bg-white text-blue-600 hover:bg-blue-600 hover:text-white hover:scale-110'"
    >
      <Icon name="Heart" :size="22" :class="isFavorited ? 'fill-current' : 'fill-current'" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '~/stores/user'
import Icon from '~/components/Icon.vue'

interface DharamshalItem {
  id: string
  name: string
  description: string
  type: string
  rating: number
  capacity: string
  priceRange: string
  location: {
    city: string
    state: string
    address: string
    latitude: number
    longitude: number
  }
  contact: {
    phone: string
    email?: string
  }
  features: string[]
  images?: string[] | string
  reviews: number
}

const props = defineProps<{
  dharamshala: DharamshalItem
}>()

const router = useRouter()
const userStore = useUserStore()
const currentImageIndex = ref(0)

// Normalize images to an array
const imagesArr = computed(() => {
  if (!props.dharamshala.images) return [] as string[]
  return Array.isArray(props.dharamshala.images) ? props.dharamshala.images : [props.dharamshala.images]
})

// Helper to check if favorited
const isFavorited = computed(() => {
  try {
    if (typeof userStore.isFavorite === 'function') {
      return userStore.isFavorite(props.dharamshala.id)
    }
    return (userStore.user?.favorites || []).includes(props.dharamshala.id)
  } catch (e) {
    return false
  }
})

// Format type text
const formatType = (type: string) => {
  return type
    .replace(/-/g, ' ')
    .split(' ')
    .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

// Carousel navigation
const nextImage = () => {
  if (imagesArr.value.length === 0) return
  currentImageIndex.value = (currentImageIndex.value + 1) % imagesArr.value.length
}

const prevImage = () => {
  if (imagesArr.value.length === 0) return
  currentImageIndex.value = (currentImageIndex.value - 1 + imagesArr.value.length) % imagesArr.value.length
}

// Toggle wishlist
const toggleWishlist = async () => {
  try {
    const favs = (userStore.user?.favorites || [])
    if (favs.includes(props.dharamshala.id)) {
      await userStore.removeFavorite(props.dharamshala.id)
    } else {
      await userStore.addFavorite(props.dharamshala.id)
    }
  } catch (e) {
    console.error('Error toggling favorite:', e)
  }
}

// Handle card click to navigate to details page
const handleCardClick = (event: MouseEvent) => {
  // Don't navigate if clicking on interactive elements
  const target = event.target as HTMLElement
  const clickedButton = target.closest('button')
  const clickedLink = target.closest('a')
  
  if (clickedButton || clickedLink) {
    return
  }
  
  router.push(`/dharamshala-detail/${props.dharamshala.id}`)
}
</script>
