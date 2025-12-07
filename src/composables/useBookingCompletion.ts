/**
 * useBookingCompletion Composable
 * Helper for developers to manage booking completion and trigger rating popups
 */

export const useBookingCompletion = () => {
  /**
   * Manually complete a booking and trigger rating popup
   * Used by developers to test the rating system
   * 
   * @param bookingId - The ID of the booking to complete
   * @param dharamshalaId - The ID of the dharamshala
   * @param guestName - Guest name for the rating form
   * @param guestEmail - Guest email for the rating form
   * 
   * Usage in console:
   * window.completeBookingForRating('BOOKING-123', 'shanti-dharamshala', 'John Doe', 'john@example.com')
   */
  const completeBookingAndRate = async (
    bookingId: string,
    dharamshalaId: string,
    guestName: string,
    guestEmail: string
  ) => {
    try {
      const { useRoomBookingApi } = await import('~/composables/api')
      const { completeBooking } = useRoomBookingApi()

      // Mark booking as completed
      const result = await completeBooking(bookingId)
      
      console.log('✅ Booking completed:', result)
      console.log(`🎉 Rating popup should be displayed for guest: ${guestName}`)

      // Return booking data for modal
      return {
        id: bookingId,
        dharamshalaId,
        guestName,
        guestEmail,
        status: 'checked-out',
      }
    } catch (error) {
      console.error('❌ Error completing booking:', error)
      throw error
    }
  }

  /**
   * Get all bookings for a dharamshala (for testing)
   */
  const getDharamshalaBookings = async (dharamshalaId: string) => {
    try {
      const { useRoomBookingApi } = await import('~/composables/api')
      const { getDharamshalaBookings: getBookings } = useRoomBookingApi()
      
      return await getBookings(dharamshalaId)
    } catch (error) {
      console.error('Error fetching dharamshala bookings:', error)
      throw error
    }
  }

  /**
   * Submit a rating for a booking
   */
  const submitRating = async (
    bookingId: string,
    dharamshalaId: string,
    ratingData: {
      guestName: string
      guestEmail: string
      overallRating: number
      cleanliness?: number
      comfort?: number
      hospitality?: number
      value?: number
      comment?: string
    }
  ) => {
    try {
      const { useRatingApi } = await import('~/composables/api')
      const { createRating } = useRatingApi()

      const rating = await createRating({
        dharamshalaId,
        guestName: ratingData.guestName,
        guestEmail: ratingData.guestEmail,
        bookingId,
        overallRating: ratingData.overallRating,
        cleanliness: ratingData.cleanliness || 0,
        comfort: ratingData.comfort || 0,
        hospitality: ratingData.hospitality || 0,
        value: ratingData.value || 0,
        comment: ratingData.comment || '',
        visitDate: new Date().toISOString().split('T')[0],
      })

      console.log('✅ Rating submitted:', rating)
      return rating
    } catch (error) {
      console.error('❌ Error submitting rating:', error)
      throw error
    }
  }

  return {
    completeBookingAndRate,
    getDharamshalaBookings,
    submitRating,
  }
}
