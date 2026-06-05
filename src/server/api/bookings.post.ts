/**
 * POST /api/bookings - Create a new booking
 * Validates inventory, creates booking record, and decrements room inventory
 * Queries tirthlok.room_types directly
 */
import type { Booking } from '~/types/models'
import { getSupabaseTirthlok, getUserIdFromEvent } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const userId = await getUserIdFromEvent(event)
  if (!userId) {
    throw createError({ statusCode: 401, statusMessage: 'Authentication required' })
  }

  // Validate required fields
  const requiredFields = ['roomId', 'dharamshalaId', 'guestName', 'guestEmail', 'guestPhone', 'checkInDate', 'checkOutDate']
  const missingFields = requiredFields.filter((field) => !body[field])

  if (missingFields.length > 0) {
    throw createError({
      statusCode: 400,
      statusMessage: `Missing required fields: ${missingFields.join(', ')}`,
    })
  }

  // Validate dates
  const checkIn = new Date(body.checkInDate)
  const checkOut = new Date(body.checkOutDate)
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

  // Validate guest count
  const numberOfGuests = body.numberOfGuests || 1
  if (numberOfGuests < 1 || numberOfGuests > 20) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid number of guests (must be 1-20)',
    })
  }

  const supabase = getSupabaseTirthlok()

  try {
    // Step 1: Verify room exists and has inventory
    const { data: room, error: roomError } = await supabase
      .from('room_types')
      .select('*')
      .eq('room_type_id', body.roomId)
      .single()

    if (roomError || !room) {
      console.error('[bookings] room lookup failed:', roomError?.message)
      throw createError({
        statusCode: 404,
        statusMessage: 'Room not found',
      })
    }

    // Step 2: Validate inventory > 0
    if (room.total_inventory <= 0) {
      throw createError({
        statusCode: 409,
        statusMessage: 'This room type is fully booked. No inventory available.',
      })
    }

    // Step 3: Validate guest capacity
    if (numberOfGuests > room.max_guests) {
      throw createError({
        statusCode: 400,
        statusMessage: `Guest count exceeds maximum capacity of ${room.max_guests}`,
      })
    }

    // Step 4: Validate room is available for UI
    if (!room.is_available_ui) {
      throw createError({
        statusCode: 409,
        statusMessage: 'This room type is currently unavailable',
      })
    }

    // Step 5: Calculate pricing
    const nights = Math.max(
      Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)),
      1
    )
    const subtotal = room.base_price * nights
    const tax = Math.round(subtotal * 0.05 * 100) / 100 // 5% GST
    const serviceCharge = 50 // flat service charge
    const discount = body.discount || 0
    const grandTotal = subtotal + tax + serviceCharge - discount

    // Step 6: Create booking record
    const { data: bookingRecord, error: bookingError } = await supabase
      .from('bookings')
      .insert({
        user_id:          userId,
        dharamshala_id:   body.dharamshalaId,
        room_type_id:     body.roomId,
        rooms_count:      1,
        check_in_date:    body.checkInDate,
        check_out_date:   body.checkOutDate,
        total_amount:     grandTotal,
        status:           'initiated',
        hold_expires_at:  new Date(Date.now() + 15 * 60 * 1000).toISOString(),
        guest_name:       body.guestName,
        guest_email:      body.guestEmail,
        guest_phone:      body.guestPhone,
        adults_count:     body.guests?.adults || numberOfGuests,
        children_count:   body.guests?.children || 0,
        special_requests: body.notes || null,
      })
      .select()
      .single()

    if (bookingError || !bookingRecord) {
      console.error('[bookings] insert failed:', bookingError?.message)
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to create booking record'
      })
    }

    // Step 7: Write to room_inventory_ledger for each booked date
    const ledgerEntries = []
    const current = new Date(checkIn)
    while (current < checkOut) {
      const dateStr = current.toISOString().split('T')[0]
      ledgerEntries.push({
        room_type_id:    body.roomId,
        booking_date:    dateStr,
        allocated_rooms: 1,
        held_rooms:      0,
      })
      current.setDate(current.getDate() + 1)
    }

    const { error: ledgerError } = await supabase
      .from('room_inventory_ledger')
      .upsert(ledgerEntries, {
        onConflict: 'room_type_id,booking_date',
        ignoreDuplicates: false,
      })

    if (ledgerError) {
      console.error('[bookings] ledger update failed:', ledgerError.message)
      // Roll back booking
      await supabase
        .from('bookings')
        .delete()
        .eq('booking_id', bookingRecord.booking_id)
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to update room availability'
      })
    }

    // Step 8: Return values
    return {
      success: true,
      booking: {
        id:            bookingRecord.booking_id,
        bookingId:     bookingRecord.booking_id,
        status:        bookingRecord.status,
        totalPrice:    bookingRecord.total_amount,
        checkInDate:   bookingRecord.check_in_date,
        checkOutDate:  bookingRecord.check_out_date,
        guestName:     bookingRecord.guest_name,
        guestEmail:    bookingRecord.guest_email,
        dharamshalaId: bookingRecord.dharamshala_id,
        roomId:        bookingRecord.room_type_id,
        createdAt:     bookingRecord.created_at,
        pricing: {
          roomPrice:     room.base_price,
          nights,
          subtotal,
          tax,
          serviceCharge,
          discount,
          grandTotal,
        }
      }
    }
  } catch (error: any) {
    if (error.statusCode) throw error
    console.error('[bookings] creation failed:', error.message)
    throw createError({
      statusCode: 500,
      statusMessage: error?.message || 'Error creating booking',
    })
  }
})
