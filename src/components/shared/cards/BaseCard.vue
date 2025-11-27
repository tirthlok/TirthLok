<template>
  <div class="relative group" @click="handleCardClick($event, routePrefix)">
    <div
      :class="[wrapperClasses, colorScheme.border, 'hover:' + colorScheme.borderHover, props.variant === 'featured' ? 'hover:scale-100' : 'hover:scale-105']"
    >
      <!-- Image Carousel Container -->
      <ImageCarousel
        :images="item.images"
        :title="item.name"
        :subtitle="item.location.city + ', ' + item.location.state"
        :image-height="imageHeightFinal"
        :accent-dot-color="colorScheme.dot"
        :show-title-overlay="showTitleOverlay"
        :title-overlay-class="props.variant === 'featured' ? 'absolute bottom-0 left-0 right-0 px-4 py-8 text-white bg-gradient-to-t from-black/60 via-transparent to-transparent' : 'absolute bottom-0 left-0 right-0 px-4 py-8 text-white'"
      />
    </div>

    <!-- Wishlist/Favorite Button -->
    <FavoriteButton
      v-if="showWishlist"
      :item-id="item.id"
      :entity-type="cardType"
      :is-favorited="isFavorited"
      class='absolute top-4 right-4 z-10'
    />

    <!-- Additional Info Section (Optional) -->
    <div v-if="showDetails" class="p-4 space-y-3">
      <!-- Rating -->
      <div v-if="item.rating" class="flex items-center gap-1">
        <Icon name="Star" :size="16" class="fill-yellow-400 text-yellow-400" />
        <span class="text-sm font-bold text-gray-900">{{ item.rating }}</span>
        <span class="text-xs text-gray-500">({{ item.reviews || 0 }} reviews)</span>
      </div>

      <!-- Description -->
      <p v-if="item.description" class="text-sm text-gray-600 line-clamp-2">{{ item.description }}</p>

      <!-- Additional Fields -->
      <div v-if="displayFields.length > 0" class="space-y-2 text-sm border-t border-gray-200 pt-3">
        <div v-for="field in displayFields" :key="field.key" class="flex items-start gap-2 text-gray-700">
          <Icon v-if="field.icon" :name="(field.icon as any)" :size="16" :class="'flex-shrink-0 ' + colorScheme.accentColor" />
          <div>
            <span v-if="field.label" class="font-semibold">{{ field.label }}:</span>
            <span>{{ formatFieldValue(field) }}</span>
          </div>
        </div>
      </div>

      <!-- Tags/Features -->
      <div v-if="tagFields.length > 0" class="flex flex-wrap gap-2">
        <span
          v-for="tag in tagFields.slice(0, maxTags)"
          :key="tag"
          :class="['px-2 py-1 rounded-full text-xs font-semibold', colorScheme.tagBg, colorScheme.tagText]"
        >
          {{ tag }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { CardType, CardItem, CardDisplayField, ColorScheme } from './types'
import { DEFAULT_COLOR_SCHEMES } from './types'
import { useCard } from './composables/useCard'
import { useFavoritesStore } from '~/stores/favorites'
import ImageCarousel from '../carousel/ImageCarousel.vue'
import FavoriteButton from '../../common/FavoriteButton.vue'
import Icon from '../../common/Icon.vue'

interface Props {
  item: CardItem
  cardType: CardType
  colorScheme?: Partial<ColorScheme>
  displayFields?: CardDisplayField[]
  tagFields?: string[]
  routePrefix?: string
  imageHeight?: string
  showWishlist?: boolean
  showTitleOverlay?: boolean
  showDetails?: boolean
  maxTags?: number
  variant?: 'default' | 'featured'
}

const props = withDefaults(defineProps<Props>(), {
  colorScheme: () => ({}),
  displayFields: () => [],
  tagFields: () => [],
  routePrefix: '/tirth',
  imageHeight: 'h-64',
  showWishlist: true,
  showTitleOverlay: true,
  showDetails: false,
  maxTags: 3,
  variant: 'default',
})

const favoritesStore = useFavoritesStore()
const { handleCardClick } = useCard(props.item)

// Compute final color scheme with defaults
const colorScheme = computed<ColorScheme>(() => {
  const baseScheme = DEFAULT_COLOR_SCHEMES[props.cardType]
  return {
    ...baseScheme,
    ...props.colorScheme,
  }
})

const wrapperClasses = computed(() => {
  if (props.variant === 'featured') {
    return 'rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer bg-white shadow-lg hover:shadow-2xl border-0'
  }
  return 'rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer bg-white shadow-lg hover:shadow-2xl border-2'
})

const imageHeightFinal = computed(() => {
  // Featured cards should be slightly taller by default
  if (props.variant === 'featured') return props.imageHeight || 'h-72'
  return props.imageHeight
})

// Check if item is favorited
const isFavorited = computed(() => {
  return favoritesStore.isFavorite(props.item.id)
})

// Format field value
const formatFieldValue = (field: CardDisplayField): string => {
  const value = props.item[field.key]
  if (!value) return ''

  if (field.format) {
    return field.format(value)
  }

  if (typeof value === 'object') {
    return JSON.stringify(value)
  }

  return String(value)
}
</script>
