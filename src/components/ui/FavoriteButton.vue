<template>
  <button
    @click.stop="handleClick"
    @mouseenter="() => (isHovered = true)"
    @mouseleave="() => (isHovered = false)"
    :aria-pressed="isFavorited"
    :title="isFavorited ? 'Remove from wishlist' : 'Add to wishlist'"
    :disabled="isLoading"
    class="w-11 h-11 flex items-center justify-center transition-all duration-300"
    :class="[
      isLoading ? 'opacity-50 cursor-wait' : '',
      isFavorited
        ? `${heartColor} scale-110`
        : `text-white hover:scale-110`
    ]"
  >
    <!-- Loading spinner -->
    <div v-if="isLoading" class="animate-spin w-6 h-6 border-2 border-current border-t-transparent rounded-full"></div>
    <!-- Icon: stroked when not favorited, filled when favorited. Hover tracked via isHovered. -->
    <Icon
      v-else
      name="Heart"
      :size="32"
      :class="(isFavorited || isHovered) ? 'fill-current' : 'stroke-current'"
      stroke-width="2"
      :fill="(isFavorited || isHovered) ? 'currentColor' : 'none'"
      aria-hidden
    />
  </button>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useFavoritesStore } from '~/stores/favorites'
import { useAuth } from '~/composables/auth/useAuth'
import Icon from './Icon.vue'

interface Props {
  itemId: string
  entityType?: 'tirth' | 'dharamshala' | 'bhojanshala'
  isFavorited?: boolean
  heartColor?: string
  heartFilledColor?: string
}

const props = withDefaults(defineProps<Props>(), {
  entityType: 'tirth',
  isFavorited: false,
  heartColor: 'text-red-500',
  heartFilledColor: 'bg-red-500',
})

const emit = defineEmits<{
  'toggle-favorite': [{ id: string; isFavorited: boolean }]
  'auth-required': []
}>()

const favoritesStore = useFavoritesStore()
const { isAuthenticated, initialize } = useAuth()
const router = useRouter()

// Initialize auth on component mount
onMounted(async () => {
  await initialize()
})

// Determine if favorited
const isFavorited = computed(() => {
  return favoritesStore.isFavorite(props.itemId)
})

// Local hover state (used instead of group-hover)
let isHovered = ref(false)

// Loading state for API operations
const isLoading = ref(false)

// Handle click with auth gating
const handleClick = async () => {
  // Check authentication first
  if (!isAuthenticated.value) {
    emit('auth-required')
    // Navigate directly to login page
    await router.push('/auth/login')
    return
  }

  // Toggle favorite
  await toggleFavorite()
}

// Toggle favorite
const toggleFavorite = async () => {
  if (isLoading.value) return
  
  isLoading.value = true
  try {
    const newState = !isFavorited.value
    await favoritesStore.toggleFavorite(props.itemId, props.entityType)
    emit('toggle-favorite', { id: props.itemId, isFavorited: newState })
  } catch (e) {
    console.error('Error toggling favorite:', e)
  } finally {
    isLoading.value = false
  }
}
</script>
