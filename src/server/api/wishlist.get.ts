/**
 * GET /api/wishlist
 * Fetch authenticated user's wishlist (tirth + dharamshala)
 * Queries tirthlok.customer_wishlist directly
 */
import { getSupabaseTirthlok, getUserIdFromEvent } from '../utils/supabase'

export default defineEventHandler(async (event) => {
    const userId = await getUserIdFromEvent(event)

    if (!userId) {
        // Return empty structure for unauthenticated users
        return { tirth: [], dharamshala: [] }
    }

    const supabase = getSupabaseTirthlok()

    try {
        const { data, error } = await supabase
            .from('customer_wishlist')
            .select('entity_type, tirth_id, dharamshala_id')
            .eq('customer_id', userId)

        if (error) {
            console.error('[wishlist] fetch failed:', error.message)
            throw createError({
                statusCode: 500,
                statusMessage: 'Failed to fetch wishlist'
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
        console.error('[wishlist] fetch failed:', err.message)
        throw createError({
            statusCode: 500,
            statusMessage: 'Internal server error'
        })
    }
})
