import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useWishlistApi } from '../services/wishlistApi'

export const useWishlistStore = defineStore('wishlist', () => {
  const wishlistItems = ref<string[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const initialized = ref(false)

  // Initialize API securely within the Nuxt context
  const api = useWishlistApi()

  const getWishlistItems = computed(() => wishlistItems.value)
  const isInWishlist = computed(() => (id: string) => wishlistItems.value.includes(id))
  const getWishlistCount = computed(() => wishlistItems.value.length)
  const hasItems = computed(() => wishlistItems.value.length > 0)

  async function fetchWishlist() {
    loading.value = true
    error.value = null
    try {
      wishlistItems.value = await api.getWishlist()
      initialized.value = true
    } catch (err: any) {
      error.value = 'Failed to fetch wishlist'
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  async function addToWishlist(itemId: string, entityType: 'tirth' | 'dharamshala' | 'bhojanshala' = 'tirth') {
    if (wishlistItems.value.includes(itemId)) {
      return
    }

    try {
      const updatedWishlist = await api.addToWishlist(itemId, entityType)
      wishlistItems.value = updatedWishlist
    } catch (err: any) {
      error.value = `Failed to add to wishlist: ${itemId}`
      console.error(err)
      throw err
    }
  }

  async function removeFromWishlist(itemId: string) {
    if (!wishlistItems.value.includes(itemId)) {
      return
    }

    try {
      const updatedWishlist = await api.removeFromWishlist(itemId)
      wishlistItems.value = updatedWishlist
    } catch (err: any) {
      error.value = `Failed to remove from wishlist: ${itemId}`
      console.error(err)
      throw err
    }
  }

  async function toggleWishlist(itemId: string, entityType: 'tirth' | 'dharamshala' | 'bhojanshala' = 'tirth') {
    if (isInWishlist.value(itemId)) {
      await removeFromWishlist(itemId)
    } else {
      await addToWishlist(itemId, entityType)
    }
  }

  async function clearAllItems() {
    try {
      await api.clearWishlist()
      wishlistItems.value = []
    } catch (err: any) {
      error.value = 'Failed to clear wishlist'
      console.error(err)
      throw err
    }
  }

  function setWishlist(items: string[]) {
    wishlistItems.value = items
  }

  function syncWishlist(items: string[]) {
    wishlistItems.value = [...new Set([...wishlistItems.value, ...items])]
  }

  return {
    wishlistItems,
    loading,
    error,
    initialized,
    getWishlistItems,
    isInWishlist,
    getWishlistCount,
    hasItems,
    fetchWishlist,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    clearAllItems,
    setWishlist,
    syncWishlist,
  }
})
