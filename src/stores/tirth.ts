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
    search?: string
    sect?: string
    type?: string
  }
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
  }),

  getters: {
    getTirthById: (state) => (id: string) => {
      return state.tirths.find((t) => t.id === id)
    },

    getTirthsByState: (state) => (state_name: string) => {
      return state.filteredTirths.filter((t) => t.location.state === state_name)
    },

    getTirthsBySect: (state) => (sect: string) => {
      return state.filteredTirths.filter((t) => t.sect === sect)
    },

    getTirthsByType: (state) => (type: string) => {
      return state.filteredTirths.filter((t) => t.type === type)
    },
    // Return a simple array of tirth names for suggestions
    tirthNames: (state) => state.tirths.map((t) => t.name || ''),
  },

  actions: {
    async fetchTirths(page = 1, filters?: { search?: string; sect?: string; type?: string }) {
      this.loading = true
      this.error = null
      this.currentFilters = filters || {}

      try {
        const { useTirthApi } = await import('~/composables/api/useTirthApi')
        const api = useTirthApi()
        
        const { tirths, pagination } = await api.fetchTirths(page, this.pagination.limit, filters)
        
        this.tirths = tirths
        this.filteredTirths = tirths
        this.pagination = {
          total: pagination.total,
          page: pagination.page,
          pages: pagination.pages,
          limit: this.pagination.limit,
        }
      } catch (error) {
        this.error = 'Failed to fetch tirth locations'
        console.error('Fetch error:', error)
        this.filteredTirths = []
      } finally {
        this.loading = false
      }
    },

    async fetchTirthById(id: string) {
      try {
        const { useTirthApi } = await import('~/composables/api/useTirthApi')
        const api = useTirthApi()
        const tirth = await api.fetchTirthById(id)
        this.selectedTirth = tirth
        return tirth
      } catch (error) {
        console.error(`Error fetching tirth ${id}:`, error)
        throw error
      }
    },

    setPage(page: number) {
      this.fetchTirths(page, this.currentFilters)
    },

    filterTirths(filters: {
      state?: string
      sect?: string
      type?: string
      facilities?: string[]
      searchTerm?: string
    }) {
      let results = [...this.tirths]

      if (filters.searchTerm) {
        const term = filters.searchTerm.toLowerCase()
        results = results.filter(
          (t) =>
            t.name.toLowerCase().includes(term) ||
            t.description.toLowerCase().includes(term) ||
            t.location.city.toLowerCase().includes(term)
        )
      }

      if (filters.state) {
        results = results.filter((t) => t.location.state === filters.state)
      }

      if (filters.sect) {
        results = results.filter((t) => t.sect === filters.sect)
      }

      if (filters.type) {
        results = results.filter((t) => t.type === filters.type)
      }

      if (filters.facilities && filters.facilities.length > 0) {
        results = results.filter((t) => {
          // Check if tirth has facilities property and if any selected facility type is included
          if (!t.facilities || t.facilities.length === 0) return false
          return filters.facilities!.some((facilityType) =>
            t.facilities!.some((f) => f.type === facilityType)
          )
        })
      }

      this.filteredTirths = results
    },

    setSelectedTirth(tirth: Tirth | null) {
      this.selectedTirth = tirth
    },
  },
})
