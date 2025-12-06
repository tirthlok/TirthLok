/**
 * GET /api/dharamshala/:id/rooms/availability - Check room availability for date range
 */
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const query = getQuery(event)

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Dharamshala ID is required',
    })
  }

  const checkInDate = query.checkIn as string
  const checkOutDate = query.checkOut as string
  const guests = parseInt(query.guests as string) || 1

  if (!checkInDate || !checkOutDate) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Check-in and check-out dates are required',
    })
  }

  try {
    const { sampleDharamshalas } = await import('~/server/utils/sampleData')
    const dh = sampleDharamshalas.find((d: any) => d.id === id)

    if (!dh) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Dharamshala not found',
      })
    }

    // Filter rooms by guest capacity and availability
    const availableRooms = (dh.rooms || []).filter((room: any) => {
      return room.available && room.maxGuests >= guests
    })

    return availableRooms
  } catch (error) {
    if (error.statusCode) throw error
    throw createError({
      statusCode: 500,
      statusMessage: 'Error checking room availability',
    })
  }
})
