import { getSupabaseTirthlok } from '~/server/utils/supabase'
import { requireAdmin } from '~/server/utils/adminContext'

export default defineEventHandler(async (event) => {
  requireAdmin(event)

  const bookingId = getRouterParam(event, 'id')
  const body = await readBody(event)
  const { status, reason } = body

  const VALID_STATUSES = [
    'confirmed', 'cancelled', 'checked_in', 'checked_out', 'refunded'
  ]
  if (!VALID_STATUSES.includes(status)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid status' })
  }

  const supabase = getSupabaseTirthlok()

  const updateData: Record<string, any> = {
    status,
    updated_at: new Date().toISOString(),
  }

  if (status === 'cancelled') {
    updateData.cancelled_at        = new Date().toISOString()
    updateData.cancellation_reason = reason || 'Cancelled by admin'
  }

  const { data, error } = await (supabase
    .from('bookings') as any)
    .update(updateData)
    .eq('booking_id', bookingId)
    .select()
    .single()

  if (error) {
    throw createError({ statusCode: 500, statusMessage: 'Update failed' })
  }

  return data
})
