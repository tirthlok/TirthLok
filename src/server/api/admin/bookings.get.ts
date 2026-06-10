import { getSupabaseTirthlok, getUserIdFromEvent } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  const userId = await getUserIdFromEvent(event)
  if (!userId) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const supabase = getSupabaseTirthlok()
  const query = getQuery(event)
  const status = query.status as string | undefined
  const search = query.search as string | undefined
  const page   = Number(query.page  || 1)
  const limit  = Number(query.limit || 20)
  const offset = (page - 1) * limit

  let dbQuery = supabase
    .from('bookings')
    .select(`
      booking_id, user_id, dharamshala_id, room_type_id,
      rooms_count, check_in_date, check_out_date,
      total_amount, status, guest_name, guest_email,
      guest_phone, adults_count, children_count,
      special_requests, created_at, updated_at,
      cancelled_at, cancellation_reason,
      dharamshala:dharamshala_id (
        dharamshala_name, dharamshala_city, dharamshala_state
      ),
      room:room_type_id ( name, room_category, base_price )
    `, { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (status && status !== 'all') {
    dbQuery = dbQuery.eq('status', status)
  }

  if (search) {
    dbQuery = dbQuery.or(
      `guest_name.ilike.%${search}%,guest_email.ilike.%${search}%`
    )
  }

  const { data, error, count } = await dbQuery

  if (error) {
    throw createError({ statusCode: 500, statusMessage: 'Failed to fetch bookings' })
  }

  return { bookings: data || [], total: count || 0, page, limit }
})
