/**
 * useBookingRating Composable
 * Manages booking completion detection and rating popup triggers
 */

import type { Booking } from '~/types/models'

export const useBookingRating = () => {
  /**
   * Check if booking checkout date has passed (stay is completed)
   */
  const isBookingCompleted = (booking: Booking): boolean => {
    if (!booking.checkOutDate) return false

    const checkOutDate = new Date(booking.checkOutDate)
    const today = new Date()

    // Set time to midnight for accurate date comparison
    checkOutDate.setHours(0, 0, 0, 0)
    today.setHours(0, 0, 0, 0)

    // Booking is completed if check-out date has passed
    return today >= checkOutDate
  }

  /**
   * Check if a booking should trigger rating popup
   * - Booking must be completed (check-out date passed)
   * - Booking must not already be rated
   */
  const shouldShowRatingPopup = async (booking: Booking): Promise<boolean> => {
    try {
      // Check if booking is completed
      if (!isBookingCompleted(booking)) {
        return false
      }

      // Check if already rated
      const { useRatingApi } = await import('~/composables/api')
      const { checkIfBookingRated } = useRatingApi()
      const isRated = await checkIfBookingRated(booking.id)

      // Show popup only if completed and not rated
      return !isRated
    } catch (error) {
      console.error('Error checking rating status:', error)
      return false
    }
  }

  /**
   * Get user's completed bookings from localStorage (temporary storage)
   * In production, fetch from server/database
   */
  const getCompletedBookings = (): Booking[] => {
    try {
      // For development: check sessionStorage for test bookings
      const stored = sessionStorage.getItem('completedBookings')
      return stored ? JSON.parse(stored) : []
    } catch (error) {
      console.error('Error loading bookings:', error)
      return []
    }
  }

  /**
   * Store completed booking in sessionStorage for testing
   * In production, this would be managed server-side
   */
  const storeCompletedBooking = (booking: Booking): void => {
    try {
      const bookings = getCompletedBookings()
      if (!bookings.find(b => b.id === booking.id)) {
        bookings.push(booking)
        sessionStorage.setItem('completedBookings', JSON.stringify(bookings))
      }
    } catch (error) {
      console.error('Error storing booking:', error)
    }
  }

  /**
   * Check all user's bookings and return any that need rating
   */
  const findBookingNeedingRating = async (dharamshalaId: string): Promise<Booking | null> => {
    try {
      const completedBookings = getCompletedBookings()
      
      // Filter bookings for this dharamshala
      const dharamshalaBookings = completedBookings.filter(b => b.dharamshalaId === dharamshalaId)

      // Find first booking that needs rating
      for (const booking of dharamshalaBookings) {
        const needsRating = await shouldShowRatingPopup(booking)
        if (needsRating) {
          return booking
        }
      }

      return null
    } catch (error) {
      console.error('Error finding booking needing rating:', error)
      return null
    }
  }

  return {
    isBookingCompleted,
    shouldShowRatingPopup,
    getCompletedBookings,
    storeCompletedBooking,
    findBookingNeedingRating,
  }
}
