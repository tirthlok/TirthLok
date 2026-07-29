/**
 * useRoomBookingApi Composable
 * Room Booking and availability management API endpoints
 * Supports both old Room[] and new RoomType[] schemas
 */

import type { Room, RoomType, Booking, PricingBreakdown, GuestBreakdown, RoomAvailabilityStatus } from '~/types/models'
import { useAuth } from '~/features/auth/composables/useAuth'

/** API response wrapper for room endpoints */
interface RoomApiResponse {
  success: boolean
  data: RoomType[]
  source: 'supabase' | 'sample' | 'empty'
}

/** API response wrapper for booking endpoint */
interface BookingApiResponse {
  success: boolean
  booking: Booking
}

/** API response wrapper for dharamshala bookings list */
interface BookingsListResponse {
  bookings: Booking[]
  total: number
  page: number
  limit: number
}

export const useRoomBookingApi = () => {
  const { session } = useAuth()

  const getAuthHeaders = (): Record<string, string> => {
    if (!session.value?.access_token) return {}
    return {
      Authorization: `Bearer ${session.value.access_token}`
    }
  }

  /**
   * Get available rooms for a dharamshala (returns RoomType[])
   */
  const getAvailableRooms = async (dharamshalaId: string): Promise<RoomType[]> => {
    try {
      const response = await $fetch<RoomApiResponse>(`/api/dharamshala/${dharamshalaId}/rooms`)
      return response?.data || []
    } catch (error) {
      console.error(`Error fetching rooms for dharamshala ${dharamshalaId}:`, error)
      return []
    }
  }

  /**
   * Get rooms availability for specific dates
   */
  const checkRoomAvailability = async (
    dharamshalaId: string,
    checkInDate: string,
    checkOutDate: string,
    guests?: number
  ): Promise<RoomType[]> => {
    try {
      const response = await $fetch<RoomApiResponse>(`/api/dharamshala/${dharamshalaId}/rooms/availability`, {
        query: {
          checkIn: checkInDate,
          checkOut: checkOutDate,
          guests: guests || 1,
        },
      })
      return response?.data || []
    } catch (error) {
      console.error('Error checking room availability:', error)
      return []
    }
  }

  /**
   * Create a new booking (server-side validated)
   */
  const createBooking = async (booking: Omit<Booking, 'id' | 'createdAt'>): Promise<Booking> => {
    try {
      const response = await $fetch<BookingApiResponse>('/api/bookings', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: booking,
      })
      return response.booking
    } catch (error) {
      console.error('Error creating booking:', error)
      throw error
    }
  }

  /**
   * Get booking by ID
   */
  const getBookingById = async (bookingId: string): Promise<Booking> => {
    try {
      return await $fetch<Booking>(`/api/bookings/${bookingId}`, {
        headers: getAuthHeaders(),
      })
    } catch (error) {
      console.error(`Error fetching booking ${bookingId}:`, error)
      throw error
    }
  }

  /**
   * Update booking status
   */
  const updateBookingStatus = async (
    bookingId: string,
    status: Booking['status'],
    reason?: string
  ): Promise<Booking> => {
    try {
      return await $fetch<Booking>(`/api/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: { status, reason },
      })
    } catch (error) {
      console.error(`Error updating booking ${bookingId}:`, error)
      throw error
    }
  }

  /**
   * Get all bookings for a dharamshala
   */
  const getDharamshalaBookings = async (dharamshalaId: string): Promise<Booking[]> => {
    try {
      const response = await $fetch<BookingsListResponse>(
        `/api/dharamshala/${dharamshalaId}/bookings`,
        { headers: getAuthHeaders() }
      )
      return response?.bookings || []
    } catch (error) {
      console.error(`Error fetching bookings for dharamshala ${dharamshalaId}:`, error)
      throw error
    }
  }

  /**
   * Calculate number of nights between two dates
   */
  const calculateNights = (checkInDate: string, checkOutDate: string): number => {
    if (!checkInDate || !checkOutDate) return 0
    const checkIn = new Date(checkInDate)
    const checkOut = new Date(checkOutDate)
    const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24))
    return Math.max(nights, 0)
  }

  /**
   * Calculate full pricing breakdown for a booking
   */
  const calculatePricing = (
    roomPrice: number,
    checkInDate: string,
    checkOutDate: string,
    discount: number = 0
  ): PricingBreakdown => {
    const nights = calculateNights(checkInDate, checkOutDate)
    const subtotal = roomPrice * nights
    const tax = Math.round(subtotal * 0.05 * 100) / 100 // 5% GST
    const serviceCharge = nights > 0 ? 50 : 0 // flat ₹50
    const grandTotal = Math.max(subtotal + tax + serviceCharge - discount, 0)

    return {
      roomPrice,
      nights,
      subtotal,
      tax,
      serviceCharge,
      discount,
      grandTotal,
    }
  }

  /**
   * Calculate total price for booking (backward-compatible wrapper)
   */
  const calculateBookingPrice = (
    roomPrice: number,
    checkInDate: string,
    checkOutDate: string
  ): number => {
    return calculatePricing(roomPrice, checkInDate, checkOutDate).grandTotal
  }

  /**
   * Derive availability status from room inventory
   */
  const getRoomAvailabilityStatus = (room: RoomType): RoomAvailabilityStatus => {
    const inventory = room.available_rooms !== undefined ? room.available_rooms : room.total_inventory
    if (!room.is_available_ui || inventory <= 0) return 'sold_out'
    if (inventory <= 5) return 'limited'
    return 'available'
  }

  /**
   * Get total guest count from breakdown
   */
  const getTotalGuests = (guests: GuestBreakdown): number => {
    return guests.adults + guests.children + guests.seniors
  }

  return {
    getAvailableRooms,
    checkRoomAvailability,
    createBooking,
    getBookingById,
    updateBookingStatus,
    getDharamshalaBookings,
    calculateBookingPrice,
    calculateNights,
    calculatePricing,
    getRoomAvailabilityStatus,
    getTotalGuests,
  }
}
