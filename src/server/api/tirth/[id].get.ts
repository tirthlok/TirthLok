/**
 * GET /api/tirth/:id - Fetch single tirth by name from Supabase
 * Server-side only endpoint that queries Supabase directly
 * The :id parameter should be the tirth_name (e.g., "Palitana")
 * Fetches:
 * - v_tirth_details view for detailed information
 * - v_tirth_cards view for basic card data
 * - events table for related events
 */
import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  try {
    let id = getRouterParam(event, 'id')

    // Skip non-tirth routes
    if (id === 'filter-options') {
      throw createError({
        statusCode: 404,
        statusMessage: 'Not found',
      })
    }

    // Decode URI component to handle spaces and special characters
    if (id) {
      id = decodeURIComponent(id)
    }

    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Tirth name is required',
      })
    }

    console.log(`🔌 Server API: /api/tirth/${id} called`)

    // Get Supabase config - try runtime config first, then fallback to environment
    const config = useRuntimeConfig()
    let supabaseUrl = config.public?.supabaseUrl
    let supabaseKey = config.public?.supabaseAnonKey

    // Fallback to service role key for full schema access
    if (!supabaseUrl) {
      supabaseUrl = 'https://cfmvkvpyjvbcenqorifa.supabase.co'
    }
    if (!supabaseKey) {
      // Use service role key for full access to all schemas including tirthlok
      supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNmbXZrdnB5anZiY2VucW9yaWZhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTI5MzQyNCwiZXhwIjoyMDgwODY5NDI0fQ.fLyzNci3KFvO--KEo342_3aYvWk6I4qWnxtXMz74ZEA'
    }

    console.log('📊 Supabase config:', { url: !!supabaseUrl, key: !!supabaseKey })

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase credentials not configured')
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    // First try to get detailed data from v_tirth_details view
    let data: any = null
    let detailedData: any = null

    console.log(`🔍 Querying v_tirth_details for: ${id}`)

    try {
      const { data: detailsResult, error: detailsError } = await supabase
        .from('v_tirth_details')
        .select('*')
        .eq('tirth_name', id)
        .single()

      if (!detailsError && detailsResult) {
        detailedData = detailsResult
        console.log(`✅ Found detailed data in v_tirth_details`)
        console.log(`📋 Raw v_tirth_details columns:`, Object.keys(detailsResult))
        console.log(`📋 Raw v_tirth_details data:`, JSON.stringify(detailsResult, null, 2))
      } else {
        console.log(`⚠️ No detailed data found: ${detailsError?.message || 'not found'}`)
      }
    } catch (err) {
      console.log(`⚠️ Error querying v_tirth_details: ${err}`)
    }

    // Now get the basic card data
    const { data: cardData, error: cardError } = await supabase
      .from('v_tirth_cards')
      .select('*')
      .eq('tirth_name', id)
      .single()

    console.log(`📊 Supabase response for ${id}:`, { found: !!cardData, hasDetails: !!detailedData, error: cardError?.message })

    if (cardData) {
      console.log(`📋 Raw v_tirth_cards columns:`, Object.keys(cardData))
      console.log(`📋 Raw v_tirth_cards data:`, JSON.stringify(cardData, null, 2))
    }

    if (cardError) {
      console.error(`❌ Error fetching tirth ${id}:`, cardError)
      throw createError({
        statusCode: 404,
        statusMessage: 'Tirth not found',
      })
    }

    if (!cardData) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Tirth not found',
      })
    }

    // Merge card and detail data, with details taking precedence
    data = { ...cardData, ...detailedData }

    // Now fetch events from the v_tirth_events view for this tirth
    console.log(`🔍 Querying v_tirth_events view for tirth: ${id}`)
    let events: any[] = []

    try {
      const { data: eventsData, error: eventsError } = await supabase
        .from('v_tirth_events')
        .select('*')
        .eq('tirth_name', id)
        .order('time_frame', { ascending: true })

      if (!eventsError && eventsData && eventsData.length > 0) {
        // Transform backend fields to EventItem interface
        events = eventsData.map((f: any) => ({
          name: f.event_name || '',
          date: f.tithi || '',
          month: f.time_frame || '',
          description: f.event_description || '',
          specialEvent: f.event_details || undefined,
        }))
        console.log(`✅ Found ${events.length} events for tirth_name: ${id}`)
        console.log(`📋 Raw events data:`, JSON.stringify(eventsData, null, 2))
        console.log(`📋 Transformed events data:`, JSON.stringify(events, null, 2))
      } else if (eventsError) {
        console.log(`⚠️ Error querying v_tirth_events: ${eventsError.message}`)
      } else {
        console.log(`⚠️ No events found for tirth_name: ${id}`)
      }
    } catch (err) {
      console.log(`⚠️ Error querying events: ${err}`)
    }

    // Transform database row to Tirth interface
    // Parse JSON strings if needed
    let images = data.tirth_images || []
    if (typeof images === 'string') {
      try {
        images = JSON.parse(images)
      } catch {
        images = [images]
      }
    }

    const transformedTirth = {
      id: data.tirth_name || 'unknown',
      name: data.tirth_name || '',
      description: data.tirth_description || '',
      architecture: data.tirth_architecture || data.architecture || 'To Be Updated Soon',
      mythology: data.tirth_mythology || data.mythology || 'To Be Updated Soon',
      foundingDetails: data.tirth_founding_details || data.founding_details || 'To Be Updated Soon',
      direction: data.tirth_direction || data.google_maps_url || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(data.tirth_name + ' ' + data.tirth_city)}`,
      mainTemples: data.tirth_main_temples || data.main_temples ? (Array.isArray(data.tirth_main_temples || data.main_temples) ? (data.tirth_main_temples || data.main_temples) : [data.tirth_main_temples || data.main_temples]) : ['To Be Updated Soon'],
      moolnayak: data.tirth_moolnayak || data.moolnayak || data.mul_nayak || [
        {
          name: data.tirth_name || 'Main Idol',
          height: 'To Be Updated Soon',
          metal: 'To Be Updated Soon',
          year: 'To Be Updated Soon',
          details: 'To Be Updated Soon',
        }
      ],
      poojaTimings: data.tirth_pooja_timings || data.pooja_timings || 'To Be Updated Soon',
      darshanTimings: data.tirth_darshan_timings || data.darshan_timings || 'To Be Updated Soon',
      events: events,
      location: {
        city: data.tirth_city || '',
        state: data.tirth_state || '',
        latitude: data.tirth_latitude || data.latitude || 0,
        longitude: data.tirth_longitude || data.longitude || 0,
        address: data.tirth_address || data.address || `${data.tirth_city}, ${data.tirth_state}`,
      },
      contact: {
        phone: data.tirth_contact || data.contact_no || '',
        email: data.tirth_email || '',
        website: data.tirth_website || ''
      },
      images: Array.isArray(images) ? images : [images].filter(Boolean),
      sect: data.tirth_sect as 'Shwetambar' | 'Digambar' || 'Shwetambar',
      facilities: data.tirth_facilities || data.facilities || [],
      rules: data.tirth_rules || data.rules ? (Array.isArray(data.tirth_rules || data.rules) ? (data.tirth_rules || data.rules) : [data.tirth_rules || data.rules]) : [],
      tirth_grouping: data.tirth_grouping || undefined,
      tirth_tags: data.tirth_tags ? (Array.isArray(data.tirth_tags) ? data.tirth_tags : [data.tirth_tags]) : undefined,
    }

    console.log(`📦 Transformed tirth data for ${id}:`, { name: transformedTirth.name, hasImages: transformedTirth.images.length > 0, hasDetails: !!detailedData })

    return transformedTirth
  } catch (error: any) {
    console.error(`❌ Error fetching tirth ${getRouterParam(event, 'id')}:`, error)

    // Handle 404 errors
    if (error.statusCode === 404) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch tirth details from Supabase',
    })
  }
})
