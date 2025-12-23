/**
 * useRoomBookingApi Composable
 * Room Booking and availability management API endpoints
 */

import type { Room, Booking } from '~/types/models'

export const useRoomBookingApi = () => {
  const config = useRuntimeConfig()

  /**
   * Get available rooms for a dharamshala
   */
  const getAvailableRooms = async (dharamshalaId: string): Promise<Room[]> => {
    try {
      return await $fetch(`/api/dharamshala/${dharamshalaId}/rooms`, {
        baseURL: config.public.apiBaseUrl,
      })
    } catch (error) {
      console.error(`Error fetching rooms for dharamshala ${dharamshalaId}:`, error)
      throw error
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
  ): Promise<Room[]> => {
    try {
      return await $fetch(`/api/dharamshala/${dharamshalaId}/rooms/availability`, {
        baseURL: config.public.apiBaseUrl,
        query: {
          checkIn: checkInDate,
          checkOut: checkOutDate,
          guests: guests || 1,
        },
      })
    } catch (error) {
      console.error('Error checking room availability:', error)
      throw error
    }
  }

  /**
   * Create a new booking (server-side)
   */
  const createBooking = async (booking: Omit<Booking, 'id' | 'createdAt'>): Promise<Booking> => {
    try {
      return await $fetch('/api/bookings', {
        method: 'POST',
        baseURL: config.public.apiBaseUrl,
        body: booking,
      })
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
      return await $fetch(`/api/bookings/${bookingId}`, {
        baseURL: config.public.apiBaseUrl,
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
    status: Booking['status']
  ): Promise<Booking> => {
    try {
      return await $fetch(`/api/bookings/${bookingId}`, {
        method: 'PATCH',
        baseURL: config.public.apiBaseUrl,
        body: { status },
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
      return await $fetch(`/api/dharamshala/${dharamshalaId}/bookings`, {
        baseURL: config.public.apiBaseUrl,
      })
    } catch (error) {
      console.error(`Error fetching bookings for dharamshala ${dharamshalaId}:`, error)
      throw error
    }
  }

  /**
   * Calculate total price for booking
   */
  const calculateBookingPrice = (
    roomPrice: number,
    checkInDate: string,
    checkOutDate: string
  ): number => {
    const checkIn = new Date(checkInDate)
    const checkOut = new Date(checkOutDate)
    const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24))
    return Math.max(nights, 1) * roomPrice
  }

  /**
   * Calculate number of nights
   */
  const calculateNights = (checkInDate: string, checkOutDate: string): number => {
    const checkIn = new Date(checkInDate)
    const checkOut = new Date(checkOutDate)
    const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24))
    return Math.max(nights, 1)
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
  }
}
