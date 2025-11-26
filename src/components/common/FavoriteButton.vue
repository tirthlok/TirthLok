<template>
  <button
    @click.stop="toggleFavorite"
    :aria-pressed="isFavorited"
    :title="isFavorited ? 'Remove from wishlist' : 'Add to wishlist'"
    class="w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-xl"
    :class="
      isFavorited
        ? `${heartFilledColor} text-white scale-110`
        : `bg-white ${heartColor} hover:${heartFilledColor} hover:text-white hover:scale-110`
    "
  >
    <Icon name="Heart" :size="22" :class="isFavorited ? 'fill-current' : 'fill-current'" />
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useUserStore } from '~/stores/user'
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
}>()

const userStore = useUserStore()

// Determine if favorited
const isFavorited = computed(() => {
  try {
    if (typeof userStore.isFavorite === 'function') {
      return userStore.isFavorite(props.itemId)
    }
    return (userStore.user?.favorites || []).includes(props.itemId)
  } catch (_e) {
    return false
  }
})

// Toggle favorite
const toggleFavorite = async () => {
  try {
    const favs = (userStore.user?.favorites || [])
    const newState = !isFavorited.value

    if (isFavorited.value) {
      await userStore.removeFavorite(props.itemId)
    } else {
      await userStore.addFavorite(props.itemId)
    }

    emit('toggle-favorite', { id: props.itemId, isFavorited: newState })
  } catch (e) {
    console.error('Error toggling favorite:', e)
  }
}
</script>
