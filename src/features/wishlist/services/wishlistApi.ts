/**
 * useWishlistApi Composable
 * Wishlist API - uses Nuxt backend APIs (ID-based, supports tirth + dharamshala)
 */

import { useAuth } from '~/features/auth/composables/useAuth'

export type WishlistResult = { tirth: string[]; dharamshala: string[] }

export const useWishlistApi = () => {
  const { session } = useAuth()

  const getHeaders = () => {
    if (!session.value?.access_token) return {}
    return {
      Authorization: `Bearer ${session.value.access_token}`
    }
  }

  /**
   * Fetch user's wishlist (tirth IDs + dharamshala IDs)
   */
  const getWishlist = async (): Promise<WishlistResult> => {
    if (!session.value?.access_token) {
      console.log('[Wishlist] No user session, returning empty wishlist')
      return { tirth: [], dharamshala: [] }
    }

    try {
      const data = await $fetch<WishlistResult>('/api/wishlist', {
        headers: getHeaders()
      })
      return data ?? { tirth: [], dharamshala: [] }
    } catch (error) {
      console.error('[Wishlist] Error fetching wishlist:', error)
      throw error
    }
  }

  /**
   * Add item to wishlist
   * @param itemId - The item ID
   * @param entityType - 'tirth' or 'dharamshala'
   */
  const addToWishlist = async (
    itemId: string,
    entityType: 'tirth' | 'dharamshala' = 'tirth'
  ): Promise<WishlistResult> => {
    if (!session.value?.access_token) {
      throw new Error('Not authenticated')
    }

    if (!itemId || itemId === 'undefined') {
      console.error('[Wishlist] Invalid item id:', itemId)
      throw new Error(`Invalid item id: ${itemId}`)
    }

    try {
      const data = await $fetch<WishlistResult>('/api/wishlist', {
        method: 'POST',
        headers: getHeaders(),
        body: { itemId, entityType }
      })
      return data ?? { tirth: [], dharamshala: [] }
    } catch (error) {
      console.error(`[Wishlist] Error adding to wishlist ${itemId} (${entityType}):`, error)
      throw error
    }
  }

  /**
   * Remove item from wishlist
   * @param itemId - The item ID
   * @param entityType - 'tirth' or 'dharamshala'
   */
  const removeFromWishlist = async (
    itemId: string,
    entityType: 'tirth' | 'dharamshala' = 'tirth'
  ): Promise<WishlistResult> => {
    if (!session.value?.access_token) {
      throw new Error('Not authenticated')
    }

    if (!itemId || itemId === 'undefined') {
      console.error('[Wishlist] Invalid item id:', itemId)
      throw new Error(`Invalid item id: ${itemId}`)
    }

    try {
      const encodedId = encodeURIComponent(itemId)
      const data = await $fetch<WishlistResult>(`/api/wishlist/${encodedId}`, {
        method: 'DELETE',
        headers: getHeaders(),
        query: { entityType }
      })
      return data ?? { tirth: [], dharamshala: [] }
    } catch (error) {
      console.error(`[Wishlist] Error removing from wishlist ${itemId} (${entityType}):`, error)
      throw error
    }
  }

  /**
   * Check if item is in wishlist
   */
  const isInWishlist = async (
    itemId: string,
    entityType: 'tirth' | 'dharamshala' = 'tirth'
  ): Promise<boolean> => {
    try {
      const wishlist = await getWishlist()
      return entityType === 'dharamshala'
        ? wishlist.dharamshala.includes(itemId)
        : wishlist.tirth.includes(itemId)
    } catch (error) {
      console.error(`[Wishlist] Error checking wishlist status for ${itemId}:`, error)
      return false
    }
  }

  /**
   * Clear all items from wishlist
   */
  const clearWishlist = async (): Promise<void> => {
    if (!session.value?.access_token) {
      throw new Error('Not authenticated')
    }

    try {
      await $fetch('/api/wishlist/clear', {
        method: 'POST',
        headers: getHeaders()
      })
    } catch (error) {
      console.error('[Wishlist] Error clearing wishlist:', error)
      throw error
    }
  }

  return {
    getWishlist,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    clearWishlist,
  }
}
