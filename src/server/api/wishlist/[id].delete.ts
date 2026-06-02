/**
 * DELETE /api/wishlist/[id]
 * Remove tirth from user's wishlist
 * The :id param is the tirth_id (e.g. TL-GJ-0001)
 * Queries tirthlok.customer_wishlist directly
 */
import { getSupabaseTirthlok, getUserIdFromEvent } from '../../utils/supabase'

export default defineEventHandler(async (event) => {
    const userId = await getUserIdFromEvent(event)

    if (!userId) {
        throw createError({
            statusCode: 401,
            message: 'Authentication required'
        })
    }

    const tirthId = getRouterParam(event, 'id')

    if (!tirthId) {
        throw createError({
            statusCode: 400,
            message: 'Tirth ID is required'
        })
    }

    const supabase = getSupabaseTirthlok()

    try {
        // Remove from wishlist by deleting directly from customer_wishlist table
        const { error: deleteError } = await supabase
            .from('customer_wishlist')
            .delete()
            .eq('customer_id', userId)
            .eq('tirth_id', decodeURIComponent(tirthId))

        if (deleteError) {
            console.error('[wishlist] remove failed:', deleteError.message)
            throw createError({
                statusCode: 500,
                message: 'Failed to remove from wishlist'
            })
        }

        // Return updated wishlist
        const { data, error: fetchError } = await supabase
            .from('customer_wishlist')
            .select('tirth_id')
            .eq('customer_id', userId)

        if (fetchError) {
            throw createError({
                statusCode: 500,
                message: 'Failed to fetch updated wishlist'
            })
        }

        return (data as { tirth_id: string }[]).map(item => item.tirth_id)
    } catch (err: any) {
        if (err.statusCode) throw err
        console.error('[wishlist] remove failed:', err.message)
        throw createError({
            statusCode: 500,
            message: 'Internal server error'
        })
    }
})
