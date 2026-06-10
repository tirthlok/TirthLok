/**
 * UI Components Index
 * Central export point for all reusable UI components
 */

// =============================================================================
// Carousel Components
// =============================================================================
export { default as ImageCarousel } from './carousel/ImageCarousel.vue'
export { useImageCarousel } from './carousel/composables/useImageCarousel.ts'
export type { UseImageCarouselOptions } from './carousel/composables/useImageCarousel.ts'

// =============================================================================
// Card Components
// =============================================================================
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

// =============================================================================
// Filter Components
// =============================================================================
export { default as TirthFilterPanel } from './filters/TirthFilterPanel.vue'
export { default as SearchBox } from './filters/SearchBox.vue'
export type { SearchResult } from './filters/SearchBox.vue'

// =============================================================================
// Button Components
// =============================================================================
// (ActionButton and TagButton removed — orphaned, no consumers)

// =============================================================================
// Common UI Components (from merged common folder)
// =============================================================================
export { default as Icon } from './Icon.vue'
export { default as BottomNav } from './BottomNav.vue'
export { default as TirthCardSkeleton } from './TirthCardSkeleton.vue'
