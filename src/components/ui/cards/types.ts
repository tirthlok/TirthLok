/**
 * Generic Card Component Types
 * Defines reusable interfaces for BaseCard component
 */

export type CardType = 'tirth' | 'dharamshala' | 'bhojanshala'

export interface Location {
  city: string
  state: string
  address?: string
  latitude?: number
  longitude?: number
  zipCode?: string
}

export interface CardItem {
  id: string
  name: string
  description?: string
  images?: string[] | string
  location: Location
  rating?: number
  [key: string]: any
}

export interface ColorScheme {
  border: string // e.g., 'border-red-100'
  borderHover: string // e.g., 'border-red-300'
  accentColor: string // e.g., 'text-red-600'
  tagBg: string // e.g., 'bg-red-50'
  tagText: string // e.g., 'text-red-700'
  heart: string // e.g., 'text-red-500'
  heartFilled: string // e.g., 'bg-red-500'
  dot: string // e.g., 'bg-red-400'
  badge?: string // e.g., 'bg-red-600'
}

export interface CardDisplayField {
  key: string
  label?: string
  icon?: string
  format?: (value: any) => string
  show?: boolean
}

export interface CardAction {
  id: string
  label: string
  icon: string
  handler: (item: CardItem) => void | Promise<void>
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
  show?: boolean
}

export interface CardConfig {
  cardType: CardType
  colorScheme: ColorScheme
  displayFields?: CardDisplayField[]
  actions?: CardAction[]
  showRating?: boolean
  showImages?: boolean
  imageHeight?: string
  showWishlist?: boolean
  navigateTo?: (id: string) => void
}

export const DEFAULT_COLOR_SCHEMES: Record<CardType, ColorScheme> = {
  tirth: {
    border: 'border-red-900/30',
    borderHover: 'border-red-700/50',
    accentColor: 'text-red-400',
    tagBg: 'bg-red-900/30',
    tagText: 'text-red-300',
    heart: 'text-red-400',
    heartFilled: 'bg-red-500',
    dot: 'bg-red-400',
    badge: 'bg-red-600',
  },
  dharamshala: {
    border: 'border-blue-900/30',
    borderHover: 'border-blue-700/50',
    accentColor: 'text-blue-400',
    tagBg: 'bg-blue-900/30',
    tagText: 'text-blue-300',
    heart: 'text-blue-400',
    heartFilled: 'bg-blue-600',
    dot: 'bg-blue-400',
    badge: 'bg-blue-600',
  },
  bhojanshala: {
    border: 'border-green-900/30',
    borderHover: 'border-green-700/50',
    accentColor: 'text-green-400',
    tagBg: 'bg-green-900/30',
    tagText: 'text-green-300',
    heart: 'text-red-400',
    heartFilled: 'bg-red-500',
    dot: 'bg-green-400',
    badge: 'bg-green-600',
  },
}

// Light theme color schemes
export const DEFAULT_COLOR_SCHEMES_LIGHT: Record<CardType, ColorScheme> = {
  tirth: {
    border: 'border-red-100',
    borderHover: 'border-red-300',
    accentColor: 'text-red-600',
    tagBg: 'bg-red-50',
    tagText: 'text-red-700',
    heart: 'text-red-500',
    heartFilled: 'bg-red-500',
    dot: 'bg-red-400',
    badge: 'bg-red-600',
  },
  dharamshala: {
    border: 'border-blue-100',
    borderHover: 'border-blue-300',
    accentColor: 'text-blue-600',
    tagBg: 'bg-blue-50',
    tagText: 'text-blue-700',
    heart: 'text-blue-600',
    heartFilled: 'bg-blue-600',
    dot: 'bg-blue-400',
    badge: 'bg-blue-600',
  },
  bhojanshala: {
    border: 'border-green-100',
    borderHover: 'border-green-300',
    accentColor: 'text-green-600',
    tagBg: 'bg-green-50',
    tagText: 'text-green-700',
    heart: 'text-red-500',
    heartFilled: 'bg-red-500',
    dot: 'bg-green-400',
    badge: 'bg-green-600',
  },
}
