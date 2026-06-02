/**
 * GET /api/wishlist
 * Fetch authenticated user's wishlist
 * Queries tirthlok.customer_wishlist directly
 */
import { getSupabaseTirthlok, getUserIdFromEvent } from '../utils/supabase'

export default defineEventHandler(async (event) => {
    const userId = await getUserIdFromEvent(event)

    if (!userId) {
        // Return empty array for unauthenticated users
        return []
    }

    const supabase = getSupabaseTirthlok()

    try {
        const { data, error } = await supabase
            .from('customer_wishlist')
            .select('tirth_id')
            .eq('customer_id', userId)

        if (error) {
            console.error('[wishlist] fetch failed:', error.message)
            throw createError({
                statusCode: 500,
                message: 'Failed to fetch wishlist'
            })
        }

        // Return array of tirth IDs
        return (data as { tirth_id: string }[]).map(item => item.tirth_id)
    } catch (err: any) {
        if (err.statusCode) throw err
        console.error('[wishlist] fetch failed:', err.message)
        throw createError({
            statusCode: 500,
            message: 'Internal server error'
        })
    }
})
