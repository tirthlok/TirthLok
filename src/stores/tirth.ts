import { defineStore } from 'pinia'
import type { Tirth } from '~/types/models'

interface TirthState {
  tirths: Tirth[]
  selectedTirth: Tirth | null
  filteredTirths: Tirth[]
  loading: boolean
  error: string | null
  pagination: {
    total: number
    page: number
    pages: number
    limit: number
  }
  currentFilters: {
    searchTerm?: string
    state?: string
    sect?: string
    type?: string
    amenities?: string[]
  }
  filterOptions: {
    states: string[]
    sects: string[]
    types: string[]
    facilities: string[]
  }
  filterOptionsLoading: boolean
}

export const useTirthStore = defineStore('tirth', {
  state: (): TirthState => ({
    tirths: [],
    selectedTirth: null,
    filteredTirths: [],
    loading: false,
    error: null,
    pagination: {
      total: 0,
      page: 1,
      pages: 1,
      limit: 10,
    },
    currentFilters: {},
    filterOptions: {
      states: [],
      sects: [],
      types: [],
      facilities: [],
    },
    filterOptionsLoading: false,
  }),

  getters: {
    getTirthById: (state) => (id: string) => {
      if (!Array.isArray(state.tirths)) return undefined
      return state.tirths.find((t) => t.id === id)
    },

    // Return a simple array of tirth names for suggestions
    tirthNames: (state) => {
      if (!Array.isArray(state.tirths)) return []
      return state.tirths.map((t) => t.name || '')
    },
  },

  actions: {
    async fetchTirths(page = 1) {
      this.loading = true
      this.error = null

      try {
        console.log('📦 Store: Starting fetchTirths')
        
        // Build API URL with params
        const params = new URLSearchParams({
          page: String(page),
          limit: String(this.pagination.limit),
        })
        
        console.log('📦 Store: Calling /api/tirth with params:', params.toString())
        const response = await $fetch(`/api/tirth?${params.toString()}`)
        
        console.log('📦 Store: API response:', response)
        
        if (!response.success || !response.data) {
          throw new Error('Invalid API response')
        }

        const transformTirthData = (raw: any) => {
          // Parse mul_nayak if it exists
          let mulNayakArray: any[] = []
          let acharya = ''
          
          if (raw.mul_nayak) {
            try {
              const mulNayakData = typeof raw.mul_nayak === 'string' 
                ? JSON.parse(raw.mul_nayak) 
                : raw.mul_nayak
              
              if (mulNayakData) {
                if (Array.isArray(mulNayakData)) {
                  mulNayakArray = mulNayakData.map((idol: any) => ({
                    name: idol.name || '',
                    height: idol.height || '',
                    metal: idol.metal || '',
                    year: idol.year ? parseInt(idol.year) : undefined,
                  }))
                } else {
                  mulNayakArray = [{
                    name: mulNayakData.name || '',
                    height: mulNayakData.height || '',
                    metal: mulNayakData.metal || '',
                    year: mulNayakData.year ? parseInt(mulNayakData.year) : undefined,
                  }]
                }
                acharya = Array.isArray(mulNayakData) ? (mulNayakData[0]?.name || '') : (mulNayakData.name || '')
              }
            } catch (e) {
              console.error('Error parsing mul_nayak:', e)
              if (raw.mul_nayak) {
                acharya = String(raw.mul_nayak)
                mulNayakArray = [{ name: acharya }]
              }
            }
          }

          return {
            id: String(raw.tirth_id),
            name: raw.tirth_name,
            location: {
              city: raw.tirth_city,
              state: raw.tirth_state,
              address: raw.address || '',
              latitude: raw.latitude || 0,
              longitude: raw.longitude || 0,
            },
            sect: (raw.tirth_sect && ['Digambar', 'Shwetambar'].includes(raw.tirth_sect)) ? raw.tirth_sect : 'Jain',
            type: raw.tirth_kshetra || 'Gyan-sthan',
            description: raw.tirth_description || '',
            historicalBackground: raw.historical_background || raw.historicalBackground || '',
            foundingYear: 0,
            foundingDetails: raw.founding_details || raw.foundingDetails || '',
            pratisthaYear: 0,
            acharya: acharya,
            architecture: raw.architecture || '',
            moolnayak: mulNayakArray,
            specialFacts: raw.special_facts ? (Array.isArray(raw.special_facts) ? raw.special_facts : [raw.special_facts]) : [],
            poojaTimings: raw.pooja_timings || raw.poojaTimings || '',
            darshanTimings: raw.darshan_timings || raw.darshanTimings || '',
            festivals: raw.festivals || [],
            images: raw.images || [],
            rating: raw.rating || 0,
            reviews: 0,
            facilities: raw.facilities || [],
          }
        }
        
        const tirths = (response.data || []).map(transformTirthData)
        
        this.tirths = tirths
        this.filteredTirths = tirths
        this.pagination = {
          total: response.pagination.total,
          page: response.pagination.page,
          pages: response.pagination.pages,
          limit: this.pagination.limit,
        }
        console.log('📦 Store: State updated, total tirths:', this.tirths.length)
      } catch (error) {
        this.error = 'Failed to fetch tirth locations'
        console.error('❌ Fetch error:', error)
        this.filteredTirths = []
      } finally {
        this.loading = false
      }
    },

    async fetchTirthById(id: string) {
      try {
        const { useSupabaseTirthApi } = await import('~/composables/api/useSupabaseTirthApi')
        const api = useSupabaseTirthApi()
        const tirth = await api.fetchTirthById(id)
        this.selectedTirth = tirth
        return tirth
      } catch (error) {
        console.error(`Error fetching tirth ${id}:`, error)
        throw error
      }
    },

    setPage(page: number) {
      this.fetchTirths(page)
    },

    async fetchFilterOptions() {
      if (this.filterOptions.states.length > 0) {
        return // Already loaded
      }

      this.filterOptionsLoading = true
      try {
        const response = await $fetch<any>('/api/tirth/filter-options')
        if (response?.success) {
          this.filterOptions = response.data
          console.log('📦 Store: Filter options loaded:', this.filterOptions)
        }
      } catch (error) {
        console.error('❌ Error fetching filter options:', error)
      } finally {
        this.filterOptionsLoading = false
      }
    },

    filterTirths(filters: {
      searchTerm?: string
      state?: string
      sect?: string
      type?: string
      amenities?: string[]
    }) {
      this.currentFilters = filters
      
      // Make sure we have data to filter
      if (!Array.isArray(this.tirths) || this.tirths.length === 0) {
        console.warn('❌ No tirth data available for filtering')
        this.filteredTirths = []
        return
      }

      let results = [...this.tirths]
      console.log(`🔍 Starting filter with ${results.length} tirths`)

      // Search by name, description, or city
      if (filters.searchTerm && filters.searchTerm.trim()) {
        const term = filters.searchTerm.toLowerCase()
        results = results.filter((t) =>
          t.name.toLowerCase().includes(term) ||
          (t.description && t.description.toLowerCase().includes(term)) ||
          t.location.city.toLowerCase().includes(term)
        )
        console.log(`📍 After search filter: ${results.length} results`)
      }

      // Filter by state
      if (filters.state) {
        results = results.filter((t) => t.location.state === filters.state)
        console.log(`📍 After state filter (${filters.state}): ${results.length} results`)
      }

      // Filter by sect
      if (filters.sect) {
        results = results.filter((t) => t.sect === filters.sect)
        console.log(`📍 After sect filter (${filters.sect}): ${results.length} results`)
      }

      // Filter by type
      if (filters.type) {
        results = results.filter((t) => t.type === filters.type)
        console.log(`📍 After type filter (${filters.type}): ${results.length} results`)
      }

      // Filter by amenities/facilities (all selected amenities must be present)
      if (filters.amenities && filters.amenities.length > 0) {
        results = results.filter((t) => {
          if (!t.facilities || t.facilities.length === 0) return false
          return filters.amenities!.every((amenity) =>
            t.facilities!.some((f) => f.type === amenity)
          )
        })
        console.log(`📍 After amenities filter: ${results.length} results`)
      }

      this.filteredTirths = results
      console.log(`✅ Filter complete: ${this.filteredTirths.length} filtered results`)
    },

    setSelectedTirth(tirth: Tirth | null) {
      this.selectedTirth = tirth
    },
  },
})
