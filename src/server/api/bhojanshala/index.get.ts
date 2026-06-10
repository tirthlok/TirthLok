/**
 * GET /api/bhojanshala - Fetch all bhojanshala locations
 * Queries tirthlok.bhojanshala_cards directly
 */
import { getSupabaseTirthlok } from '../../utils/supabase'

export default defineEventHandler(async (event) => {
  try {
    const supabase = getSupabaseTirthlok()
    const query = getQuery(event)
    const search = String(query.search || '')

    let supabaseQuery = supabase.from('bhojanshala_cards').select('*')

    if (search) {
      supabaseQuery = supabaseQuery.ilike('bhojanshala_name', `%${search}%`)
    }

    const { data, error } = await supabaseQuery

    if (error) {
      console.error('[bhojanshala] list fetch failed:', error.message)
      throw createError({ statusCode: 500, statusMessage: 'Failed to fetch bhojanshala locations' })
    }

    return (data || []).map((row: any) => ({
      id: row.bhojanshala_id,
      name: row.bhojanshala_name || '',
      description: row.bhojanshala_description || '',
      type: row.bhojanshala_type || 'bhojanshala',
      rating: Number(row.bhojanshala_rating) || 0,
      reviews: 0,
      operatingHours: row.bhojanshala_operating_hours || '',
      priceRange: row.bhojanshala_price_range || '',
      cuisineTypes: Array.isArray(row.bhojanshala_cuisine_types) ? row.bhojanshala_cuisine_types : [],
      dietaryOptions: Array.isArray(row.bhojanshala_dietary_options) ? row.bhojanshala_dietary_options : [],
      location: {
        latitude: 0,
        longitude: 0,
        address: row.bhojanshala_address || `${row.bhojanshala_city}, ${row.bhojanshala_state}`,
        city: row.bhojanshala_city || '',
        state: row.bhojanshala_state || '',
      },
      contact: {
        phone: row.bhojanshala_phone || '',
        email: row.bhojanshala_email || '',
        website: row.bhojanshala_website || '',
      },
      images: Array.isArray(row.bhojanshala_images) ? row.bhojanshala_images : [],
    }))
  } catch (error: any) {
    if (error.statusCode) throw error
    console.error('[bhojanshala] list fetch failed:', error.message)
    throw createError({ statusCode: 500, statusMessage: 'Internal server error' })
  }
})
