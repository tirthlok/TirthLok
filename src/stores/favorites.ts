import { defineStore } from 'pinia'

interface FavoritesState {
  favorites: string[]
  loading: boolean
  error: string | null
}

/**
 * Favorites Store
 * Centralized management of user's favorite items across all entity types
 */
export const useFavoritesStore = defineStore('favorites', {
  state: (): FavoritesState => ({
    favorites: [],
    loading: false,
    error: null,
  }),

  getters: {
    /**
     * Get list of all favorite IDs
     */
    getFavoriteIds: (state) => state.favorites,

    /**
     * Check if specific item is favorited
     */
    isFavorite: (state) => (id: string) => state.favorites.includes(id),

    /**
     * Get count of favorites
     */
    getFavoriteCount: (state) => state.favorites.length,

    /**
     * Check if any favorites exist
     */
    hasFavorites: (state) => state.favorites.length > 0,
  },

  actions: {
    /**
     * Load favorites from API
     */
    async fetchFavorites() {
      this.loading = true
      this.error = null
      try {
        const { useFavoriteApi } = await import('~/composables/api')
        const { fetchFavorites } = useFavoriteApi()
        this.favorites = await fetchFavorites()
      } catch (error) {
        this.error = 'Failed to fetch favorites'
        console.error(error)
      } finally {
        this.loading = false
      }
    },

    /**
     * Add item to favorites
     */
    async addFavorite(itemId: string, entityType: 'tirth' | 'dharamshala' | 'bhojanshala' = 'tirth') {
      if (this.favorites.includes(itemId)) {
        return
      }

      try {
        const { useFavoriteApi } = await import('~/composables/api')
        const { addFavorite } = useFavoriteApi()
        const updatedFavorites = await addFavorite(itemId, entityType)
        this.favorites = updatedFavorites
      } catch (error) {
        this.error = `Failed to add favorite: ${itemId}`
        console.error(error)
        throw error
      }
    },

    /**
     * Remove item from favorites
     */
    async removeFavorite(itemId: string) {
      if (!this.favorites.includes(itemId)) {
        return
      }

      try {
        const { useFavoriteApi } = await import('~/composables/api')
        const { removeFavorite } = useFavoriteApi()
        const updatedFavorites = await removeFavorite(itemId)
        this.favorites = updatedFavorites
      } catch (error) {
        this.error = `Failed to remove favorite: ${itemId}`
        console.error(error)
        throw error
      }
    },

    /**
     * Toggle favorite status
     */
    async toggleFavorite(itemId: string, entityType: 'tirth' | 'dharamshala' | 'bhojanshala' = 'tirth') {
      if (this.isFavorite(itemId)) {
        await this.removeFavorite(itemId)
      } else {
        await this.addFavorite(itemId, entityType)
      }
    },

    /**
     * Clear all favorites
     */
    async clearAllFavorites() {
      try {
        const { useFavoriteApi } = await import('~/composables/api')
        const { clearFavorites } = useFavoriteApi()
        await clearFavorites()
        this.favorites = []
      } catch (error) {
        this.error = 'Failed to clear favorites'
        console.error(error)
        throw error
      }
    },

    /**
     * Set favorites directly (for initialization)
     */
    setFavorites(favorites: string[]) {
      this.favorites = favorites
    },

    /**
     * Sync with another source
     */
    syncFavorites(favorites: string[]) {
      this.favorites = [...new Set([...this.favorites, ...favorites])]
    },
  },
})
