/**
 * PATCH /api/bookings/:id
 * Update booking status — authenticated user can cancel own booking only
 * Managers and super admins can update any status via service role
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

  const body = await readBody(event)
  const { status, reason } = body

  const ALLOWED_USER_TRANSITIONS = ['cancelled']
  if (!ALLOWED_USER_TRANSITIONS.includes(status)) {
    throw createError({
      statusCode: 403,
      statusMessage: 'You can only cancel your own bookings',
    })
  }

  const supabase = getSupabaseTirthlok()

  // Verify booking belongs to user
  const { data: existing, error: fetchError } = await supabase
    .from('bookings')
    .select('booking_id, status, user_id')
    .eq('booking_id', bookingId)
    .eq('user_id', userId)
    .single()

  if (fetchError || !existing) {
    throw createError({ statusCode: 404, statusMessage: 'Booking not found' })
  }

  // Only allow cancellation of non-final bookings
  const NON_CANCELLABLE = ['cancelled', 'checked_out', 'refunded']
  if (NON_CANCELLABLE.includes(existing.status)) {
    throw createError({
      statusCode: 400,
      statusMessage: `Cannot cancel a booking with status: ${existing.status}`,
    })
  }

  const { data, error } = await supabase
    .from('bookings')
    .update({
      status,
      cancelled_at: status === 'cancelled' ? new Date().toISOString() : null,
      cancellation_reason: reason || null,
      updated_at: new Date().toISOString(),
    })
    .eq('booking_id', bookingId)
    .eq('user_id', userId)
    .select()
    .single()

  if (error) {
    console.error('[bookings] status update failed:', error.message)
    throw createError({ statusCode: 500, statusMessage: 'Failed to update booking' })
  }

  return data
})
