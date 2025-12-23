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
    const tirthId = body.tirthId || body.itemId

    if (!tirthId) {
        throw createError({
            statusCode: 400,
            message: 'tirthId is required'
        })
    }

    const supabase = getSupabaseAdmin()

    try {
        // Insert into wishlist (unique constraint will prevent duplicates)
        const { error: insertError } = await supabase
            .from('customer_wishlist')
            .insert({
                customer_id: userId,
                tirth_id: parseInt(tirthId, 10)
            })

        if (insertError) {
            // Handle duplicate entry gracefully
            if (insertError.code === '23505') {
                // Already exists, just return current wishlist
            } else {
                console.error('Error adding to wishlist:', insertError)
                throw createError({
                    statusCode: 500,
                    message: 'Failed to add to wishlist'
                })
            }
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
        console.error('Wishlist add error:', err)
        throw createError({
            statusCode: 500,
            message: 'Internal server error'
        })
    }
})
