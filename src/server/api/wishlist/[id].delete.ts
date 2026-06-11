/**
 * DELETE /api/wishlist/[id]
 * Remove tirth, dharamshala, or bhojanshala from user's wishlist
 * The :id param is the item ID (e.g. TL-GJ-0001, DH-GJ-0001, or BL-GJ-0001)
 * Query param: entityType = 'tirth' | 'dharamshala' | 'bhojanshala' (default: 'tirth')
 * Queries tirthlok.customer_wishlist directly
 */
import { getSupabaseTirthlok, getUserIdFromEvent } from '../../utils/supabase'

export default defineEventHandler(async (event) => {
    const userId = await getUserIdFromEvent(event)

    if (!userId) {
        throw createError({
            statusCode: 401,
            statusMessage: 'Authentication required'
        })
    }

    const itemId = getRouterParam(event, 'id')

    if (!itemId) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Item ID is required'
        })
    }

    const query = getQuery(event)
    const entityType: 'tirth' | 'dharamshala' | 'bhojanshala' = (query.entityType as 'tirth' | 'dharamshala' | 'bhojanshala') ?? 'tirth'

    if (!['tirth', 'dharamshala', 'bhojanshala'].includes(entityType)) {
        throw createError({
            statusCode: 400,
            statusMessage: 'entityType must be tirth, dharamshala, or bhojanshala'
        })
    }

    const decodedId = decodeURIComponent(itemId)
    const supabase = getSupabaseTirthlok()

    try {
        // Delete the matching row based on entity type
        // Note: each .eq() call returns a NEW builder — must be fully chained
        let deleteError: any = null

        if (entityType === 'dharamshala') {
            const res = await supabase
                .from('customer_wishlist')
                .delete()
                .eq('customer_id', userId)
                .eq('entity_type', entityType)
                .eq('dharamshala_id', decodedId)
            deleteError = res.error
        } else if (entityType === 'bhojanshala') {
            const res = await supabase
                .from('customer_wishlist')
                .delete()
                .eq('customer_id', userId)
                .eq('entity_type', entityType)
                .eq('bhojanshala_id', decodedId)
            deleteError = res.error
        } else {
            const res = await supabase
                .from('customer_wishlist')
                .delete()
                .eq('customer_id', userId)
                .eq('entity_type', entityType)
                .eq('tirth_id', decodedId)
            deleteError = res.error
        }

        if (deleteError) {
            console.error('[wishlist] remove failed:', deleteError.message)
            throw createError({
                statusCode: 500,
                statusMessage: 'Failed to remove from wishlist'
            })
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
        console.error('[wishlist] remove failed:', err.message)
        throw createError({
            statusCode: 500,
            statusMessage: 'Internal server error'
        })
    }
})
