/**
 * Shared Components Index
 * Central export point for all generic/shared components
 */

// Carousel Components
export { default as ImageCarousel } from './carousel/ImageCarousel.vue'
export { useImageCarousel } from './carousel/composables/useImageCarousel.ts'
export type { UseImageCarouselOptions } from './carousel/composables/useImageCarousel.ts'

// Card Components
export { default as BaseCard } from './cards/BaseCard.vue'
export { useCard } from './cards/composables/useCard.ts'
export { useCardStyles, getContrastColor, formatTypeText } from './cards/composables/useCardStyles.ts'
export * from './cards/types.ts'
export type {
  CardType,
  CardItem,
  ColorScheme,
  CardDisplayField,
  CardAction,
  CardConfig,
} from './cards/types.ts'

// Header Components
export { default as HeaderWithImage } from './headers/HeaderWithImage.vue'

// Filter Components
export { default as FilterPanel } from './filters/FilterPanel.vue'
export { default as SearchBox } from './filters/SearchBox.vue'
export type { FilterOption, FilterDefinition } from './filters/FilterPanel.vue'
export type { SearchResult } from './filters/SearchBox.vue'

// Button Components
export { default as ActionButton } from './buttons/ActionButton.vue'
export { default as TagButton } from './buttons/TagButton.vue'
export type { ButtonVariant as ActionButtonVariant, ButtonSize as ActionButtonSize } from './buttons/ActionButton.vue'

// Room Booking Components (Dharamshala & Bhojanshala)
export { default as RoomCard } from './RoomCard.vue'
export { default as RoomBookingModal } from './RoomBookingModal.vue'

// Common Components
export { default as Icon } from '../common/Icon.vue'
export { default as FavoriteButton } from '../common/FavoriteButton.vue'
