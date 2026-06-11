import { watch } from 'vue'
import { useWishlistStore } from '~/features/wishlist'
import { useAdminModeStore } from '~/stores/adminMode'
import { useAuth } from '~/features/auth/composables/useAuth'

export default defineNuxtPlugin(async () => {
  if (import.meta.server) return

  const { initialize, isAuthenticated } = useAuth()
  const wishlistStore = useWishlistStore()

  // Restore session from localStorage before any component mounts
  await initialize()

  // Sync wishlist on startup if already authenticated
  if (isAuthenticated.value) {
    await wishlistStore.fetchWishlist()
  }

  // Single reactive watcher — replaces the second Supabase listener.
  // useAuth already owns the one and only onAuthStateChange subscription.
  // All side effects (wishlist, admin mode) react to the shared Vue ref.
  watch(isAuthenticated, async (isNowAuthenticated, wasPreviouslyAuthenticated) => {
    if (isNowAuthenticated && !wasPreviouslyAuthenticated) {
      // Signed in
      await wishlistStore.fetchWishlist()
    }

    if (!isNowAuthenticated && wasPreviouslyAuthenticated) {
      // Signed out — clear all dependent state
      wishlistStore.setWishlist([])
      useAdminModeStore().exitAdminMode()
    }
  })
})
