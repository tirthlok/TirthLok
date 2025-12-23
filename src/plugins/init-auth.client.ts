/**
 * Init Auth Plugin (Client-side only)
 * Initializes authentication and syncs favorites on app startup
 * This ensures auth session is restored before any component mounts
 */

import { useFavoritesStore } from '~/stores/favorites'
import { useAuth } from '~/composables/auth/useAuth'

export default defineNuxtPlugin(async () => {
    // Only run on client side
    if (import.meta.server) return

    const { initialize, isAuthenticated, session } = useAuth()
    const favoritesStore = useFavoritesStore()

    console.log('🔐 Auth Plugin: Initializing authentication')

    try {
        // Initialize auth (restores session from localStorage)
        await initialize()

        console.log('🔐 Auth Plugin: Auth initialized, isAuthenticated:', isAuthenticated.value)

        // If authenticated, fetch favorites
        if (isAuthenticated.value) {
            console.log('❤️ Auth Plugin: User authenticated, fetching favorites')
            await favoritesStore.fetchFavorites()
            console.log('❤️ Auth Plugin: Favorites loaded:', favoritesStore.favorites.length)
        }

        // Set up auth state change listener to sync favorites
        const { supabase } = await import('~/composables/auth/useSupabase').then(m => m.useSupabase())

        supabase.auth.onAuthStateChange(async (event, newSession) => {
            console.log('🔐 Auth Plugin: Auth state changed:', event)

            if (event === 'SIGNED_IN' && newSession) {
                // User just signed in - fetch their favorites
                console.log('❤️ Auth Plugin: User signed in, fetching favorites')
                await favoritesStore.fetchFavorites()
            } else if (event === 'SIGNED_OUT') {
                // User signed out - clear favorites
                console.log('❤️ Auth Plugin: User signed out, clearing favorites')
                favoritesStore.setFavorites([])
            }
        })
    } catch (error) {
        console.error('🔐 Auth Plugin: Initialization error:', error)
    }
})
