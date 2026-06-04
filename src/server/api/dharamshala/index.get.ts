/**
 * GET /api/dharamshala - Fetch all dharamshala locations
 * Queries tirthlok.dharamshala_cards directly
 */
import { getSupabaseTirthlok } from '../../utils/supabase'

export default defineEventHandler(async (event) => {
  try {
    const supabase = getSupabaseTirthlok()

    const query = getQuery(event)
    const search = String(query.search || '')

    try {
      let supabaseQuery = supabase
        .from('dharamshala_cards')
        .select('*')

      // Apply search filter if provided
      if (search) {
        supabaseQuery = supabaseQuery.ilike('dharamshala_name', `%${search}%`)
      }

      const { data, error } = await supabaseQuery

      if (error) {
        console.error('[dharamshala] list fetch failed:', error.message)
        throw error
      }

      // Transform the data to match the Dharamshala model
      const transformedData = (data || []).map((row: any) => {
        let images = row.dharamshala_images || []
        if (typeof images === 'string') {
          try {
            images = JSON.parse(images)
          } catch {
            images = [images]
          }
        }

        let amenities = row.dharamshala_amenities || []
        if (typeof amenities === 'string') {
          try {
            amenities = JSON.parse(amenities)
          } catch {
            amenities = [amenities]
          }
        }

        return {
          id: row.dharamshala_id || 'unknown',
          dharamshalaUuid: row.dharamshala_id || '',
          name: row.dharamshala_name || '',
          description: row.dharamshala_description || '',
          location: {
            city: row.dharamshala_city || '',
            state: row.dharamshala_state || '',
            address: row.dharamshala_address || `${row.dharamshala_city}, ${row.dharamshala_state}`,
          },
          images: Array.isArray(images) ? images : [images].filter(Boolean),
          amenities: Array.isArray(amenities) ? amenities : [],
          capacity: row.dharamshala_capacity || 0,
          contactInfo: {
            phone: row.dharamshala_phone || '',
            email: row.dharamshala_email || '',
            website: row.dharamshala_website || '',
          },
          bookingInfo: {
            bookingRequired: row.dharamshala_booking_required || false,
            bookingUrl: row.dharamshala_booking_url || '',
            bookingPhone: row.dharamshala_booking_phone || '',
          },
          priceRange: row.dharamshala_price_range || '',
          rating: row.dharamshala_rating || 0,
          reviews: row.dharamshala_reviews || 0,
          type: row.dharamshala_type || 'General',
          dharamshala_grouping: row.dharamshala_grouping || undefined,
          dharamshala_tags: row.dharamshala_tags ? (Array.isArray(row.dharamshala_tags) ? row.dharamshala_tags : [row.dharamshala_tags]) : undefined,
        }
      })

      return transformedData
    } catch (innerError: any) {
      throw innerError
    }
  } catch (error: any) {
    console.error('[dharamshala] list fetch failed:', error.message)
    throw createError({
      statusCode: 500,
      statusMessage: error?.message || 'Failed to fetch dharamshala locations from Supabase',
    })
  }
})
