/**
 * GET /api/events - Fetch all events from backend
 * Server-side only endpoint that queries the events view from Supabase
 */
import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
    try {
        console.log('🔌 Server API: /api/events called')

        // Get Supabase config
        const config = useRuntimeConfig()
        let supabaseUrl = config.public?.supabaseUrl
        let supabaseKey = config.public?.supabaseAnonKey

        // Fallback to hardcoded values
        if (!supabaseUrl) {
            supabaseUrl = 'https://cfmvkvpyjvbcenqorifa.supabase.co'
        }
        if (!supabaseKey) {
            supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNmbXZrdnB5anZiY2VucW9yaWZhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTI5MzQyNCwiZXhwIjoyMDgwODY5NDI0fQ.fLyzNci3KFvO--KEo342_3aYvWk6I4qWnxtXMz74ZEA'
        }

        console.log('📊 Supabase config:', { url: !!supabaseUrl, key: !!supabaseKey })

        if (!supabaseUrl || !supabaseKey) {
            throw new Error('Supabase credentials not configured')
        }

        const supabase = createClient(supabaseUrl, supabaseKey)

        // Get query parameters
        const query = getQuery(event)
        const tirth_name = query.tirth_name as string

        let queryBuilder: any = supabase.from('v_tirth_events').select('*')

        // Filter by tirth_name if provided
        if (tirth_name) {
            queryBuilder = queryBuilder.eq('tirth_name', decodeURIComponent(tirth_name))
            console.log(`📋 Fetching events for tirth_name: ${tirth_name}`)
        } else {
            console.log('📋 Fetching all events')
        }

        const { data, error } = await queryBuilder.order('time_frame', { ascending: true })

        console.log('📊 Events response:', { count: data?.length || 0, error: error?.message })

        if (error) {
            console.error('❌ Error fetching events:', error)
            // Don't throw error, just return empty array
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

        console.log('📋 Transformed events data:', JSON.stringify(transformedEvents, null, 2))

        return {
            success: true,
            data: transformedEvents,
            pagination: {
                total: transformedEvents.length,
            },
        }
    } catch (error: any) {
        console.error('❌ Error in events API:', error)

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
