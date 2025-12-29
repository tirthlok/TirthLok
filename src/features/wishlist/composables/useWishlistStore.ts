import { defineStore } from 'pinia'
import { useWishlistApi } from '../services/wishlistApi'

interface WishlistState {
  wishlistItems: string[]
  loading: boolean
  error: string | null
  initialized: boolean
}

/**
 * Wishlist Store
 * Centralized management of user's wishlist items across all entity types
 */
export const useWishlistStore = defineStore('wishlist', {
  state: (): WishlistState => ({
    wishlistItems: [],
    loading: false,
    error: null,
    initialized: false,
  }),

  getters: {
    /**
     * Get list of all wishlist IDs (tirth names)
     */
    getWishlistItems: (state) => state.wishlistItems,

    /**
     * Check if specific item is in wishlist
     */
    isInWishlist: (state) => (id: string) => state.wishlistItems.includes(id),

    /**
     * Get count of wishlist items
     */
    getWishlistCount: (state) => state.wishlistItems.length,

    /**
     * Check if any wishlist items exist
     */
    hasItems: (state) => state.wishlistItems.length > 0,
  },

  actions: {
    /**
     * Load wishlist from API
     */
    async fetchWishlist() {
      this.loading = true
      this.error = null
      try {
        const { getWishlist } = useWishlistApi()
        this.wishlistItems = await getWishlist()
        this.initialized = true
      } catch (error) {
        this.error = 'Failed to fetch wishlist'
        console.error(error)
      } finally {
        this.loading = false
      }
    },

    /**
     * Add item to wishlist
     */
    async addToWishlist(itemId: string, entityType: 'tirth' | 'dharamshala' | 'bhojanshala' = 'tirth') {
      if (this.wishlistItems.includes(itemId)) {
        return
      }

      try {
        const { addToWishlist } = useWishlistApi()
        const updatedWishlist = await addToWishlist(itemId, entityType)
        this.wishlistItems = updatedWishlist
      } catch (error) {
        this.error = `Failed to add to wishlist: ${itemId}`
        console.error(error)
        throw error
      }
    },

    /**
     * Remove item from wishlist
     */
    async removeFromWishlist(itemId: string) {
      if (!this.wishlistItems.includes(itemId)) {
        return
      }

      try {
        const { removeFromWishlist } = useWishlistApi()
        const updatedWishlist = await removeFromWishlist(itemId)
        this.wishlistItems = updatedWishlist
      } catch (error) {
        this.error = `Failed to remove from wishlist: ${itemId}`
        console.error(error)
        throw error
      }
    },

    /**
     * Toggle wishlist status
     */
    async toggleWishlist(itemId: string, entityType: 'tirth' | 'dharamshala' | 'bhojanshala' = 'tirth') {
      if (this.isInWishlist(itemId)) {
        await this.removeFromWishlist(itemId)
      } else {
        await this.addToWishlist(itemId, entityType)
      }
    },

    /**
     * Clear all wishlist items
     */
    async clearAllItems() {
      try {
        const { clearWishlist } = useWishlistApi()
        await clearWishlist()
        this.wishlistItems = []
      } catch (error) {
        this.error = 'Failed to clear wishlist'
        console.error(error)
        throw error
      }
    },

    /**
     * Set wishlist directly (for initialization)
     */
    setWishlist(items: string[]) {
      this.wishlistItems = items
    },

    /**
     * Sync with another source
     */
    syncWishlist(items: string[]) {
      this.wishlistItems = [...new Set([...this.wishlistItems, ...items])]
    },
  },
})
