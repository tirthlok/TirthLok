<template>
  <button
    @click.stop="handleClick"
    @mouseenter="() => (isHovered = true)"
    @mouseleave="() => (isHovered = false)"
    :aria-pressed="isInWishlist"
    :aria-label="isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'"
    :title="isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'"
    :disabled="isLoading"
    class="w-11 h-11 flex items-center justify-center transition-all duration-300"
    :class="[
      isLoading ? 'opacity-50 cursor-wait' : '',
      isInWishlist
        ? `${heartColor} scale-110`
        : `text-white hover:scale-110`
    ]"
  >
    <!-- Loading spinner -->
    <div v-if="isLoading" class="animate-spin w-6 h-6 border-2 border-current border-t-transparent rounded-full"></div>
    <!-- Icon: stroked when not in wishlist, filled when in wishlist. Hover tracked via isHovered. -->
    <Icon
      v-else
      name="Heart"
      :size="32"
      :class="(isInWishlist || isHovered) ? 'fill-current' : 'stroke-current'"
      stroke-width="2"
      :fill="(isInWishlist || isHovered) ? 'currentColor' : 'none'"
      aria-hidden
    />
  </button>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useWishlistStore } from '../composables/useWishlistStore'
import { useAuth } from '~/features/auth/composables/useAuth'
import Icon from '~/components/ui/Icon.vue'

interface Props {
  itemId: string
  entityType?: 'tirth' | 'dharamshala' | 'bhojanshala'
  isInWishlist?: boolean
  heartColor?: string
  heartFilledColor?: string
}

const props = withDefaults(defineProps<Props>(), {
  entityType: 'tirth',
  isInWishlist: false,
  heartColor: 'text-red-500',
  heartFilledColor: 'bg-red-500',
})

const emit = defineEmits<{
  'toggle-wishlist': [{ id: string; isInWishlist: boolean }]
  'auth-required': []
}>()

const wishlistStore = useWishlistStore()
const { isAuthenticated, initialize } = useAuth()
const router = useRouter()

// Initialize auth on component mount
onMounted(async () => {
  await initialize()
})

// Determine if in wishlist
const isInWishlist = computed(() => {
  return wishlistStore.isInWishlist(props.itemId, props.entityType)
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

  // Toggle wishlist
  await toggleWishlist()
}

// Toggle wishlist
const toggleWishlist = async () => {
  if (isLoading.value) return
  
  isLoading.value = true
  try {
    const newState = !isInWishlist.value
    await wishlistStore.toggleWishlist(props.itemId, props.entityType)
    emit('toggle-wishlist', { id: props.itemId, isInWishlist: newState })
  } catch (e) {
    console.error('Error toggling wishlist:', e)
  } finally {
    isLoading.value = false
  }
}
</script>
