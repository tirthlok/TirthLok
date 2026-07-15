import { defineStore } from 'pinia'
import type { Bhojanshala } from '~/types/models'
import { useBhojanshalaApi } from '~/features/bhojanshala/bhojanshalalistpage/services/bhojanshalaApi'

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
        const { fetchBhojanshallas } = useBhojanshalaApi()
        const response: any = await fetchBhojanshallas()
        const rawList = Array.isArray(response)
          ? response
          : (response?.bhojanshalas || [])
        const list = rawList.map((b: any) => ({
          id: b.bhojanshala_id,
          name: b.bhojanshala_name || '',
          description: b.bhojanshala_description || '',
          type: b.bhojanshala_type || 'General',
          rating: Number(b.bhojanshala_rating) || 4.5,
          reviews: 0,
          operatingHours: b.operatingHours || '',
          priceRange: '',
          cuisineTypes: b.cuisineTypes || b.tags || [],
          dietaryOptions: b.dietaryOptions || [],
          location: {
            latitude: Number(b.latitude) || 0,
            longitude: Number(b.longitude) || 0,
            address: b.bhojanshala_address || `${b.bhojanshala_city}, ${b.bhojanshala_state}`,
            city: b.bhojanshala_city || '',
            state: b.bhojanshala_state || '',
          },
          contact: {
            phone: b.bhojanshala_phone || '',
            email: b.bhojanshala_email || '',
          },
          images: Array.isArray(b.bhojanshala_images)
            ? b.bhojanshala_images
            : (b.bhojanshala_images ? [b.bhojanshala_images] : []),
        }))
        this.bhojanshalas = list as Bhojanshala[]
        this.filteredBhojanshalas = [...list] as Bhojanshala[]
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
      type?: string
      cuisines?: string[]
      dietaryOptions?: string[]
      vegetarianOnly?: boolean
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

      if (filters.type) {
        results = results.filter((b) => b.type === filters.type)
      }

      if (filters.cuisines && filters.cuisines.length > 0) {
        results = results.filter((b) =>
          filters.cuisines!.some((c) =>
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

      if (filters.vegetarianOnly) {
        results = results.filter((b) => b.vegetarianOnly === true)
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
