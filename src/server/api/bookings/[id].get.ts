/**
 * GET /api/bookings/:id
 * Fetch a single booking by ID for the authenticated user
 */
import { getSupabaseTirthlok, getUserIdFromEvent } from '../../utils/supabase'

export default defineEventHandler(async (event) => {
  const userId = await getUserIdFromEvent(event)
  if (!userId) {
    throw createError({ statusCode: 401, statusMessage: 'Authentication required' })
  }

  const bookingId = getRouterParam(event, 'id')
  if (!bookingId) {
    throw createError({ statusCode: 400, statusMessage: 'Booking ID is required' })
  }

  const supabase = getSupabaseTirthlok()

  const { data, error } = await supabase
    .from('bookings')
    .select(`
      *,
      booking_guests (*),
      payment_transactions (
        transaction_id,
        gateway_name,
        gateway_order_id,
        gateway_payment_id,
        amount_paid,
        status,
        created_at
      )
    `)
    .eq('booking_id', bookingId)
    .eq('user_id', userId)
    .single()

  if (error || !data) {
    throw createError({ statusCode: 404, statusMessage: 'Booking not found' })
  }

  return data
})
