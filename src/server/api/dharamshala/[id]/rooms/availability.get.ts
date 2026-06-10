/**
 * GET /api/dharamshala/:id/rooms/availability - Check room availability for date range
 * The :id param is the dharamshala_id (e.g. DL-GJ-0001)
 * Queries tirthlok.room_types directly
 */
import { getSupabaseTirthlok } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const query = getQuery(event)

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Dharamshala ID is required',
    })
  }

  const checkInDate = query.checkIn as string
  const checkOutDate = query.checkOut as string
  const guests = parseInt(query.guests as string) || 1

  if (!checkInDate || !checkOutDate) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Check-in and check-out dates are required',
    })
  }

  // Validate dates
  const checkIn = new Date(checkInDate)
  const checkOut = new Date(checkOutDate)
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  if (checkIn < today) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Check-in date cannot be in the past',
    })
  }

  if (checkOut <= checkIn) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Check-out date must be after check-in date',
    })
  }

  try {
    const supabase = getSupabaseTirthlok()

    // Resolve dharamshala_id
    let dharamshalaId = decodeURIComponent(id)
    const isStandardId = /^DL-[A-Z]{2}-\d{4}$/i.test(dharamshalaId)

    if (!isStandardId) {
      const { data: detailData } = await supabase
        .from('dharamshala_cards')
        .select('dharamshala_id')
        .eq('dharamshala_name', dharamshalaId)
        .single()

      if (!detailData) {
        throw createError({ statusCode: 404, statusMessage: 'Dharamshala not found' })
      }
      dharamshalaId = detailData.dharamshala_id
    }

    // Query available rooms with sufficient capacity and inventory
    const { data, error } = await supabase
      .from('room_types')
      .select('*')
      .eq('dharamshala_id', dharamshalaId)
      .eq('is_available_ui', true)
      .gte('max_guests', guests)
      .gt('total_inventory', 0)
      .order('base_price', { ascending: true })

    if (error) {
      console.error('[availability] fetch failed:', error.message)
      throw createError({ statusCode: 500, statusMessage: 'Failed to check room availability' })
    }

    return {
      success: true,
      data: data || [],
      source: 'supabase',
    }
  } catch (error: any) {
    if (error.statusCode) throw error
    console.error('[availability] fetch failed:', error.message)
    throw createError({
      statusCode: 500,
      statusMessage: error?.message || 'Error checking room availability',
    })
  }
})

