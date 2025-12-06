/**
 * POST /api/bookings - Create a new booking (server-side storage)
 */
import type { Booking } from '~/types/models'

// Server-side storage (in production, use database)
const bookings: Map<string, Booking> = new Map()

export default defineEventHandler(async (event) => {
  if (event.node.req.method === 'POST') {
    const body = await readBody(event)

    // Validate required fields
    if (!body.roomId || !body.dharamshalaId || !body.guestName || !body.checkInDate || !body.checkOutDate) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Missing required fields',
      })
    }

    try {
      const bookingId = `BOOKING-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      const newBooking: Booking = {
        id: bookingId,
        roomId: body.roomId,
        dharamshalaId: body.dharamshalaId,
        guestName: body.guestName,
        guestEmail: body.guestEmail || '',
        guestPhone: body.guestPhone || '',
        checkInDate: body.checkInDate,
        checkOutDate: body.checkOutDate,
        numberOfGuests: body.numberOfGuests || 1,
        totalPrice: body.totalPrice || 0,
        status: 'pending',
        createdAt: new Date().toISOString(),
        notes: body.notes || undefined,
      }

      // Store booking on server
      bookings.set(bookingId, newBooking)

      // Emit event or send notification (server-side only)
      console.log(`New booking created: ${bookingId}`)

      return newBooking
    } catch (error) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Error creating booking',
      })
    }
  }
})
