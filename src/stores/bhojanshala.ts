import { defineStore } from 'pinia'
import type { Bhojanshala } from '~/types/models'

interface BhojanshalState {
  bhojanshalas: Bhojanshala[]
  selectedBhojanshala: Bhojanshala | null
  filteredBhojanshalas: Bhojanshala[]
  loading: boolean
  error: string | null
}

/**
 * Bhojanshala Store
 * Manages bhojanshala (food service) locations and state
 */
export const useBhojanshalaStore = defineStore('bhojanshala', {
  state: (): BhojanshalState => ({
    bhojanshalas: [],
    selectedBhojanshala: null,
    filteredBhojanshalas: [],
    loading: false,
    error: null,
  }),

  getters: {
    getBhojanshalAById: (state) => (id: string) => {
      return state.bhojanshalas.find((b) => b.id === id)
    },

    getBhojanshalAsByCity: (state) => (city: string) => {
      return state.filteredBhojanshalas.filter((b) => b.location.city === city)
    },

    getBhojanshalAsByCuisine: (state) => (cuisine: string) => {
      return state.filteredBhojanshalas.filter((b) =>
        b.cuisineTypes?.some((c) => c.toLowerCase().includes(cuisine.toLowerCase()))
      )
    },

    getBhojanshalACount: (state) => state.bhojanshalas.length,

    getFilteredCount: (state) => state.filteredBhojanshalas.length,
    // Provide list of bhojanshala names for suggestions
    bhojanshalaNames: (state) => state.bhojanshalas.map((b) => b.name || ''),
  },

  actions: {
    async fetchBhojanshalas() {
      if (this.bhojanshalas.length > 0) {
        this.filteredBhojanshalas = [...this.bhojanshalas]
        return
      }

      this.loading = true
      this.error = null
      try {
        const { useBhojanshalaApi } = await import('~/composables/api')
        const { fetchBhojanshallas } = useBhojanshalaApi()
        const response = await fetchBhojanshallas()
        this.bhojanshalas = response
        this.filteredBhojanshalas = response
      } catch (error) {
        this.error = 'Failed to fetch bhojanshala locations'
        console.error(error)
      } finally {
        this.loading = false
      }
    },

    async fetchBhojanshalAById(id: string) {
      const local = this.bhojanshalas.find((b) => b.id === id)
      if (local) {
        this.selectedBhojanshala = local
        return local
      }

      this.loading = true
      try {
        const { useBhojanshalaApi } = await import('~/composables/api')
        const { fetchBhojanshalaById } = useBhojanshalaApi()
        const response = await fetchBhojanshalaById(id)
        this.selectedBhojanshala = response
        return response
      } catch (error) {
        this.error = `Failed to fetch bhojanshala: ${id}`
        console.error(error)
      } finally {
        this.loading = false
      }
    },

    filterBhojanshalas(filters: {
      city?: string
      cuisine?: string[]
      dietaryOptions?: string[]
      searchTerm?: string
    }) {
      let results = [...this.bhojanshalas]

      if (filters.searchTerm) {
        const term = filters.searchTerm.toLowerCase()
        results = results.filter(
          (b) =>
            b.name.toLowerCase().includes(term) ||
            b.description?.toLowerCase().includes(term) ||
            b.location.city.toLowerCase().includes(term)
        )
      }

      if (filters.city) {
        results = results.filter((b) => b.location.city === filters.city)
      }

      if (filters.cuisine && filters.cuisine.length > 0) {
        results = results.filter((b) =>
          filters.cuisine!.some((c) =>
            b.cuisineTypes?.some((ct) => ct.toLowerCase() === c.toLowerCase())
          )
        )
      }

      if (filters.dietaryOptions && filters.dietaryOptions.length > 0) {
        results = results.filter((b) =>
          filters.dietaryOptions!.some((option) =>
            b.dietaryOptions?.some((o) => o.toLowerCase() === option.toLowerCase())
          )
        )
      }

      this.filteredBhojanshalas = results
    },

    setSelectedBhojanshala(bhojanshala: Bhojanshala | null) {
      this.selectedBhojanshala = bhojanshala
    },

    clearFilters() {
      this.filteredBhojanshalas = [...this.bhojanshalas]
    },
  },
})
