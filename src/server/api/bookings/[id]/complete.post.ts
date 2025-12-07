/**
 * POST /api/bookings/:id/complete - Mark a booking as completed (for developers to trigger rating popup)
 * This endpoint allows developers to manually mark a booking as checked-out/completed
 * In production, this would be triggered by actual check-out events
 */
export default defineEventHandler(async (event) => {
  const bookingId = getRouterParam(event, 'id')

  if (!bookingId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Booking ID is required',
    })
  }

  try {
    // In production, fetch from database and update status to 'checked-out'
    // For now, just return a mock completed booking
    return {
      success: true,
      message: `Booking ${bookingId} marked as completed. User should now see rating popup.`,
      bookingId,
      timestamp: new Date().toISOString(),
      action: 'RATING_POPUP_TRIGGERED',
    }
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Error completing booking',
    })
  }
})
