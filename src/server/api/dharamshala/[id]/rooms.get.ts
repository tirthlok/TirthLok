/**
 * GET /api/dharamshala/:id/rooms - Fetch rooms for a dharamshala
 * The :id param is the dharamshala_id (e.g. DL-GJ-0001)
 * Queries tirthlok.room_types directly
 */
import { getSupabaseTirthlok } from '~/server/utils/supabase'

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

    // Resolve dharamshala_id — if it matches DL-XX-XXXX format, use directly
    let dharamshalaId = decodeURIComponent(id)
    const isStandardId = /^DL-[A-Z]{2}-\d{4}$/i.test(dharamshalaId)

    if (!isStandardId) {
      // It's a name slug — resolve via dharamshala_cards
      const { data: detailData, error: detailError } = await supabase
        .from('dharamshala_cards')
        .select('dharamshala_id')
        .eq('dharamshala_name', dharamshalaId)
        .single()

      if (detailError || !detailData) {
        throw createError({ statusCode: 404, statusMessage: 'Dharamshala not found' })
      }

      dharamshalaId = detailData.dharamshala_id
    }

    // Query room_types
    const { data, error } = await supabase
      .from('room_types')
      .select('*')
      .eq('dharamshala_id', dharamshalaId)
      .eq('is_available_ui', true)
      .order('base_price', { ascending: true })

    if (error) {
      console.error('[rooms] fetch failed:', error.message)
      throw createError({ statusCode: 500, statusMessage: 'Failed to fetch rooms' })
    }

    return {
      success: true,
      data: data || [],
      source: 'supabase',
    }

  } catch (error: any) {
    if (error.statusCode) throw error
    console.error('[rooms] fetch failed:', error.message)
    throw createError({
      statusCode: 500,
      statusMessage: error?.message || 'Error fetching rooms',
    })
  }
})


