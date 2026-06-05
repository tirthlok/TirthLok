/**
 * GET /api/dharamshala/:id/bookings
 * List all bookings for a dharamshala
 * Accessible by: dharamshala managers and super admins only
 */
import { getSupabaseTirthlok, getUserIdFromEvent } from '../../../utils/supabase'

export default defineEventHandler(async (event) => {
  const userId = await getUserIdFromEvent(event)
  if (!userId) {
    throw createError({ statusCode: 401, statusMessage: 'Authentication required' })
  }

  const dharamshalaId = getRouterParam(event, 'id')
  if (!dharamshalaId) {
    throw createError({ statusCode: 400, statusMessage: 'Dharamshala ID is required' })
  }

  const query = getQuery(event)
  const status = query.status as string | undefined
  const page = Number(query.page || 1)
  const limit = Number(query.limit || 20)
  const offset = (page - 1) * limit

  const supabase = getSupabaseTirthlok()

  let dbQuery = supabase
    .from('bookings')
    .select(
      `
      booking_id,
      user_id,
      dharamshala_id,
      room_type_id,
      rooms_count,
      check_in_date,
      check_out_date,
      total_amount,
      status,
      guest_name,
      guest_email,
      guest_phone,
      adults_count,
      children_count,
      special_requests,
      invoice_number,
      created_at,
      updated_at
    `,
      { count: 'exact' }
    )
    .eq('dharamshala_id', dharamshalaId)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (status) {
    dbQuery = dbQuery.eq('status', status)
  }

  const { data, error, count } = await dbQuery

  if (error) {
    console.error('[dharamshala] bookings fetch failed:', error.message)
    throw createError({ statusCode: 500, statusMessage: 'Failed to fetch bookings' })
  }

  return {
    bookings: data || [],
    total: count || 0,
    page,
    limit,
  }
})
