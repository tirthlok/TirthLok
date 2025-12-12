/**
 * Tirth Store (Pinia)
 * ====================
 * State management for Tirth locations
 * 
 * State:
 *  - tirths: Array of all fetched tirth locations
 *  - selectedTirth: Currently selected tirth for detail view
 *  - filteredTirths: Result of applying current filters
 *  - pagination: Page info (total, current page, total pages)
 *  - loading: API request status
 *  - error: Error message if fetch failed
 * 
 * Getters:
 *  - getTirthById(id): Find tirth by ID
 *  - getTirthsByState(state): Filter by state
 *  - getTirthsBySect(sect): Filter by sect (Digambar/Shwetambar)
 *  - getTirthsByType(type): Filter by type
 *  - tirthNames: Array of tirth names for autocomplete
 * 
 * Actions:
 *  - fetchTirths(): Fetch from API with optional filters
 *  - fetchTirthById(): Fetch single tirth details
 *  - filterTirths(): Apply client-side filters
 *  - setPage(): Go to specific page
 *  - setSelectedTirth(): Update selected tirth
 */

import { defineStore } from 'pinia'
import type { Tirth } from '~/types/models'
import { transformTirthData } from '~/composables/api/utils/tirthlTransformers'

// ============================================================================
// STATE INTERFACE
// ============================================================================

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

// ============================================================================
// STORE DEFINITION
// ============================================================================

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

  // ============================================================================
  // GETTERS - Query state with computed properties
  // ============================================================================

  getters: {
    /**
     * Find tirth by ID
     */
    getTirthById: (state) => (id: string) => {
      if (!Array.isArray(state.tirths)) return undefined
      return state.tirths.find((t) => t.id === id)
    },

    /**
     * Get all tirths in a specific state
     */
    getTirthsByState: (state) => (state_name: string) => {
      if (!Array.isArray(state.filteredTirths)) return []
      return state.filteredTirths.filter((t) => t.location.state === state_name)
    },

    /**
     * Get all tirths of a specific sect
     */
    getTirthsBySect: (state) => (sect: string) => {
      if (!Array.isArray(state.filteredTirths)) return []
      return state.filteredTirths.filter((t) => t.sect === sect)
    },

    /**
     * Get all tirths of a specific type
     */
    getTirthsByType: (state) => (type: string) => {
      if (!Array.isArray(state.filteredTirths)) return []
      return state.filteredTirths.filter((t) => t.type === type)
    },

    /**
     * Get array of tirth names for autocomplete suggestions
     */
    tirthNames: (state) => {
      if (!Array.isArray(state.tirths)) return []
      return state.tirths.map((t) => t.name || '')
    },
  },

  // ============================================================================
  // ACTIONS - Modify state and handle API calls
  // ============================================================================

  actions: {
    /**
     * Fetch tirth locations from API with optional filters
     * @param page - Page number (1-indexed)
     * @param filters - Optional filters for search, sect, type
     */
    async fetchTirths(page = 1, filters?: { search?: string; sect?: string; type?: string }) {
      this.loading = true
      this.error = null
      this.currentFilters = filters || {}

      try {
        console.log('📦 Store: Starting fetchTirths')
        
        // Build API URL with params
        const params = new URLSearchParams({
          page: String(page),
          limit: String(this.pagination.limit),
        })
        
        if (filters?.search) params.append('search', filters.search)
        if (filters?.sect) params.append('sect', filters.sect)
        if (filters?.type) params.append('type', filters.type)
        
        console.log('📦 Store: Calling /api/tirth with params:', params.toString())
        const response = await $fetch(`/api/tirth?${params.toString()}`)
        
        console.log('📦 Store: API response:', response)
        
        if (!response.success || !response.data) {
          throw new Error('Invalid API response')
        }

        // Transform API response to Tirth models
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

    /**
     * Fetch single tirth by ID with full details
     * @param id - Tirth ID/name to fetch
     */
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

    /**
     * Navigate to specific page in paginated results
     * @param page - Page number to navigate to
     */
    setPage(page: number) {
      this.fetchTirths(page, this.currentFilters)
    },

    /**
     * Apply client-side filters to loaded tirths
     * @param filters - Filter criteria (state, sect, type, facilities, searchTerm)
     */
    filterTirths(filters: {
      state?: string
      sect?: string
      type?: string
      facilities?: string[]
      searchTerm?: string
    }) {
      if (!Array.isArray(this.tirths)) {
        this.filteredTirths = []
        return
      }

      let results = [...this.tirths]

      // Search filter
      if (filters.searchTerm) {
        const term = filters.searchTerm.toLowerCase()
        results = results.filter(
          (t) =>
            t.name.toLowerCase().includes(term) ||
            (t.description && t.description.toLowerCase().includes(term)) ||
            t.location.city.toLowerCase().includes(term)
        )
      }

      // State filter
      if (filters.state) {
        results = results.filter((t) => t.location.state === filters.state)
      }

      // Sect filter
      if (filters.sect) {
        results = results.filter((t) => t.sect === filters.sect)
      }

      // Type filter
      if (filters.type) {
        results = results.filter((t) => t.type === filters.type)
      }

      // Facilities filter
      if (filters.facilities && filters.facilities.length > 0) {
        results = results.filter((t) => {
          if (!t.facilities || t.facilities.length === 0) return false
          return filters.facilities!.some((facilityType) =>
            t.facilities!.some((f) => f.type === facilityType)
          )
        })
      }

      this.filteredTirths = results
    },

    /**
     * Set currently selected tirth
     * @param tirth - Tirth object or null to deselect
     */
    setSelectedTirth(tirth: Tirth | null) {
      this.selectedTirth = tirth
    },
  },
})

