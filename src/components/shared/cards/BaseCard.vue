<template>
  <div class="relative group w-72">
    <div
      :class="[wrapperClasses, colorScheme.border, 'hover:' + colorScheme.borderHover, props.variant === 'featured' ? 'hover:scale-100' : 'hover:scale-105']"
      @click="handleCardClick($event, routePrefix)"
    >
      <!-- Image Carousel Container -->
      <div :class="['relative overflow-hidden shrink-0', props.variant === 'featured' ? 'rounded-2xl h-full' : 'rounded-t-2xl h-52']">
        <ImageCarousel
          :images="item.images"
          :title="item.name"
          :subtitle="item.location.city + ', ' + item.location.state"
          :image-height="props.variant === 'featured' ? 'h-full' : imageHeightFinal"
          :accent-dot-color="colorScheme.dot"
          :show-title-overlay="showTitleOverlay"
          :title-overlay-class="props.variant === 'featured' ? 'absolute bottom-0 left-0 right-0 px-4 py-8 text-white bg-gradient-to-t from-black/80 via-black/40 to-transparent' : 'absolute bottom-0 left-0 right-0 px-4 py-8 text-white bg-gradient-to-t from-black/60 via-transparent to-transparent'"
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
      <div v-if="showDetails" :class="detailsBgClass">
        <div class="flex flex-col h-full">
          <!-- Description -->
          <p v-if="item.description" :class="descriptionClass">{{ item.description }}</p>

          <!-- Additional Fields -->
          <div v-if="displayFields.length > 0" :class="fieldsContainerClass">
            <div v-for="field in displayFields" :key="field.key" :class="fieldItemClass">
              <Icon v-if="field.icon" :name="(field.icon as any)" :size="16" :class="'flex-shrink-0 mt-0.5 ' + colorScheme.accentColor" />
              <div :class="themeStore.isDarkMode ? 'flex-1' : ''">
                <span v-if="field.label" :class="fieldLabelClass">{{ field.label }}:</span>
                <span :class="themeStore.isDarkMode ? 'ml-1' : ''">{{ formatFieldValue(field) }}</span>
              </div>
            </div>
          </div>

          <!-- Spacer to push tags to bottom -->
          <div class="flex-1"></div>

          <!-- Tags/Features -->
          <div v-if="tagFields.length > 0" class="flex flex-wrap gap-2 mt-3" :class="themeStore.isDarkMode ? 'pt-2' : ''">
            <span
              v-for="tag in tagFields.slice(0, maxTags)"
              :key="tag"
              :class="[
                'px-3 py-1.5 rounded-full text-xs font-semibold',
              themeStore.isDarkMode ? 'bg-opacity-20 backdrop-blur-sm border border-red-500/30' : '',
              colorScheme.tagBg,
              colorScheme.tagText
            ]"
          >
            {{ tag }}
          </span>
        </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { CardType, CardItem, CardDisplayField, ColorScheme } from './types'
import { DEFAULT_COLOR_SCHEMES, DEFAULT_COLOR_SCHEMES_LIGHT } from './types'
import { useCard } from './composables/useCard'
import { useFavoritesStore } from '~/stores/favorites'
import { useThemeStore } from '~/stores/theme'
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
const themeStore = useThemeStore()
const { handleCardClick } = useCard(props.item)

// Compute final color scheme with defaults based on theme
const colorScheme = computed<ColorScheme>(() => {
  const schemeMap = themeStore.isDarkMode ? DEFAULT_COLOR_SCHEMES : DEFAULT_COLOR_SCHEMES_LIGHT
  const baseScheme = schemeMap[props.cardType]
  return {
    ...baseScheme,
    ...props.colorScheme,
  }
})

const wrapperClasses = computed(() => {
  if (props.variant === 'featured') {
    return themeStore.isDarkMode
      ? 'rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer bg-gray-800 shadow-2xl hover:shadow-[0_20px_50px_rgba(0,0,0,0.6)] border-0 backdrop-blur-sm h-full flex flex-col'
      : 'rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer bg-white shadow-lg hover:shadow-2xl border-0 h-full flex flex-col'
  }
  return themeStore.isDarkMode
    ? 'rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer bg-gray-800 shadow-xl hover:shadow-2xl border-2 backdrop-blur-sm border-gray-700/50 hover:border-gray-600/50 h-[365px] flex flex-col'
    : 'rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer bg-white shadow-lg hover:shadow-2xl border-2 h-[365px] flex flex-col'
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

// Details section background
const detailsBgClass = computed(() => {
  return themeStore.isDarkMode
    ? 'p-4 space-y-4 bg-gradient-to-b from-gray-800 to-gray-900 flex-1 min-h-0'
    : 'p-4 space-y-3 flex-1 min-h-0'
})

// Description class
const descriptionClass = computed(() => {
  return themeStore.isDarkMode
    ? 'text-sm text-gray-300 leading-relaxed flex-grow overflow-hidden'
    : 'text-sm text-gray-600 flex-grow overflow-hidden'
})

// Fields container class
const fieldsContainerClass = computed(() => {
  return themeStore.isDarkMode
    ? 'space-y-2 text-sm pt-2'
    : 'space-y-2 text-sm border-t border-gray-200 pt-3'
})

// Field item class
const fieldItemClass = computed(() => {
  return themeStore.isDarkMode
    ? 'flex items-start gap-3 text-gray-200 p-2 rounded-lg hover:bg-gray-700/50 transition-colors'
    : 'flex items-start gap-2 text-gray-700'
})

// Field label class
const fieldLabelClass = computed(() => {
  return themeStore.isDarkMode
    ? 'font-semibold text-white'
    : 'font-semibold'
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
