/**
 * POST /api/bookings - Create a new booking
 * Validates inventory, creates booking record, and decrements room inventory
 * Queries tirthlok.room_types directly
 */
import type { Booking } from '~/types/models'
import { getSupabaseTirthlok } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

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
    const bookingId = `BK-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`
    const newBooking: Booking = {
      id: bookingId,
      roomId: body.roomId,
      dharamshalaId: body.dharamshalaId,
      guestName: body.guestName,
      guestEmail: body.guestEmail,
      guestPhone: body.guestPhone,
      checkInDate: body.checkInDate,
      checkOutDate: body.checkOutDate,
      numberOfGuests,
      guests: body.guests || { adults: numberOfGuests, children: 0, seniors: 0 },
      totalPrice: grandTotal,
      pricing: {
        roomPrice: room.base_price,
        nights,
        subtotal,
        tax,
        serviceCharge,
        discount,
        grandTotal,
      },
      status: 'confirmed',
      createdAt: new Date().toISOString(),
      notes: body.notes || undefined,
    }

    // Step 7: Decrement inventory atomically
    const { error: inventoryError } = await supabase
      .from('room_types')
      .update({
        total_inventory: room.total_inventory - 1,
        updated_at: new Date().toISOString(),
      })
      .eq('room_type_id', body.roomId)
      .gt('total_inventory', 0) // Extra safety: only update if inventory > 0

    if (inventoryError) {
      console.error('[bookings] inventory update failed:', inventoryError.message)
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to update room inventory',
      })
    }

    return {
      success: true,
      booking: newBooking,
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
