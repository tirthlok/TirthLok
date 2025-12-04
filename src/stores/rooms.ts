import { defineStore } from 'pinia'
import type { Room, RoomBooking } from '~/types/models'

interface RoomsState {
  rooms: Room[]
  bookings: RoomBooking[]
  selectedRoom: Room | null
  loading: boolean
  error: string | null
}

/**
 * Rooms Store
 * Manages rooms in dharamshalas and their bookings
 */
export const useRoomsStore = defineStore('rooms', {
  state: (): RoomsState => ({
    rooms: [],
    bookings: [],
    selectedRoom: null,
    loading: false,
    error: null,
  }),

  getters: {
    getRoomsByDharamshal: (state) => (dharamshalaId: string) => {
      return state.rooms.filter((r) => r.dharamshalaId === dharamshalaId)
    },

    getRoomById: (state) => (roomId: string) => {
      return state.rooms.find((r) => r.id === roomId)
    },

    getBookingsByRoom: (state) => (roomId: string) => {
      return state.bookings.filter((b) => b.roomId === roomId && b.status !== 'cancelled')
    },

    getAvailableRoomsForDates: (state) => (dharamshalaId: string, checkInDate: string, checkOutDate: string) => {
      const roomsInDharamshal = state.rooms.filter((r) => r.dharamshalaId === dharamshalaId)
      return roomsInDharamshal.filter((room) => {
        const bookingsForRoom = state.bookings.filter((b) => b.roomId === room.id && b.status !== 'cancelled')
        const isAvailable = !bookingsForRoom.some((booking) => {
          const bookingStart = new Date(booking.checkInDate)
          const bookingEnd = new Date(booking.checkOutDate)
          const requestStart = new Date(checkInDate)
          const requestEnd = new Date(checkOutDate)

          return !(requestEnd <= bookingStart || requestStart >= bookingEnd)
        })
        return isAvailable && room.availableRooms > 0
      })
    },

    getUserBookings: (state) => (userId: string) => {
      return state.bookings.filter((b) => b.userId === userId)
    },
  },

  actions: {
    async fetchRoomsByDharamshal(dharamshalaId: string) {
      this.loading = true
      this.error = null
      try {
        // For now, load sample rooms directly
        this.loadSampleRooms(dharamshalaId)
        return this.getRoomsByDharamshal(dharamshalaId)
      } catch (error) {
        this.error = 'Failed to fetch rooms'
        console.error(error)
        this.loadSampleRooms(dharamshalaId)
      } finally {
        this.loading = false
      }
    },

    loadSampleRooms(dharamshalaId: string) {
      const sampleRooms: Room[] = [
        {
          id: `room_${dharamshalaId}_1`,
          dharamshalaId,
          roomNumber: '101',
          roomType: 'single',
          capacity: 1,
          price: 500,
          pricePerNight: 500,
          amenities: ['WiFi', 'AC', 'Attached Bathroom', 'Hot Water'],
          images: [
            'https://images.unsplash.com/photo-1578899387493-0c5f76c47cff?w=400&h=300&fit=crop',
            'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&h=300&fit=crop',
          ],
          description: 'Comfortable single room with modern amenities',
          totalRooms: 5,
          availableRooms: 3,
        },
        {
          id: `room_${dharamshalaId}_2`,
          dharamshalaId,
          roomNumber: '201',
          roomType: 'double',
          capacity: 2,
          price: 800,
          pricePerNight: 800,
          amenities: ['WiFi', 'AC', 'Attached Bathroom', 'Hot Water', 'TV'],
          images: [
            'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&h=300&fit=crop',
            'https://images.unsplash.com/photo-1578899387493-0c5f76c47cff?w=400&h=300&fit=crop',
          ],
          description: 'Spacious double room perfect for couples or small families',
          totalRooms: 8,
          availableRooms: 5,
        },
        {
          id: `room_${dharamshalaId}_3`,
          dharamshalaId,
          roomNumber: '301',
          roomType: 'dorm',
          capacity: 4,
          price: 300,
          pricePerNight: 300,
          amenities: ['Shared Bathroom', 'Locker', 'Bed Light'],
          images: [
            'https://images.unsplash.com/photo-1567521464027-f127ff144326?w=400&h=300&fit=crop',
            'https://images.unsplash.com/photo-1578899387493-0c5f76c47cff?w=400&h=300&fit=crop',
          ],
          description: 'Budget-friendly dormitory with shared facilities',
          totalRooms: 3,
          availableRooms: 2,
        },
        {
          id: `room_${dharamshalaId}_4`,
          dharamshalaId,
          roomNumber: '401',
          roomType: 'family',
          capacity: 4,
          price: 1200,
          pricePerNight: 1200,
          amenities: ['WiFi', 'AC', '2 Bathrooms', 'Kitchen', 'Living Area'],
          images: [
            'https://images.unsplash.com/photo-1566195992011-5527897915ea?w=400&h=300&fit=crop',
            'https://images.unsplash.com/photo-1578899387493-0c5f76c47cff?w=400&h=300&fit=crop',
          ],
          description: 'Luxurious family suite with all modern amenities',
          totalRooms: 4,
          availableRooms: 2,
        },
      ]

      this.rooms.push(...sampleRooms)
    },

    async createBooking(booking: Omit<RoomBooking, 'id' | 'bookingDate'>) {
      try {
        const newBooking: RoomBooking = {
          ...booking,
          id: `booking_${Date.now()}`,
          bookingDate: new Date().toISOString(),
        }

        this.bookings.push(newBooking)
        this.saveBookingsToLocalStorage()

        try {
          const { useStaysStore } = await import('~/stores/stays')
          const staysStore = useStaysStore()
          
          let dharamshalaName = booking.dharamshalaId
          const { useDharamshalaStore } = await import('~/stores/dharamshala')
          const dharamshalaStore = useDharamshalaStore()
          const dharamshala = dharamshalaStore.getDharamshalaById(booking.dharamshalaId)
          if (dharamshala) {
            dharamshalaName = dharamshala.name
          }
          
          await staysStore.startStay(booking.dharamshalaId, dharamshalaName, booking.checkInDate)
        } catch (e) {
          console.error('Failed to create stay record:', e)
        }

        try {
          await $fetch('/api/bookings', {
            method: 'POST',
            body: newBooking,
          })
        } catch (e) {
          console.error('Booking failed to sync with server')
        }

        return newBooking
      } catch (error) {
        this.error = 'Failed to create booking'
        console.error(error)
        throw error
      }
    },

    async updateBookingStatus(bookingId: string, status: RoomBooking['status']) {
      const booking = this.bookings.find((b) => b.id === bookingId)
      if (!booking) {
        this.error = 'Booking not found'
        return
      }

      booking.status = status
      this.saveBookingsToLocalStorage()

      try {
        await $fetch(`/api/bookings/${bookingId}`, {
          method: 'PATCH',
          body: { status },
        })
      } catch (e) {
        console.error('Booking status update failed to sync with server')
      }
    },

    async cancelBooking(bookingId: string) {
      await this.updateBookingStatus(bookingId, 'cancelled')
    },

    loadBookingsFromLocalStorage() {
      try {
        const key = 'dharamshala_bookings'
        const stored = localStorage.getItem(key)
        if (stored) {
          const data = JSON.parse(stored)
          this.bookings = data.bookings || []
        }
      } catch (e) {
        console.error('Failed to load bookings from localStorage:', e)
      }
    },

    saveBookingsToLocalStorage() {
      try {
        const key = 'dharamshala_bookings'
        localStorage.setItem(key, JSON.stringify({ bookings: this.bookings }))
      } catch (e) {
        console.error('Failed to save bookings to localStorage:', e)
      }
    },

    calculateNights(checkInDate: string, checkOutDate: string): number {
      const start = new Date(checkInDate)
      const end = new Date(checkOutDate)
      return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
    },

    calculateTotalPrice(pricePerNight: number, nights: number): number {
      return pricePerNight * nights
    },

    resetAllBookings() {
      this.bookings = []
      this.rooms = []
      this.selectedRoom = null
      try {
        localStorage.removeItem('dharamshala_bookings')
      } catch (e) {
        console.error('Failed to clear localStorage:', e)
      }
    },
  },
})
