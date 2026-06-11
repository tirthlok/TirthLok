/**
 * POST /api/wishlist
 * Add tirth, dharamshala, or bhojanshala to user's wishlist
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
    const entityType: 'tirth' | 'dharamshala' | 'bhojanshala' = body.entityType ?? 'tirth'

    if (!itemId) {
        throw createError({
            statusCode: 400,
            statusMessage: 'itemId is required'
        })
    }

    if (!['tirth', 'dharamshala', 'bhojanshala'].includes(entityType)) {
        throw createError({
            statusCode: 400,
            statusMessage: 'entityType must be tirth, dharamshala, or bhojanshala'
        })
    }

    const supabase = getSupabaseTirthlok()

    try {
        // Check if item already exists in wishlist to avoid duplicates
        // Note: each .eq() call returns a NEW builder — must be fully chained
        let existingRows: any[] | null = null
        let checkError: any = null

        if (entityType === 'dharamshala') {
            const res = await supabase
                .from('customer_wishlist')
                .select('wishlist_id')
                .eq('customer_id', userId)
                .eq('entity_type', entityType)
                .eq('dharamshala_id', itemId)
            existingRows = res.data
            checkError = res.error
        } else if (entityType === 'bhojanshala') {
            const res = await supabase
                .from('customer_wishlist')
                .select('wishlist_id')
                .eq('customer_id', userId)
                .eq('entity_type', entityType)
                .eq('bhojanshala_id', itemId)
            existingRows = res.data
            checkError = res.error
        } else {
            const res = await supabase
                .from('customer_wishlist')
                .select('wishlist_id')
                .eq('customer_id', userId)
                .eq('entity_type', entityType)
                .eq('tirth_id', itemId)
            existingRows = res.data
            checkError = res.error
        }

        if (checkError) {
            console.error('[wishlist] check failed:', checkError.message)
        }

        if (!existingRows || existingRows.length === 0) {
            // Build insert payload based on entity type
            const insertPayload =
                entityType === 'dharamshala'
                    ? { customer_id: userId, entity_type: entityType, dharamshala_id: itemId }
                    : entityType === 'bhojanshala'
                        ? { customer_id: userId, entity_type: entityType, bhojanshala_id: itemId }
                        : { customer_id: userId, entity_type: entityType, tirth_id: itemId }

            const { error: insertError } = await supabase
                .from('customer_wishlist')
                .insert(insertPayload)

            if (insertError) {
                console.error('[wishlist] add failed:', insertError.message)
                throw createError({
                    statusCode: 500,
                    statusMessage: 'Failed to add to wishlist. If you are adding a bhojanshala, please verify the DB check constraint `entity_integrity` is updated.'
                })
            }
        }

        // Return updated wishlist (same shape as GET)
        const { data, error: fetchError } = await supabase
            .from('customer_wishlist')
            .select('entity_type, tirth_id, dharamshala_id, bhojanshala_id')
            .eq('customer_id', userId)

        if (fetchError) {
            throw createError({
                statusCode: 500,
                statusMessage: 'Failed to fetch updated wishlist'
            })
        }

        const rows = data as { entity_type: string; tirth_id: string | null; dharamshala_id: string | null; bhojanshala_id: string | null }[]

        return {
            tirth: rows
                .filter(i => i.entity_type === 'tirth')
                .map(i => i.tirth_id as string),
            dharamshala: rows
                .filter(i => i.entity_type === 'dharamshala')
                .map(i => i.dharamshala_id as string),
            bhojanshala: rows
                .filter(i => i.entity_type === 'bhojanshala')
                .map(i => i.bhojanshala_id as string)
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
