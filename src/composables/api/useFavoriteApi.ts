/**
 * useFavoriteApi Composable
 * Favorite/Wishlist API - uses Supabase client directly with authenticated session
 * Uses tirth_name as the unique identifier (since v_tirth_cards view lacks tirth_id)
 */

import { useSupabase } from '~/features/auth/composables/useSupabase'
import { useAuth } from '~/features/auth/composables/useAuth'

export const useFavoriteApi = () => {
  const { supabase } = useSupabase()
  const { session } = useAuth()

  /**
   * Fetch user's wishlist (Tirth names) using secure view
   * View automatically filters to show only user's own wishlist
   */
  const fetchFavorites = async (): Promise<string[]> => {
    if (!session.value?.user?.id) {
      console.log('[Wishlist] No user session, returning empty wishlist')
      return []
    }

    try {
      const { data, error } = await supabase
        .from('v_customer_wishlist')
        .select('tirth_name')

      if (error) {
        console.error('Error fetching wishlist:', error)
        throw error
      }

      return (data || []).map(item => item.tirth_name)
    } catch (error) {
      console.error('Error fetching wishlist:', error)
      throw error
    }
  }

  /**
   * Add tirth to wishlist using RPC function
   * @param tirthName - The tirth name (used as unique identifier)
   */
  const addFavorite = async (tirthName: string, _entityType: 'tirth' | 'dharamshala' | 'bhojanshala' = 'tirth'): Promise<string[]> => {
    if (!session.value?.user?.id) {
      throw new Error('Not authenticated')
    }

    if (!tirthName || tirthName === 'undefined') {
      console.error('[Wishlist] Invalid tirth name:', tirthName)
      throw new Error(`Invalid tirth name: ${tirthName}`)
    }

    try {
      console.log('[Wishlist] Adding tirth:', { tirthName, userId: session.value.user.id })

      const { error: rpcError } = await supabase.rpc('add_to_wishlist', {
        p_tirth_name: tirthName
      })

      if (rpcError) {
        // Handle duplicate entry gracefully
        if (rpcError.code === '23505') {
          console.log('[Wishlist] Already in wishlist')
        } else {
          console.error('Error adding to wishlist:', rpcError)
          throw rpcError
        }
      }

      // Return updated wishlist
      return await fetchFavorites()
    } catch (error) {
      console.error(`Error adding to wishlist ${tirthName}:`, error)
      throw error
    }
  }

  /**
   * Remove tirth from wishlist using RPC function
   * @param tirthName - The tirth name (used as unique identifier)
   */
  const removeFavorite = async (tirthName: string): Promise<string[]> => {
    if (!session.value?.user?.id) {
      throw new Error('Not authenticated')
    }

    if (!tirthName || tirthName === 'undefined') {
      console.error('[Wishlist] Invalid tirth name:', tirthName)
      throw new Error(`Invalid tirth name: ${tirthName}`)
    }

    try {
      console.log('[Wishlist] Removing tirth:', { tirthName, userId: session.value.user.id })

      const { error: rpcError } = await supabase.rpc('remove_from_wishlist', {
        p_tirth_name: tirthName
      })

      if (rpcError) {
        console.error('Error removing from wishlist:', rpcError)
        throw rpcError
      }

      // Return updated wishlist
      return await fetchFavorites()
    } catch (error) {
      console.error(`Error removing from wishlist ${tirthName}:`, error)
      throw error
    }
  }

  /**
   * Check if item is in wishlist
   */
  const isFavorite = async (tirthName: string): Promise<boolean> => {
    try {
      const favorites = await fetchFavorites()
      return favorites.includes(tirthName)
    } catch (error) {
      console.error(`Error checking wishlist status for ${tirthName}:`, error)
      return false
    }
  }

  /**
   * Clear all favorites using RPC function
   */
  const clearFavorites = async (): Promise<void> => {
    if (!session.value?.user?.id) {
      return
    }

    try {
      const { error: rpcError } = await supabase.rpc('clear_wishlist')

      if (rpcError) {
        console.error('Error clearing wishlist:', rpcError)
        throw rpcError
      }
    } catch (error) {
      console.error('Error clearing wishlist:', error)
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
