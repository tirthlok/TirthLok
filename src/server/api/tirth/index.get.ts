/**
 * GET /api/tirth - Fetch all tirth locations with pagination
 * Queries tirthlok.tirth_cards directly
 */
import { getSupabaseTirthlok } from '../../utils/supabase'

export default defineEventHandler(async (event) => {
  try {
    const supabase = getSupabaseTirthlok()

    const query = getQuery(event)
    const search = String(query.search || '')
    const sect = String(query.sect || '')
    const type = String(query.type || '')

    try {
      const limitStr = String(query.limit || '10').trim()
      const pageStr = String(query.page || '1').trim()
      const limit = parseInt(limitStr, 10) || 10
      const page = parseInt(pageStr, 10) || 1
      const offset = (page - 1) * limit

      let supabaseQuery = supabase
        .from('tirth_cards')
        .select('*', { count: 'exact' })

      // Apply filters
      if (sect) {
        supabaseQuery = supabaseQuery.eq('tirth_sect', sect)
      }
      if (type) {
        supabaseQuery = supabaseQuery.eq('tirth_kshetra', type)
      }
      if (search) {
        supabaseQuery = supabaseQuery.ilike('tirth_name', `%${search}%`)
      }

      // Apply pagination
      const { data, error, count } = await supabaseQuery.range(offset, offset + limit - 1)

      if (error) {
        console.error('[tirth] fetch failed:', error.message)
        throw error
      }

      // Transform rows
      let transformedData = (data || []).map((row: any) => {
        let images = row.tirth_images || []
        if (typeof images === 'string') {
          try {
            images = JSON.parse(images)
          } catch {
            images = [images]
          }
        }

        return {
          id: row.tirth_id || 'unknown',
          name: row.tirth_name || '',
          description: row.tirth_description || '',
          historicalBackground: row.tirth_history || 'To be Updated Soon',
          foundingYear: row.tirth_founding_year || 0,
          foundingDetails: row.tirth_founding_details || 'To be Updated Soon',
          pratisthaYear: row.tirth_pratistha_year || 0,
          acharya: row.tirth_acharya || 'To be Updated Soon',
          architecture: row.tirth_architecture || 'To be Updated Soon',
          moolnayak: row.tirth_moolnayak || [
            {
              name: row.tirth_name || 'Main Idol',
              height: 'To be Updated Soon',
              metal: 'To be Updated Soon',
              year: 'To be Updated Soon',
              details: 'To be Updated Soon',
            }
          ],
          specialFacts: row.tirth_special_facts ? (Array.isArray(row.tirth_special_facts) ? row.tirth_special_facts : [row.tirth_special_facts]) : [],
          poojaTimings: row.tirth_pooja_timings || 'To be Updated Soon',
          darshanTimings: row.tirth_darshan_timings || 'To be Updated Soon',
          events: row.tirth_events || [],
          location: {
            city: row.tirth_city || '',
            state: row.tirth_state || '',
            latitude: row.tirth_latitude || 0,
            longitude: row.tirth_longitude || 0,
            address: row.tirth_address || `${row.tirth_city}, ${row.tirth_state}`,
          },
          images: Array.isArray(images) ? images : [images].filter(Boolean),
          sect: row.tirth_sect as 'Shwetambar' | 'Digambar' || 'Shwetambar',
          type: row.tirth_kshetra || 'Other',
          facilities: row.tirth_facilities || [],
          rating: row.tirth_rating || 0,
          reviews: row.tirth_reviews || 0,
          travelDuration: row.tirth_travel_duration || '',
          rules: row.tirth_rules ? (Array.isArray(row.tirth_rules) ? row.tirth_rules : [row.tirth_rules]) : [],
          tirth_grouping: row.tirth_grouping || undefined,
          tirth_tags: row.tirth_tags ? (Array.isArray(row.tirth_tags) ? row.tirth_tags : [row.tirth_tags]) : undefined,
        }
      })

      return {
        success: true,
        data: transformedData,
        pagination: {
          total: count || transformedData.length,
          page,
          pages: Math.ceil((count || transformedData.length) / limit),
        },
      }
    } catch (innerError: any) {
      throw innerError
    }
  } catch (error: any) {
    console.error('[tirth] list fetch failed:', error.message)
    throw createError({
      statusCode: 500,
      statusMessage: error?.message || 'Failed to fetch tirth locations from Supabase',
    })
  }
})
