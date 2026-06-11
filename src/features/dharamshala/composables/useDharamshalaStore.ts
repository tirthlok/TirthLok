import { defineStore } from 'pinia'
import type { Dharamshala, RoomType } from '~/types/models'
import { useDharamshalaApi } from '~/features/dharamshala/services/dharamshalaApi'
import { useRoomBookingApi } from '~/features/dharamshala/services/roomBookingApi'

interface DharamshalaState {
  dharamshalas: Dharamshala[]
  selectedDharamshala: Dharamshala | null
  filteredDharamshalas: Dharamshala[]
  loading: boolean
  error: string | null
  filterOptions: {
    states: string[]
    cities: string[]
    facilities: string[]
  }
  currentFilters: {
    state?: string
    city?: string
    facilities?: string[]
    searchTerm?: string
  }
  // Room booking state
  roomTypes: RoomType[]
  roomsLoading: boolean
  roomsError: string | null
}

/**
 * Dharamshala Store
 * Manages dharamshala locations and state
 */
export const useDharamshalaStore = defineStore('dharamshala', {
  state: (): DharamshalaState => ({
    dharamshalas: [],
    selectedDharamshala: null,
    filteredDharamshalas: [],
    loading: false,
    error: null,
    filterOptions: {
      states: [],
      cities: [],
      facilities: [],
    },
    currentFilters: {},
    // Room booking state
    roomTypes: [],
    roomsLoading: false,
    roomsError: null,
  }),

  getters: {
    getDharamshalaById: (state) => (id: string) => {
      return state.dharamshalas.find((d) => d.id === id)
    },

    getDharamshalasByCity: (state) => (city: string) => {
      return state.filteredDharamshalas.filter((d) => d.location.city === city)
    },

    getDharamshalasByAmenity: (state) => (amenity: string) => {
      return state.filteredDharamshalas.filter((d) =>
        d.amenities?.some((a) => a.toLowerCase().includes(amenity.toLowerCase()))
      )
    },

    getDharamshalaCount: (state) => state.dharamshalas.length,

    getFilteredCount: (state) => state.filteredDharamshalas.length,
    // Provide list of dharamshala names for suggestions
    dharamshalaNames: (state) => state.dharamshalas.map((d) => d.name || ''),
  },

  actions: {
    async fetchDharamshalas() {
      if (this.dharamshalas.length > 0) {
        this.filteredDharamshalas = [...this.dharamshalas]
        return
      }

      this.loading = true
      this.error = null
      try {
        const { fetchDharamshalas } = useDharamshalaApi()
        const response = await fetchDharamshalas()
        this.dharamshalas = response
        this.filteredDharamshalas = response
      } catch (error) {
        this.error = 'Failed to fetch dharamshala locations'
        console.error(error)
      } finally {
        this.loading = false
      }
    },

    async fetchDharamshalaById(id: string) {
      const local = this.dharamshalas.find((d) => d.id === id)
      if (local) {
        this.selectedDharamshala = local
        return local
      }

      this.loading = true
      try {
        const { fetchDharamshalaById } = useDharamshalaApi()
        const response = await fetchDharamshalaById(id)
        this.selectedDharamshala = response
        return response
      } catch (error) {
        this.error = `Failed to fetch dharamshala: ${id}`
        console.error(error)
      } finally {
        this.loading = false
      }
    },

    filterDharamshalas(filters: {
      state?: string
      city?: string
      type?: string
      capacity?: number
      facilities?: string[]
      searchTerm?: string
    }) {
      // Store current filters
      this.currentFilters = filters

      let results = [...this.dharamshalas]

      if (filters.searchTerm) {
        const term = filters.searchTerm.toLowerCase()
        results = results.filter(
          (d) =>
            d.name.toLowerCase().includes(term) ||
            d.description?.toLowerCase().includes(term) ||
            d.location.city.toLowerCase().includes(term)
        )
      }

      if (filters.state) {
        results = results.filter((d) => d.location.state === filters.state)
      }

      if (filters.city) {
        results = results.filter((d) => d.location.city === filters.city)
      }

      if (filters.type) {
        results = results.filter((d) => d.type === filters.type)
      }

      if (filters.capacity && filters.capacity > 0) {
        results = results.filter((d) => d.capacity && d.capacity >= filters.capacity!)
      }

      if (filters.facilities && filters.facilities.length > 0) {
        results = results.filter((d) =>
          filters.facilities!.some((facility) =>
            d.amenities?.some((a) => a.toLowerCase() === facility.toLowerCase())
          )
        )
      }

      this.filteredDharamshalas = results
    },

    setSelectedDharamshala(dharamshala: Dharamshala | null) {
      this.selectedDharamshala = dharamshala
    },

    async fetchFilterOptions() {
      // Extract unique states, cities, and facilities from dharamshalas
      const states = new Set<string>()
      const cities = new Set<string>()
      const facilities = new Set<string>()

      this.dharamshalas.forEach((d) => {
        if (d.location?.state) states.add(d.location.state)
        if (d.location?.city) cities.add(d.location.city)
        if (d.amenities) {
          d.amenities.forEach((amenity) => {
            const normalized = amenity.toLowerCase()
            facilities.add(normalized)
          })
        }
      })

      this.filterOptions = {
        states: Array.from(states).sort(),
        cities: Array.from(cities).sort(),
        facilities: Array.from(facilities).sort(),
      }
    },

    clearFilters() {
      this.filteredDharamshalas = [...this.dharamshalas]
    },

    // ─── Room Actions ───────────────────────────────────

    async fetchRoomTypes(dharamshalaId: string) {
      this.roomsLoading = true
      this.roomsError = null
      try {
        const { getAvailableRooms } = useRoomBookingApi()
        this.roomTypes = await getAvailableRooms(dharamshalaId)
      } catch (error) {
        this.roomsError = 'Failed to fetch rooms'
        console.error('Error fetching room types:', error)
      } finally {
        this.roomsLoading = false
      }
    },

    /** Handle realtime UPDATE event for a room */
    updateRoomFromRealtime(updatedRoom: RoomType) {
      const index = this.roomTypes.findIndex(
        (r) => r.room_type_id === updatedRoom.room_type_id
      )
      if (index !== -1) {
        this.roomTypes[index] = updatedRoom
      }
    },

    /** Handle realtime INSERT event for a room */
    addRoomFromRealtime(newRoom: RoomType) {
      const exists = this.roomTypes.some(
        (r) => r.room_type_id === newRoom.room_type_id
      )
      if (!exists && newRoom.is_available_ui) {
        this.roomTypes.push(newRoom)
      }
    },

    /** Handle realtime DELETE event for a room */
    removeRoomFromRealtime(roomTypeId: string) {
      this.roomTypes = this.roomTypes.filter(
        (r) => r.room_type_id !== roomTypeId
      )
    },
  },
})
