/**
 * useWishlist Composable
 * Handles wishlist operations using secure RPC and views
 * Following production-grade Supabase architecture:
 * - Reads via public.v_customer_wishlist view
 * - Writes via public RPC functions
 */

import { ref, computed } from 'vue'
import { useSupabase } from '~/features/auth/composables/useSupabase'
import { useAuth } from '~/features/auth/composables/useAuth'

// TypeScript types
export interface WishlistItem {
    wishlist_id: string
    customer_id: string
    tirth_name: string
    created_at: string
}

export const useWishlist = () => {
    const { supabase } = useSupabase()
    const { session } = useAuth()
    const loading = ref(false)
    const error = ref<string | null>(null)
    const wishlistItems = ref<string[]>([])

    /**
     * Get wishlist using secure view
     * View automatically filters to show only authenticated user's wishlist
     */
    const getWishlist = async (): Promise<string[]> => {
        if (!session.value?.user?.id) {
            console.log('[Wishlist] No user session, returning empty wishlist')
            return []
        }

        loading.value = true
        error.value = null

        try {
            const { data, error: fetchError } = await supabase
                .from('v_customer_wishlist')
                .select('tirth_name')

            if (fetchError) {
                error.value = fetchError.message
                console.error('Error fetching wishlist:', fetchError)
                throw fetchError
            }

            wishlistItems.value = (data || []).map(item => item.tirth_name)
            return wishlistItems.value
        } catch (err: any) {
            error.value = err.message || 'Failed to fetch wishlist'
            console.error('Error fetching wishlist:', err)
            throw err
        } finally {
            loading.value = false
        }
    }

    /**
     * Add tirth to wishlist using RPC function
     * RPC handles auth.uid() automatically and prevents duplicates
     */
    const addToWishlist = async (tirthName: string): Promise<string[]> => {
        if (!session.value?.user?.id) {
            throw new Error('Not authenticated')
        }

        if (!tirthName || tirthName === 'undefined') {
            console.error('[Wishlist] Invalid tirth name:', tirthName)
            throw new Error(`Invalid tirth name: ${tirthName}`)
        }

        loading.value = true
        error.value = null

        try {
            console.log('[Wishlist] Adding tirth:', { tirthName, userId: session.value.user.id })

            const { error: rpcError } = await supabase.rpc('add_to_wishlist', {
                p_tirth_name: tirthName
            })

            if (rpcError) {
                error.value = rpcError.message
                console.error('Error adding to wishlist:', rpcError)
                throw rpcError
            }

            // Return updated wishlist
            return await getWishlist()
        } catch (err: any) {
            error.value = err.message || 'Failed to add to wishlist'
            console.error(`Error adding to wishlist ${tirthName}:`, err)
            throw err
        } finally {
            loading.value = false
        }
    }

    /**
     * Remove tirth from wishlist using RPC function
     * RPC ensures user can only delete their own items
     */
    const removeFromWishlist = async (tirthName: string): Promise<string[]> => {
        if (!session.value?.user?.id) {
            throw new Error('Not authenticated')
        }

        if (!tirthName || tirthName === 'undefined') {
            console.error('[Wishlist] Invalid tirth name:', tirthName)
            throw new Error(`Invalid tirth name: ${tirthName}`)
        }

        loading.value = true
        error.value = null

        try {
            console.log('[Wishlist] Removing tirth:', { tirthName, userId: session.value.user.id })

            const { error: rpcError } = await supabase.rpc('remove_from_wishlist', {
                p_tirth_name: tirthName
            })

            if (rpcError) {
                error.value = rpcError.message
                console.error('Error removing from wishlist:', rpcError)
                throw rpcError
            }

            // Return updated wishlist
            return await getWishlist()
        } catch (err: any) {
            error.value = err.message || 'Failed to remove from wishlist'
            console.error(`Error removing from wishlist ${tirthName}:`, err)
            throw err
        } finally {
            loading.value = false
        }
    }

    /**
     * Clear entire wishlist using RPC function
     */
    const clearWishlist = async (): Promise<void> => {
        if (!session.value?.user?.id) {
            return
        }

        loading.value = true
        error.value = null

        try {
            const { error: rpcError } = await supabase.rpc('clear_wishlist')

            if (rpcError) {
                error.value = rpcError.message
                console.error('Error clearing wishlist:', rpcError)
                throw rpcError
            }

            wishlistItems.value = []
        } catch (err: any) {
            error.value = err.message || 'Failed to clear wishlist'
            console.error('Error clearing wishlist:', err)
            throw err
        } finally {
            loading.value = false
        }
    }

    /**
     * Check if tirth is in wishlist (client-side check)
     */
    const isFavorite = computed(() => (tirthName: string): boolean => {
        return wishlistItems.value.includes(tirthName)
    })

    return {
        // State
        loading,
        error,
        wishlistItems,
        // Computed
        isFavorite,
        // Methods
        getWishlist,
        addToWishlist,
        removeFromWishlist,
        clearWishlist,
    }
}
