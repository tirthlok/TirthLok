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
        return {
          id: row.dharamshala_id,
          dharamshalaUuid: row.dharamshala_id,
          name: row.dharamshala_name || '',
          description: row.dharamshala_description || '',
          type: row.dharamshala_type || 'General',
          rating: Number(row.dharamshala_rating) || 0,
          reviews: 0,
          priceRange: '',
          amenities: Array.isArray(row.dharamshala_amenities)
            ? row.dharamshala_amenities
            : [],
          location: {
            latitude: 0,
            longitude: 0,
            address: row.dharamshala_address || `${row.dharamshala_city}, ${row.dharamshala_state}`,
            city: row.dharamshala_city || '',
            state: row.dharamshala_state || '',
          },
          contact: {
            phone: '',
            email: '',
            website: '',
          },
          images: Array.isArray(row.dharamshala_images)
            ? row.dharamshala_images
            : [],
          rules: [],
          dharamshala_grouping: row.dharamshala_grouping || [],
          dharamshala_tags: Array.isArray(row.dharamshala_tags)
            ? row.dharamshala_tags
            : [],
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
