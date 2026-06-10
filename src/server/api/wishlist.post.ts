/**
 * POST /api/wishlist
 * Add tirth or dharamshala to user's wishlist
 * Queries tirthlok.customer_wishlist directly
 */
import { readBody } from 'h3'
import { getSupabaseTirthlok, getUserIdFromEvent } from '../utils/supabase'

export default defineEventHandler(async (event) => {
    const userId = await getUserIdFromEvent(event)

    if (!userId) {
        throw createError({
            statusCode: 401,
            statusMessage: 'Authentication required'
        })
    }

    const body = await readBody(event)
    const itemId = body.itemId
    const entityType: 'tirth' | 'dharamshala' = body.entityType ?? 'tirth'

    if (!itemId) {
        throw createError({
            statusCode: 400,
            statusMessage: 'itemId is required'
        })
    }

    if (!['tirth', 'dharamshala'].includes(entityType)) {
        throw createError({
            statusCode: 400,
            statusMessage: 'entityType must be tirth or dharamshala'
        })
    }

    const supabase = getSupabaseTirthlok()

    try {
        // Build insert payload based on entity type
        const insertPayload =
            entityType === 'dharamshala'
                ? { customer_id: userId, entity_type: entityType, dharamshala_id: itemId }
                : { customer_id: userId, entity_type: entityType, tirth_id: itemId }

        const conflictTarget =
            entityType === 'dharamshala'
                ? 'customer_id,dharamshala_id'
                : 'customer_id,tirth_id'

        const { error: insertError } = await supabase
            .from('customer_wishlist')
            .upsert(insertPayload, { onConflict: conflictTarget })

        if (insertError) {
            console.error('[wishlist] add failed:', insertError.message)
            throw createError({
                statusCode: 500,
                statusMessage: 'Failed to add to wishlist'
            })
        }

        // Return updated wishlist (same shape as GET)
        const { data, error: fetchError } = await supabase
            .from('customer_wishlist')
            .select('entity_type, tirth_id, dharamshala_id')
            .eq('customer_id', userId)

        if (fetchError) {
            throw createError({
                statusCode: 500,
                statusMessage: 'Failed to fetch updated wishlist'
            })
        }

        const rows = data as { entity_type: string; tirth_id: string | null; dharamshala_id: string | null }[]

        return {
            tirth: rows
                .filter(i => i.entity_type === 'tirth')
                .map(i => i.tirth_id as string),
            dharamshala: rows
                .filter(i => i.entity_type === 'dharamshala')
                .map(i => i.dharamshala_id as string)
        }
    } catch (err: any) {
        if (err.statusCode) throw err
        console.error('[wishlist] add failed:', err.message)
        throw createError({
            statusCode: 500,
            statusMessage: 'Internal server error'
        })
    }
})
