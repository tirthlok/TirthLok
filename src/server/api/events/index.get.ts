/**
 * GET /api/events - Fetch all events
 * Queries tirthlok.tirth_events directly
 */
import { getSupabaseTirthlok } from '../../utils/supabase'

export default defineEventHandler(async (event) => {
    try {
        const supabase = getSupabaseTirthlok()

        // Get query parameters
        const query = getQuery(event)
        const tirth_id = query.tirth_id as string || query.tirthId as string

        let queryBuilder: any = supabase.from('tirth_events').select('*')

        // Filter by tirth_id if provided
        if (tirth_id) {
            queryBuilder = queryBuilder.eq('tirth_id', decodeURIComponent(tirth_id))
        }

        const { data, error } = await queryBuilder.order('time_frame', { ascending: true })

        if (error) {
            console.error('[events] fetch failed:', error.message)
            return {
                success: true,
                data: [],
                pagination: {
                    total: 0,
                },
            }
        }

        // Transform backend fields to EventItem interface
        const transformedEvents = (data || []).map((f: any) => ({
            name: f.event_name || '',
            date: f.tithi || '',
            month: f.time_frame || '',
            description: f.event_description || '',
            specialEvent: f.event_details || undefined,
        }))

        return {
            success: true,
            data: transformedEvents,
            pagination: {
                total: transformedEvents.length,
            },
        }
    } catch (error: any) {
        console.error('[events] fetch failed:', error.message)

        return {
            success: false,
            data: [],
            error: error.message,
            pagination: {
                total: 0,
            },
        }
    }
})
