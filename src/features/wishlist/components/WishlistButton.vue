<template>
  <button
    @click.stop="handleClick"
    @mouseenter="() => (isHovered = true)"
    @mouseleave="() => (isHovered = false)"
    :aria-pressed="isInWishlist"
    :aria-label="isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'"
    :title="isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'"
    :disabled="isLoading"
    class="transition-all duration-300 flex items-center justify-center"
    :class="[
      isLoading ? 'opacity-50 cursor-wait' : '',
      variant === 'text' 
        ? 'gap-2 px-3 py-2 rounded-xl hover:bg-gray-100 text-gray-700 hover:text-gray-900 font-semibold text-sm underline decoration-transparent hover:decoration-gray-900 w-auto h-auto'
        : 'w-11 h-11',
      variant === 'icon' && isInWishlist ? `${activeColor} scale-110` : '',
      variant === 'icon' && !isInWishlist ? 'text-white hover:scale-110' : ''
    ]"
  >
    <!-- Loading spinner -->
    <div v-if="isLoading" class="animate-spin w-5 h-5 border-2 border-current border-t-transparent rounded-full"></div>
    
    <template v-else>
      <Icon
        name="Heart"
        :size="variant === 'text' ? 16 : 32"
        :class="[
          (isInWishlist || isHovered) && variant === 'icon' ? `fill-current ${activeColor}` : '',
          !(isInWishlist || isHovered) && variant === 'icon' ? 'stroke-current text-white' : '',
          isInWishlist && variant === 'text' ? 'fill-rose-500 text-rose-500' : ''
        ]"
        :stroke-width="variant === 'text' ? 1.5 : 2"
        :fill="(isInWishlist || (isHovered && variant === 'icon')) ? 'currentColor' : 'none'"
        aria-hidden
      />
      <span v-if="variant === 'text'" class="underline">Save</span>
    </template>
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
  variant?: 'icon' | 'text'
}

const props = withDefaults(defineProps<Props>(), {
  entityType: 'tirth',
  isInWishlist: false,
  heartColor: 'text-red-500',
  heartFilledColor: 'bg-red-500',
  variant: 'icon'
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

const activeColor = computed(() => {
  if (props.entityType === 'dharamshala') return 'text-blue-500'
  if (props.entityType === 'bhojanshala') return 'text-green-500'
  return 'text-red-500'
})

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
