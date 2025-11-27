import { defineStore } from 'pinia'
import type { Dharamshala } from '~/types/models'

interface DharamshalaState {
  dharamshalas: Dharamshala[]
  selectedDharmadhala: Dharamshala | null
  filteredDharamshalas: Dharamshala[]
  loading: boolean
  error: string | null
}

/**
 * Dharamshala Store
 * Manages dharamshala locations and state
 */
export const useDharamshalaStore = defineStore('dharamshala', {
  state: (): DharamshalaState => ({
    dharamshalas: [],
    selectedDharmadhala: null,
    filteredDharamshalas: [],
    loading: false,
    error: null,
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
        const { useDharamshalaApi } = await import('~/composables/api')
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
        this.selectedDharmadhala = local
        return local
      }

      this.loading = true
      try {
        const { useDharamshalaApi } = await import('~/composables/api')
        const { fetchDharamshalaById } = useDharamshalaApi()
        const response = await fetchDharamshalaById(id)
        this.selectedDharmadhala = response
        return response
      } catch (error) {
        this.error = `Failed to fetch dharamshala: ${id}`
        console.error(error)
      } finally {
        this.loading = false
      }
    },

    filterDharamshalas(filters: {
      city?: string
      capacity?: number
      amenities?: string[]
      searchTerm?: string
    }) {
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

      if (filters.city) {
        results = results.filter((d) => d.location.city === filters.city)
      }

      if (filters.capacity && filters.capacity > 0) {
        results = results.filter((d) => d.capacity && d.capacity >= filters.capacity!)
      }

      if (filters.amenities && filters.amenities.length > 0) {
        results = results.filter((d) =>
          filters.amenities!.some((amenity) =>
            d.amenities?.some((a) => a.toLowerCase() === amenity.toLowerCase())
          )
        )
      }

      this.filteredDharamshalas = results
    },

    setSelectedDharmadhala(dharamshala: Dharamshala | null) {
      this.selectedDharmadhala = dharamshala
    },

    clearFilters() {
      this.filteredDharamshalas = [...this.dharamshalas]
    },
  },
})
