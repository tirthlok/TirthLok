/**
 * useCardStyles Composable
 * Handles card styling and color schemes
 */

import type { CardType, ColorScheme } from '../types'
import { DEFAULT_COLOR_SCHEMES } from '../types'

export function useCardStyles(
  cardType: CardType,
  customColorScheme?: Partial<ColorScheme>
): ColorScheme {
  const defaultScheme = DEFAULT_COLOR_SCHEMES[cardType]

  return {
    ...defaultScheme,
    ...(customColorScheme || {}),
  }
}

/**
 * Get contrasting text color for a background
 */
export function getContrastColor(bgColor: string): string {
  // Simple heuristic: lighter backgrounds get dark text, dark backgrounds get light text
  const lightBackgrounds = ['bg-white', 'bg-gray-50', 'bg-gray-100', 'bg-yellow-50', 'bg-blue-50', 'bg-green-50', 'bg-red-50']

  return lightBackgrounds.some((bg) => bgColor.includes(bg)) ? 'text-gray-900' : 'text-white'
}

/**
 * Format type text (e.g., 'veg-only' -> 'Veg Only')
 */
export function formatTypeText(type: string): string {
  return type
    .replace(/-/g, ' ')
    .split(' ')
    .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}
