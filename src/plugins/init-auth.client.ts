/**
 * Init Auth Plugin (Client-side only)
 * Initializes authentication and syncs wishlist on app startup
 * This ensures auth session is restored before any component mounts
 */

import { useWishlistStore } from '~/features/wishlist'
import { useAuth } from '~/features/auth/composables/useAuth'

export default defineNuxtPlugin(async () => {
    // Only run on client side
    if (import.meta.server) return

    const { initialize, isAuthenticated } = useAuth()
    const wishlistStore = useWishlistStore()

    console.log('🔐 Auth Plugin: Initializing authentication')

    try {
        // Initialize auth (restores session from localStorage)
        await initialize()

        console.log('🔐 Auth Plugin: Auth initialized, isAuthenticated:', isAuthenticated.value)

        // If authenticated, fetch wishlist
        if (isAuthenticated.value) {
            console.log('📜 Wishlist Plugin: User authenticated, fetching wishlist')
            await wishlistStore.fetchWishlist()
            console.log('📜 Wishlist Plugin: Wishlist loaded:', wishlistStore.wishlistItems.length)
        }

        // Set up auth state change listener to sync wishlist
        const { supabase } = await import('~/features/auth/composables/useSupabase').then(m => m.useSupabase())

        supabase.auth.onAuthStateChange(async (event, newSession) => {
            console.log('🔐 Auth Plugin: Auth state changed:', event)

            if (event === 'SIGNED_IN' && newSession) {
                // User just signed in - fetch their wishlist
                console.log('📜 Wishlist Plugin: User signed in, fetching wishlist')
                await wishlistStore.fetchWishlist()
            } else if (event === 'SIGNED_OUT') {
                // User signed out - clear wishlist
                console.log('📜 Wishlist Plugin: User signed out, clearing wishlist')
                wishlistStore.setWishlist([])
            }
        })
    } catch (error) {
        console.error('🔐 Auth Plugin: Initialization error:', error)
    }
})
