import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useWishlistApi } from '../services/wishlistApi'

export const useWishlistStore = defineStore('wishlist', () => {
  const tirthWishlist = ref<string[]>([])
  const dharamshalaWishlist = ref<string[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const initialized = ref(false)

  // Initialize API securely within the Nuxt context
  const api = useWishlistApi()

  // ─── Computed ────────────────────────────────────────────────────────────────

  const getWishlistCount = computed(
    () => tirthWishlist.value.length + dharamshalaWishlist.value.length
  )
  const hasItems = computed(() => getWishlistCount.value > 0)

  const isInWishlist = computed(
    () => (id: string, entityType: 'tirth' | 'dharamshala' = 'tirth') => {
      if (entityType === 'dharamshala') return dharamshalaWishlist.value.includes(id)
      return tirthWishlist.value.includes(id)
    }
  )

  // ─── Actions ─────────────────────────────────────────────────────────────────

  async function fetchWishlist() {
    loading.value = true
    error.value = null
    try {
      const result = await api.getWishlist()
      tirthWishlist.value = result.tirth
      dharamshalaWishlist.value = result.dharamshala
      initialized.value = true
    } catch (err: any) {
      error.value = 'Failed to fetch wishlist'
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  async function addToWishlist(
    itemId: string,
    entityType: 'tirth' | 'dharamshala' = 'tirth'
  ) {
    if (isInWishlist.value(itemId, entityType)) return

    // 1. Optimistic update — instant UI response
    if (entityType === 'dharamshala') {
      dharamshalaWishlist.value = [...dharamshalaWishlist.value, itemId]
    } else {
      tirthWishlist.value = [...tirthWishlist.value, itemId]
    }

    try {
      // 2. Persist to server
      const result = await api.addToWishlist(itemId, entityType)
      tirthWishlist.value = result.tirth
      dharamshalaWishlist.value = result.dharamshala
    } catch (err: any) {
      // 3. Revert on failure
      if (entityType === 'dharamshala') {
        dharamshalaWishlist.value = dharamshalaWishlist.value.filter(i => i !== itemId)
      } else {
        tirthWishlist.value = tirthWishlist.value.filter(i => i !== itemId)
      }
      error.value = `Failed to add to wishlist: ${itemId}`
      console.error(err)
      throw err
    }
  }

  async function removeFromWishlist(
    itemId: string,
    entityType: 'tirth' | 'dharamshala' = 'tirth'
  ) {
    if (!isInWishlist.value(itemId, entityType)) return

    // 1. Optimistic update — instant UI response
    if (entityType === 'dharamshala') {
      dharamshalaWishlist.value = dharamshalaWishlist.value.filter(i => i !== itemId)
    } else {
      tirthWishlist.value = tirthWishlist.value.filter(i => i !== itemId)
    }

    try {
      // 2. Persist to server
      const result = await api.removeFromWishlist(itemId, entityType)
      tirthWishlist.value = result.tirth
      dharamshalaWishlist.value = result.dharamshala
    } catch (err: any) {
      // 3. Revert on failure — restore the item
      if (entityType === 'dharamshala') {
        dharamshalaWishlist.value = [...dharamshalaWishlist.value, itemId]
      } else {
        tirthWishlist.value = [...tirthWishlist.value, itemId]
      }
      error.value = `Failed to remove from wishlist: ${itemId}`
      console.error(err)
      throw err
    }
  }

  async function toggleWishlist(
    itemId: string,
    entityType: 'tirth' | 'dharamshala' = 'tirth'
  ) {
    if (isInWishlist.value(itemId, entityType)) {
      await removeFromWishlist(itemId, entityType)
    } else {
      await addToWishlist(itemId, entityType)
    }
  }

  async function clearAllItems() {
    try {
      await api.clearWishlist()
      tirthWishlist.value = []
      dharamshalaWishlist.value = []
    } catch (err: any) {
      error.value = 'Failed to clear wishlist'
      console.error(err)
      throw err
    }
  }

  function setWishlist(tirth: string[], dharamshala: string[]) {
    tirthWishlist.value = tirth
    dharamshalaWishlist.value = dharamshala
  }

  function syncWishlist(tirth: string[], dharamshala: string[]) {
    tirthWishlist.value = [...new Set([...tirthWishlist.value, ...tirth])]
    dharamshalaWishlist.value = [...new Set([...dharamshalaWishlist.value, ...dharamshala])]
  }

  return {
    tirthWishlist,
    dharamshalaWishlist,
    loading,
    error,
    initialized,
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
