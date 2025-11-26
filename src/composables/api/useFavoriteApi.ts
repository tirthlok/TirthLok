/**
 * useFavoriteApi Composable
 * Favorite/Wishlist API endpoints
 */

export const useFavoriteApi = () => {
  const config = useRuntimeConfig()

  /**
   * Fetch user's favorites
   */
  const fetchFavorites = async (): Promise<string[]> => {
    try {
      return await $fetch('/api/favorites', {
        baseURL: config.public.apiBaseUrl,
      })
    } catch (error) {
      console.error('Error fetching favorites:', error)
      throw error
    }
  }

  /**
   * Add item to favorites
   */
  const addFavorite = async (itemId: string, entityType: 'tirth' | 'dharamshala' | 'bhojanshala'): Promise<string[]> => {
    try {
      return await $fetch('/api/favorites', {
        method: 'POST',
        baseURL: config.public.apiBaseUrl,
        body: { itemId, entityType },
      })
    } catch (error) {
      console.error(`Error adding favorite ${itemId}:`, error)
      throw error
    }
  }

  /**
   * Remove item from favorites
   */
  const removeFavorite = async (itemId: string): Promise<string[]> => {
    try {
      return await $fetch(`/api/favorites/${itemId}`, {
        method: 'DELETE',
        baseURL: config.public.apiBaseUrl,
      })
    } catch (error) {
      console.error(`Error removing favorite ${itemId}:`, error)
      throw error
    }
  }

  /**
   * Check if item is favorited
   */
  const isFavorite = async (itemId: string): Promise<boolean> => {
    try {
      const response = await $fetch<{ isFavorite: boolean }>(`/api/favorites/${itemId}`, {
        baseURL: config.public.apiBaseUrl,
      })
      return response.isFavorite
    } catch (error) {
      console.error(`Error checking favorite status for ${itemId}:`, error)
      throw error
    }
  }

  /**
   * Clear all favorites
   */
  const clearFavorites = async (): Promise<void> => {
    try {
      await $fetch('/api/favorites', {
        method: 'DELETE',
        baseURL: config.public.apiBaseUrl,
      })
    } catch (error) {
      console.error('Error clearing favorites:', error)
      throw error
    }
  }

  return {
    fetchFavorites,
    addFavorite,
    removeFavorite,
    isFavorite,
    clearFavorites,
  }
}
