/**
 * GET /api/dharamshala/:id - Fetch single dharamshala by ID
 * The :id parameter should be the dharamshala_id (e.g. DL-GJ-0001)
 * Queries tirthlok.dharamshala_cards + tirthlok.dharamshala_details
 */
import { getSupabaseTirthlok } from '../../utils/supabase'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Dharamshala ID is required',
    })
  }

  try {
    const supabase = getSupabaseTirthlok()

    // Fetch card data
    const { data: cardData, error: cardError } = await supabase
      .from('dharamshala_cards')
      .select('*')
      .eq('dharamshala_id', decodeURIComponent(id))
      .single()

    if (cardError || !cardData) {
      throw createError({ statusCode: 404, statusMessage: 'Dharamshala not found' })
    }

    // Fetch detail data
    let detailData: any = null
    try {
      const { data: details } = await supabase
        .from('dharamshala_details')
        .select('*')
        .eq('dharamshala_id', decodeURIComponent(id))
        .single()

      if (details) {
        detailData = details
      }
    } catch {
      // Details may not exist — not an error
    }

    // Merge and return
    const card: any = cardData
    const detail = detailData || {}

    return {
      id: card.dharamshala_id,
      dharamshalaUuid: card.dharamshala_id,
      name: card.dharamshala_name || '',
      description: detail.about || card.dharamshala_description || '',
      type: card.dharamshala_type || 'General',
      rating: Number(card.dharamshala_rating) || 0,
      reviews: 0,
      priceRange: detail.dharamshala_price_range || '',
      amenities: Array.isArray(detail.dharamshala_amenities)
        ? detail.dharamshala_amenities
        : [],
      location: {
        latitude: 0,
        longitude: 0,
        address: detail.dharamshala_location
          || card.dharamshala_address
          || `${card.dharamshala_city}, ${card.dharamshala_state}`,
        city: card.dharamshala_city || '',
        state: card.dharamshala_state || '',
      },
      contact: {
        phone: detail.dharamshala_phone || '',
        email: detail.dharamshala_email || '',
        website: '',
      },
      images: Array.isArray(card.dharamshala_images)
        ? card.dharamshala_images
        : [],
      rules: detail.rules
        ? detail.rules.split('\n').filter(Boolean)
        : [],
      dharamshala_grouping: card.dharamshala_grouping || [],
      dharamshala_tags: Array.isArray(card.dharamshala_tags)
        ? card.dharamshala_tags
        : [],
      checkInTime: detail.check_in_time || '12:00 PM',
      checkOutTime: detail.check_out_time || '10:00 AM',
      languagesSpoken: Array.isArray(detail.languages_spoken)
        ? detail.languages_spoken : [],
      nearbyAttractions: Array.isArray(detail.nearby_attractions)
        ? detail.nearby_attractions : [],
      diningInfo: detail.dining_info || '',
      specialServices: Array.isArray(detail.special_services)
        ? detail.special_services : [],
      paymentMethods: Array.isArray(detail.payment_methods)
        ? detail.payment_methods : [],
      reviews: card.total_reviews || 0,
      isFeatured: card.is_featured || false,
      establishedYear: card.established_year || null,
    }
  } catch (error: any) {
    if (error.statusCode) throw error
    console.error('[dharamshala] detail fetch failed:', error.message)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch dharamshala details',
    })
  }
})
