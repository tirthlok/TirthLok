/**
 * GET /api/tirth/:id - Fetch single tirth by name from Supabase
 * Server-side only endpoint that queries Supabase directly
 * The :id parameter should be the tirth_name (e.g., "Palitana")
 * Fetches:
 * - tirth_details table for detailed information
 * - tirth_cards table for basic card data
 * - festivals table for related festivals
 */
import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  try {
    let id = getRouterParam(event, 'id')

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

    // First try to get detailed data from tirth_details table
    let data: any = null
    let detailedData: any = null

    console.log(`🔍 Querying tirth_details for: ${id}`)
    
    try {
      const { data: detailsResult, error: detailsError } = await supabase
        .from('tirth_details')
        .select('*')
        .eq('tirth_name', id)
        .single()

      if (!detailsError && detailsResult) {
        detailedData = detailsResult
        console.log(`✅ Found detailed data in tirth_details`)
        console.log(`📋 Raw tirth_details columns:`, Object.keys(detailsResult))
        console.log(`📋 Raw tirth_details data:`, JSON.stringify(detailsResult, null, 2))
      } else {
        console.log(`⚠️ No detailed data found: ${detailsError?.message || 'not found'}`)
      }
    } catch (err) {
      console.log(`⚠️ Error querying tirth_details: ${err}`)
    }

    // Now get the basic card data
    const { data: cardData, error: cardError } = await supabase
      .from('tirth_cards')
      .select('*')
      .eq('tirth_name', id)
      .single()

    console.log(`📊 Supabase response for ${id}:`, { found: !!cardData, hasDetails: !!detailedData, error: cardError?.message })
    
    if (cardData) {
      console.log(`📋 Raw tirth_cards columns:`, Object.keys(cardData))
      console.log(`📋 Raw tirth_cards data:`, JSON.stringify(cardData, null, 2))
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

    // Now fetch festivals from the tirth_festivals_and_events table for this tirth
    console.log(`🔍 Querying tirth_festivals_and_events table for tirth: ${id}`)
    let festivals: any[] = []
    
    try {
      const { data: festivalsData, error: festivalsError } = await supabase
        .from('tirth_festivals_and_events')
        .select('*')
        .eq('tirth_name', id)
        .order('time_frame', { ascending: true })

      if (!festivalsError && festivalsData && festivalsData.length > 0) {
        // Transform backend fields to Festival interface
        festivals = festivalsData.map((f: any) => ({
          name: f.event_name || '',
          date: f.tithi || '',
          month: f.time_frame || '',
          description: f.event_description || '',
          specialEvent: f.event_details || undefined,
        }))
        console.log(`✅ Found ${festivals.length} festivals for tirth_name: ${id}`)
        console.log(`📋 Raw festivals data:`, JSON.stringify(festivalsData, null, 2))
        console.log(`📋 Transformed festivals data:`, JSON.stringify(festivals, null, 2))
      } else if (festivalsError) {
        console.log(`⚠️ Error querying tirth_festivals_and_events: ${festivalsError.message}`)
      } else {
        console.log(`⚠️ No festivals found for tirth_name: ${id}`)
      }
    } catch (err) {
      console.log(`⚠️ Error querying festivals: ${err}`)
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
      id: data.id || `tirth-${data.tirth_name}`,
      name: data.tirth_name || '',
      description: data.tirth_description || '',
      historicalBackground: data.tirth_history || data.historical_background || 'To be Updated Soon',
      foundingYear: data.tirth_founding_year || data.founding_year || 0,
      foundingDetails: data.tirth_founding_details || data.founding_details || 'To be Updated Soon',
      pratisthaYear: data.tirth_pratistha_year || data.pratistha_year || 0,
      acharya: data.tirth_acharya || data.acharya || 'To be Updated Soon',
      architecture: data.tirth_architecture || data.architecture || 'To be Updated Soon',
      moolnayak: data.tirth_moolnayak || data.moolnayak || data.mul_nayak || [
        {
          name: data.tirth_name || 'Main Idol',
          height: 'To be Updated Soon',
          metal: 'To be Updated Soon',
          year: 'To be Updated Soon',
          details: 'To be Updated Soon',
        }
      ],
      specialFacts: data.tirth_special_facts || data.special_facts ? (Array.isArray(data.tirth_special_facts || data.special_facts) ? (data.tirth_special_facts || data.special_facts) : [data.tirth_special_facts || data.special_facts]) : [],
      poojaTimings: data.tirth_pooja_timings || data.pooja_timings || 'To be Updated Soon',
      darshanTimings: data.tirth_darshan_timings || data.darshan_timings || 'To be Updated Soon',
      festivals: festivals, // Use fetched festivals data from festivals table
      location: {
        city: data.tirth_city || '',
        state: data.tirth_state || '',
        latitude: data.tirth_latitude || data.latitude || 0,
        longitude: data.tirth_longitude || data.longitude || 0,
        address: data.tirth_address || data.address || `${data.tirth_city}, ${data.tirth_state}`,
      },
      images: Array.isArray(images) ? images : [images].filter(Boolean),
      sect: data.tirth_sect as 'Shwetambar' | 'Digambar' || 'Shwetambar',
      type: data.tirth_kshetra || 'Other',
      facilities: data.tirth_facilities || data.facilities || [],
      rating: data.tirth_rating || data.rating || 0,
      reviews: data.tirth_reviews || data.reviews || 0,
      travelDuration: data.tirth_travel_duration || data.travel_duration || '',
      rules: data.tirth_rules || data.rules ? (Array.isArray(data.tirth_rules || data.rules) ? (data.tirth_rules || data.rules) : [data.tirth_rules || data.rules]) : [],
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
