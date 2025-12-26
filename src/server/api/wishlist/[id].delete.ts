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

    const tirthName = getRouterParam(event, 'id')

    if (!tirthName) {
        throw createError({
            statusCode: 400,
            message: 'Tirth name is required'
        })
    }

    const supabase = getSupabaseAdmin()

    try {
        // Remove from wishlist using RPC
        const { error: rpcError } = await supabase.rpc('remove_from_wishlist', {
            p_tirth_name: decodeURIComponent(tirthName)
        })

        if (rpcError) {
            console.error('Error removing from wishlist:', rpcError)
            throw createError({
                statusCode: 500,
                message: 'Failed to remove from wishlist'
            })
        }

        // Return updated wishlist using view
        const { data, error: fetchError } = await supabase
            .from('v_customer_wishlist')
            .select('tirth_name')

        if (fetchError) {
            throw createError({
                statusCode: 500,
                message: 'Failed to fetch updated wishlist'
            })
        }

        return (data as { tirth_name: string }[]).map(item => item.tirth_name)
    } catch (err: any) {
        if (err.statusCode) throw err
        console.error('Wishlist remove error:', err)
        throw createError({
            statusCode: 500,
            message: 'Internal server error'
        })
    }
})
