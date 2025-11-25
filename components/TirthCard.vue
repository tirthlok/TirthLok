<template>
  <div class="relative group">
    <NuxtLink :to="`/${tirth.id}`" class="block">
      <BaseCard
        :images="tirth.images"
        :title="tirth.name"
        :subtitle="`${tirth.location.city}, ${tirth.location.state}`"
        clickable
      />
    </NuxtLink>

    <!-- Wishlist Heart Button -->
    <button
      @click.stop="toggleWishlist"
      :aria-pressed="isFavorited"
      :title="isFavorited ? 'Remove from wishlist' : 'Add to wishlist'"
      class="absolute top-4 right-4 z-10 w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg"
      :class="isFavorited 
        ? 'bg-red-500 text-white scale-110' 
        : 'bg-white text-red-500 hover:bg-red-500 hover:text-white hover:scale-110'"
    >
      <Icon name="Heart" :size="22" :class="isFavorited ? 'fill-current' : 'fill-current'" />
    </button>
  </div>
</template>

<script setup lang="ts">
import type { Tirth } from '~/types/models'
import { computed } from 'vue'
import { useUserStore } from '~/stores/user'
import Icon from '~/components/Icon.vue'

const props = defineProps<{
  tirth: Tirth
}>()

const userStore = useUserStore()

// Helper to check if favorited (server-only)
const isFavorited = computed(() => {
  try {
    if (typeof userStore.isFavorite === 'function') {
      return userStore.isFavorite(props.tirth.id)
    }
    return (userStore.user?.favorites || []).includes(props.tirth.id)
  } catch (e) {
    return false
  }
})

const toggleWishlist = async () => {
  // Always use store (no localStorage fallback)
  try {
    const favs = (userStore.user?.favorites || [])
    if (favs.includes(props.tirth.id)) {
      await userStore.removeFavorite(props.tirth.id)
    } else {
      await userStore.addFavorite(props.tirth.id)
    }
  } catch (e) {
    console.error('Error toggling favorite:', e)
  }
}

// Navigation handled via `NuxtLink` wrapper above
</script>
