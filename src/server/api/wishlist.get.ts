/**
 * GET /api/wishlist
 * Fetch authenticated user's wishlist from customer_wishlist table
 */
import { getSupabaseAdmin, getUserIdFromEvent } from '../utils/supabase'

export default defineEventHandler(async (event) => {
    const userId = await getUserIdFromEvent(event)

    if (!userId) {
        // Return empty array for unauthenticated users
        return []
    }

    const supabase = getSupabaseAdmin()

    try {
        const { data, error } = await supabase
            .from('v_customer_wishlist')
            .select('tirth_name')

        if (error) {
            console.error('Error fetching wishlist:', error)
            throw createError({
                statusCode: 500,
                message: 'Failed to fetch wishlist'
            })
        }

        // Return array of tirth names
        return (data as { tirth_name: string }[]).map(item => item.tirth_name)
    } catch (err: any) {
        if (err.statusCode) throw err
        console.error('Wishlist fetch error:', err)
        throw createError({
            statusCode: 500,
            message: 'Internal server error'
        })
    }
})
