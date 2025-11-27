<template>
  <button
    @click.stop="toggleFavorite"
    @mouseenter="() => (isHovered = true)"
    @mouseleave="() => (isHovered = false)"
    :aria-pressed="isFavorited"
    :title="isFavorited ? 'Remove from wishlist' : 'Add to wishlist'"
    class="w-11 h-11 flex items-center justify-center transition-all duration-300"
    :class="
      isFavorited
        ? `${heartColor} scale-110`
        : `text-white hover:scale-110`
    "
  >
    <!-- Icon: stroked when not favorited, filled when favorited. Hover tracked via isHovered. -->
    <Icon
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
import { computed, ref } from 'vue'
import { useFavoritesStore } from '~/stores/favorites'
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

const favoritesStore = useFavoritesStore()

// Determine if favorited
const isFavorited = computed(() => {
  return favoritesStore.isFavorite(props.itemId)
})

// Local hover state (used instead of group-hover)
let isHovered = ref(false)

// Toggle favorite
const toggleFavorite = async () => {
  try {
    const newState = !isFavorited.value
    await favoritesStore.toggleFavorite(props.itemId, props.entityType)
    emit('toggle-favorite', { id: props.itemId, isFavorited: newState })
  } catch (e) {
    console.error('Error toggling favorite:', e)
  }
}
</script>
