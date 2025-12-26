/**
 * POST /api/wishlist
 * Add tirth to user's wishlist
 */
import { readBody } from 'h3'
import { getSupabaseAdmin, getUserIdFromEvent } from '../utils/supabase'

export default defineEventHandler(async (event) => {
    const userId = await getUserIdFromEvent(event)

    if (!userId) {
        throw createError({
            statusCode: 401,
            message: 'Authentication required'
        })
    }

    const body = await readBody(event)
    const tirthName = body.tirthName || body.tirth_name

    if (!tirthName) {
        throw createError({
            statusCode: 400,
            message: 'tirthName is required'
        })
    }

    const supabase = getSupabaseAdmin()

    try {
        // Add to wishlist using RPC (handles auth and duplicates)
        const { error: rpcError } = await supabase.rpc('add_to_wishlist', {
            p_tirth_name: tirthName
        })

        if (rpcError) {
            console.error('Error adding to wishlist:', rpcError)
            throw createError({
                statusCode: 500,
                message: 'Failed to add to wishlist'
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
        console.error('Wishlist add error:', err)
        throw createError({
            statusCode: 500,
            message: 'Internal server error'
        })
    }
})
