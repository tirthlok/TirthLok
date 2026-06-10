/**
 * GET /api/bhojanshala/:id - Fetch single bhojanshala by ID
 * Queries tirthlok.bhojanshala_cards directly
 */
import { getSupabaseTirthlok } from '../../utils/supabase'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Bhojanshala ID is required' })
  }

  try {
    const supabase = getSupabaseTirthlok()
    const decodedId = decodeURIComponent(id)

    const { data, error } = await supabase
      .from('bhojanshala_cards')
      .select('*')
      .eq('bhojanshala_id', decodedId)
      .single()

    if (error || !data) {
      throw createError({ statusCode: 404, statusMessage: 'Bhojanshala not found' })
    }

    return {
      id: data.bhojanshala_id,
      name: data.bhojanshala_name || '',
      description: data.bhojanshala_description || '',
      type: data.bhojanshala_type || 'bhojanshala',
      rating: Number(data.bhojanshala_rating) || 0,
      reviews: 0,
      operatingHours: data.bhojanshala_operating_hours || '',
      priceRange: data.bhojanshala_price_range || '',
      cuisineTypes: Array.isArray(data.bhojanshala_cuisine_types) ? data.bhojanshala_cuisine_types : [],
      dietaryOptions: Array.isArray(data.bhojanshala_dietary_options) ? data.bhojanshala_dietary_options : [],
      location: {
        latitude: 0,
        longitude: 0,
        address: data.bhojanshala_address || `${data.bhojanshala_city}, ${data.bhojanshala_state}`,
        city: data.bhojanshala_city || '',
        state: data.bhojanshala_state || '',
      },
      contact: {
        phone: data.bhojanshala_phone || '',
        email: data.bhojanshala_email || '',
        website: data.bhojanshala_website || '',
      },
      images: Array.isArray(data.bhojanshala_images) ? data.bhojanshala_images : [],
    }
  } catch (error: any) {
    if (error.statusCode) throw error
    console.error('[bhojanshala] detail fetch failed:', error.message)
    throw createError({ statusCode: 500, statusMessage: 'Internal server error' })
  }
})
