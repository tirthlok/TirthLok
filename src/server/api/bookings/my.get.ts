/**
 * GET /api/bookings/my
 * Fetch all bookings for the authenticated user
 */
import { getSupabaseTirthlok, getUserIdFromEvent } from '../../utils/supabase'

export default defineEventHandler(async (event) => {
  const userId = await getUserIdFromEvent(event)
  if (!userId) {
    throw createError({ statusCode: 401, statusMessage: 'Authentication required' })
  }

  const supabase = getSupabaseTirthlok()
  const query = getQuery(event)
  const status = query.status as string | undefined

  let dbQuery = supabase
    .from('bookings')
    .select(`
      booking_id,
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
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (status) {
    dbQuery = dbQuery.eq('status', status)
  }

  const { data, error } = await dbQuery

  if (error) {
    console.error('[bookings] my bookings fetch failed:', error.message)
    throw createError({ statusCode: 500, statusMessage: 'Failed to fetch bookings' })
  }

  return data || []
})
