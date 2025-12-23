/**
 * DELETE /api/wishlist/[id]
 * Remove tirth from user's wishlist
 */
import { getSupabaseAdmin, getUserIdFromEvent } from '../../utils/supabase'

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

    const supabase = getSupabaseAdmin()

    try {
        // Delete from wishlist
        const { error: deleteError } = await supabase
            .from('customer_wishlist')
            .delete()
            .eq('customer_id', userId)
            .eq('tirth_id', parseInt(tirthId, 10))

        if (deleteError) {
            console.error('Error removing from wishlist:', deleteError)
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

        return data.map(item => String(item.tirth_id))
    } catch (err: any) {
        if (err.statusCode) throw err
        console.error('Wishlist remove error:', err)
        throw createError({
            statusCode: 500,
            message: 'Internal server error'
        })
    }
})
