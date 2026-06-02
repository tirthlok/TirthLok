/**
 * POST /api/wishlist
 * Add tirth to user's wishlist
 * Queries tirthlok.customer_wishlist directly
 */
import { readBody } from 'h3'
import { getSupabaseTirthlok, getUserIdFromEvent } from '../utils/supabase'

export default defineEventHandler(async (event) => {
    const userId = await getUserIdFromEvent(event)

    if (!userId) {
        throw createError({
            statusCode: 401,
            message: 'Authentication required'
        })
    }

    const body = await readBody(event)
    const tirthId = body.tirthId || body.tirth_id

    if (!tirthId) {
        throw createError({
            statusCode: 400,
            message: 'tirthId is required'
        })
    }

    const supabase = getSupabaseTirthlok()

    try {
        // Add to wishlist by inserting directly into customer_wishlist table
        const { error: insertError } = await supabase
            .from('customer_wishlist')
            .upsert({
                customer_id: userId,
                tirth_id: tirthId
            }, {
                onConflict: 'customer_id, tirth_id'
            })

        if (insertError) {
            console.error('[wishlist] add failed:', insertError.message)
            throw createError({
                statusCode: 500,
                message: 'Failed to add to wishlist'
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
        console.error('[wishlist] add failed:', err.message)
        throw createError({
            statusCode: 500,
            message: 'Internal server error'
        })
    }
})
