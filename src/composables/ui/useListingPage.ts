/**
 * useListingPage Composable
 * Generic composable for handling listing page logic across tirth, dharamshala, and bhojanshala pages
 * Reduces code duplication by ~60% across three pages
 */

import { computed } from 'vue'
import { useRoute } from 'vue-router'
import type { Tirth, Dharamshala, Bhojanshala } from '~/types/models'
import { useFavoritesStore } from '~/stores/favorites'
import { useThemeStore } from '~/stores/theme'

type ItemType = Tirth | Dharamshala | Bhojanshala

interface UseListingPageOptions {
  store: {
    loading: boolean
    error: string | null
    getFiltered: () => ItemType[]
  }
  pageType: 'tirth' | 'dharamshala' | 'bhojanshala'
  routePrefix: string
  accentColor: string // e.g., 'red-500', 'blue-500', 'green-500'
}

interface FilterOption {
  id: string
  label: string
}

export function useListingPage(options: UseListingPageOptions) {
  const route = useRoute()
  const favoritesStore = useFavoritesStore()
  const themeStore = useThemeStore()

  const hasId = computed(() => !!(route && route.params && route.params.id))
  const loading = computed(() => options.store.loading)
  const error = computed(() => options.store.error)
  const filteredItems = computed(() => options.store.getFiltered())

  // Filter model - removed from composable, handled in component
  
  // Filter options
  const filterOptions = computed<FilterOption[]>(() => [
    { id: 'all', label: 'All' },
    { id: 'wishlist', label: `Favorites (${favoritesStore.getFavoriteCount})` },
  ])

  // Get filter icon based on ID
  const getFilterIcon = (id: string): string => {
    switch (id) {
      case 'all':
        return 'Grid3X3'
      case 'wishlist':
        return 'Heart'
      default:
        return 'Circle'
    }
  }

  // Display items - component handles filtering, just return filtered items
  const displayedItems = filteredItems

  // Get page-specific strings
  const getPageStrings = () => {
    const strings: Record<
      string,
      { title: string; subtitle: string; emptyIcon: string; emptyTitle: string }
    > = {
      tirth: {
        title: 'All Tirth Locations',
        subtitle: 'Explore sacred Jain pilgrimage sites',
        emptyIcon: 'MapPin',
        emptyTitle: 'No Tirths Found',
      },
      dharamshala: {
        title: 'All Dharamshala',
        subtitle: 'Traditional lodging and accommodation facilities',
        emptyIcon: 'Home',
        emptyTitle: 'No Dharamshala Found',
      },
      bhojanshala: {
        title: 'All Bhojanshala',
        subtitle: 'Authentic vegetarian dining facilities',
        emptyIcon: 'UtensilsCrossed',
        emptyTitle: 'No Bhojanshala Found',
      },
    }

    return strings[options.pageType] || strings.tirth
  }

  // Get breadcrumb title
  const getBreadcrumbTitle = (): string => {
    const titles: Record<string, string> = {
      tirth: 'Tirth',
      dharamshala: 'Dharamshala',
      bhojanshala: 'Bhojanshala',
    }
    return titles[options.pageType] || 'Locations'
  }

  return {
    hasId,
    loading,
    error,
    filteredItems,
    filterOptions,
    displayedItems,
    getFilterIcon,
    getPageStrings,
    getBreadcrumbTitle,
    routePrefix: options.routePrefix,
    accentColor: options.accentColor,
    pageType: options.pageType,
    themeStore,
  }
}
