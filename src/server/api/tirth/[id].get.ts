/**
 * GET /api/tirth/:id - Fetch single tirth by ID
 * The :id parameter should be the tirth_id (e.g. TL-GJ-0001)
 * Queries tirthlok.tirth_cards + tirthlok.tirth_details + tirthlok.tirth_events
 */
import { getSupabaseTirthlok } from '../../utils/supabase'

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
        statusMessage: 'Tirth ID is required',
      })
    }

    const supabase = getSupabaseTirthlok()
    
    const isTirthId = /^TL-[A-Z]{2}-\d{4}$/i.test(id)

    // 1. Fetch basic card data from tirth_cards (supports both ID and name resolution)
    let cardData: any = null
    let cardError: any = null

    if (isTirthId) {
      const { data, error } = await supabase.from('tirth_cards').select('*').eq('tirth_id', id).single()
      cardData = data
      cardError = error
    } else {
      const { data, error } = await supabase.from('tirth_cards').select('*').eq('tirth_name', id).single()
      cardData = data
      cardError = error
    }

    if (cardError || !cardData) {
      console.error('[tirth] card fetch failed for id/name:', id, cardError?.message)
      throw createError({
        statusCode: 404,
        statusMessage: 'Tirth not found',
      })
    }

    const actualTirthId = cardData.tirth_id

    // 2. Fetch detailed data from tirth_details
    let data: any = null
    let detailedData: any = null

    try {
      const { data: detailsResult, error: detailsError } = await supabase
        .from('tirth_details')
        .select('*')
        .eq('tirth_id', actualTirthId)
        .single()

      if (!detailsError && detailsResult) {
        detailedData = detailsResult
      }
    } catch (err) {
      // Details may not exist for every tirth — not an error
    }

    // Merge card and detail data, with details taking precedence
    data = { ...cardData, ...detailedData }

    // Fetch events from tirth_events
    let events: any[] = []

    try {
      const { data: eventsData, error: eventsError } = await supabase
        .from('tirth_events')
        .select('*')
        .eq('tirth_id', actualTirthId)
        .order('time_frame', { ascending: true })

      if (!eventsError && eventsData && eventsData.length > 0) {
        events = eventsData.map((f: any) => ({
          name: f.event_name || '',
          date: f.tithi || '',
          month: f.time_frame || '',
          description: f.event_description || '',
          specialEvent: f.event_details || undefined,
        }))
      }
    } catch (err) {
      // Events may not exist — not an error
    }

    // Transform database row to Tirth interface
    let images = data.tirth_images || []
    if (typeof images === 'string') {
      try {
        images = JSON.parse(images)
      } catch {
        images = [images]
      }
    }

    const transformedTirth = {
      id: data.tirth_id || 'unknown',
      name: data.tirth_name || '',
      description: data.tirth_description || '',
      architecture: data.architecture || data.tirth_architecture || 'To Be Updated Soon',
      mythology: data.historical_background || data.tirth_mythology || 'To Be Updated Soon',
      foundingDetails: data.founding_details || data.tirth_founding_details || 'To Be Updated Soon',
      direction: data.tirth_direction || data.google_maps_url || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(data.tirth_name + ' ' + data.tirth_city)}`,
      mainTemples: data.main_temples || data.tirth_main_temples ? (Array.isArray(data.main_temples || data.tirth_main_temples) ? (data.main_temples || data.tirth_main_temples) : [data.main_temples || data.tirth_main_temples]) : ['To Be Updated Soon'],
      moolnayak: data.mul_nayak || data.tirth_moolnayak || [
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
      specialFacts: data.special_facts ? (Array.isArray(data.special_facts) ? data.special_facts : [data.special_facts]) : [],
    }

    return transformedTirth
  } catch (error: any) {
    if (error.statusCode === 404) {
      throw error
    }

    console.error('[tirth] detail fetch failed:', error.message)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch tirth details from Supabase',
    })
  }
})
