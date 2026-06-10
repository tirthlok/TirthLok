import { getSupabaseTirthlok, getUserIdFromEvent } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  const userId    = await getUserIdFromEvent(event)
  const bookingId = getRouterParam(event, 'bookingId')
  if (!bookingId) {
    throw createError({ statusCode: 400, statusMessage: 'Booking ID required' })
  }

  if (!userId) {
    throw createError({ statusCode: 401, statusMessage: 'Authentication required' })
  }

  const supabase = getSupabaseTirthlok()

  const { data: bookingRaw, error } = await supabase
    .from('bookings')
    .select(`
      booking_id,
      invoice_number,
      check_in_date,
      check_out_date,
      total_amount,
      status,
      guest_name,
      guest_email,
      guest_phone,
      adults_count,
      children_count,
      rooms_count,
      special_requests,
      created_at,
      dharamshala:dharamshala_id (
        dharamshala_name,
        dharamshala_city,
        dharamshala_state,
        dharamshala_address
      ),
      room:room_type_id (
        name,
        room_category,
        base_price,
        bed_configuration
      )
    `)
    .eq('booking_id', bookingId as string)
    .eq('user_id', userId as string)
    .single()
  const booking = bookingRaw as any

  if (error || !booking) {
    throw createError({ statusCode: 404, statusMessage: 'Booking not found' })
  }

  // Fetch invoice record
  const { data: invoiceRaw } = await supabase
    .from('invoices')
    .select('invoice_number, amount, tax_amount, total_amount, issued_at')
    .eq('booking_id', bookingId as string)
    .single()
  const invoice = invoiceRaw as any

  // Calculate nights
  const checkIn  = new Date(booking.check_in_date)
  const checkOut = new Date(booking.check_out_date)
  const nights   = Math.max(
    Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)),
    1
  )

  const basePrice     = Number((booking.room as any)?.base_price || 0)
  const subtotal      = basePrice * nights
  const tax           = Math.round(subtotal * 0.05 * 100) / 100
  const serviceCharge = 50
  const grandTotal    = subtotal + tax + serviceCharge

  return {
    booking,
    invoice,
    calculated: { nights, subtotal, tax, serviceCharge, grandTotal, basePrice }
  }
})
